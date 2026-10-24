import type { FastifyInstance } from 'fastify';
import { z } from 'zod';

import type { AuthService } from './service.js';

const RegistrationSchema = z.object({
  email: z.email(),
  password: z.string().min(12),
});
const VerificationSchema = z.object({
  email: z.email(),
  code: z.string().regex(/^\d{6}$/),
});

export async function registerAuthRoutes(
  app: FastifyInstance,
  options: { authService: AuthService },
): Promise<void> {
  app.post('/v1/auth/register', async (request, reply) =>
    reply.code(202).send(
      await options.authService.register(RegistrationSchema.parse(request.body)),
    ),
  );
  app.post('/v1/auth/verify', async (request) =>
    options.authService.verifyContact(VerificationSchema.parse(request.body)),
  );
  app.post('/v1/auth/sign-in', async (request) => {
    const session = await options.authService.signIn(
      RegistrationSchema.parse(request.body),
    );
    return { status: 'authenticated', sessionId: session.id };
  });
  app.post('/v1/auth/recovery', async (request, reply) => {
    const body = z.object({ email: z.email() }).parse(request.body);
    return reply.code(202).send(await options.authService.startRecovery(body.email));
  });
  app.post('/v1/auth/recovery/complete', async (request) => {
    const body = z.object({
      email: z.email(),
      code: z.string().regex(/^\d{6}$/),
      newPassword: z.string().min(12),
    }).parse(request.body);
    return options.authService.completeRecovery(body);
  });
}
