import { describe, expect, it } from 'vitest';

import { AppointmentService } from '../src/appointments/service.js';
import { InMemoryAppointmentRepository } from '../src/appointments/repository.js';
import { DemoSoulMvAdapter } from '../src/integrations/soul-mv/demo-adapter.js';

describe('AppointmentService', () => {
  it('returns the same booking for repeated idempotency keys', async () => {
    const service = new AppointmentService(
      new InMemoryAppointmentRepository(),
      new DemoSoulMvAdapter(),
    );
    const request = { slotId: 'slot-cardio-1', patientId: crypto.randomUUID() };
    const first = await service.book(request, 'book-123');
    const repeated = await service.book(request, 'book-123');
    expect(repeated.appointment.id).toBe(first.appointment.id);
    expect(repeated.protocol.id).toBe(first.protocol.id);
  });

  it('lists only appointments owned by the patient', async () => {
    const service = new AppointmentService(
      new InMemoryAppointmentRepository(),
      new DemoSoulMvAdapter(),
    );
    const patientA = crypto.randomUUID();
    await service.book({ slotId: 'slot-cardio-1', patientId: patientA }, 'a');
    expect(await service.getOwnAppointments(patientA)).toHaveLength(1);
    expect(await service.getOwnAppointments(crypto.randomUUID())).toEqual([]);
  });
});
