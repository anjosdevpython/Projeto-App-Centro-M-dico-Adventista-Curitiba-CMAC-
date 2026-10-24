import type { DemoCredentials, DemoUserRole } from './types';

const STORAGE_KEY = 'cmac_demo_session';

export function generatePatientCredentials(email?: string): DemoCredentials {
  const cleanEmail =
    email && email.includes('@')
      ? email.trim().toLowerCase()
      : 'paciente.demonstrativo@cmac.demo';
  const namePart = cleanEmail.split('@')[0] || 'paciente';
  const formattedName = namePart.charAt(0).toUpperCase() + namePart.slice(1);
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const idSuffix = Math.floor(100000 + Math.random() * 900000);

  return {
    id: `DEMO-PAC-${idSuffix}`,
    email: cleanEmail,
    patientName: `${formattedName} (Cliente/Paciente)`,
    protocol: `CMAC-DEMO-2026-${randomSuffix}`,
    role: 'paciente',
    createdAt: new Date().toISOString(),
    isSynthetic: true,
  };
}

export function generateDoctorCredentials(
  email?: string,
  doctorName = 'Dr. Lucas Silveira',
  specialty = 'Cardiologia Demonstrativa',
  crm = 'CRM-PR 28941',
): DemoCredentials {
  const cleanEmail =
    email && email.includes('@')
      ? email.trim().toLowerCase()
      : 'dr.lucas.silveira@cmac.demo';
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);

  return {
    id: `DEMO-MED-${crm.replace(/\D/g, '') || '28941'}`,
    email: cleanEmail,
    patientName: doctorName,
    protocol: `CMAC-MED-2026-${randomSuffix}`,
    role: 'medico',
    crm,
    specialty,
    createdAt: new Date().toISOString(),
    isSynthetic: true,
  };
}

export function generateDemoCredentials(
  email: string,
  role: DemoUserRole = 'paciente',
  options?: { doctorName?: string; specialty?: string; crm?: string },
): DemoCredentials {
  if (role === 'medico') {
    return generateDoctorCredentials(
      email,
      options?.doctorName,
      options?.specialty,
      options?.crm,
    );
  }
  return generatePatientCredentials(email);
}

export function saveDemoSession(credentials: DemoCredentials): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(credentials));
  } catch {
    // Fallback if storage is blocked
  }
}

export function getDemoSession(): DemoCredentials | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed.email === 'string' && typeof parsed.protocol === 'string') {
      return parsed as DemoCredentials;
    }
    return null;
  } catch {
    return null;
  }
}

export function getOrCreateDemoSession(): DemoCredentials {
  const existing = getDemoSession();
  if (existing) return existing;
  const defaultCredentials = generatePatientCredentials('paciente.demonstrativo@cmac.demo');
  saveDemoSession(defaultCredentials);
  return defaultCredentials;
}

export function clearDemoSession(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Ignore
  }
}
