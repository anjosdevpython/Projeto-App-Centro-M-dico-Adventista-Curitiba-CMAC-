'use client';

import { useEffect, useState } from 'react';

import { getOrCreateDemoSession } from '../../lib/demo/demo-auth';
import {
  cancelDemoAppointment,
  listDemoAppointments,
} from '../../lib/demo/demo-service';
import type { DemoAppointment, DemoCredentials } from '../../lib/demo/types';

export default function AgendamentosPage() {
  const [session, setSession] = useState<DemoCredentials | null>(null);
  const [appointments, setAppointments] = useState<DemoAppointment[]>([]);
  const [activeTab, setActiveTab] = useState<'future' | 'history'>('future');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  useEffect(() => {
    setSession(getOrCreateDemoSession());
    setAppointments(listDemoAppointments());
  }, []);

  function handleCancel(id: string) {
    if (confirm('Deseja realmente cancelar esta consulta demonstrativa?')) {
      const updated = cancelDemoAppointment(id);
      if (updated) {
        setAppointments(listDemoAppointments());
        setStatusMessage(`Consulta com protocolo ${updated.protocol} foi cancelada com sucesso.`);
        setTimeout(() => setStatusMessage(null), 5000);
      }
    }
  }

  function handleCheckin(protocol: string) {
    setStatusMessage(`Check-in prévio confirmado com sucesso para o protocolo ${protocol}! Senha C-042 emitida no painel.`);
    setTimeout(() => setStatusMessage(null), 5000);
  }

  return (
    <div className="flex flex-col min-h-screen bg-background pb-12">
      {/* Header from Stitch */}
      <header className="sticky top-0 inset-x-0 z-40 bg-primary-container text-on-primary shadow-md">
        <div className="h-16 px-4 lg:px-8 flex items-center justify-between max-w-7xl mx-auto w-full">
          <div className="flex items-center gap-3">
            <a
              href="/inicio"
              className="w-9 h-9 flex items-center justify-center rounded-lg text-on-primary hover:bg-white/10"
            >
              <span className="material-symbols-outlined text-[22px]">arrow_back</span>
            </a>
            <div className="flex flex-col">
              <span className="font-bold text-sm text-surface-container-lowest leading-tight">
                Clínica Adventista
              </span>
              <span className="text-xs text-surface-container-low font-normal">
                Minhas Consultas &amp; Procedimentos
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="/agendar"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-secondary text-white text-xs font-semibold shadow-sm hover:bg-secondary/90 transition-all"
            >
              <span className="material-symbols-outlined text-[16px]">add</span>
              <span className="hidden sm:inline">Nova Consulta</span>
            </a>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 lg:px-8 py-6 flex flex-col gap-6">
        {statusMessage && (
          <div
            role="status"
            className="p-4 rounded-2xl bg-tertiary-fixed text-on-tertiary-fixed-variant text-sm font-bold flex items-center gap-2 shadow-sm animate-pulse"
          >
            <span className="material-symbols-outlined text-[22px]">verified</span>
            <span>{statusMessage}</span>
          </div>
        )}

        {/* Micro Mensagem de Acolhimento e Serenidade (Stitch) */}
        <div className="flex items-center justify-between bg-surface-container-low rounded-2xl p-5 shadow-sm border border-surface-container">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-full bg-secondary-fixed flex items-center justify-center text-on-secondary-fixed shrink-0">
              <span className="material-symbols-outlined text-[22px]">spa</span>
            </div>
            <div>
              <p className="text-base font-bold text-on-surface">
                Olá, {session?.patientName ?? 'Carlos Alberto'}
              </p>
              <p className="text-xs text-on-surface-variant">Seus agendamentos, preparos de exames e laudos integrados.</p>
            </div>
          </div>
          <span className="hidden md:inline-flex items-center gap-1 px-3 py-1 rounded-full bg-surface-container-lowest text-xs text-secondary font-semibold">
            <span className="w-2 h-2 rounded-full bg-tertiary-fixed animate-pulse"></span>
            SOUL MV Conectado
          </span>
        </div>

        {/* 1. SELETOR DE ABAS SUPERIOR (Stitch) */}
        <div className="w-full max-w-md bg-surface-container rounded-xl p-1 flex gap-1 shadow-inner">
          <button
            type="button"
            onClick={() => setActiveTab('future')}
            className={`flex-1 py-2.5 px-4 rounded-lg text-xs md:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
              activeTab === 'future'
                ? 'bg-surface-container-lowest text-primary shadow-sm'
                : 'text-on-surface-variant hover:text-primary'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">event_upcoming</span>
            <span>
              Futuros{' '}
              <span className="ml-1 px-2 py-0.5 bg-secondary-fixed text-on-secondary-fixed rounded-full text-[10px] font-bold">
                {appointments.filter((a) => a.status !== 'cancelado').length + 1}
              </span>
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('history')}
            className={`flex-1 py-2.5 px-4 rounded-lg text-xs md:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
              activeTab === 'history'
                ? 'bg-surface-container-lowest text-primary shadow-sm'
                : 'text-on-surface-variant hover:text-primary'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">history</span>
            <span>
              Histórico{' '}
              <span className="ml-1 text-on-surface-variant text-[11px] font-semibold">
                ({appointments.filter((a) => a.status === 'cancelado').length})
              </span>
            </span>
          </button>
        </div>

        {/* LISTA DE AGENDAMENTOS (Stitch Responsive Grid: 1 col mobile, 2 cols desktop) */}
        {activeTab === 'future' ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Card 1: Próxima Consulta Dinâmica */}
            {appointments
              .filter((a) => a.status !== 'cancelado')
              .map((apt) => (
                <article
                  key={apt.id}
                  className="bg-surface-container-lowest rounded-2xl p-5 shadow-sm flex flex-col gap-3.5 border border-slate-200/80 hover:border-secondary transition-all"
                >
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                    <span className="px-2.5 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed text-xs font-bold uppercase tracking-wider">
                      Consulta Presencial
                    </span>
                    <span className="text-xs text-outline font-mono flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">tag</span> {apt.protocol}
                    </span>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <div className="w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center text-primary shrink-0">
                      <span className="material-symbols-outlined text-[24px]">cardiology</span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-secondary font-semibold">{apt.specialtyName}</p>
                      <h3 className="text-base text-on-surface font-bold leading-tight">
                        {apt.professionalName}
                      </h3>
                      <p className="text-xs text-on-surface-variant mt-0.5">
                        CRM-PR • Convênio Unimed Curitiba
                      </p>
                    </div>
                  </div>

                  <div className="bg-surface-container-low rounded-xl p-3.5 space-y-1.5 text-xs border border-surface-container">
                    <div className="flex items-center gap-2 text-on-surface font-semibold">
                      <span className="material-symbols-outlined text-[18px] text-secondary">
                        calendar_today
                      </span>
                      <span>
                        {new Date(apt.startsAt).toLocaleDateString('pt-BR')} às{' '}
                        {new Date(apt.startsAt).toLocaleTimeString('pt-BR', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-on-surface-variant">
                      <span className="material-symbols-outlined text-[18px] text-outline">
                        location_on
                      </span>
                      <span>{apt.location}</span>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => handleCheckin(apt.protocol)}
                      className="flex-1 h-10 rounded-xl bg-primary hover:bg-primary-container text-on-primary text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-sm active:scale-[0.98] cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[16px]">how_to_reg</span>
                      <span>Fazer Check-in Prévio</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleCancel(apt.id)}
                      className="h-10 px-3.5 rounded-xl bg-surface-container hover:bg-red-50 hover:text-red-700 text-on-surface-variant text-xs font-semibold flex items-center justify-center gap-1 transition-colors cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[16px]">close</span>
                      <span>Cancelar</span>
                    </button>
                  </div>
                </article>
              ))}

            {/* Card Fixo de Exame com Preparo do Stitch (Ultrassonografia) */}
            <article className="bg-surface-container-lowest rounded-2xl p-5 shadow-sm flex flex-col gap-3.5 border border-slate-200/80">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                  Exame com Preparo
                </span>
                <span className="text-xs text-outline font-mono flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">tag</span> Protocolo MV-99104
                </span>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center text-secondary shrink-0">
                  <span className="material-symbols-outlined text-[24px]">radiology</span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-secondary font-semibold">
                    Centro de Diagnóstico por Imagem
                  </p>
                  <h3 className="text-base text-on-surface font-bold leading-tight">
                    Ultrassonografia Abdominal Total
                  </h3>
                  <p className="text-xs text-on-surface-variant mt-0.5">
                    Convênio: Unimed Curitiba • Guia Liberada
                  </p>
                </div>
              </div>

              <div className="bg-surface-container-low rounded-xl p-3.5 space-y-1.5 text-xs border border-surface-container">
                <div className="flex items-center gap-2 text-on-surface font-semibold">
                  <span className="material-symbols-outlined text-[18px] text-secondary">
                    calendar_today
                  </span>
                  <span>04 de Novembro de 2026 às 08:15</span>
                </div>
                <div className="flex items-center gap-2 text-on-surface-variant">
                  <span className="material-symbols-outlined text-[18px] text-outline">
                    location_on
                  </span>
                  <span>Unidade Curitiba - Juvevê • Setor de Imagem (Subsolo 1)</span>
                </div>
              </div>

              {/* Box de Preparo Rápido do Stitch */}
              <div className="bg-surface-container rounded-xl p-3.5 flex items-start gap-3 text-xs border border-slate-200/60">
                <span className="material-symbols-outlined text-[20px] text-secondary shrink-0 mt-0.5">
                  info
                </span>
                <div>
                  <p className="font-bold text-on-surface">Preparo Obrigatório para o Exame</p>
                  <p className="text-on-surface-variant mt-0.5 leading-relaxed">
                    Jejum absoluto de 8 horas e bexiga cheia (ingerir de 4 a 6 copos de água 1 hora antes do procedimento).
                  </p>
                </div>
              </div>
            </article>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {appointments
              .filter((a) => a.status === 'cancelado')
              .map((apt) => (
                <div
                  key={apt.id}
                  className="bg-surface-container-lowest rounded-xl p-4 shadow-sm flex items-center justify-between text-xs border border-slate-200/60 opacity-75"
                >
                  <div>
                    <strong className="text-on-surface block text-sm">{apt.specialtyName}</strong>
                    <span className="text-on-surface-variant">{apt.professionalName}</span>
                    <span className="text-outline block mt-0.5">
                      Protocolo: <code>{apt.protocol}</code>
                    </span>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-slate-200 text-slate-700 font-bold uppercase text-[10px]">
                    Cancelado
                  </span>
                </div>
              ))}
            {appointments.filter((a) => a.status === 'cancelado').length === 0 && (
              <p className="text-center text-xs text-outline py-8">
                Nenhum agendamento no histórico de cancelamentos.
              </p>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
