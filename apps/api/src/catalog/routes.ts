import type { FastifyInstance } from 'fastify';
import { z } from 'zod';

import type { SoulMvPort } from '../integrations/soul-mv/port.js';
import type { CatalogService } from './service.js';

export async function registerCatalogRoutes(
  app: FastifyInstance,
  options: { catalogService: CatalogService; soulMv: SoulMvPort },
): Promise<void> {
  app.get('/v1/catalog', async () => options.catalogService.getCatalog());
  app.get('/v1/catalog/slots', async (request) => {
    const query = z.object({
      specialtyId: z.string().optional(),
      professionalId: z.string().optional(),
    }).parse(request.query);
    return options.soulMv.listSlots({
      ...(query.specialtyId ? { specialtyId: query.specialtyId } : {}),
      ...(query.professionalId ? { professionalId: query.professionalId } : {}),
    });
  });
}
