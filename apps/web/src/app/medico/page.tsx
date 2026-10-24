'use client';

import { useEffect, useState } from 'react';

import { getOrCreateDemoSession } from '../../lib/demo/demo-auth';
import { listDemoAppointments } from '../../lib/demo/demo-service';
import type { DemoAppointment, DemoCredentials } from '../../lib/demo/types';

export default function MedicoPage() {
  const [session, setSession] = useState<DemoCredentials | null>(null);
  const [appointments, setAppointments] = useState<DemoAppointment[]>([]);
  const [activeCallMessage, setActiveCallMessage] = useState<string | null>(null);

  useEffect(() => {
    setSession(getOrCreateDemoSession());
    setAppointments(listDemoAppointments());
  }, []);

  function handleCallPatient(name: string) {
    setActiveCallMessage(`Chamando paciente ${name} para o Consultório 04...`);
    setTimeout(() => setActiveCallMessage(null), 4000);
  }

  return (
    <div className="flex flex-col min-h-screen bg-surface pb-24">
      {/* Header from Stitch Doctor view */}
      <header className="sticky top-0 inset-x-0 z-40 bg-primary text-on-primary shadow-sm pt-safe">
        <div className="h-18 px-4 py-2 flex items-center justify-between gap-2 max-w-xl mx-auto">
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative shrink-0">
              <div className="w-11 h-11 rounded-full bg-secondary-container flex items-center justify-center text-primary font-bold">
                <span className="material-symbols-outlined text-[24px]">stethoscope</span>
              </div>
              <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-tertiary-fixed rounded-full ring-2 ring-primary"></span>
            </div>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-bold text-on-primary truncate">
                  Dr. Marcos Vinícius
                </span>
                <span className="px-1.5 py-0.2 rounded-full bg-secondary text-on-secondary text-[10px] uppercase font-semibold">
                  CRM-PR 28.412
                </span>
              </div>
              <div className="flex items-center gap-2 mt-0.5 text-xs text-surface-container-high">
                <span className="truncate">Cardiologia Clínica</span>
                <span className="inline-block w-1 h-1 rounded-full bg-outline-variant"></span>
                <span className="inline-flex items-center gap-1 text-tertiary-fixed-dim font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-tertiary-fixed-dim animate-pulse"></span>
                  Consultório 04
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <a
              href="/cadastro"
              title="Trocar perfil"
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10 text-on-primary transition-colors"
            >
              <span className="material-symbols-outlined">swap_horiz</span>
            </a>
          </div>
        </div>
      </header>

      {/* Top Context & Mode Indicator Bar */}
      <div className="px-4 py-2 bg-surface-container-low flex items-center justify-between shadow-sm max-w-xl mx-auto w-full text-xs">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-tertiary-container text-on-tertiary-container font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-tertiary-fixed inline-block mr-1 animate-pulse"></span>
            Sincronizado Tasy / SOUL MV
          </span>
          <span className="text-outline">Turno Ativo</span>
        </div>
        <div className="flex items-center gap-1 text-on-surface-variant font-medium">
          <span className="material-symbols-outlined text-[16px] text-secondary">meeting_room</span>
          <span className="font-semibold text-on-surface">Consultório 04</span>
        </div>
      </div>

      <main className="flex-1 w-full max-w-xl mx-auto px-4 py-4 flex flex-col gap-4">
        {activeCallMessage && (
          <div
            role="status"
            className="p-3 rounded-xl bg-tertiary-fixed text-on-tertiary-fixed-variant text-sm font-bold flex items-center gap-2 shadow-sm animate-pulse"
          >
            <span className="material-symbols-outlined text-[20px]">notifications_active</span>
            <span>{activeCallMessage}</span>
          </div>
        )}

        {/* Bento Grid Metrics from Stitch */}
        <section aria-label="Resumo do Turno Clínico" className="flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <h2 className="text-base text-primary font-bold">Visão do Turno</h2>
            <span className="text-xs text-on-surface-variant bg-surface-container px-2.5 py-0.5 rounded-full">
              Escala de Hoje
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            {/* Total card */}
            <div className="col-span-2 p-3.5 rounded-xl bg-surface-container-lowest shadow-sm flex items-center justify-between border border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-lg bg-surface-container-high text-primary flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[26px]">event_available</span>
                </div>
                <div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-2xl font-bold text-primary leading-none">
                      {Math.max(appointments.length, 8)}
                    </span>
                    <span className="text-xs text-outline font-medium">pacientes agendados</span>
                  </div>
                  <p className="text-xs text-on-surface-variant mt-0.5">Cardiologia Ambulatorial</p>
                </div>
              </div>
              <div className="text-right pl-2">
                <div className="flex items-center gap-1 text-secondary justify-end text-xs font-semibold">
                  <span className="material-symbols-outlined text-[16px]">pace</span>
                  <span>20 min / cons.</span>
                </div>
                <span className="text-[11px] text-outline">tempo médio</span>
              </div>
            </div>

            {/* Metric Tile 1 */}
            <div className="p-3 rounded-xl bg-surface-container-lowest shadow-sm flex flex-col justify-between border border-slate-100">
              <div className="flex items-center justify-between text-outline text-xs">
                <span>Atendidos</span>
                <span className="material-symbols-outlined text-[18px] text-tertiary-fixed-dim">
                  check_circle
                </span>
              </div>
              <div className="mt-2 flex items-baseline justify-between">
                <span className="text-xl font-bold text-on-surface">3</span>
                <span className="text-xs text-tertiary font-semibold">Concluídos</span>
              </div>
            </div>

            {/* Metric Tile 2 */}
            <div className="p-3 rounded-xl bg-surface-container-lowest shadow-sm flex flex-col justify-between border border-slate-100">
              <div className="flex items-center justify-between text-outline text-xs">
                <span>Na Recepção</span>
                <span className="material-symbols-outlined text-[18px] text-secondary">
                  airline_seat_recline_normal
                </span>
              </div>
              <div className="mt-2 flex items-baseline justify-between">
                <span className="text-xl font-bold text-secondary">2</span>
                <span className="text-xs text-secondary font-semibold">Aguardando</span>
              </div>
            </div>
          </div>
        </section>

        {/* Fila de Pacientes */}
        <section className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <h2 className="text-base text-primary font-bold">Fila de Consultas do Dia</h2>
            <span className="text-xs text-outline">Ordem de Chegada</span>
          </div>

          <div className="flex flex-col gap-2.5">
            {appointments.map((apt, index) => (
              <div
                key={apt.id}
                className="p-3.5 rounded-xl bg-surface-container-lowest shadow-sm flex flex-col gap-2 border border-slate-100"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-surface-container text-primary text-xs font-bold flex items-center justify-center">
                      {index + 1}
                    </span>
                    <strong className="text-sm text-primary">{apt.patientEmail}</strong>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed text-[11px] font-semibold">
                    {new Date(apt.startsAt).toLocaleTimeString('pt-BR', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs text-on-surface-variant">
                  <span>
                    Protocolo: <code>{apt.protocol}</code>
                  </span>
                  <span>{apt.specialtyName}</span>
                </div>

                <div className="flex gap-2 pt-1 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => handleCallPatient(apt.patientEmail)}
                    className="flex-1 h-9 rounded-lg bg-primary hover:bg-primary-container text-on-primary text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px]">campaign</span>
                    <span>Chamar ao Consultório</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => alert(`Prontuário eletrônico demonstrativo de ${apt.patientEmail} aberto.`)}
                    className="h-9 px-3 rounded-lg bg-surface-container hover:bg-surface-container-high text-primary text-xs font-semibold flex items-center justify-center gap-1 transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px]">clinical_notes</span>
                    <span>Prontuário</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Retornar ao paciente */}
        <section className="p-4 rounded-xl bg-surface-container-low flex flex-col items-center text-center gap-2 border border-surface-container">
          <p className="text-xs text-on-surface-variant">
            Deseja simular o fluxo a partir da visão do cliente/paciente?
          </p>
          <a
            href="/inicio"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-on-primary text-xs font-bold shadow-sm"
          >
            <span className="material-symbols-outlined text-[16px]">person</span>
            <span>Alternar para Portal do Paciente</span>
          </a>
        </section>
      </main>
    </div>
  );
}
