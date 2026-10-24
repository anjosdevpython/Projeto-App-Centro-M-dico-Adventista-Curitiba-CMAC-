import type { SoulMvPort } from '../integrations/soul-mv/port.js';
import {
  InMemoryAppointmentRepository,
  type BookingResult,
} from './repository.js';

export class AppointmentService {
  readonly #inFlight = new Map<string, Promise<BookingResult>>();

  constructor(
    private readonly repository: InMemoryAppointmentRepository,
    private readonly soulMv: SoulMvPort,
  ) {}

  async book(
    input: { slotId: string; patientId: string },
    idempotencyKey: string,
  ): Promise<BookingResult> {
    const existing = this.repository.getByIdempotency(input.patientId, idempotencyKey);
    if (existing) return existing;
    const operationKey = `${input.patientId}:${idempotencyKey}`;
    const pending = this.#inFlight.get(operationKey);
    if (pending) return pending;
    const operation = this.performBooking(input, idempotencyKey);
    this.#inFlight.set(operationKey, operation);
    try {
      return await operation;
    } finally {
      this.#inFlight.delete(operationKey);
    }
  }

  getOwnAppointments(patientId: string) {
    return Promise.resolve(this.repository.listByPatient(patientId));
  }

  async reconcile(input: {
    patientId: string;
    slotId: string;
    idempotencyKey: string;
    correlationId: string;
  }): Promise<BookingResult> {
    const existing = this.repository.getByIdempotency(
      input.patientId,
      input.idempotencyKey,
    );
    if (existing) return existing;
    const status = await this.soulMv.getOperationStatus(input.correlationId);
    if (status.status !== 'confirmed') {
      throw new Error('OPERATION_STILL_UNCERTAIN');
    }
    this.repository.claimSlot(input.slotId);
    return this.repository.saveConfirmed({
      patientId: input.patientId,
      slotId: input.slotId,
      idempotencyKey: input.idempotencyKey,
      externalReference: status.externalReference,
      confirmedAt: status.confirmedAt,
    });
  }

  async cancel(
    patientId: string,
    appointmentId: string,
    idempotencyKey: string,
  ): Promise<BookingResult> {
    const repeated = this.repository.getByIdempotency(patientId, idempotencyKey);
    if (repeated) return repeated;
    const current = this.ownedConfirmed(patientId, appointmentId);
    const result = await this.soulMv.cancelAppointment({
      externalReference: current.externalReference,
      idempotencyKey,
    });
    this.repository.releaseSlot(current.slotId);
    return this.repository.saveCancelled(
      current,
      idempotencyKey,
      result.confirmedAt,
    );
  }

  async reschedule(
    patientId: string,
    appointmentId: string,
    newSlotId: string,
    idempotencyKey: string,
  ): Promise<BookingResult> {
    const repeated = this.repository.getByIdempotency(patientId, idempotencyKey);
    if (repeated) return repeated;
    const current = this.ownedConfirmed(patientId, appointmentId);
    this.repository.claimSlot(newSlotId);
    try {
      const hold = await this.soulMv.holdSlot({
        slotId: newSlotId,
        patientRef: patientId,
      });
      const result = await this.soulMv.rescheduleAppointment({
        externalReference: current.externalReference,
        newHoldId: hold.id,
        idempotencyKey,
      });
      this.repository.releaseSlot(current.slotId);
      return this.repository.saveRescheduled(
        current,
        newSlotId,
        result.externalReference,
        result.confirmedAt,
        idempotencyKey,
      );
    } catch (error) {
      this.repository.releaseSlot(newSlotId);
      throw error;
    }
  }

  private ownedConfirmed(
    patientId: string,
    appointmentId: string,
  ): Extract<import('@cmac/contracts').Appointment, { status: 'confirmed' }> {
    const appointment = this.repository.getById(appointmentId);
    if (appointment?.patientId !== patientId) {
      throw Object.assign(new Error('Recurso não encontrado.'), { code: 'NOT_FOUND' });
    }
    if (appointment.status !== 'confirmed') {
      throw Object.assign(new Error('Operação indisponível para o estado atual.'), {
        code: 'INVALID_STATE',
      });
    }
    return appointment;
  }

  private async performBooking(
    input: { slotId: string; patientId: string },
    idempotencyKey: string,
  ): Promise<BookingResult> {
    this.repository.claimSlot(input.slotId);
    try {
      const hold = await this.soulMv.holdSlot({
        slotId: input.slotId,
        patientRef: input.patientId,
      });
      const confirmation = await this.soulMv.confirmBooking({
        holdId: hold.id,
        idempotencyKey,
      });
      return this.repository.saveConfirmed({
        ...input,
        idempotencyKey,
        externalReference: confirmation.externalReference,
        confirmedAt: confirmation.confirmedAt,
      });
    } catch (error) {
      this.repository.releaseSlot(input.slotId);
      throw error;
    }
  }
}
