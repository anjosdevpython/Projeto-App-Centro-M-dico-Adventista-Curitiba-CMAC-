import type { FastifyInstance } from 'fastify';
import { z } from 'zod';

import type { AppointmentService } from './service.js';

export async function registerAppointmentRoutes(
  app: FastifyInstance,
  options: { appointments: AppointmentService },
): Promise<void> {
  app.post('/v1/appointments', async (request, reply) => {
    const body = z.object({
      slotId: z.string().min(1),
      patientId: z.uuid(),
    }).parse(request.body);
    const idempotencyKey = z.string().min(8).parse(request.headers['idempotency-key']);
    return reply.code(201).send(await options.appointments.book(body, idempotencyKey));
  });
}
