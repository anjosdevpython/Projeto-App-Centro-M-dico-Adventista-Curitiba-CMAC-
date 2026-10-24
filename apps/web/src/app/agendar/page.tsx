'use client';

import { useState } from 'react';

import { getOrCreateDemoSession } from '../../lib/demo/demo-auth';
import {
  DEMO_PROFESSIONALS,
  DEMO_SLOTS,
  DEMO_SPECIALTIES,
  bookDemoAppointment,
} from '../../lib/demo/demo-service';
import type { DemoAppointment } from '../../lib/demo/types';

export default function AgendarPage() {
  const [selectedSpecialtyId, setSelectedSpecialtyId] = useState<string>('');
  const [selectedProfessionalId, setSelectedProfessionalId] = useState<string>('');
  const [selectedSlotId, setSelectedSlotId] = useState<string>('');
  const [bookedAppointment, setBookedAppointment] = useState<DemoAppointment | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const availableProfessionals = DEMO_PROFESSIONALS.filter(
    (p) => !selectedSpecialtyId || p.specialtyId === selectedSpecialtyId,
  );

  const availableSlots = DEMO_SLOTS.filter(
    (s) =>
      (!selectedSpecialtyId || s.specialtyId === selectedSpecialtyId) &&
      (!selectedProfessionalId || s.professionalId === selectedProfessionalId),
  );

  const selectedSlot = DEMO_SLOTS.find((s) => s.id === selectedSlotId);
  const selectedSpecialty = DEMO_SPECIALTIES.find((s) => s.id === selectedSpecialtyId);
  const selectedProfessional = DEMO_PROFESSIONALS.find((p) => p.id === selectedProfessionalId);

  function handleConfirm() {
    if (!selectedSlotId || isSubmitting) return;
    setIsSubmitting(true);
    const session = getOrCreateDemoSession();
    try {
      const apt = bookDemoAppointment({
        slotId: selectedSlotId,
        patientEmail: session.email,
      });
      setBookedAppointment(apt);
    } finally {
      setIsSubmitting(false);
    }
  }

  if (bookedAppointment) {
    return (
      <main className="page">
        <p className="eyebrow">Agendamento Confirmado</p>
        <h1>Simulação Realizada com Sucesso!</h1>
        <p className="lead">Seu agendamento foi registrado no ambiente demonstrativo local.</p>

        <section className="panel credentials-receipt" role="status" aria-live="polite">
          <span className="badge badge-success">Protocolo Emitido</span>
          <div className="receipt-box" style={{ marginTop: '16px' }}>
            <div className="receipt-row">
              <span className="receipt-label">Protocolo:</span>
              <code className="receipt-value">{bookedAppointment.protocol}</code>
            </div>
            <div className="receipt-row">
              <span className="receipt-label">Especialidade:</span>
              <strong className="receipt-value">{bookedAppointment.specialtyName}</strong>
            </div>
            <div className="receipt-row">
              <span className="receipt-label">Profissional:</span>
              <span className="receipt-value">{bookedAppointment.professionalName}</span>
            </div>
            <div className="receipt-row">
              <span className="receipt-label">Data e Hora:</span>
              <span className="receipt-value">
                {new Date(bookedAppointment.startsAt).toLocaleDateString('pt-BR')} às{' '}
                {new Date(bookedAppointment.startsAt).toLocaleTimeString('pt-BR', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>
            <div className="receipt-row">
              <span className="receipt-label">Local:</span>
              <span className="receipt-value">{bookedAppointment.location}</span>
            </div>
            <div className="receipt-row">
              <span className="receipt-label">Status:</span>
              <span className="receipt-value" style={{ color: '#15803d', fontWeight: 700 }}>
                Confirmado (Demonstrativo)
              </span>
            </div>
          </div>

          <div style={{ display: 'grid', gap: '12px', marginTop: '20px' }}>
            <a
              href="/agendamentos"
              className="primary-button"
              style={{ display: 'grid', placeItems: 'center', textDecoration: 'none' }}
            >
              Ver em Meus Agendamentos
            </a>
            <a
              href="/inicio"
              className="secondary-button"
              style={{ display: 'grid', placeItems: 'center', textDecoration: 'none' }}
            >
              Voltar ao Início
            </a>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="page">
      <p className="eyebrow">Agendar Atendimento</p>
      <h1>Novo Agendamento Demonstrativo</h1>
      <p className="lead">Selecione o serviço e horário desejados para simular a marcação.</p>

      <div className="panel" style={{ display: 'grid', gap: '20px' }}>
        <div>
          <label htmlFor="select-specialty" style={{ fontWeight: 700, display: 'block', marginBottom: '8px' }}>
            1. Especialidade Médica
          </label>
          <select
            id="select-specialty"
            value={selectedSpecialtyId}
            onChange={(e) => {
              setSelectedSpecialtyId(e.target.value);
              setSelectedProfessionalId('');
              setSelectedSlotId('');
            }}
            style={{ width: '100%', minHeight: '48px', padding: '8px 12px', borderRadius: '8px', border: '1px solid #91a4b7', fontSize: '16px' }}
          >
            <option value="">Selecione a especialidade...</option>
            {DEMO_SPECIALTIES.map((spec) => (
              <option key={spec.id} value={spec.id}>
                {spec.name}
              </option>
            ))}
          </select>
        </div>

        {selectedSpecialtyId && (
          <div>
            <label htmlFor="select-professional" style={{ fontWeight: 700, display: 'block', marginBottom: '8px' }}>
              2. Profissional
            </label>
            <select
              id="select-professional"
              value={selectedProfessionalId}
              onChange={(e) => {
                setSelectedProfessionalId(e.target.value);
                setSelectedSlotId('');
              }}
              style={{ width: '100%', minHeight: '48px', padding: '8px 12px', borderRadius: '8px', border: '1px solid #91a4b7', fontSize: '16px' }}
            >
              <option value="">Selecione o profissional (ou qualquer um)...</option>
              {availableProfessionals.map((prof) => (
                <option key={prof.id} value={prof.id}>
                  {prof.name} — {prof.crm}
                </option>
              ))}
            </select>
          </div>
        )}

        {selectedSpecialtyId && (
          <div>
            <label htmlFor="select-slot" style={{ fontWeight: 700, display: 'block', marginBottom: '8px' }}>
              3. Horários Disponíveis
            </label>
            {availableSlots.length === 0 ? (
              <p style={{ color: 'var(--muted)', margin: 0 }}>Nenhum horário sintético disponível para este filtro.</p>
            ) : (
              <select
                id="select-slot"
                value={selectedSlotId}
                onChange={(e) => setSelectedSlotId(e.target.value)}
                style={{ width: '100%', minHeight: '48px', padding: '8px 12px', borderRadius: '8px', border: '1px solid #91a4b7', fontSize: '16px' }}
              >
                <option value="">Selecione uma data e horário...</option>
                {availableSlots.map((slot) => {
                  const prof = DEMO_PROFESSIONALS.find((p) => p.id === slot.professionalId);
                  const dateStr = new Date(slot.startsAt).toLocaleDateString('pt-BR');
                  const timeStr = new Date(slot.startsAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
                  return (
                    <option key={slot.id} value={slot.id}>
                      {dateStr} às {timeStr} — {prof?.name ?? 'Profissional'} ({slot.location})
                    </option>
                  );
                })}
              </select>
            )}
          </div>
        )}

        {selectedSlot && (
          <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '10px', border: '1px solid var(--border)' }}>
            <h3 style={{ margin: '0 0 10px', fontSize: '16px' }}>Resumo da Escolha:</h3>
            <p style={{ margin: '4px 0', fontSize: '14px' }}>
              <strong>Especialidade:</strong> {selectedSpecialty?.name}
            </p>
            <p style={{ margin: '4px 0', fontSize: '14px' }}>
              <strong>Profissional:</strong> {selectedProfessional?.name ?? 'Designado conforme escala'}
            </p>
            <p style={{ margin: '4px 0', fontSize: '14px' }}>
              <strong>Data/Hora:</strong>{' '}
              {new Date(selectedSlot.startsAt).toLocaleDateString('pt-BR')} às{' '}
              {new Date(selectedSlot.startsAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
            </p>
            <p style={{ margin: '4px 0', fontSize: '14px' }}>
              <strong>Local:</strong> {selectedSlot.location}
            </p>
          </div>
        )}

        <button
          type="button"
          className="primary-button"
          disabled={!selectedSlotId || isSubmitting}
          onClick={handleConfirm}
        >
          {isSubmitting ? 'Gerando confirmação...' : 'Confirmar Agendamento Demonstrativo'}
        </button>
      </div>
    </main>
  );
}
