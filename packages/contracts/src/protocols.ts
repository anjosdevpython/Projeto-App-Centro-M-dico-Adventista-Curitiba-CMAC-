import { z } from 'zod';

export const OperationProtocolSchema = z.object({
  id: z.uuid(),
  patientId: z.uuid(),
  operation: z.enum(['book', 'cancel', 'reschedule', 'support']),
  referenceId: z.string().min(1),
  issuedAt: z.iso.datetime(),
});

export type OperationProtocol = z.infer<typeof OperationProtocolSchema>;
