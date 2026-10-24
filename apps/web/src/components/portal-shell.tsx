'use client';

import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';

export function PortalShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = pathname === '/cadastro' || pathname === '/';

  return (
    <div className="min-h-screen flex flex-col bg-surface text-on-surface">
      <div className="bg-amber-100 text-amber-900 px-4 py-1 text-center font-medium text-xs border-b border-amber-200 z-50 flex items-center justify-center gap-1.5">
        <span className="material-symbols-outlined text-[14px]">info</span>
        <span>Ambiente de Demonstração CMAC — Dados Sintéticos Locais</span>
      </div>
      {children}
      {!isAuthPage && (
        <nav
          className="fixed bottom-0 inset-x-0 z-50 pb-safe bg-surface-container-lowest/95 backdrop-blur-xl shadow-[0_-2px_12px_rgba(13,28,46,0.06)] border-t border-slate-200"
          aria-label="Navegação principal"
        >
          <div className="flex justify-around items-center h-16 px-2 max-w-lg mx-auto">
            <a
              href="/inicio"
              className={`flex flex-col items-center justify-center min-w-[56px] h-12 px-1 ${
                pathname === '/inicio'
                  ? 'text-secondary font-semibold'
                  : 'text-on-surface-variant hover:text-secondary'
              }`}
            >
              <span className="material-symbols-outlined text-[24px]">home</span>
              <span className="font-label-sm text-[11px] tracking-tight mt-0.5">Início</span>
            </a>
            <a
              href="/agendar"
              className={`flex flex-col items-center justify-center min-w-[56px] h-12 px-1 ${
                pathname === '/agendar'
                  ? 'text-secondary font-semibold'
                  : 'text-on-surface-variant hover:text-secondary'
              }`}
            >
              <span className="material-symbols-outlined text-[24px]">calendar_add_on</span>
              <span className="font-label-sm text-[11px] tracking-tight mt-0.5">Agendar</span>
            </a>
            <a
              href="/agendamentos"
              className={`flex flex-col items-center justify-center min-w-[56px] h-12 px-1 ${
                pathname === '/agendamentos'
                  ? 'text-secondary font-semibold'
                  : 'text-on-surface-variant hover:text-secondary'
              }`}
            >
              <span className="material-symbols-outlined text-[24px]">event_note</span>
              <span className="font-label-sm text-[11px] tracking-tight mt-0.5">Consultas</span>
            </a>
            <a
              href="/medico"
              className={`flex flex-col items-center justify-center min-w-[56px] h-12 px-1 ${
                pathname === '/medico'
                  ? 'text-secondary font-semibold'
                  : 'text-on-surface-variant hover:text-secondary'
              }`}
            >
              <span className="material-symbols-outlined text-[24px]">stethoscope</span>
              <span className="font-label-sm text-[11px] tracking-tight mt-0.5">Médico</span>
            </a>
            <a
              href="/perfil"
              className={`flex flex-col items-center justify-center min-w-[56px] h-12 px-1 ${
                pathname === '/perfil'
                  ? 'text-secondary font-semibold'
                  : 'text-on-surface-variant hover:text-secondary'
              }`}
            >
              <span className="material-symbols-outlined text-[24px]">badge</span>
              <span className="font-label-sm text-[11px] tracking-tight mt-0.5">Perfil</span>
            </a>
          </div>
        </nav>
      )}
    </div>
  );
}
