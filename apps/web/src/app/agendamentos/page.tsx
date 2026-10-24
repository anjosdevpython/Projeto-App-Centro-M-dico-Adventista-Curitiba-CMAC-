'use client';

import { useEffect, useState } from 'react';

import { getOrCreateDemoSession } from '../../lib/demo/demo-auth';
import {
  cancelDemoAppointment,
  listDemoAppointments,
  rescheduleDemoAppointment,
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
    setStatusMessage(`Check-in prévio confirmado com sucesso para o protocolo ${protocol}! Senha emitida.`);
    setTimeout(() => setStatusMessage(null), 5000);
  }

  return (
    <div className="flex flex-col min-h-screen bg-background pb-24">
      {/* Header from Stitch */}
      <header className="sticky top-0 inset-x-0 z-40 bg-primary-container text-on-primary shadow-md">
        <div className="h-16 px-4 flex items-center justify-between max-w-xl mx-auto">
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
                Unidade Curitiba - Juvevê
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <a
              href="/ajuda"
              className="w-9 h-9 flex items-center justify-center rounded-lg text-surface-container-lowest hover:bg-white/10"
            >
              <span className="material-symbols-outlined text-[20px]">contact_support</span>
            </a>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full max-w-xl mx-auto px-4 py-4 flex flex-col gap-4">
        {statusMessage && (
          <div
            role="status"
            className="p-3.5 rounded-xl bg-tertiary-fixed text-on-tertiary-fixed-variant text-xs font-bold flex items-center gap-2 shadow-sm animate-pulse"
          >
            <span className="material-symbols-outlined text-[18px]">verified</span>
            <span>{statusMessage}</span>
          </div>
        )}

        {/* Micro Mensagem de Acolhimento e Serenidade (Stitch) */}
        <div className="flex items-center justify-between bg-surface-container-low rounded-xl p-4 shadow-sm border border-surface-container">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-secondary-fixed flex items-center justify-center text-on-secondary-fixed shrink-0">
              <span className="material-symbols-outlined text-[20px]">spa</span>
            </div>
            <div>
              <p className="text-sm font-bold text-on-surface">
                Olá, {session?.patientName ?? 'Carlos Alberto'}
              </p>
              <p className="text-xs text-on-surface-variant">Seus cuidados e consultas em dia.</p>
            </div>
          </div>
        </div>

        {/* 1. SELETOR DE ABAS SUPERIOR (Stitch) */}
        <div className="w-full bg-surface-container rounded-xl p-1 flex gap-1 shadow-inner">
          <button
            type="button"
            onClick={() => setActiveTab('future')}
            className={`flex-1 py-2.5 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'future'
                ? 'bg-surface-container-lowest text-primary shadow-sm'
                : 'text-on-surface-variant'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">event_upcoming</span>
            <span>
              Futuros{' '}
              <span className="ml-1 px-2 py-0.2 bg-secondary-fixed text-on-secondary-fixed rounded-full text-[10px] font-semibold">
                {appointments.filter((a) => a.status !== 'cancelado').length}
              </span>
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('history')}
            className={`flex-1 py-2.5 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'history'
                ? 'bg-surface-container-lowest text-primary shadow-sm'
                : 'text-on-surface-variant'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">history</span>
            <span>
              Histórico{' '}
              <span className="ml-0.5 text-on-surface-variant text-[10px] font-semibold">
                ({appointments.filter((a) => a.status === 'cancelado').length})
              </span>
            </span>
          </button>
        </div>

        {/* LISTA DE AGENDAMENTOS (Stitch) */}
        {activeTab === 'future' ? (
          <div className="flex flex-col gap-3.5">
            {appointments
              .filter((a) => a.status !== 'cancelado')
              .map((apt) => (
                <article
                  key={apt.id}
                  className="bg-surface-container-lowest rounded-xl p-4 shadow-sm flex flex-col gap-3 border border-slate-100"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs text-outline flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">tag</span>
                      Protocolo {apt.protocol}
                    </span>
                    <span className="px-2 py-0.2 rounded-full bg-secondary-fixed text-on-secondary-fixed text-[10px] font-bold uppercase">
                      {apt.status}
                    </span>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-xl bg-secondary-container flex items-center justify-center text-primary font-bold shrink-0">
                      <span className="material-symbols-outlined text-[24px]">cardiology</span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-secondary font-semibold">{apt.specialtyName}</p>
                      <h3 className="text-base text-on-surface font-bold leading-tight">
                        {apt.professionalName}
                      </h3>
                      <p className="text-xs text-on-surface-variant mt-0.5">Consulta Presencial</p>
                    </div>
                  </div>

                  {/* Data, Horário e Local */}
                  <div className="bg-surface-container-low rounded-lg p-3 space-y-1.5 text-xs border border-surface-container">
                    <div className="flex items-center gap-2 text-on-surface font-semibold">
                      <span className="material-symbols-outlined text-[18px] text-secondary">
                        calendar_today
                      </span>
                      <span>
                        {new Date(apt.startsAt).toLocaleDateString('pt-BR')} às{' '}
                        {new Date(apt.startsAt).toLocaleTimeString('pt-BR', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}{' '}
                        <strong className="text-tertiary-container">(Confirmado)</strong>
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-on-surface-variant">
                      <span className="material-symbols-outlined text-[18px] text-outline">
                        location_on
                      </span>
                      <span>{apt.location}</span>
                    </div>
                  </div>

                  {/* Ações */}
                  <div className="flex flex-col gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => handleCheckin(apt.protocol)}
                      className="w-full h-11 rounded-lg bg-primary hover:bg-primary-container text-on-primary text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[18px] text-tertiary-fixed">
                        how_to_reg
                      </span>
                      <span>Fazer Check-in Prévio</span>
                    </button>
                    <div className="grid grid-cols-2 gap-2">
                      <a
                        href="/agendar"
                        className="h-10 rounded-lg bg-surface-container text-on-surface text-xs font-semibold flex items-center justify-center gap-1.5 hover:bg-surface-container-high transition-colors"
                      >
                        <span className="material-symbols-outlined text-[16px]">edit_calendar</span>
                        <span>Reagendar</span>
                      </a>
                      <button
                        type="button"
                        onClick={() => handleCancel(apt.id)}
                        className="h-10 rounded-lg bg-error-container text-on-error-container text-xs font-semibold flex items-center justify-center gap-1.5 hover:opacity-90 transition-opacity cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[16px]">event_busy</span>
                        <span>Cancelar</span>
                      </button>
                    </div>
                  </div>

                  <p className="text-[11px] text-outline text-center flex items-center justify-center gap-1 mt-1">
                    <span className="material-symbols-outlined text-[13px]">schedule</span>
                    Cancelamento sem ônus até 4h antes
                  </p>
                </article>
              ))}

            {/* Card Exame Ultrassonografia (do Stitch) */}
            <article className="bg-surface-container-lowest rounded-xl p-4 shadow-sm flex flex-col gap-3 border border-slate-100">
              <div className="flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed-variant text-[11px] font-bold">
                  <span className="material-symbols-outlined text-[14px]">medical_information</span>
                  Exame de Imagem
                </span>
                <span className="text-xs text-outline flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">tag</span> Protocolo
                  MV-99104
                </span>
              </div>

              <div className="flex items-start gap-3">
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
                    Convênio: Unimed Curitiba
                  </p>
                </div>
              </div>

              <div className="bg-surface-container-low rounded-lg p-3 space-y-1 text-xs border border-surface-container">
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
              <div className="bg-surface-container rounded-lg p-3 flex items-start gap-2.5 text-xs">
                <span className="material-symbols-outlined text-[18px] text-secondary shrink-0 mt-0.5">
                  info
                </span>
                <div>
                  <p className="font-semibold text-on-surface">Preparo Obrigatório</p>
                  <p className="text-on-surface-variant mt-0.5">
                    Jejum absoluto de 8 horas e bexiga cheia (ingerir 4 a 6 copos de água 1h antes).
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
                  className="bg-surface-container-lowest rounded-xl p-4 shadow-sm flex items-center justify-between text-xs border border-slate-100 opacity-70"
                >
                  <div>
                    <strong className="text-on-surface block text-sm">{apt.specialtyName}</strong>
                    <span className="text-on-surface-variant">{apt.professionalName}</span>
                    <span className="text-outline block mt-0.5">
                      Protocolo: <code>{apt.protocol}</code>
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 font-bold uppercase text-[10px]">
                    Cancelado
                  </span>
                </div>
              ))}
            {appointments.filter((a) => a.status === 'cancelado').length === 0 && (
              <p className="text-center text-xs text-outline py-8">
                Nenhum agendamento no histórico.
              </p>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
