'use client';

import { useRef, useState, type FormEvent } from 'react';

import { FormField } from '../../components/form-field';
import { generateDemoCredentials, saveDemoSession } from '../../lib/demo/demo-auth';
import type { DemoCredentials } from '../../lib/demo/types';

export function RegisterForm({
  onSubmit,
}: {
  onSubmit?: (input: { email: string; password: string; credentials?: DemoCredentials }) => void | Promise<void>;
}) {
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [createdCredentials, setCreatedCredentials] = useState<DemoCredentials | null>(null);
  const summary = useRef<HTMLDivElement>(null);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const email = String(data.get('email') ?? '').trim();
    const password = String(data.get('password') ?? '');
    const next = {
      ...(!email.includes('@') ? { email: 'Informe um e-mail válido.' } : {}),
      ...(password.length < 12 ? { password: 'Use pelo menos 12 caracteres.' } : {}),
    };
    setErrors(next);
    if (Object.keys(next).length) {
      queueMicrotask(() => summary.current?.focus());
      return;
    }

    const credentials = generateDemoCredentials(email);
    saveDemoSession(credentials);
    setCreatedCredentials(credentials);

    if (onSubmit) {
      await onSubmit({ email, password, credentials });
    }
  }

  if (createdCredentials) {
    return (
      <div className="auth-card credentials-receipt" role="status" aria-live="polite">
        <span className="badge badge-success">Acesso de Demonstração Ativo</span>
        <h2 style={{ margin: '12px 0 8px', fontSize: '24px' }}>Credenciais demonstrativas geradas com sucesso!</h2>
        <p className="lead" style={{ fontSize: '16px', marginBottom: '20px' }}>
          Seu acesso sintético foi configurado localmente no navegador. Nenhum dado é enviado a prontuários reais.
        </p>

        <div className="receipt-box">
          <div className="receipt-row">
            <span className="receipt-label">E-mail:</span>
            <strong className="receipt-value">{createdCredentials.email}</strong>
          </div>
          <div className="receipt-row">
            <span className="receipt-label">ID Demonstrativo:</span>
            <code className="receipt-value">{createdCredentials.id}</code>
          </div>
          <div className="receipt-row">
            <span className="receipt-label">Protocolo de Acesso:</span>
            <code className="receipt-value">{createdCredentials.protocol}</code>
          </div>
          <div className="receipt-row">
            <span className="receipt-label">Perfil:</span>
            <span className="receipt-value">{createdCredentials.patientName}</span>
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
            Acessar portal demonstrativo
          </a>
          <button
            type="button"
            className="secondary-button"
            onClick={() => setCreatedCredentials(null)}
          >
            Cadastrar outro e-mail
          </button>
        </div>
      </div>
    );
  }

  return (
    <form className="auth-card" onSubmit={submit} noValidate>
      <div
        ref={summary}
        tabIndex={-1}
        role={Object.keys(errors).length ? 'alert' : undefined}
        className="error-summary"
      >
        {Object.keys(errors).length ? 'Revise os campos destacados.' : null}
      </div>
      <FormField id="email" name="email" type="email" autoComplete="email" label="E-mail" error={errors.email} />
      <FormField id="password" name="password" type="password" autoComplete="new-password" label="Senha de acesso" error={errors.password} />
      <button className="primary-button" type="submit">Criar acesso</button>
    </form>
  );
}
