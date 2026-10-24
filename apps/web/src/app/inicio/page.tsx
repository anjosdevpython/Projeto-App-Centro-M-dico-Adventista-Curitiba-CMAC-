'use client';

import { useEffect, useState } from 'react';

import { getOrCreateDemoSession } from '../../lib/demo/demo-auth';
import { listDemoAppointments } from '../../lib/demo/demo-service';
import type { DemoAppointment, DemoCredentials } from '../../lib/demo/types';

export default function InicioPage() {
  const [session, setSession] = useState<DemoCredentials | null>(null);
  const [appointments, setAppointments] = useState<DemoAppointment[]>([]);
  const [fontSize, setFontSize] = useState<number>(16);
  const [highContrast, setHighContrast] = useState<boolean>(false);

  useEffect(() => {
    setSession(getOrCreateDemoSession());
    setAppointments(listDemoAppointments());
  }, []);

  const nextAppointment = appointments.find(
    (a) => a.status === 'agendado' || a.status === 'reagendado',
  );

  return (
    <div
      className={`flex flex-col min-h-screen bg-background pb-12 ${
        highContrast ? 'contrast-125' : ''
      }`}
      style={{ fontSize: `${fontSize}px` }}
    >
      {/* Top Header - Responsive */}
      <header className="sticky top-0 inset-x-0 z-40 bg-primary-container text-on-primary shadow-md">
        <div className="px-4 lg:px-8 flex items-center justify-between h-16 max-w-7xl mx-auto w-full">
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            <img
              alt="Clínica Adventista"
              className="w-8 h-8 rounded-lg object-contain shadow-sm bg-white/10 p-0.5 shrink-0"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDrk3vT9w5PgltHzhH3M6CDRfoi4uKJJeeX4UiFhgKiEkObRjBYPJ4qSt6HxxPdEa2zxCEG8-_AhLPoWEm0A8OkaU7BNU2zKTx6R_1hoeCJtggc67-PlNJ37bK1fQ5F3_1juA2_C-WxnMGHzQ_Ga1nkWlz6WhWcLC3rz2HUEghccWwhaHGoC3WadFBUCR0JH1da8X4N51WAm8bTthLprdHNpKLCkq2RieoYLMl93gjPR4nR9Jq48PTx_To2hquGOnRKpw"
            />
            <div className="flex flex-col min-w-0 pr-1">
              <span className="font-bold text-sm tracking-tight text-surface-container-lowest leading-tight truncate">
                Clínica Adventista
              </span>
              <span className="text-xs text-surface-container-low font-normal truncate">
                Curitiba • Autoatendimento Digital
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Accessibility Controls */}
            <div className="flex items-center bg-white/10 rounded-lg p-0.5 border border-white/10">
              <button
                type="button"
                aria-label="Diminuir fonte"
                onClick={() => setFontSize(Math.max(14, fontSize - 1))}
                className="w-7 h-7 flex items-center justify-center rounded text-surface-container-lowest hover:bg-white/10 text-xs font-bold"
              >
                A-
              </button>
              <button
                type="button"
                aria-label="Aumentar fonte"
                onClick={() => setFontSize(Math.min(20, fontSize + 1))}
                className="w-7 h-7 flex items-center justify-center rounded text-surface-container-lowest hover:bg-white/10 text-xs font-bold"
              >
                A+
              </button>
              <button
                type="button"
                aria-label="Alternar contraste"
                onClick={() => setHighContrast(!highContrast)}
                className="w-7 h-7 flex items-center justify-center rounded text-surface-container-lowest hover:bg-white/10"
              >
                <span className="material-symbols-outlined text-[16px]">contrast</span>
              </button>
            </div>
            <a
              href="/ajuda"
              aria-label="Suporte e ajuda"
              className="w-8 h-8 flex items-center justify-center rounded-lg text-surface-container-lowest hover:bg-white/10 transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">contact_support</span>
            </a>
            <a
              href="/perfil"
              className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shadow-inner ml-1"
            >
              <span className="material-symbols-outlined text-on-primary text-[18px]">person</span>
            </a>
          </div>
        </div>
      </header>

      {/* Main Container: Mobile Single Column & Desktop 2-Column Grid */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 lg:px-8 py-6 flex flex-col gap-6">
        {/* Banner de Boas-vindas (Stitch) */}
        <section className="w-full rounded-2xl bg-gradient-to-br from-primary-container via-primary-container to-primary p-5 lg:p-7 text-on-primary shadow-md relative overflow-hidden">
          <div
            aria-hidden="true"
            className="absolute -right-8 -bottom-10 w-64 h-64 rounded-full bg-secondary/20 blur-3xl pointer-events-none"
          ></div>
          <div className="relative z-10 flex flex-col gap-2">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-fixed/20 text-secondary-fixed text-xs font-semibold">
                <span className="material-symbols-outlined text-[16px] text-tertiary-fixed">
                  verified_user
                </span>
                <span>{session?.role === 'medico' ? 'Corpo Clínico Conectado' : 'Portal do Paciente'}</span>
              </div>
              <span className="text-xs text-primary-fixed-dim font-mono bg-black/20 px-2 py-0.5 rounded">
                Protocolo: {session?.protocol ?? 'CMAC-DEMO-2026'}
              </span>
            </div>

            <div className="mt-2 flex items-center justify-between gap-4">
              <div className="min-w-0">
                <h1 className="text-2xl md:text-3xl text-surface-container-lowest font-bold tracking-tight truncate">
                  Olá, {session?.patientName ?? 'Carlos Silva'}
                </h1>
                <p className="text-xs md:text-sm text-on-primary-container mt-1 flex items-center gap-3 flex-wrap">
                  <span>{session?.email ?? 'paciente.demonstrativo@cmac.demo'}</span>
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-on-primary-container"></span>
                  <span>
                    Matrícula SOUL MV: <strong className="text-white">{session?.id ?? '84920-01'}</strong>
                  </span>
                </p>
              </div>
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-secondary-fixed text-[30px] md:text-[34px]">
                  account_circle
                </span>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-white/15 flex items-start gap-2.5">
              <span className="material-symbols-outlined text-tertiary-fixed-dim text-[18px] shrink-0 mt-0.5">
                health_and_safety
              </span>
              <p className="text-xs md:text-sm text-surface-container-low leading-relaxed">
                Autoatendimento exclusivo para fluxos administrativos e rotinas eletivas da Clínica Adventista. Em situações de emergência ou dor súbita intensa, dirija-se a um pronto-socorro.
              </p>
            </div>
          </div>
        </section>

        {/* Content Layout: 2 Columns on Desktop (lg:) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column (Desktop: 7 cols) -> Ações Rápidas & Exames */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            {/* Ações Rápidas (Grid 2 colunas mobile, 3 colunas desktop) */}
            <section aria-label="Ações Rápidas" className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <h2 className="text-lg text-primary font-bold tracking-tight">Ações Rápidas</h2>
                <span className="text-xs text-on-surface-variant font-medium">Autoatendimento</span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {/* Card 1: Agendar Consulta */}
                <a
                  href="/agendar"
                  className="group relative rounded-xl bg-gradient-to-br from-secondary to-primary-container p-4 text-on-primary shadow-sm hover:shadow-md transition-all active:scale-[0.98] flex flex-col justify-between min-h-[140px]"
                >
                  <div className="w-10 h-10 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center text-on-primary shadow-inner">
                    <span className="material-symbols-outlined text-[24px]">calendar_add_on</span>
                  </div>
                  <div className="mt-3 flex flex-col">
                    <span className="text-base font-bold leading-tight text-surface-container-lowest">
                      Agendar Consulta
                    </span>
                    <span className="text-[11px] text-surface-container-low mt-0.5">
                      Consultas e Exames
                    </span>
                  </div>
                  <div className="absolute top-3 right-3 text-white/40 group-hover:text-white transition-colors">
                    <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                  </div>
                </a>

                {/* Card 2: Check-in Ágil */}
                <a
                  href="/agendamentos"
                  className="group relative rounded-xl bg-surface-container-lowest border border-slate-200/80 p-4 shadow-sm hover:shadow-md hover:border-secondary transition-all active:scale-[0.98] flex flex-col justify-between min-h-[140px]"
                >
                  <div className="w-10 h-10 rounded-lg bg-surface-container text-primary flex items-center justify-center">
                    <span className="material-symbols-outlined text-[24px]">qr_code_scanner</span>
                  </div>
                  <div className="mt-3 flex flex-col">
                    <span className="text-base font-bold leading-tight text-primary">
                      Check-in Ágil
                    </span>
                    <span className="text-[11px] text-on-surface-variant mt-0.5">
                      Confirmar chegada
                    </span>
                  </div>
                  <span className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed-variant text-[10px] font-bold">
                    Recepção
                  </span>
                </a>

                {/* Card 3: Minhas Consultas */}
                <a
                  href="/agendamentos"
                  className="group relative rounded-xl bg-surface-container-lowest border border-slate-200/80 p-4 shadow-sm hover:shadow-md hover:border-secondary transition-all active:scale-[0.98] flex flex-col justify-between min-h-[140px]"
                >
                  <div className="w-10 h-10 rounded-lg bg-surface-container text-primary flex items-center justify-center">
                    <span className="material-symbols-outlined text-[24px]">event_note</span>
                  </div>
                  <div className="mt-3 flex flex-col">
                    <span className="text-base font-bold leading-tight text-primary">
                      Consultas
                    </span>
                    <span className="text-[11px] text-on-surface-variant mt-0.5">
                      Histórico e futuros
                    </span>
                  </div>
                </a>

                {/* Card 4: Teleconsulta */}
                <a
                  href="/agendar"
                  className="group relative rounded-xl bg-surface-container-lowest border border-slate-200/80 p-4 shadow-sm hover:shadow-md hover:border-secondary transition-all active:scale-[0.98] flex flex-col justify-between min-h-[140px]"
                >
                  <div className="w-10 h-10 rounded-lg bg-surface-container text-secondary flex items-center justify-center">
                    <span className="material-symbols-outlined text-[24px]">video_camera_front</span>
                  </div>
                  <div className="mt-3 flex flex-col">
                    <span className="text-base font-bold leading-tight text-primary">
                      Teleconsulta
                    </span>
                    <span className="text-[11px] text-on-surface-variant mt-0.5">
                      Atendimento online
                    </span>
                  </div>
                </a>

                {/* Card 5: Resultados e Laudos */}
                <a
                  href="/agendamentos"
                  className="group relative rounded-xl bg-surface-container-lowest border border-slate-200/80 p-4 shadow-sm hover:shadow-md hover:border-secondary transition-all active:scale-[0.98] flex flex-col justify-between min-h-[140px]"
                >
                  <div className="w-10 h-10 rounded-lg bg-surface-container text-primary flex items-center justify-center">
                    <span className="material-symbols-outlined text-[24px]">description</span>
                  </div>
                  <div className="mt-3 flex flex-col">
                    <span className="text-base font-bold leading-tight text-primary">
                      Laudos & Exames
                    </span>
                    <span className="text-[11px] text-on-surface-variant mt-0.5">
                      Central digital
                    </span>
                  </div>
                </a>

                {/* Card 6: Central de Preparos */}
                <a
                  href="/agendamentos"
                  className="group relative rounded-xl bg-surface-container-lowest border border-slate-200/80 p-4 shadow-sm hover:shadow-md hover:border-secondary transition-all active:scale-[0.98] flex flex-col justify-between min-h-[140px]"
                >
                  <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
                    <span className="material-symbols-outlined text-[24px]">warning_amber</span>
                  </div>
                  <div className="mt-3 flex flex-col">
                    <span className="text-base font-bold leading-tight text-primary">
                      Orientações
                    </span>
                    <span className="text-[11px] text-on-surface-variant mt-0.5">
                      Jejum e preparos
                    </span>
                  </div>
                </a>
              </div>
            </section>

            {/* Apoio e Assistência Humanizada */}
            <section className="w-full rounded-2xl bg-surface-container-lowest p-5 shadow-sm flex flex-col gap-4 border border-slate-200/80">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-secondary-fixed flex items-center justify-center text-secondary shrink-0">
                  <span className="material-symbols-outlined text-[22px]">volunteer_activism</span>
                </div>
                <div>
                  <h3 className="text-base font-bold text-primary">Precisa de Ajuda Humanizada?</h3>
                  <p className="text-xs text-on-surface-variant">
                    Nossa equipe de acolhimento e recepção está pronta para apoiar seu agendamento.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <a
                  href="https://wa.me/554130518000"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-12 rounded-xl bg-surface-container text-primary text-xs md:text-sm font-semibold flex items-center justify-between px-4 hover:bg-surface-container-high transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="material-symbols-outlined text-[20px] text-tertiary">chat</span>
                    <span>WhatsApp Central CMAC</span>
                  </div>
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed-variant font-bold">
                    Online
                  </span>
                </a>
                <a
                  href="tel:04130518000"
                  className="h-12 rounded-xl bg-surface-container text-primary text-xs md:text-sm font-semibold flex items-center justify-between px-4 hover:bg-surface-container-high transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="material-symbols-outlined text-[20px] text-primary">call</span>
                    <span>(41) 3051-8000</span>
                  </div>
                  <span className="text-[11px] text-outline">07h às 19h</span>
                </a>
              </div>
            </section>
          </div>

          {/* Right Column (Desktop: 5 cols) -> Próximo Agendamento & Convênio */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            {/* Próximo Atendimento Confirmado (Card de Alto Destaque do Stitch) */}
            {nextAppointment && (
              <section className="w-full">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-lg text-primary font-bold tracking-tight">Próxima Consulta</h2>
                  <span className="text-xs text-on-surface-variant font-medium">Autoatendimento</span>
                </div>

                <div className="w-full rounded-2xl bg-surface-container-lowest shadow-sm p-5 flex flex-col gap-4 border border-slate-200/80">
                  <div className="flex items-start gap-3.5">
                    <div className="w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center text-primary shrink-0 mt-0.5">
                      <span className="material-symbols-outlined text-[28px]">cardiology</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="px-2.5 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed-variant text-xs font-semibold">
                          Consulta Presencial
                        </span>
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-surface-container text-primary text-xs font-mono">
                          <span className="w-2 h-2 rounded-full bg-tertiary-fixed"></span>
                          {nextAppointment.protocol}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-primary leading-tight">
                        {nextAppointment.specialtyName}
                      </h3>
                      <p className="text-sm text-on-surface-variant mt-0.5">
                        {nextAppointment.professionalName}
                      </p>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-surface-container-low flex flex-col gap-2 border border-surface-container">
                    <div className="flex items-center gap-2 text-primary font-semibold text-sm">
                      <span className="material-symbols-outlined text-[20px] text-secondary">
                        schedule
                      </span>
                      <span>
                        {new Date(nextAppointment.startsAt).toLocaleDateString('pt-BR')} às{' '}
                        {new Date(nextAppointment.startsAt).toLocaleTimeString('pt-BR', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                    <div className="flex items-start gap-2 text-on-surface-variant text-xs">
                      <span className="material-symbols-outlined text-[18px] text-outline shrink-0 mt-0.5">
                        location_on
                      </span>
                      <span>{nextAppointment.location}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2.5 rounded-lg bg-surface-container flex items-center gap-2">
                      <span className="material-symbols-outlined text-[18px] text-on-tertiary-container">
                        check_circle
                      </span>
                      <span className="truncate font-medium">Guia Autorizada</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-surface-container flex items-center gap-2">
                      <span className="material-symbols-outlined text-[18px] text-secondary">
                        assignment
                      </span>
                      <span className="truncate font-medium">Levar exames</span>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-1">
                    <a
                      href="/agendamentos"
                      className="flex-1 h-12 rounded-xl bg-primary hover:bg-primary-container text-on-primary text-xs md:text-sm font-bold flex items-center justify-center gap-2 shadow-sm transition-all"
                    >
                      <span className="material-symbols-outlined text-[18px]">how_to_reg</span>
                      <span>Check-in Prévio</span>
                    </a>
                    <a
                      href="/agendamentos"
                      className="h-12 px-4 rounded-xl bg-surface-container text-primary text-xs md:text-sm font-semibold flex items-center justify-center gap-1.5 hover:bg-surface-container-high transition-colors"
                    >
                      <span className="material-symbols-outlined text-[18px]">edit_calendar</span>
                      <span>Gerenciar</span>
                    </a>
                  </div>
                </div>
              </section>
            )}

            {/* Prontuário & Convênio Sincronizado */}
            <section className="w-full flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <h2 className="text-lg text-primary font-bold tracking-tight">Prontuário & Convênio</h2>
                <span className="text-xs text-on-surface-variant font-medium">Sincronizado MV</span>
              </div>

              <div className="w-full p-5 rounded-2xl bg-surface-container-lowest shadow-sm flex items-center justify-between gap-3 border border-slate-200/80">
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-11 h-11 rounded-xl bg-secondary-fixed flex items-center justify-center text-on-secondary-fixed shrink-0">
                    <span className="material-symbols-outlined text-[24px]">verified</span>
                  </div>
                  <div className="min-w-0">
                    <span className="text-xs text-on-surface-variant block font-medium">Convênio Ativo</span>
                    <h4 className="text-sm font-bold text-primary truncate">Unimed Curitiba</h4>
                    <span className="text-xs text-outline truncate block mt-0.5">
                      Plano Nacional • Elegibilidade Válida
                    </span>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full bg-tertiary-fixed text-on-tertiary-fixed-variant text-xs font-bold shrink-0">
                  Liberado
                </span>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
