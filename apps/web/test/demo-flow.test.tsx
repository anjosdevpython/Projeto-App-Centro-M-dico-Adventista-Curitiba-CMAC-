import { beforeEach, describe, expect, it } from 'vitest';

import {
  clearDemoSession,
  generateDemoCredentials,
  getDemoSession,
  saveDemoSession,
} from '../src/lib/demo/demo-auth';
import {
  DEMO_SLOTS,
  bookDemoAppointment,
  cancelDemoAppointment,
  listDemoAppointments,
  rescheduleDemoAppointment,
  resetAllDemoData,
} from '../src/lib/demo/demo-service';

describe('Demo Flow and Storage', () => {
  beforeEach(() => {
    resetAllDemoData();
    clearDemoSession();
  });

  it('generates synthetic credentials with correct structure and protocol', () => {
    const creds = generateDemoCredentials('allan.teste@cmac.demo');
    expect(creds.email).toBe('allan.teste@cmac.demo');
    expect(creds.id).toMatch(/^DEMO-PAC-\d+$/);
    expect(creds.protocol).toMatch(/^CMAC-DEMO-2026-\d+$/);
    expect(creds.isSynthetic).toBe(true);
  });

  it('persists and restores demo session in browser storage', () => {
    const creds = generateDemoCredentials('usuario@cmac.demo');
    saveDemoSession(creds);

    const loaded = getDemoSession();
    expect(loaded).not.toBeNull();
    expect(loaded?.email).toBe('usuario@cmac.demo');
    expect(loaded?.protocol).toBe(creds.protocol);
  });

  it('books, reschedules and cancels simulated appointments', () => {
    const slot = DEMO_SLOTS[0]!;
    const apt = bookDemoAppointment({
      slotId: slot.id,
      patientEmail: 'paciente.teste@cmac.demo',
    });

    expect(apt.id).toBeDefined();
    expect(apt.protocol).toMatch(/^CMAC-DEMO-2026-\d+$/);
    expect(apt.status).toBe('agendado');

    const list = listDemoAppointments();
    expect(list.some((a) => a.id === apt.id)).toBe(true);

    const alternativeSlot = DEMO_SLOTS[1]!;
    const rescheduled = rescheduleDemoAppointment(apt.id, alternativeSlot.id);
    expect(rescheduled?.status).toBe('reagendado');
    expect(rescheduled?.startsAt).toBe(alternativeSlot.startsAt);

    const cancelled = cancelDemoAppointment(apt.id);
    expect(cancelled?.status).toBe('cancelado');
  });
});
