'use client';

import { useEffect, useState } from 'react';

import {
  DEMO_SLOTS,
  cancelDemoAppointment,
  listDemoAppointments,
  rescheduleDemoAppointment,
} from '../../lib/demo/demo-service';
import type { DemoAppointment } from '../../lib/demo/types';

export default function AgendamentosPage() {
  const [appointments, setAppointments] = useState<DemoAppointment[]>([]);
  const [reschedulingId, setReschedulingId] = useState<string | null>(null);
  const [targetSlotId, setTargetSlotId] = useState<string>('');
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  useEffect(() => {
    setAppointments(listDemoAppointments());
  }, []);

  function handleCancel(id: string) {
    if (confirm('Deseja realmente cancelar este agendamento demonstrativo?')) {
      const updated = cancelDemoAppointment(id);
      if (updated) {
        setAppointments(listDemoAppointments());
        setActionMessage(`Agendamento com protocolo ${updated.protocol} foi cancelado.`);
      }
    }
  }

  function handleRescheduleSubmit(id: string) {
    if (!targetSlotId) return;
    const updated = rescheduleDemoAppointment(id, targetSlotId);
    if (updated) {
      setAppointments(listDemoAppointments());
      setReschedulingId(null);
      setTargetSlotId('');
      setActionMessage(`Agendamento reagendado com sucesso para ${new Date(updated.startsAt).toLocaleDateString('pt-BR')}.`);
    }
  }

  return (
    <main className="page">
      <p className="eyebrow">Acompanhamento</p>
      <h1>Meus Agendamentos</h1>
      <p className="lead">
        Consulte, altere ou cancele seus atendimentos simulados salvos no navegador.
      </p>

      {actionMessage && (
        <div className="panel" role="status" style={{ borderLeft: '4px solid var(--brand-blue)', marginBottom: '16px', padding: '12px 16px' }}>
          {actionMessage}
        </div>
      )}

      <div style={{ marginBottom: '20px' }}>
        <a
          href="/agendar"
          className="primary-button"
          style={{ display: 'inline-grid', placeItems: 'center', textDecoration: 'none', maxWidth: '240px', minHeight: '44px' }}
        >
          + Novo Agendamento
        </a>
      </div>

      {appointments.length === 0 ? (
        <div className="panel" style={{ textAlign: 'center', padding: '40px 20px' }}>
          <p style={{ color: 'var(--muted)', fontSize: '18px' }}>Nenhum agendamento encontrado.</p>
          <a href="/agendar" className="primary-button" style={{ display: 'inline-block', maxWidth: '220px', textDecoration: 'none' }}>
            Agendar agora
          </a>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '16px' }}>
          {appointments.map((apt) => {
            const isCancelled = apt.status === 'cancelado';
            const badgeClass =
              apt.status === 'cancelado'
                ? 'badge-muted'
                : apt.status === 'reagendado'
                ? 'badge-info'
                : 'badge-success';

            return (
              <article key={apt.id} className="appointment-card">
                <div className="appointment-header">
                  <span className={`badge ${badgeClass}`}>{apt.status.toUpperCase()}</span>
                  <span style={{ fontSize: '13px', color: 'var(--muted)' }}>
                    Protocolo: <code>{apt.protocol}</code>
                  </span>
                </div>

                <div>
                  <h2 style={{ margin: '4px 0', fontSize: '20px' }}>{apt.specialtyName}</h2>
                  <p style={{ margin: '0 0 6px', color: 'var(--muted)', fontSize: '15px' }}>
                    {apt.professionalName}
                  </p>
                  <p style={{ margin: '2px 0', fontSize: '14px' }}>
                    📅 {new Date(apt.startsAt).toLocaleDateString('pt-BR')} às{' '}
                    {new Date(apt.startsAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                  <p style={{ margin: '2px 0', fontSize: '14px', color: 'var(--muted)' }}>
                    📍 {apt.location}
                  </p>
                </div>

                {!isCancelled && reschedulingId !== apt.id && (
                  <div className="appointment-actions">
                    <button
                      type="button"
                      className="secondary-button"
                      onClick={() => {
                        setReschedulingId(apt.id);
                        setTargetSlotId('');
                      }}
                    >
                      Reagendar
                    </button>
                    <button
                      type="button"
                      className="danger-button"
                      onClick={() => handleCancel(apt.id)}
                    >
                      Cancelar Agendamento
                    </button>
                  </div>
                )}

                {reschedulingId === apt.id && (
                  <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '10px', marginTop: '10px', border: '1px solid var(--border)' }}>
                    <label htmlFor={`reschedule-${apt.id}`} style={{ fontWeight: 700, fontSize: '14px', display: 'block', marginBottom: '8px' }}>
                      Selecione um novo horário alternativo:
                    </label>
                    <select
                      id={`reschedule-${apt.id}`}
                      value={targetSlotId}
                      onChange={(e) => setTargetSlotId(e.target.value)}
                      style={{ width: '100%', minHeight: '44px', padding: '8px', borderRadius: '8px', border: '1px solid #91a4b7', marginBottom: '12px', fontSize: '15px' }}
                    >
                      <option value="">Escolha novo horário...</option>
                      {DEMO_SLOTS.map((slot) => {
                        const dateStr = new Date(slot.startsAt).toLocaleDateString('pt-BR');
                        const timeStr = new Date(slot.startsAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
                        return (
                          <option key={slot.id} value={slot.id}>
                            {dateStr} às {timeStr} — {slot.location}
                          </option>
                        );
                      })}
                    </select>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        type="button"
                        className="primary-button"
                        style={{ minHeight: '40px', fontSize: '14px' }}
                        disabled={!targetSlotId}
                        onClick={() => handleRescheduleSubmit(apt.id)}
                      >
                        Confirmar Reagendamento
                      </button>
                      <button
                        type="button"
                        className="secondary-button"
                        style={{ minHeight: '40px', fontSize: '14px' }}
                        onClick={() => setReschedulingId(null)}
                      >
                        Voltar
                      </button>
                    </div>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}
    </main>
  );
}
