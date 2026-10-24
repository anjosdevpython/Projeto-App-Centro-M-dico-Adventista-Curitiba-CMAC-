import type { SoulMvPort } from '../integrations/soul-mv/port.js';

export class CatalogService {
  constructor(private readonly soulMv: SoulMvPort) {}

  async getCatalog() {
    const [specialties, professionals, locations] = await Promise.all([
      this.soulMv.listSpecialties(),
      this.soulMv.listProfessionals(),
      this.soulMv.listLocations(),
    ]);
    return {
      institutionName: 'Centro Médico Adventista Curitiba',
      environment: 'demo' as const,
      specialties,
      professionals,
      locations,
    };
  }
}
