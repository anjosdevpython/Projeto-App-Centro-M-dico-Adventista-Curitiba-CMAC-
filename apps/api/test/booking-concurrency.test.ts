import { expect, it } from 'vitest';

import { AppointmentService } from '../src/appointments/service.js';
import { InMemoryAppointmentRepository } from '../src/appointments/repository.js';
import { DemoSoulMvAdapter } from '../src/integrations/soul-mv/demo-adapter.js';

it('allows only one patient to confirm the same slot', async () => {
  const service = new AppointmentService(
    new InMemoryAppointmentRepository(),
    new DemoSoulMvAdapter(),
  );
  const results = await Promise.allSettled(
    Array.from({ length: 10 }, (_, index) =>
      service.book(
        { slotId: 'slot-cardio-1', patientId: crypto.randomUUID() },
        `book-${index}`,
      ),
    ),
  );
  expect(results.filter((result) => result.status === 'fulfilled')).toHaveLength(1);
});
