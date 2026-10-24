import { randomUUID } from 'node:crypto';

import type { Appointment, OperationProtocol } from '@cmac/contracts';

export interface BookingResult {
  appointment: Appointment;
  protocol: OperationProtocol;
}

export class InMemoryAppointmentRepository {
  readonly #byIdempotency = new Map<string, BookingResult>();
  readonly #appointments = new Map<string, Appointment>();
  readonly #claimedSlots = new Set<string>();

  getByIdempotency(patientId: string, key: string): BookingResult | undefined {
    return this.#byIdempotency.get(`${patientId}:${key}`);
  }

  claimSlot(slotId: string): void {
    if (this.#claimedSlots.has(slotId)) throw new Error('SLOT_CONFLICT');
    this.#claimedSlots.add(slotId);
  }

  releaseSlot(slotId: string): void {
    this.#claimedSlots.delete(slotId);
  }

  saveConfirmed(input: {
    patientId: string;
    slotId: string;
    idempotencyKey: string;
    externalReference: string;
    confirmedAt: string;
  }): BookingResult {
    const appointment: Appointment = {
      id: randomUUID(),
      patientId: input.patientId,
      slotId: input.slotId,
      status: 'confirmed',
      externalReference: input.externalReference,
      confirmedAt: input.confirmedAt,
    };
    const protocol: OperationProtocol = {
      id: randomUUID(),
      patientId: input.patientId,
      operation: 'book',
      referenceId: appointment.id,
      issuedAt: input.confirmedAt,
    };
    const result = { appointment, protocol };
    this.#appointments.set(appointment.id, appointment);
    this.#byIdempotency.set(`${input.patientId}:${input.idempotencyKey}`, result);
    return result;
  }

  listByPatient(patientId: string): Appointment[] {
    return [...this.#appointments.values()].filter(
      (appointment) => appointment.patientId === patientId,
    );
  }
}
