import { randomUUID } from 'node:crypto';

import {
  CatalogItemSchema,
  SlotSchema,
  type CatalogItem,
  type Slot,
} from '@cmac/contracts';

import {
  demoLocations,
  demoProfessionals,
  demoSlots,
  demoSpecialties,
} from '../../../fixtures/demo-catalog.js';
import type {
  ConfirmedOperation,
  SlotHold,
  SoulMvPort,
} from './port.js';

export class DemoSoulMvAdapter implements SoulMvPort {
  readonly #holds = new Map<string, SlotHold>();
  readonly #results = new Map<string, ConfirmedOperation>();

  async listSpecialties(): Promise<CatalogItem[]> {
    return demoSpecialties.map((item) => CatalogItemSchema.parse(item));
  }
  async listProfessionals(): Promise<CatalogItem[]> {
    return demoProfessionals.map((item) => CatalogItemSchema.parse(item));
  }
  async listLocations(): Promise<CatalogItem[]> {
    return demoLocations.map((item) => CatalogItemSchema.parse(item));
  }
  async listSlots(filter: {
    specialtyId?: string;
    professionalId?: string;
  }): Promise<Slot[]> {
    return demoSlots
      .filter((slot) => !filter.specialtyId || slot.specialtyId === filter.specialtyId)
      .filter(
        (slot) => !filter.professionalId || slot.professionalId === filter.professionalId,
      )
      .map((slot) => SlotSchema.parse(slot));
  }
  async holdSlot(input: { slotId: string; patientRef: string }): Promise<SlotHold> {
    if (!demoSlots.some((slot) => slot.id === input.slotId)) {
      throw new Error('SLOT_NOT_FOUND');
    }
    const hold = {
      id: randomUUID(),
      slotId: input.slotId,
      expiresAt: new Date(Date.now() + 5 * 60_000).toISOString(),
    };
    this.#holds.set(hold.id, hold);
    return hold;
  }
  async confirmBooking(input: {
    holdId: string;
    idempotencyKey: string;
  }): Promise<ConfirmedOperation> {
    const previous = this.#results.get(input.idempotencyKey);
    if (previous) return previous;
    if (!this.#holds.has(input.holdId)) throw new Error('HOLD_NOT_FOUND');
    const result = {
      status: 'confirmed' as const,
      externalReference: `DEMO-${randomUUID()}`,
      confirmedAt: new Date().toISOString(),
    };
    this.#results.set(input.idempotencyKey, result);
    return result;
  }
  async getOperationStatus(
    correlationId: string,
  ): Promise<ConfirmedOperation | { status: 'unknown' }> {
    return this.#results.get(correlationId) ?? { status: 'unknown' };
  }
  async cancelAppointment(input: {
    externalReference: string;
    idempotencyKey: string;
  }): Promise<ConfirmedOperation> {
    return this.confirmAdministrativeOperation(input.idempotencyKey, input.externalReference);
  }
  async rescheduleAppointment(input: {
    externalReference: string;
    newHoldId: string;
    idempotencyKey: string;
  }): Promise<ConfirmedOperation> {
    if (!this.#holds.has(input.newHoldId)) throw new Error('HOLD_NOT_FOUND');
    return this.confirmAdministrativeOperation(input.idempotencyKey, input.externalReference);
  }
  private confirmAdministrativeOperation(
    idempotencyKey: string,
    externalReference: string,
  ): ConfirmedOperation {
    const previous = this.#results.get(idempotencyKey);
    if (previous) return previous;
    const result = {
      status: 'confirmed' as const,
      externalReference,
      confirmedAt: new Date().toISOString(),
    };
    this.#results.set(idempotencyKey, result);
    return result;
  }
}
