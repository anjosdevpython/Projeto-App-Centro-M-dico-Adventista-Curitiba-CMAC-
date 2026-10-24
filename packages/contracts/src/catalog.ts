import { z } from 'zod';

export const CatalogItemSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  description: z.string().min(1).optional(),
  isSynthetic: z.boolean(),
});

export const SlotSchema = z.object({
  id: z.string().min(1),
  specialtyId: z.string().min(1),
  professionalId: z.string().min(1),
  locationId: z.string().min(1),
  startsAt: z.iso.datetime({ offset: true }),
  endsAt: z.iso.datetime({ offset: true }),
  isSynthetic: z.boolean(),
});

export type CatalogItem = z.infer<typeof CatalogItemSchema>;
export type Slot = z.infer<typeof SlotSchema>;
