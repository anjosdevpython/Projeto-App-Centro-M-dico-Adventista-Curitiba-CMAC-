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
  app.post('/v1/appointments/:id/cancel', async (request) => {
    const params = z.object({ id: z.uuid() }).parse(request.params);
    const body = z.object({ patientId: z.uuid() }).parse(request.body);
    const key = z.string().min(8).parse(request.headers['idempotency-key']);
    return options.appointments.cancel(body.patientId, params.id, key);
  });
  app.post('/v1/appointments/:id/reschedule', async (request) => {
    const params = z.object({ id: z.uuid() }).parse(request.params);
    const body = z.object({
      patientId: z.uuid(),
      newSlotId: z.string().min(1),
    }).parse(request.body);
    const key = z.string().min(8).parse(request.headers['idempotency-key']);
    return options.appointments.reschedule(
      body.patientId,
      params.id,
      body.newSlotId,
      key,
    );
  });
}
