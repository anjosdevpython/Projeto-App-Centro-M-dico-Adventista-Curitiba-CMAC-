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
      className={`flex flex-col min-h-screen bg-background pb-20 ${
        highContrast ? 'contrast-125' : ''
      }`}
      style={{ fontSize: `${fontSize}px` }}
    >
      {/* Top Header from Stitch */}
      <header className="sticky top-0 inset-x-0 z-40 bg-primary-container text-on-primary shadow-md">
        <div className="px-4 flex items-center justify-between h-16 max-w-xl mx-auto">
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
                Curitiba • Atendimento
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
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

      <main className="flex-1 w-full max-w-xl mx-auto px-4 py-4 flex flex-col gap-4">
        {/* Banner de Boas-vindas (Stitch) */}
        <section className="w-full rounded-xl bg-gradient-to-br from-primary-container via-primary-container to-primary p-5 text-on-primary shadow-md relative overflow-hidden">
          <div
            aria-hidden="true"
            className="absolute -right-8 -bottom-10 w-44 h-44 rounded-full bg-secondary/20 blur-2xl pointer-events-none"
          ></div>
          <div className="relative z-10 flex flex-col gap-1">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-secondary-fixed/20 text-secondary-fixed text-xs font-semibold">
                <span className="material-symbols-outlined text-[15px] text-tertiary-fixed">
                  verified_user
                </span>
                <span>{session?.role === 'medico' ? 'Corpo Clínico' : 'Portal do Paciente'}</span>
              </div>
              <span className="text-[11px] text-primary-fixed-dim font-mono">
                {session?.protocol ?? 'CMAC-DEMO-2026'}
              </span>
            </div>

            <div className="mt-2 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <h1 className="text-2xl text-surface-container-lowest font-bold tracking-tight truncate">
                  Olá, {session?.patientName ?? 'Carlos Silva'}
                </h1>
                <p className="text-xs text-on-primary-container mt-0.5 flex items-center gap-2 flex-wrap">
                  <span>{session?.email ?? 'paciente.demonstrativo@cmac.demo'}</span>
                  <span className="inline-block w-1 h-1 rounded-full bg-on-primary-container"></span>
                  <span>
                    Matrícula SOUL MV: <strong>{session?.id ?? '84920-01'}</strong>
                  </span>
                </p>
              </div>
              <div className="w-11 h-11 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-secondary-fixed text-[26px]">
                  account_circle
                </span>
              </div>
            </div>

            <div className="mt-3 pt-2 border-t border-white/15 flex items-start gap-2">
              <span className="material-symbols-outlined text-tertiary-fixed-dim text-[16px] shrink-0 mt-0.5">
                health_and_safety
              </span>
              <p className="text-xs text-surface-container-low leading-relaxed">
                Autoatendimento exclusivo para fluxos administrativos e rotinas eletivas. Em casos
                de dor intensa, procure atendimento médico.
              </p>
            </div>
          </div>
        </section>

        {/* Ações Rápidas (Grid 2 colunas Stitch) */}
        <section aria-label="Ações Rápidas" className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <h2 className="text-base text-primary font-bold tracking-tight">Ações Rápidas</h2>
            <span className="text-xs text-on-surface-variant font-medium">Autoatendimento</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
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
                <span className="text-xs text-surface-container-high mt-0.5 line-clamp-2">
                  Especialidades e teleconsulta
                </span>
              </div>
              <span className="material-symbols-outlined absolute top-3 right-3 text-white/40 group-hover:text-white transition-colors text-[20px]">
                arrow_forward
              </span>
            </a>

            {/* Card 2: Agendar Exames */}
            <a
              href="/agendar"
              className="group relative rounded-xl bg-primary-container p-4 text-on-primary shadow-sm hover:shadow-md transition-all active:scale-[0.98] flex flex-col justify-between min-h-[140px]"
            >
              <div className="w-10 h-10 rounded-lg bg-white/15 backdrop-blur-sm flex items-center justify-center text-secondary-fixed shadow-inner">
                <span className="material-symbols-outlined text-[24px]">science</span>
              </div>
              <div className="mt-3 flex flex-col">
                <span className="text-base font-bold leading-tight text-surface-container-lowest">
                  Agendar Exames
                </span>
                <span className="text-xs text-surface-container-high mt-0.5 line-clamp-2">
                  Mais de 120 tipos disponíveis
                </span>
              </div>
              <span className="material-symbols-outlined absolute top-3 right-3 text-white/40 group-hover:text-white transition-colors text-[20px]">
                arrow_forward
              </span>
            </a>

            {/* Card 3: Meus Agendamentos */}
            <a
              href="/agendamentos"
              className="group relative rounded-xl bg-surface-container-lowest p-4 text-on-surface shadow-sm hover:shadow-md transition-all active:scale-[0.98] flex flex-col justify-between min-h-[140px] border border-slate-100"
            >
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-[24px]">event_available</span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed-variant text-[11px] font-bold">
                  {appointments.length} Ativo(s)
                </span>
              </div>
              <div className="mt-3 flex flex-col">
                <span className="text-base font-bold leading-tight text-primary">Consultas</span>
                <span className="text-xs text-on-surface-variant mt-0.5 line-clamp-2">
                  Gerencie horários e protocolos
                </span>
              </div>
              <span className="material-symbols-outlined absolute top-3 right-3 text-outline-variant group-hover:text-secondary transition-colors text-[20px]">
                arrow_forward
              </span>
            </a>

            {/* Card 4: Preparos de Exames */}
            <a
              href="/ajuda"
              className="group relative rounded-xl bg-surface-container-lowest p-4 text-on-surface shadow-sm hover:shadow-md transition-all active:scale-[0.98] flex flex-col justify-between min-h-[140px] border border-slate-100"
            >
              <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-secondary">
                <span className="material-symbols-outlined text-[24px]">menu_book</span>
              </div>
              <div className="mt-3 flex flex-col">
                <span className="text-base font-bold leading-tight text-primary">Preparos</span>
                <span className="text-xs text-on-surface-variant mt-0.5 line-clamp-2">
                  Jejum e orientações clínicas
                </span>
              </div>
              <span className="material-symbols-outlined absolute top-3 right-3 text-outline-variant group-hover:text-secondary transition-colors text-[20px]">
                arrow_forward
              </span>
            </a>
          </div>
        </section>

        {/* Próximo Atendimento Confirmado (Card de Alto Destaque do Stitch) */}
        {nextAppointment && (
          <section className="w-full">
            <div className="w-full rounded-xl bg-surface-container-lowest shadow-sm p-4 flex flex-col gap-3 border border-slate-100">
              <div className="flex items-start gap-3">
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

              <div className="p-3.5 rounded-xl bg-surface-container-low flex flex-col gap-1.5 border border-surface-container">
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
                <div className="p-2 rounded-lg bg-surface-container flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px] text-on-tertiary-container">
                    check_circle
                  </span>
                  <span className="truncate">Guia Autorizada</span>
                </div>
                <div className="p-2 rounded-lg bg-surface-container flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px] text-secondary">
                    assignment
                  </span>
                  <span className="truncate">Levar exames</span>
                </div>
              </div>

              <div className="flex gap-2 pt-1">
                <a
                  href="/agendamentos"
                  className="flex-1 h-11 rounded-lg bg-primary hover:bg-primary-container text-on-primary text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-all"
                >
                  <span className="material-symbols-outlined text-[18px]">how_to_reg</span>
                  <span>Check-in Prévio</span>
                </a>
                <a
                  href="/agendamentos"
                  className="h-11 px-3.5 rounded-lg bg-surface-container text-primary text-xs font-semibold flex items-center justify-center gap-1 hover:bg-surface-container-high transition-colors"
                >
                  <span className="material-symbols-outlined text-[16px]">edit_calendar</span>
                  <span>Gerenciar</span>
                </a>
              </div>
            </div>
          </section>
        )}

        {/* Prontuário & Convênio Sincronizado */}
        <section className="w-full flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <h2 className="text-base text-primary font-bold tracking-tight">Prontuário & Convênio</h2>
            <span className="text-xs text-on-surface-variant">Sincronizado MV</span>
          </div>

          <div className="w-full p-4 rounded-xl bg-surface-container-lowest shadow-sm flex items-center justify-between gap-3 border border-slate-100">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-full bg-secondary-fixed flex items-center justify-center text-on-secondary-fixed shrink-0">
                <span className="material-symbols-outlined text-[22px]">verified</span>
              </div>
              <div className="min-w-0">
                <span className="text-xs text-on-surface-variant block">Convênio Ativo</span>
                <h4 className="text-sm font-bold text-primary truncate">Unimed Curitiba</h4>
                <span className="text-xs text-outline truncate block">
                  Plano Nacional • Elegibilidade Válida
                </span>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed-variant text-[11px] font-bold shrink-0">
              Liberado
            </span>
          </div>
        </section>

        {/* Apoio e Assistência Humanizada */}
        <section className="w-full rounded-xl bg-surface-container-lowest p-4 shadow-sm flex flex-col gap-3 border border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-secondary-fixed flex items-center justify-center text-secondary shrink-0">
              <span className="material-symbols-outlined text-[22px]">volunteer_activism</span>
            </div>
            <div>
              <h3 className="text-base font-bold text-primary">Precisa de Ajuda Humanizada?</h3>
              <p className="text-xs text-on-surface-variant">
                Nossa equipe de recepção está disponível para você.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <a
              href="https://wa.me/554130518000"
              target="_blank"
              rel="noopener noreferrer"
              className="h-11 rounded-lg bg-surface-container text-primary text-xs font-semibold flex items-center justify-between px-3 hover:bg-surface-container-high transition-colors"
            >
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-tertiary">chat</span>
                <span>WhatsApp Central</span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-surface-container-high">
                Online
              </span>
            </a>
            <a
              href="tel:04130518000"
              className="h-11 rounded-lg bg-surface-container text-primary text-xs font-semibold flex items-center justify-between px-3 hover:bg-surface-container-high transition-colors"
            >
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-primary">call</span>
                <span>(41) 3051-8000</span>
              </div>
              <span className="text-[10px] text-outline">07h-19h</span>
            </a>
          </div>
        </section>
      </main>
    </div>
  );
}
