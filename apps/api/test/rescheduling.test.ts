import { expect, it } from 'vitest';

import { AppointmentService } from '../src/appointments/service.js';
import { InMemoryAppointmentRepository } from '../src/appointments/repository.js';
import { DemoSoulMvAdapter } from '../src/integrations/soul-mv/demo-adapter.js';

it('preserves the original appointment when the replacement slot fails', async () => {
  const repository = new InMemoryAppointmentRepository();
  const service = new AppointmentService(repository, new DemoSoulMvAdapter());
  const patientId = crypto.randomUUID();
  const booking = await service.book({ patientId, slotId: 'slot-cardio-1' }, 'book-1');

  await expect(
    service.reschedule(patientId, booking.appointment.id, 'missing-slot', 'move-1'),
  ).rejects.toThrow(/SLOT_NOT_FOUND/);

  expect(repository.getById(booking.appointment.id)?.status).toBe('confirmed');
});
