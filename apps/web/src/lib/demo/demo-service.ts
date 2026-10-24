import type {
  DemoAppointment,
  DemoProfessional,
  DemoSlot,
  DemoSpecialty,
} from './types';

export const DEMO_SPECIALTIES: DemoSpecialty[] = [
  {
    id: 'cardiology',
    name: 'Cardiologia Demonstrativa',
    description: 'Avaliação clínica cardiológica e prevenção cardiovascular simulada.',
    isSynthetic: true,
  },
  {
    id: 'general-medicine',
    name: 'Clínica Médica Geral',
    description: 'Acompanhamento preventivo e triagem clínica geral.',
    isSynthetic: true,
  },
  {
    id: 'pediatrics',
    name: 'Pediatria Demonstrativa',
    description: 'Atendimento infantil preventivo e acompanhamento de rotina.',
    isSynthetic: true,
  },
  {
    id: 'orthopedics',
    name: 'Ortopedia Demonstrativa',
    description: 'Avaliação osteomuscular e postura preventiva.',
    isSynthetic: true,
  },
];

export const DEMO_PROFESSIONALS: DemoProfessional[] = [
  {
    id: 'prof-cardio-1',
    name: 'Dr. Lucas Silveira',
    crm: 'CRM-PR 28941',
    specialtyId: 'cardiology',
    isSynthetic: true,
  },
  {
    id: 'prof-cardio-2',
    name: 'Dra. Beatriz Santos',
    crm: 'CRM-PR 31205',
    specialtyId: 'cardiology',
    isSynthetic: true,
  },
  {
    id: 'prof-general-1',
    name: 'Dr. Fernando Prado',
    crm: 'CRM-PR 24108',
    specialtyId: 'general-medicine',
    isSynthetic: true,
  },
  {
    id: 'prof-pedia-1',
    name: 'Dra. Camila Rocha',
    crm: 'CRM-PR 35890',
    specialtyId: 'pediatrics',
    isSynthetic: true,
  },
  {
    id: 'prof-ortho-1',
    name: 'Dr. Rodrigo Mendes',
    crm: 'CRM-PR 27443',
    specialtyId: 'orthopedics',
    isSynthetic: true,
  },
];

export const DEMO_SLOTS: DemoSlot[] = [
  {
    id: 'slot-c1',
    specialtyId: 'cardiology',
    professionalId: 'prof-cardio-1',
    location: 'CMAC Curitiba — Sala 204',
    startsAt: '2026-10-28T09:00:00-03:00',
    endsAt: '2026-10-28T09:30:00-03:00',
    isSynthetic: true,
  },
  {
    id: 'slot-c2',
    specialtyId: 'cardiology',
    professionalId: 'prof-cardio-1',
    location: 'CMAC Curitiba — Sala 204',
    startsAt: '2026-10-28T10:00:00-03:00',
    endsAt: '2026-10-28T10:30:00-03:00',
    isSynthetic: true,
  },
  {
    id: 'slot-c3',
    specialtyId: 'cardiology',
    professionalId: 'prof-cardio-2',
    location: 'CMAC Curitiba — Sala 206',
    startsAt: '2026-10-29T14:30:00-03:00',
    endsAt: '2026-10-29T15:00:00-03:00',
    isSynthetic: true,
  },
  {
    id: 'slot-g1',
    specialtyId: 'general-medicine',
    professionalId: 'prof-general-1',
    location: 'CMAC Curitiba — Sala 102',
    startsAt: '2026-10-27T08:30:00-03:00',
    endsAt: '2026-10-27T09:00:00-03:00',
    isSynthetic: true,
  },
  {
    id: 'slot-g2',
    specialtyId: 'general-medicine',
    professionalId: 'prof-general-1',
    location: 'CMAC Curitiba — Sala 102',
    startsAt: '2026-10-27T11:00:00-03:00',
    endsAt: '2026-10-27T11:30:00-03:00',
    isSynthetic: true,
  },
  {
    id: 'slot-p1',
    specialtyId: 'pediatrics',
    professionalId: 'prof-pedia-1',
    location: 'CMAC Curitiba — Sala 108',
    startsAt: '2026-10-30T13:30:00-03:00',
    endsAt: '2026-10-30T14:00:00-03:00',
    isSynthetic: true,
  },
  {
    id: 'slot-o1',
    specialtyId: 'orthopedics',
    professionalId: 'prof-ortho-1',
    location: 'CMAC Curitiba — Sala 215',
    startsAt: '2026-10-31T15:00:00-03:00',
    endsAt: '2026-10-31T15:30:00-03:00',
    isSynthetic: true,
  },
];

