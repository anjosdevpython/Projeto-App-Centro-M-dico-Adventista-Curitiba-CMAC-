import type { CatalogItem, Slot } from '@cmac/contracts';

export const demoSpecialties: CatalogItem[] = [
  { id: 'cardiology', name: 'Cardiologia demonstrativa', isSynthetic: true },
  { id: 'general-medicine', name: 'Clínica médica demonstrativa', isSynthetic: true },
];

export const demoProfessionals: CatalogItem[] = [
  { id: 'professional-1', name: 'Profissional Demonstrativo 1', isSynthetic: true },
  { id: 'professional-2', name: 'Profissional Demonstrativo 2', isSynthetic: true },
];

export const demoLocations: CatalogItem[] = [
  {
    id: 'cmac-demo',
    name: 'Centro Médico Adventista Curitiba — ambiente demonstrativo',
    isSynthetic: true,
  },
];

export const demoSlots: Slot[] = [
  {
    id: 'slot-cardio-1',
    specialtyId: 'cardiology',
    professionalId: 'professional-1',
    locationId: 'cmac-demo',
    startsAt: '2026-10-26T09:00:00-03:00',
    endsAt: '2026-10-26T09:30:00-03:00',
    isSynthetic: true,
  },
  {
    id: 'slot-general-1',
    specialtyId: 'general-medicine',
    professionalId: 'professional-2',
    locationId: 'cmac-demo',
    startsAt: '2026-10-27T14:00:00-03:00',
    endsAt: '2026-10-27T14:30:00-03:00',
    isSynthetic: true,
  },
];
