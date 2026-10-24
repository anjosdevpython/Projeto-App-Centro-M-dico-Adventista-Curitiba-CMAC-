export type DemoUserRole = 'paciente' | 'medico';

export interface DemoCredentials {
  id: string;
  email: string;
  patientName: string;
  protocol: string;
  role: DemoUserRole;
  crm?: string;
  specialty?: string;
  createdAt: string;
  isSynthetic: true;
}

export interface DemoSpecialty {
  id: string;
  name: string;
  description: string;
  isSynthetic: true;
}

export interface DemoProfessional {
  id: string;
  name: string;
  crm: string;
  specialtyId: string;
  isSynthetic: true;
}

export interface DemoSlot {
  id: string;
  specialtyId: string;
  professionalId: string;
  location: string;
  startsAt: string;
  endsAt: string;
  isSynthetic: true;
}

export type DemoAppointmentStatus = 'agendado' | 'reagendado' | 'cancelado' | 'atendido';

export interface DemoAppointment {
  id: string;
  protocol: string;
  specialtyId: string;
  specialtyName: string;
  professionalId: string;
  professionalName: string;
  location: string;
  startsAt: string;
  endsAt: string;
  status: DemoAppointmentStatus;
  createdAt: string;
  patientEmail: string;
  patientName?: string;
  isSynthetic: true;
}
