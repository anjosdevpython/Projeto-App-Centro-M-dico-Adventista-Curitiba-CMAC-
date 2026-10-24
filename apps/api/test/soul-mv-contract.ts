import { expect, it } from 'vitest';

import { SlotSchema } from '@cmac/contracts';
import type { SoulMvPort } from '../src/integrations/soul-mv/port.js';

export function soulMvContract(createAdapter: () => SoulMvPort): void {
  it('returns only schema-valid synthetic slots in demo mode', async () => {
    const slots = await createAdapter().listSlots({ specialtyId: 'cardiology' });
    expect(slots.length).toBeGreaterThan(0);
    for (const slot of slots) {
      expect(SlotSchema.parse(slot).isSynthetic).toBe(true);
    }
  });

  it('does not duplicate a confirmed booking for the same idempotency key', async () => {
    const adapter = createAdapter();
    const hold = await adapter.holdSlot({ slotId: 'slot-cardio-1', patientRef: 'patient-1' });
    const first = await adapter.confirmBooking({
      holdId: hold.id,
      idempotencyKey: 'booking-1',
    });
    const repeated = await adapter.confirmBooking({
      holdId: hold.id,
      idempotencyKey: 'booking-1',
    });
    expect(repeated.externalReference).toBe(first.externalReference);
  });
}
