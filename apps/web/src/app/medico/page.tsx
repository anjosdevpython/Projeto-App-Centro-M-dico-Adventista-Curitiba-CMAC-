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
    setActiveCallMessage(`Chamando paciente ${name} para o Consultório 04 no painel da recepção...`);
    setTimeout(() => setActiveCallMessage(null), 4000);
  }

  return (
    <div className="flex flex-col min-h-screen bg-surface pb-12">
      {/* Header from Stitch Doctor view */}
      <header className="sticky top-0 inset-x-0 z-40 bg-primary text-on-primary shadow-sm pt-safe">
        <div className="h-18 px-4 lg:px-8 py-2.5 flex items-center justify-between gap-3 max-w-7xl mx-auto w-full">
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="relative shrink-0">
              <div className="w-11 h-11 rounded-full bg-secondary-container flex items-center justify-center text-primary font-bold">
                <span className="material-symbols-outlined text-[24px]">stethoscope</span>
              </div>
              <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-tertiary-fixed rounded-full ring-2 ring-primary"></span>
            </div>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm md:text-base font-bold text-on-primary truncate">
                  Dr. Marcos Vinícius
                </span>
                <span className="px-2 py-0.5 rounded-full bg-secondary text-on-secondary text-[10px] uppercase font-bold tracking-wider">
                  CRM-PR 28.412
                </span>
              </div>
              <div className="flex items-center gap-2 mt-0.5 text-xs text-surface-container-high">
                <span className="truncate">Cardiologia Clínica</span>
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-outline-variant"></span>
                <span className="inline-flex items-center gap-1 text-tertiary-fixed-dim font-medium">
                  <span className="w-2 h-2 rounded-full bg-tertiary-fixed-dim animate-pulse"></span>
                  Consultório 04 • Unidade Curitiba
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <a
              href="/cadastro"
              title="Trocar perfil"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-on-primary text-xs font-semibold transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">swap_horiz</span>
              <span className="hidden sm:inline">Alternar Perfil</span>
            </a>
          </div>
        </div>
      </header>

      {/* Top Context & Mode Indicator Bar */}
      <div className="border-b border-slate-200 bg-surface-container-low">
        <div className="px-4 lg:px-8 py-2.5 flex items-center justify-between max-w-7xl mx-auto w-full text-xs">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-tertiary-container text-on-tertiary-container font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-tertiary-fixed inline-block mr-1.5 animate-pulse"></span>
              Sincronizado Tasy / SOUL MV
            </span>
            <span className="text-outline hidden sm:inline">Turno Eletivo Ativo</span>
          </div>
          <div className="flex items-center gap-2 text-on-surface-variant font-medium">
            <span className="material-symbols-outlined text-[16px] text-secondary">meeting_room</span>
            <span className="font-semibold text-on-surface">Consultório 04 • Ala A</span>
          </div>
        </div>
      </div>

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 lg:px-8 py-6 flex flex-col gap-6">
        {activeCallMessage && (
          <div
            role="status"
            className="p-4 rounded-2xl bg-tertiary-fixed text-on-tertiary-fixed-variant text-sm font-bold flex items-center gap-3 shadow-md animate-pulse border border-tertiary-container/20"
          >
            <span className="material-symbols-outlined text-[24px]">notifications_active</span>
            <span>{activeCallMessage}</span>
          </div>
        )}

        {/* Bento Grid Metrics on Desktop (4 columns) & Mobile (2 columns) */}
        <section aria-label="Resumo do Turno Clínico" className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg text-primary font-bold">Visão do Turno</h2>
            <span className="text-xs text-on-surface-variant bg-surface-container px-3 py-1 rounded-full font-medium">
              Segunda-feira • Escala Ambulatorial
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {/* Total Agendados */}
            <div className="col-span-2 md:col-span-1 p-4 rounded-2xl bg-surface-container-lowest shadow-sm flex flex-col justify-between border border-slate-200/80">
              <div className="flex items-center justify-between text-outline text-xs">
                <span className="font-medium">Total de Pacientes</span>
                <span className="material-symbols-outlined text-[22px] text-primary">event_available</span>
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-3xl font-bold text-primary leading-none">
                  {Math.max(appointments.length, 8)}
                </span>
                <span className="text-xs text-outline font-medium">agendados hoje</span>
              </div>
              <p className="text-[11px] text-on-surface-variant mt-1">8 Manhã · 6 Tarde</p>
            </div>

            {/* Atendidos */}
            <div className="p-4 rounded-2xl bg-surface-container-lowest shadow-sm flex flex-col justify-between border border-slate-200/80">
              <div className="flex items-center justify-between text-outline text-xs">
                <span className="font-medium">Atendidos</span>
                <span className="material-symbols-outlined text-[22px] text-tertiary-fixed-dim">
                  check_circle
                </span>
              </div>
              <div className="mt-3 flex items-baseline justify-between">
                <span className="text-3xl font-bold text-on-surface">3</span>
                <span className="text-xs text-tertiary font-bold px-2 py-0.5 rounded-full bg-emerald-50">
                  Concluídos
                </span>
              </div>
              <p className="text-[11px] text-on-surface-variant mt-1">Prontuários liberados</p>
            </div>

            {/* Na Recepção */}
            <div className="p-4 rounded-2xl bg-surface-container-lowest shadow-sm flex flex-col justify-between border border-slate-200/80">
              <div className="flex items-center justify-between text-outline text-xs">
                <span className="font-medium">Na Recepção</span>
                <span className="material-symbols-outlined text-[22px] text-secondary">
                  airline_seat_recline_normal
                </span>
              </div>
              <div className="mt-3 flex items-baseline justify-between">
                <span className="text-3xl font-bold text-secondary">2</span>
                <span className="text-xs text-secondary font-bold px-2 py-0.5 rounded-full bg-sky-50">
                  Aguardando
                </span>
              </div>
              <p className="text-[11px] text-on-surface-variant mt-1">Triagem realizada</p>
            </div>

            {/* Tempo Médio */}
            <div className="p-4 rounded-2xl bg-surface-container-lowest shadow-sm flex flex-col justify-between border border-slate-200/80">
              <div className="flex items-center justify-between text-outline text-xs">
                <span className="font-medium">Tempo Médio</span>
                <span className="material-symbols-outlined text-[22px] text-secondary">pace</span>
              </div>
              <div className="mt-3 flex items-baseline gap-1.5">
                <span className="text-3xl font-bold text-primary">20</span>
                <span className="text-xs text-outline font-medium">min / consulta</span>
              </div>
              <p className="text-[11px] text-on-surface-variant mt-1">Dentro da meta clínica</p>
            </div>
          </div>
        </section>

        {/* Fila de Pacientes & Painel de Ações Clínicas */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Main Queue: 8 cols desktop */}
          <section className="lg:col-span-8 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg text-primary font-bold">Fila de Atendimento do Turno</h2>
              <span className="text-xs text-outline font-medium">Ordem de Chegada & Recepção Digital</span>
            </div>

            <div className="flex flex-col gap-3">
              {appointments.map((apt, index) => (
                <div
                  key={apt.id}
                  className="p-4 rounded-2xl bg-surface-container-lowest shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 border border-slate-200/80 hover:border-secondary transition-all"
                >
                  <div className="flex items-start gap-3.5 min-w-0">
                    <span className="w-8 h-8 rounded-xl bg-surface-container text-primary text-sm font-bold flex items-center justify-center shrink-0">
                      {index + 1}
                    </span>
                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <strong className="text-base text-primary truncate">{apt.patientEmail}</strong>
                        <span className="px-2 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed text-[11px] font-bold">
                          {new Date(apt.startsAt).toLocaleTimeString('pt-BR', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-on-surface-variant mt-1 flex-wrap">
                        <span>
                          Protocolo SOUL MV: <code className="font-mono text-primary font-semibold">{apt.protocol}</code>
                        </span>
                        <span>•</span>
                        <span>{apt.specialtyName}</span>
                        <span>•</span>
                        <span className="text-tertiary font-semibold flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-tertiary-fixed inline-block"></span>
                          Check-in Realizado
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
                    <button
                      type="button"
                      onClick={() => handleCallPatient(apt.patientEmail)}
                      className="flex-1 md:flex-initial h-10 px-4 rounded-xl bg-primary hover:bg-primary-container text-on-primary text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-sm active:scale-[0.98] cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[18px]">campaign</span>
                      <span>Chamar ao Consultório</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => alert(`Prontuário eletrônico demonstrativo de ${apt.patientEmail} aberto.`)}
                      className="h-10 px-3.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-primary text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[18px]">clinical_notes</span>
                      <span className="hidden sm:inline">Prontuário</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Right Clinical Column: 4 cols desktop */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            <section className="p-5 rounded-2xl bg-surface-container-lowest shadow-sm flex flex-col gap-3 border border-slate-200/80">
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-[22px] text-secondary">
                  shield
                </span>
                <h3 className="text-base font-bold text-primary">Diretrizes de Turno</h3>
              </div>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                As chamadas são transmitidas em tempo real para os televisores da recepção central e alertam o paciente pelo smartphone via autoatendimento CMAC.
              </p>
              <div className="p-3 rounded-xl bg-surface-container-low text-xs flex flex-col gap-1 border border-surface-container">
                <span className="font-bold text-primary">Unidade: Curitiba - Juvevê</span>
                <span className="text-outline">Ala Ambulatorial • Piso 1</span>
              </div>
            </section>

            <section className="p-5 rounded-2xl bg-surface-container-low flex flex-col items-center text-center gap-3 border border-surface-container">
              <p className="text-xs text-on-surface-variant">
                Deseja alternar para a perspectiva do paciente e testar o agendamento?
              </p>
              <a
                href="/inicio"
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-on-primary text-xs font-bold shadow-sm hover:bg-primary-container transition-all"
              >
                <span className="material-symbols-outlined text-[18px]">person</span>
                <span>Ir para Portal do Paciente</span>
              </a>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
