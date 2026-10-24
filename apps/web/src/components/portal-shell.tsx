import type { ReactNode } from 'react';

import { DemoBanner } from './demo-banner';

export function PortalShell({ children }: { children: ReactNode }) {
  return (
    <div className="app-shell">
      <DemoBanner />
      <header className="site-header">
        <a className="brand" href="/inicio" aria-label="Centro Médico Adventista Curitiba — início">
          <span className="brand-mark" aria-hidden="true">CM</span>
          <span><strong>Centro Médico Adventista</strong><small>Curitiba</small></span>
        </a>
        <a className="help-link" href="/ajuda">Ajuda</a>
      </header>
      {children}
      <nav className="bottom-nav" aria-label="Navegação principal">
        <a href="/inicio">Início</a>
        <a href="/agendar">Agendar</a>
        <a href="/agendamentos">Agendamentos</a>
        <a href="/ajuda">Ajuda</a>
      </nav>
    </div>
  );
}
