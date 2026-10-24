import { z } from 'zod';

export const AppEnvironmentSchema = z.enum([
  'development',
  'demo',
  'homologation',
  'production',
]);

export const IntegrationModeSchema = z.enum(['demo', 'real']);
