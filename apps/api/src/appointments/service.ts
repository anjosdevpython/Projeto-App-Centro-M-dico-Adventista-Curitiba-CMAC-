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
