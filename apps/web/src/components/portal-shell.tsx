import type { ReactNode } from 'react';

import { DemoBanner } from './demo-banner';

export function PortalShell({ children }: { children: ReactNode }) {
  return (
    <div className="app-shell">
      <DemoBanner />
      <header className="site-header">
        <a className="brand" href="/" aria-label="Centro Médico Adventista Curitiba — início">
          <span className="brand-mark" aria-hidden="true">CM</span>
          <span><strong>Centro Médico Adventista</strong><small>Curitiba</small></span>
        </a>
        <a className="help-link" href="/suporte">Ajuda</a>
      </header>
      {children}
      <nav className="bottom-nav" aria-label="Navegação principal">
        <a href="/">Início</a>
        <a href="/agendar">Agendar</a>
        <a href="/agendamentos">Agendamentos</a>
        <a href="/perfil">Perfil</a>
      </nav>
    </div>
  );
}
