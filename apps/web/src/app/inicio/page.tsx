'use client';

import { useEffect, useState } from 'react';

import { clearDemoSession, getOrCreateDemoSession } from '../../lib/demo/demo-auth';
import { listDemoAppointments } from '../../lib/demo/demo-service';
import type { DemoAppointment, DemoCredentials } from '../../lib/demo/types';

export default function InicioPage() {
  const [session, setSession] = useState<DemoCredentials | null>(null);
  const [nextAppointment, setNextAppointment] = useState<DemoAppointment | null>(null);

  useEffect(() => {
    const active = getOrCreateDemoSession();
    setSession(active);

    const appointments = listDemoAppointments();
    const upcoming = appointments.find((a) => a.status === 'agendado' || a.status === 'reagendado');
    if (upcoming) {
      setNextAppointment(upcoming);
    }
  }, []);

  function handleReset() {
    clearDemoSession();
    window.location.href = '/cadastro';
  }

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
            <span className="badge badge-success">Credencial Demonstrativa Ativa</span>
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

      <section className="panel" style={{ marginTop: '24px' }}>
        <h2>Gerenciamento do Acesso</h2>
        <p style={{ fontSize: '14px', color: 'var(--muted)' }}>
          Para testar com outro e-mail ou redefinir todos os dados sintéticos salvos neste navegador:
        </p>
        <button
          type="button"
          onClick={handleReset}
          className="secondary-button"
          style={{ maxWidth: '300px', minHeight: '44px', fontSize: '14px' }}
        >
          Trocar credencial / Criar outro acesso
        </button>
      </section>
    </main>
  );
}
