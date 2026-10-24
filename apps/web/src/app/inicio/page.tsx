'use client';

import { useEffect, useState } from 'react';

import {
  clearDemoSession,
  generateDoctorCredentials,
  getOrCreateDemoSession,
  saveDemoSession,
} from '../../lib/demo/demo-auth';
import { listDemoAppointments } from '../../lib/demo/demo-service';
import type { DemoAppointment, DemoCredentials } from '../../lib/demo/types';

export default function InicioPage() {
  const [session, setSession] = useState<DemoCredentials | null>(null);
  const [appointments, setAppointments] = useState<DemoAppointment[]>([]);
  const [attendanceMessage, setAttendanceMessage] = useState<string | null>(null);

  useEffect(() => {
    const active = getOrCreateDemoSession();
    setSession(active);
    setAppointments(listDemoAppointments());
  }, []);

  function handleReset() {
    clearDemoSession();
    window.location.href = '/cadastro';
  }

  function handleSwitchToDoctor() {
    const doc = generateDoctorCredentials();
    saveDemoSession(doc);
    setSession(doc);
    setAppointments(listDemoAppointments());
  }

  function handleSimulateCall(patientName: string) {
    setAttendanceMessage(`Chamada emitida para ${patientName} no painel da sala.`);
    setTimeout(() => setAttendanceMessage(null), 4000);
  }

  const isDoctor = session?.role === 'medico';

  // Visão da Equipe Médica
  if (isDoctor) {
    return (
      <main className="page">
        <p className="eyebrow">Painel da Equipe Médica • CMAC</p>
        <h1>{session.patientName}</h1>
        <p className="lead">
          Ambiente simulado para acompanhamento da escala e fila de consultas do dia.
        </p>

        <section className="panel" style={{ borderLeft: '4px solid #00b5cc', marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
            <span className="badge badge-info">Sessão Médica Ativa</span>
            <span style={{ fontSize: '13px', color: 'var(--muted)' }}>
              Protocolo: <code>{session.protocol}</code>
            </span>
          </div>
          <div style={{ marginTop: '12px', fontSize: '15px' }}>
            <p style={{ margin: '4px 0' }}><strong>Especialidade:</strong> {session.specialty}</p>
            <p style={{ margin: '4px 0' }}><strong>Registro Profissional:</strong> {session.crm}</p>
            <p style={{ margin: '4px 0' }}><strong>E-mail institucional:</strong> {session.email}</p>
          </div>
        </section>

        {attendanceMessage && (
          <div className="panel" role="status" style={{ borderLeft: '4px solid #15803d', background: '#f0fdf4', marginBottom: '16px' }}>
            🔔 {attendanceMessage}
          </div>
        )}

        <section className="panel" style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '20px', margin: 0 }}>Agenda do Dia — Consultas Marcadas</h2>
            <span className="badge badge-success">{appointments.length} Pacientes</span>
          </div>

          {appointments.length === 0 ? (
            <p style={{ color: 'var(--muted)' }}>Nenhuma consulta agendada para hoje.</p>
          ) : (
            <div style={{ display: 'grid', gap: '12px' }}>
              {appointments.map((apt) => (
                <div
                  key={apt.id}
                  style={{
                    border: '1px solid var(--border)',
                    borderRadius: '10px',
                    padding: '14px',
                    display: 'grid',
                    gap: '8px',
                    background: apt.status === 'cancelado' ? '#f8fafc' : 'white',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                    <strong>{apt.specialtyName}</strong>
                    <span className={`badge ${apt.status === 'cancelado' ? 'badge-muted' : 'badge-success'}`}>
                      {apt.status.toUpperCase()}
                    </span>
                  </div>
                  <p style={{ margin: 0, fontSize: '14px' }}>
                    <strong>Paciente:</strong> {apt.patientEmail} • Protocolo: <code>{apt.protocol}</code>
                  </p>
                  <p style={{ margin: 0, fontSize: '14px', color: 'var(--muted)' }}>
                    Horário: {new Date(apt.startsAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })} • Local: {apt.location}
                  </p>
                  {apt.status !== 'cancelado' && (
                    <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                      <button
                        type="button"
                        className="secondary-button"
                        style={{ minHeight: '36px', fontSize: '13px', padding: '0 12px', width: 'auto' }}
                        onClick={() => handleSimulateCall(apt.patientEmail)}
                      >
                        Chamar Paciente
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="panel">
          <h2>Gerenciar Sessão</h2>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '12px' }}>
            <button
              type="button"
              onClick={handleReset}
              className="primary-button"
              style={{ maxWidth: '260px', minHeight: '44px', fontSize: '14px' }}
            >
              Trocar Perfil / Voltar ao Cadastro
            </button>
          </div>
        </section>
      </main>
    );
  }

  // Visão do Paciente (Cliente)
  const nextAppointment = appointments.find((a) => a.status === 'agendado' || a.status === 'reagendado');

  return (
    <main className="page">
      <p className="eyebrow">Portal do paciente • Demonstração</p>
      <h1>{session ? `Olá, ${session.patientName}` : 'Painel do Paciente'}</h1>
      <p className="lead">
        Ambiente de autoatendimento administrativo do CMAC em modo demonstrativo com dados sintéticos.
      </p>

      {session && (
        <section className="panel" style={{ borderLeft: '4px solid var(--brand-cyan)', marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
            <span className="badge badge-success">Credencial de Paciente Ativa</span>
            <span style={{ fontSize: '13px', color: 'var(--muted)' }}>Protocolo: <code>{session.protocol}</code></span>
          </div>
          <div style={{ marginTop: '12px', fontSize: '15px' }}>
            <p style={{ margin: '4px 0' }}><strong>E-mail:</strong> {session.email}</p>
            <p style={{ margin: '4px 0' }}><strong>ID do Paciente:</strong> <code>{session.id}</code></p>
            <p style={{ margin: '4px 0', color: 'var(--muted)', fontSize: '14px' }}>
              Nenhum dado pessoal ou conexão com o sistema hospitalar SOUL MV é utilizado nesta simulação.
            </p>
          </div>
        </section>
      )}

      {nextAppointment && (
        <section className="appointment-card" style={{ borderLeft: '4px solid var(--brand-blue)' }}>
          <div className="appointment-header">
            <span className="badge badge-info">Próxima Consulta Simulada</span>
            <span style={{ fontSize: '13px', color: 'var(--muted)' }}>Protocolo: {nextAppointment.protocol}</span>
          </div>
          <h2 style={{ margin: '4px 0', fontSize: '20px' }}>{nextAppointment.specialtyName}</h2>
          <p style={{ margin: '0', color: 'var(--muted)' }}>{nextAppointment.professionalName}</p>
          <div style={{ fontSize: '14px', margin: '4px 0' }}>
            <p style={{ margin: '2px 0' }}>📅 {new Date(nextAppointment.startsAt).toLocaleDateString('pt-BR')} às {new Date(nextAppointment.startsAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</p>
            <p style={{ margin: '2px 0' }}>📍 {nextAppointment.location}</p>
          </div>
          <div className="appointment-actions">
            <a
              href="/agendamentos"
              className="secondary-button"
              style={{ display: 'grid', placeItems: 'center', textDecoration: 'none', minHeight: '40px', fontSize: '14px' }}
            >
              Gerenciar agendamento
            </a>
          </div>
        </section>
      )}

      <div className="card-grid">
        <a className="action-card" href="/agendar">
          <div>
            <span style={{ fontSize: '24px' }}>📅</span>
            <h3>Novo Agendamento</h3>
            <p>Simule a marcação de consultas por especialidade, profissional e horário.</p>
          </div>
          <strong style={{ color: 'var(--brand-blue)', fontSize: '14px' }}>Agendar atendimento &rarr;</strong>
        </a>

        <a className="action-card" href="/agendamentos">
          <div>
            <span style={{ fontSize: '24px' }}>📋</span>
            <h3>Meus Agendamentos</h3>
            <p>Consulte protocolos, altere horários ou cancele agendamentos demonstrativos.</p>
          </div>
          <strong style={{ color: 'var(--brand-blue)', fontSize: '14px' }}>Ver agendamentos &rarr;</strong>
        </a>

        <a className="action-card" href="/ajuda">
          <div>
            <span style={{ fontSize: '24px' }}>ℹ️</span>
            <h3>Ajuda & Escopo</h3>
            <p>Saiba mais sobre as limitações e diretrizes de conformidade desta demonstração.</p>
          </div>
          <strong style={{ color: 'var(--brand-blue)', fontSize: '14px' }}>Consultar limites &rarr;</strong>
        </a>
      </div>

      <section className="panel" style={{ marginTop: '24px', display: 'grid', gap: '16px' }}>
        <h2>Alternar Perfil Demonstrativo</h2>
        <p style={{ fontSize: '14px', color: 'var(--muted)', margin: 0 }}>
          Deseja visualizar a perspectiva da clínica e dos médicos?
        </p>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={handleSwitchToDoctor}
            className="secondary-button"
            style={{ maxWidth: '280px', minHeight: '44px', fontSize: '14px' }}
          >
            🩺 Ver como Equipe Médica
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="secondary-button"
            style={{ maxWidth: '260px', minHeight: '44px', fontSize: '14px' }}
          >
            Trocar credenciais / Sair
          </button>
        </div>
      </section>
    </main>
  );
}
