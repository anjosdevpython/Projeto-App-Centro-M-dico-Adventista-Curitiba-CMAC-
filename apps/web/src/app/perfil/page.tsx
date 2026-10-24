'use client';

import { useEffect, useState } from 'react';

import { clearDemoSession, getOrCreateDemoSession } from '../../lib/demo/demo-auth';
import type { DemoCredentials } from '../../lib/demo/types';

export default function PerfilPage() {
  const [session, setSession] = useState<DemoCredentials | null>(null);

  useEffect(() => {
    setSession(getOrCreateDemoSession());
  }, []);

  function handleLogout() {
    clearDemoSession();
    window.location.href = '/cadastro';
  }

  return (
    <main className="page">
      <p className="eyebrow">Acesso e Identidade</p>
      <h1>Perfil Demonstrativo</h1>
      <p className="lead">Informações do usuário sintético ativo no navegador.</p>

      {session && (
        <section className="panel credentials-receipt" role="status">
          <span className="badge badge-success">Sessão Demonstrativa</span>
          <div className="receipt-box" style={{ marginTop: '16px' }}>
            <div className="receipt-row">
              <span className="receipt-label">Nome:</span>
              <strong className="receipt-value">{session.patientName}</strong>
            </div>
            <div className="receipt-row">
              <span className="receipt-label">E-mail:</span>
              <span className="receipt-value">{session.email}</span>
            </div>
            <div className="receipt-row">
              <span className="receipt-label">Identificador:</span>
              <code className="receipt-value">{session.id}</code>
            </div>
            <div className="receipt-row">
              <span className="receipt-label">Protocolo:</span>
              <code className="receipt-value">{session.protocol}</code>
            </div>
            <div className="receipt-row">
              <span className="receipt-label">Criado em:</span>
              <span className="receipt-value">{new Date(session.createdAt).toLocaleString('pt-BR')}</span>
            </div>
          </div>

          <div style={{ marginTop: '20px' }}>
            <button
              type="button"
              onClick={handleLogout}
              className="secondary-button"
              style={{ maxWidth: '280px' }}
            >
              Trocar credenciais / Sair
            </button>
          </div>
        </section>
      )}
    </main>
  );
}
