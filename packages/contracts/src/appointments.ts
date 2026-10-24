import { z } from 'zod';

const AppointmentBaseSchema = z.object({
  id: z.uuid(),
  patientId: z.uuid(),
  slotId: z.string().min(1),
});

export const AppointmentSchema = z.discriminatedUnion('status', [
  AppointmentBaseSchema.extend({
    status: z.literal('pending'),
  }),
  AppointmentBaseSchema.extend({
    status: z.literal('confirmed'),
    externalReference: z.string().min(1),
    confirmedAt: z.iso.datetime(),
  }),
  AppointmentBaseSchema.extend({
    status: z.literal('uncertain'),
    correlationId: z.string().min(1),
  }),
  AppointmentBaseSchema.extend({
    status: z.literal('cancelled'),
    externalReference: z.string().min(1),
    cancelledAt: z.iso.datetime(),
  }),
]);

export type Appointment = z.infer<typeof AppointmentSchema>;