const APPOINTMENTS_STORAGE_KEY = 'cmac_demo_appointments';

function getInitialAppointments(): DemoAppointment[] {
  return [
    {
      id: 'apt-demo-init-1',
      protocol: 'CMAC-DEMO-2026-7842',
      specialtyId: 'cardiology',
      specialtyName: 'Cardiologia Demonstrativa',
      professionalId: 'prof-cardio-1',
      professionalName: 'Dr. Lucas Silveira (CRM-PR 28941)',
      location: 'CMAC Curitiba — Sala 204',
      startsAt: '2026-10-28T09:00:00-03:00',
      endsAt: '2026-10-28T09:30:00-03:00',
      status: 'agendado',
      createdAt: '2026-10-24T12:00:00-03:00',
      patientEmail: 'paciente.demonstrativo@cmac.demo',
      isSynthetic: true,
    },
  ];
}

export function listDemoAppointments(): DemoAppointment[] {
  if (typeof window === 'undefined') return getInitialAppointments();
  try {
    const raw = localStorage.getItem(APPOINTMENTS_STORAGE_KEY);
    if (!raw) {
      const initial = getInitialAppointments();
      localStorage.setItem(APPOINTMENTS_STORAGE_KEY, JSON.stringify(initial));
      return initial;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed as DemoAppointment[];
    return getInitialAppointments();
  } catch {
    return getInitialAppointments();
  }
}

export function saveDemoAppointments(appointments: DemoAppointment[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(APPOINTMENTS_STORAGE_KEY, JSON.stringify(appointments));
  } catch {
    // Ignore storage issues
  }
}

export function bookDemoAppointment(params: {
  slotId: string;
  patientEmail: string;
}): DemoAppointment {
  const slot = DEMO_SLOTS.find((s) => s.id === params.slotId);
  if (!slot) throw new Error('Horário não encontrado.');

  const specialty = DEMO_SPECIALTIES.find((s) => s.id === slot.specialtyId);
  const professional = DEMO_PROFESSIONALS.find((p) => p.id === slot.professionalId);

  const randomNum = Math.floor(1000 + Math.random() * 9000);
  const appointment: DemoAppointment = {
    id: `apt-${Date.now()}-${randomNum}`,
    protocol: `CMAC-DEMO-2026-${randomNum}`,
    specialtyId: slot.specialtyId,
    specialtyName: specialty?.name ?? 'Especialidade Demonstrativa',
    professionalId: slot.professionalId,
    professionalName: professional ? `${professional.name} (${professional.crm})` : 'Profissional',
    location: slot.location,
    startsAt: slot.startsAt,
    endsAt: slot.endsAt,
    status: 'agendado',
    createdAt: new Date().toISOString(),
    patientEmail: params.patientEmail,
    isSynthetic: true,
  };

  const list = listDemoAppointments();
  list.unshift(appointment);
  saveDemoAppointments(list);
  return appointment;
}

export function cancelDemoAppointment(id: string): DemoAppointment | null {
  const list = listDemoAppointments();
  const index = list.findIndex((a) => a.id === id);
  if (index === -1) return null;
  const current = list[index];
  if (!current) return null;

  const updated: DemoAppointment = {
    ...current,
    status: 'cancelado',
  };
  list[index] = updated;
  saveDemoAppointments(list);
  return updated;
}

export function rescheduleDemoAppointment(id: string, newSlotId: string): DemoAppointment | null {
  const newSlot = DEMO_SLOTS.find((s) => s.id === newSlotId);
  if (!newSlot) return null;

  const list = listDemoAppointments();
  const index = list.findIndex((a) => a.id === id);
  if (index === -1) return null;
  const current = list[index];
  if (!current) return null;

  const specialty = DEMO_SPECIALTIES.find((s) => s.id === newSlot.specialtyId);
  const professional = DEMO_PROFESSIONALS.find((p) => p.id === newSlot.professionalId);

  const updated: DemoAppointment = {
    ...current,
    specialtyId: newSlot.specialtyId,
    specialtyName: specialty?.name ?? current.specialtyName,
    professionalId: newSlot.professionalId,
    professionalName: professional ? `${professional.name} (${professional.crm})` : current.professionalName,
    location: newSlot.location,
    startsAt: newSlot.startsAt,
    endsAt: newSlot.endsAt,
    status: 'reagendado',
  };
  list[index] = updated;
  saveDemoAppointments(list);
  return updated;
}

export function resetAllDemoData(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(APPOINTMENTS_STORAGE_KEY);
    localStorage.removeItem('cmac_demo_session');
  } catch {
    // Ignore
  }
}
