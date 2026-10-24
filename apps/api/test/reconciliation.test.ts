import { expect, it } from 'vitest';

import { AppointmentService } from '../src/appointments/service.js';
import { InMemoryAppointmentRepository } from '../src/appointments/repository.js';
import { DemoSoulMvAdapter } from '../src/integrations/soul-mv/demo-adapter.js';

it('checks operation status before completing an uncertain booking', async () => {
  const adapter = new DemoSoulMvAdapter();
  const hold = await adapter.holdSlot({
    slotId: 'slot-cardio-1',
    patientRef: 'patient-ref',
  });
  const confirmation = await adapter.confirmBooking({
    holdId: hold.id,
    idempotencyKey: 'correlation-1',
  });
  const service = new AppointmentService(new InMemoryAppointmentRepository(), adapter);
  const patientId = crypto.randomUUID();

  const result = await service.reconcile({
    patientId,
    slotId: 'slot-cardio-1',
    idempotencyKey: 'book-after-timeout',
    correlationId: 'correlation-1',
  });

  expect(result.appointment).toMatchObject({
    status: 'confirmed',
    externalReference: confirmation.externalReference,
  });
});
