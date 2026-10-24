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
      className={`flex flex-col min-h-screen bg-background pb-12 animate-fade-in-up ${
        highContrast ? 'contrast-125' : ''
      }`}
      style={{ fontSize: `${fontSize}px` }}
    >
      {/* Top Header - Glass Header */}
      <header className="sticky top-0 inset-x-0 z-40 bg-primary-container/95 backdrop-blur-md text-on-primary shadow-sm border-b border-white/10">
        <div className="px-4 lg:px-8 flex items-center justify-between h-16 max-w-7xl mx-auto w-full">
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            <img
              alt="Clínica Adventista"
              className="w-9 h-9 rounded-xl object-contain shadow-sm bg-white/10 p-0.5 shrink-0 transition-transform duration-300 hover:scale-105"
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
                className="w-7 h-7 flex items-center justify-center rounded text-surface-container-lowest hover:bg-white/15 text-xs font-bold transition-colors"
              >
                A-
              </button>
              <button
                type="button"
                aria-label="Aumentar fonte"
                onClick={() => setFontSize(Math.min(20, fontSize + 1))}
                className="w-7 h-7 flex items-center justify-center rounded text-surface-container-lowest hover:bg-white/15 text-xs font-bold transition-colors"
              >
                A+
              </button>
              <button
                type="button"
                aria-label="Alternar contraste"
                onClick={() => setHighContrast(!highContrast)}
                className="w-7 h-7 flex items-center justify-center rounded text-surface-container-lowest hover:bg-white/15 transition-colors"
              >
                <span className="material-symbols-outlined text-[16px]">contrast</span>
              </button>
            </div>
            <a
              href="/ajuda"
              aria-label="Suporte e ajuda"
              className="w-8 h-8 flex items-center justify-center rounded-lg text-surface-container-lowest hover:bg-white/15 transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">contact_support</span>
            </a>
            <a
              href="/perfil"
              className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shadow-inner ml-1 ring-1 ring-white/20 transition-transform hover:scale-105"
            >
              <span className="material-symbols-outlined text-on-primary text-[18px]">person</span>
            </a>
          </div>
        </div>
      </header>

      {/* Main Container: Mobile Single Column & Desktop 2-Column Grid */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 lg:px-8 py-6 flex flex-col gap-6">
        {/* Banner de Boas-vindas (Stitch com Glow Radiante) */}
        <section className="w-full rounded-2xl bg-radial-hero p-5 lg:p-7 text-on-primary shadow-lg relative overflow-hidden border border-white/10">
          <div
            aria-hidden="true"
            className="absolute -right-8 -bottom-10 w-72 h-72 rounded-full bg-secondary/25 blur-3xl pointer-events-none animate-pulse-soft"
          ></div>
          <div
            aria-hidden="true"
            className="absolute -left-12 -top-12 w-56 h-56 rounded-full bg-secondary-container/15 blur-2xl pointer-events-none"
          ></div>

          <div className="relative z-10 flex flex-col gap-2">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-fixed/20 backdrop-blur-md text-secondary-fixed text-xs font-semibold border border-white/10">
                <span className="material-symbols-outlined text-[16px] text-tertiary-fixed">
                  verified_user
                </span>
                <span>{session?.role === 'medico' ? 'Corpo Clínico Conectado' : 'Portal do Paciente'}</span>
              </div>
              <span className="text-xs text-primary-fixed-dim font-mono bg-black/25 backdrop-blur-sm px-2.5 py-0.5 rounded-full border border-white/10">
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
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center shrink-0 ring-2 ring-white/15 shadow-sm">
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

              <div className="grid grid-cols-2 md:grid-cols-3 gap-3.5">
                {/* Card 1: Agendar Consulta */}
                <a
                  href="/agendar"
                  className="card-interactive group relative rounded-2xl bg-gradient-to-br from-secondary via-secondary to-primary-container p-4 text-on-primary shadow-sm flex flex-col justify-between min-h-[145px] overflow-hidden"
                >
                  <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-on-primary shadow-inner">
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
                  <div className="absolute top-3 right-3 text-white/50 group-hover:text-white group-hover:translate-x-0.5 transition-all">
                    <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                  </div>
                </a>

                {/* Card 2: Check-in Ágil */}
                <a
                  href="/agendamentos"
                  className="card-interactive group relative rounded-2xl bg-surface-container-lowest border border-slate-200/80 p-4 shadow-sm hover:border-secondary flex flex-col justify-between min-h-[145px]"
                >
                  <div className="w-10 h-10 rounded-xl bg-surface-container text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
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
                  className="card-interactive group relative rounded-2xl bg-surface-container-lowest border border-slate-200/80 p-4 shadow-sm hover:border-secondary flex flex-col justify-between min-h-[145px]"
                >
                  <div className="w-10 h-10 rounded-xl bg-surface-container text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
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
                  className="card-interactive group relative rounded-2xl bg-surface-container-lowest border border-slate-200/80 p-4 shadow-sm hover:border-secondary flex flex-col justify-between min-h-[145px]"
                >
                  <div className="w-10 h-10 rounded-xl bg-surface-container text-secondary flex items-center justify-center group-hover:bg-secondary group-hover:text-white transition-colors">
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
                  className="card-interactive group relative rounded-2xl bg-surface-container-lowest border border-slate-200/80 p-4 shadow-sm hover:border-secondary flex flex-col justify-between min-h-[145px]"
                >
                  <div className="w-10 h-10 rounded-xl bg-surface-container text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                    <span className="material-symbols-outlined text-[24px]">description</span>
                  </div>
                  <div className="mt-3 flex flex-col">
                    <span className="text-base font-bold leading-tight text-primary">
                      Laudos &amp; Exames
                    </span>
                    <span className="text-[11px] text-on-surface-variant mt-0.5">
                      Central digital
                    </span>
                  </div>
                </a>

                {/* Card 6: Central de Preparos */}
                <a
                  href="/agendamentos"
                  className="card-interactive group relative rounded-2xl bg-surface-container-lowest border border-slate-200/80 p-4 shadow-sm hover:border-amber-400 flex flex-col justify-between min-h-[145px]"
                >
                  <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center group-hover:bg-amber-600 group-hover:text-white transition-colors">
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
            <section className="card-interactive w-full rounded-2xl bg-surface-container-lowest p-5 md:p-6 shadow-sm flex flex-col gap-4 border border-slate-200/80">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-secondary-fixed flex items-center justify-center text-secondary shrink-0">
                  <span className="material-symbols-outlined text-[24px]">volunteer_activism</span>
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
                  className="card-interactive h-12 rounded-xl bg-surface-container text-primary text-xs md:text-sm font-semibold flex items-center justify-between px-4 hover:bg-surface-container-high transition-colors"
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
                  className="card-interactive h-12 rounded-xl bg-surface-container text-primary text-xs md:text-sm font-semibold flex items-center justify-between px-4 hover:bg-surface-container-high transition-colors"
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

                <div className="card-interactive w-full rounded-2xl bg-surface-container-lowest shadow-sm p-5 flex flex-col gap-4 border border-slate-200/80 hover:border-secondary">
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
                          <span className="w-2 h-2 rounded-full bg-tertiary-fixed animate-pulse"></span>
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
                      className="btn-glow flex-1 h-12 rounded-xl bg-primary hover:bg-primary-container text-on-primary text-xs md:text-sm font-bold flex items-center justify-center gap-2 shadow-sm transition-all"
                    >
                      <span className="material-symbols-outlined text-[18px]">how_to_reg</span>
                      <span>Check-in Prévio</span>
                    </a>
                    <a
                      href="/agendamentos"
                      className="card-interactive h-12 px-4 rounded-xl bg-surface-container text-primary text-xs md:text-sm font-semibold flex items-center justify-center gap-1.5 hover:bg-surface-container-high transition-colors"
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
                <h2 className="text-lg text-primary font-bold tracking-tight">Prontuário &amp; Convênio</h2>
                <span className="text-xs text-on-surface-variant font-medium">Sincronizado MV</span>
              </div>

              <div className="card-interactive w-full p-5 rounded-2xl bg-surface-container-lowest shadow-sm flex items-center justify-between gap-3 border border-slate-200/80 hover:border-secondary">
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

              {/* Card de Acesso Rápido à Atualização Cadastral e Documentos do Stitch */}
              <a
                href="/perfil"
                className="card-interactive w-full p-4 rounded-2xl bg-surface-container-low hover:bg-surface-container border border-surface-container flex items-center justify-between gap-3 text-xs transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-primary text-white flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[20px]">folder_shared</span>
                  </div>
                  <div className="min-w-0">
                    <strong className="text-sm font-bold text-primary block truncate">
                      Documentos &amp; Atualização Cadastral
                    </strong>
                    <span className="text-outline text-[11px] block truncate">
                      Atualize telefone, endereço ou envie RG/pedidos médicos
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-secondary font-bold shrink-0">
                  <span className="hidden sm:inline">Gerenciar</span>
                  <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                </div>
              </a>
            </section>

            {/* Unidades & Estrutura Oficial Bigorrilho (Site Oficial CMAC) */}
            <section className="w-full flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <h2 className="text-lg text-primary font-bold tracking-tight">Nossas Unidades</h2>
                <span className="text-xs text-on-surface-variant font-medium">Curitiba • Bigorrilho</span>
              </div>

              {/* Unidade 1: Centro Médico Júlia da Costa */}
              <div className="rounded-2xl overflow-hidden bg-surface-container-lowest border border-slate-200/80 shadow-sm flex flex-col">
                <div className="relative h-36 w-full overflow-hidden bg-primary/10">
                  <img
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBDffecwJI9J1164hdbbz0nbMWf5E10Qtfg09Tuk_Db4Al-j_QxAiDnN9HOLewVOxUHgTeRUIgdeOYY7byjXRrVmAfDrUqD1Pn6nbxjgF2fjDIvktXiVVdhIhRTKFgnqnspFg3kAc7ueUwo2h0sesyOce8ORtZomfin7TpXqVfSNudunFhsUChiTppv8_BXxf9LHkztREpDoKffE3tSLN_P-VxwWF-cqcYVBF_V13Q"
                    alt="Centro Médico Adventista Curitiba - Bigorrilho"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/20 to-transparent flex items-end p-3.5">
                    <div className="flex items-center justify-between w-full text-white">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider bg-secondary px-2 py-0.5 rounded-full">
                          Unidade 1 • Centro Médico
                        </span>
                        <h4 className="font-bold text-sm text-white mt-1">Alameda Júlia da Costa, 1447</h4>
                      </div>
                      <span className="text-xs text-white/90 font-medium bg-black/30 backdrop-blur-sm px-2.5 py-1 rounded-xl">
                        Bigorrilho
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-4 flex flex-col gap-2.5 text-xs">
                  <div className="flex items-center justify-between text-on-surface-variant">
                    <span className="flex items-center gap-1.5 font-medium">
                      <span className="material-symbols-outlined text-[16px] text-secondary">schedule</span>
                      Segunda a Quinta: 07h15 às 19h • Sexta: 07h15 às 16h
                    </span>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                    <span className="flex items-center gap-1 font-semibold text-primary">
                      <span className="material-symbols-outlined text-[16px] text-secondary">call</span>
                      (41) 3240-2900
                    </span>
                    <a
                      href="/agendar"
                      className="px-3 py-1.5 rounded-xl bg-primary text-white font-bold text-xs hover:bg-primary-container transition-colors"
                    >
                      Agendar Aqui
                    </a>
                  </div>
                </div>
              </div>

              {/* Unidade 2: Ângelo Sampaio */}
              <div className="p-4 rounded-2xl bg-surface-container-low border border-slate-200/80 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-secondary-fixed text-on-secondary-fixed flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[20px]">domain</span>
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] uppercase font-bold text-secondary">Unidade 2</span>
                    <h5 className="font-bold text-primary text-sm truncate">Alferes Ângelo Sampaio, 2585</h5>
                    <p className="text-on-surface-variant text-[11px] truncate">
                      Consultórios Especializados &amp; Atendimento Integrativo
                    </p>
                  </div>
                </div>
                <span className="text-[11px] text-secondary font-bold shrink-0">Bigorrilho</span>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
