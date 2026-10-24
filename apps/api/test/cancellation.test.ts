import { describe, expect, it } from 'vitest';

import { AppointmentService } from '../src/appointments/service.js';
import { InMemoryAppointmentRepository } from '../src/appointments/repository.js';
import { DemoSoulMvAdapter } from '../src/integrations/soul-mv/demo-adapter.js';

describe('appointment cancellation', () => {
  it('does not cancel an appointment owned by another patient', async () => {
    const service = new AppointmentService(new InMemoryAppointmentRepository(), new DemoSoulMvAdapter());
    const owner = crypto.randomUUID();
    const other = crypto.randomUUID();
    const booking = await service.book({ patientId: owner, slotId: 'slot-cardio-1' }, 'book-owner');

    await expect(service.cancel(other, booking.appointment.id, 'cancel-other'))
      .rejects.toMatchObject({ code: 'NOT_FOUND' });
  });

  it('deduplicates repeated cancellation and returns one protocol', async () => {
    const service = new AppointmentService(new InMemoryAppointmentRepository(), new DemoSoulMvAdapter());
    const patientId = crypto.randomUUID();
    const booking = await service.book({ patientId, slotId: 'slot-cardio-1' }, 'book-owner');
    const first = await service.cancel(patientId, booking.appointment.id, 'cancel-1');
    const repeated = await service.cancel(patientId, booking.appointment.id, 'cancel-1');
    expect(repeated.protocol.id).toBe(first.protocol.id);
    expect(repeated.appointment.status).toBe('cancelled');
  });
});
