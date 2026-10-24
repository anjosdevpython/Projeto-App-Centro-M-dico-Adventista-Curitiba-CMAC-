import { describe, expect, it } from 'vitest';
import { getTableConfig } from 'drizzle-orm/pg-core';

import { AppointmentSchema } from '@cmac/contracts';
import { idempotencyRecords } from '../src/db/schema.js';

describe('appointment contract', () => {
  it('rejects a confirmed appointment without an external confirmation reference', () => {
    expect(() =>
      AppointmentSchema.parse({
        id: crypto.randomUUID(),
        patientId: crypto.randomUUID(),
        slotId: 'slot-1',
        status: 'confirmed',
      }),
    ).toThrow();
  });

  it('accepts a confirmed appointment with confirmation evidence', () => {
    expect(
      AppointmentSchema.parse({
        id: crypto.randomUUID(),
        patientId: crypto.randomUUID(),
        slotId: 'slot-1',
        status: 'confirmed',
        externalReference: 'demo-appointment-1',
        confirmedAt: '2026-10-24T15:00:00.000Z',
      }).status,
    ).toBe('confirmed');
  });
});

describe('idempotency persistence', () => {
  it('defines a unique patient, operation, and key constraint', () => {
    const indexNames = getTableConfig(idempotencyRecords).indexes.map((item) => item.config.name);
    expect(indexNames).toContain('idempotency_patient_operation_key_unique');
  });
});
