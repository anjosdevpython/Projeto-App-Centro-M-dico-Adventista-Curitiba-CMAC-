import { z } from 'zod';

export const ApiConfigSchema = z.object({
  APP_ENV: z.enum(['development', 'demo', 'homologation', 'production']),
  DATABASE_URL: z.url(),
  SESSION_SECRET: z.string().min(32),
  PUBLIC_ORIGIN: z.url(),
  SOUL_MV_ADAPTER: z.enum(['demo', 'http']),
});

export type ApiConfig = z.infer<typeof ApiConfigSchema>;
