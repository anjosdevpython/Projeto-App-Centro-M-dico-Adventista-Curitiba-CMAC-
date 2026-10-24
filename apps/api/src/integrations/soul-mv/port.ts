import type { CatalogItem, Slot } from '@cmac/contracts';

export interface SlotHold {
  id: string;
  slotId: string;
  expiresAt: string;
}

export interface ConfirmedOperation {
  status: 'confirmed';
  externalReference: string;
  confirmedAt: string;
}

export interface SoulMvPort {
  listSpecialties(): Promise<CatalogItem[]>;
  listProfessionals(): Promise<CatalogItem[]>;
  listLocations(): Promise<CatalogItem[]>;
  listSlots(filter: { specialtyId?: string; professionalId?: string }): Promise<Slot[]>;
  holdSlot(input: { slotId: string; patientRef: string }): Promise<SlotHold>;
  confirmBooking(input: {
    holdId: string;
    idempotencyKey: string;
  }): Promise<ConfirmedOperation>;
  getOperationStatus(correlationId: string): Promise<ConfirmedOperation | { status: 'unknown' }>;
  cancelAppointment(input: {
    externalReference: string;
    idempotencyKey: string;
  }): Promise<ConfirmedOperation>;
  rescheduleAppointment(input: {
    externalReference: string;
    newHoldId: string;
    idempotencyKey: string;
  }): Promise<ConfirmedOperation>;
}
