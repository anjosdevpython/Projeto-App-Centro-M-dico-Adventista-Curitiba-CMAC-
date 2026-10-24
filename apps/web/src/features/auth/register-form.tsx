'use client';

import { useRef, useState, type FormEvent } from 'react';

import { FormField } from '../../components/form-field';
import {
  generateDoctorCredentials,
  generatePatientCredentials,
  saveDemoSession,
} from '../../lib/demo/demo-auth';
import { DEMO_PROFESSIONALS, DEMO_SPECIALTIES } from '../../lib/demo/demo-service';
import type { DemoCredentials, DemoUserRole } from '../../lib/demo/types';

export function RegisterForm({
  onSubmit,
}: {
  onSubmit?: (input: {
    email: string;
    password?: string;
    credentials?: DemoCredentials;
  }) => void | Promise<void>;
}) {
  const [selectedRole, setSelectedRole] = useState<DemoUserRole>('paciente');
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>('prof-cardio-1');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [createdCredentials, setCreatedCredentials] = useState<DemoCredentials | null>(null);
  const summary = useRef<HTMLDivElement>(null);

  function handleQuickGenerate(role: DemoUserRole) {
    let credentials: DemoCredentials;
    if (role === 'medico') {
      const doc = DEMO_PROFESSIONALS.find((p) => p.id === selectedDoctorId) ?? DEMO_PROFESSIONALS[0]!;
      const spec = DEMO_SPECIALTIES.find((s) => s.id === doc.specialtyId);
      credentials = generateDoctorCredentials(
        `dr.${doc.name.toLowerCase().replace(/[^a-z]/g, '')}@cmac.demo`,
        doc.name,
        spec?.name ?? 'Clínica Geral',
        doc.crm,
      );
    } else {
      credentials = generatePatientCredentials('paciente.demonstrativo@cmac.demo');
    }

    saveDemoSession(credentials);
    setCreatedCredentials(credentials);
    if (onSubmit) {
      void onSubmit({ email: credentials.email, credentials });
    }
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const email = String(data.get('email') ?? '').trim();
    const password = String(data.get('password') ?? '');

    const next: { email?: string; password?: string } = {};
    if (!email || !email.includes('@')) {
      next.email = 'Informe um e-mail válido (ex: paciente@exemplo.com).';
    }
    if (password && password.length < 4) {
      next.password = 'Para o modo demonstrativo, use pelo menos 4 caracteres.';
    }

    setErrors(next);
    if (Object.keys(next).length) {
      queueMicrotask(() => summary.current?.focus());
      return;
    }

    let credentials: DemoCredentials;
    if (selectedRole === 'medico') {
      const doc = DEMO_PROFESSIONALS.find((p) => p.id === selectedDoctorId) ?? DEMO_PROFESSIONALS[0]!;
      const spec = DEMO_SPECIALTIES.find((s) => s.id === doc.specialtyId);
      credentials = generateDoctorCredentials(
        email,
        doc.name,
        spec?.name ?? 'Clínica Geral',
        doc.crm,
      );
    } else {
      credentials = generatePatientCredentials(email);
    }

    saveDemoSession(credentials);
    setCreatedCredentials(credentials);

    if (onSubmit) {
      await onSubmit({ email, password, credentials });
    }
  }

  if (createdCredentials) {
    const isDoctor = createdCredentials.role === 'medico';

    return (
      <div className="auth-card credentials-receipt" role="status" aria-live="polite">
        <span className={`badge ${isDoctor ? 'badge-info' : 'badge-success'}`}>
          {isDoctor ? '🩺 Credencial da Equipe Médica Ativa' : '👤 Credencial de Paciente Ativa'}
        </span>
        <h2 style={{ margin: '12px 0 8px', fontSize: '24px' }}>Credenciais demonstrativas geradas com sucesso!</h2>
        <p className="lead" style={{ fontSize: '16px', marginBottom: '20px' }}>
          Seu acesso sintético de <strong>{isDoctor ? 'Médico / Profissional' : 'Cliente / Paciente'}</strong> foi configurado no navegador.
        </p>

        <div className="receipt-box">
          <div className="receipt-row">
            <span className="receipt-label">Perfil de Acesso:</span>
            <strong className="receipt-value" style={{ color: 'var(--brand-blue)' }}>
              {isDoctor ? 'Equipe Médica / Profissional Clínico' : 'Cliente / Paciente do Autoatendimento'}
            </strong>
          </div>
          <div className="receipt-row">
            <span className="receipt-label">{isDoctor ? 'Profissional:' : 'Nome:'}</span>
            <strong className="receipt-value">{createdCredentials.patientName}</strong>
          </div>
          {isDoctor && createdCredentials.crm && (
            <div className="receipt-row">
              <span className="receipt-label">Registro Profissional:</span>
              <code className="receipt-value">{createdCredentials.crm}</code>
            </div>
          )}
          {isDoctor && createdCredentials.specialty && (
            <div className="receipt-row">
              <span className="receipt-label">Especialidade:</span>
              <span className="receipt-value">{createdCredentials.specialty}</span>
            </div>
          )}
          <div className="receipt-row">
            <span className="receipt-label">E-mail:</span>
            <strong className="receipt-value">{createdCredentials.email}</strong>
          </div>
          <div className="receipt-row">
            <span className="receipt-label">Identificador:</span>
            <code className="receipt-value">{createdCredentials.id}</code>
          </div>
          <div className="receipt-row">
            <span className="receipt-label">Protocolo de Acesso:</span>
            <code className="receipt-value">{createdCredentials.protocol}</code>
          </div>
          <div className="receipt-row">
            <span className="receipt-label">Ambiente:</span>
            <span className="receipt-value" style={{ color: 'var(--brand-blue)', fontWeight: 700 }}>
              Demonstração Sintética CMAC
            </span>
          </div>
        </div>

        <div style={{ display: 'grid', gap: '12px', marginTop: '24px' }}>
          <a
            className="primary-button"
            style={{ display: 'grid', placeItems: 'center', textDecoration: 'none' }}
            href="/inicio"
          >
            {isDoctor ? 'Acessar Painel da Equipe Médica' : 'Acessar portal demonstrativo'}
          </a>
          <button
            type="button"
            className="secondary-button"
            onClick={() => setCreatedCredentials(null)}
          >
            Gerar outras credenciais (trocar perfil)
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'grid', gap: '24px' }}>
      {/* SEÇÃO 1: ACESSO RÁPIDO EM 1 CLIQUE */}
      <section className="panel" style={{ borderLeft: '4px solid var(--brand-cyan)' }}>
        <h2 style={{ fontSize: '18px', margin: '0 0 8px' }}>⚡ Gerar Credenciais com 1 Clique (Recomendado)</h2>
        <p style={{ fontSize: '14px', color: 'var(--muted)', margin: '0 0 16px' }}>
          Escolha o perfil desejado para gerar credenciais sintéticas imediatamente, sem necessidade de digitação:
        </p>
        <div style={{ display: 'grid', gap: '12px' }}>
          <button
            type="button"
            className="primary-button"
            onClick={() => handleQuickGenerate('paciente')}
            style={{ background: '#1a4a7a' }}
          >
            👤 Gerar Credencial de Paciente (Cliente)
          </button>
          <button
            type="button"
            className="secondary-button"
            onClick={() => handleQuickGenerate('medico')}
            style={{ borderColor: '#00b5cc', color: '#007b8a', fontWeight: 800 }}
          >
            🩺 Gerar Credencial da Equipe Médica (Médico)
          </button>
        </div>
      </section>

      {/* SEÇÃO 2: FORMULÁRIO MANUAL */}
      <form className="auth-card" onSubmit={submit} noValidate>
        <h2 style={{ fontSize: '18px', margin: '0 0 16px' }}>Ou informe dados específicos:</h2>

        <div
          ref={summary}
          tabIndex={-1}
          role={Object.keys(errors).length ? 'alert' : undefined}
          className="error-summary"
        >
          {Object.keys(errors).length ? 'Revise os campos destacados.' : null}
        </div>

        <div className="field">
          <label htmlFor="user-role-select">Tipo de Acesso:</label>
          <select
            id="user-role-select"
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value as DemoUserRole)}
            style={{ width: '100%', minHeight: '48px', padding: '8px 12px', borderRadius: '8px', border: '1px solid #91a4b7', fontSize: '16px' }}
          >
            <option value="paciente">👤 Cliente / Paciente (Autoatendimento)</option>
            <option value="medico">🩺 Equipe Médica / Profissional Clínico</option>
          </select>
        </div>

        {selectedRole === 'medico' && (
          <div className="field">
            <label htmlFor="doctor-select">Profissional Médico Simulado:</label>
            <select
              id="doctor-select"
              value={selectedDoctorId}
              onChange={(e) => setSelectedDoctorId(e.target.value)}
              style={{ width: '100%', minHeight: '48px', padding: '8px 12px', borderRadius: '8px', border: '1px solid #91a4b7', fontSize: '16px' }}
            >
              {DEMO_PROFESSIONALS.map((doc) => (
                <option key={doc.id} value={doc.id}>
                  {doc.name} — {doc.crm}
                </option>
              ))}
            </select>
          </div>
        )}

        <FormField
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          label={selectedRole === 'medico' ? 'E-mail do profissional' : 'E-mail'}
          defaultValue={selectedRole === 'medico' ? 'dr.lucas.silveira@cmac.demo' : 'paciente.teste@exemplo.com'}
          error={errors.email}
        />

        <FormField
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          label="Senha de acesso (opcional no modo demo)"
          defaultValue="demo1234"
          error={errors.password}
        />

        <button className="primary-button" type="submit">
          Criar acesso
        </button>
      </form>
    </div>
  );
}
