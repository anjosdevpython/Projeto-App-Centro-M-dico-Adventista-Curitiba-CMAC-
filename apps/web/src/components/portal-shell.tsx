'use client';

import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';

export function PortalShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = pathname === '/cadastro' || pathname === '/';

  const navItems = [
    { href: '/inicio', label: 'Início', icon: 'home', badge: null },
    { href: '/agendar', label: 'Agendar Consulta', icon: 'calendar_add_on', badge: 'Novo' },
    { href: '/agendamentos', label: 'Minhas Consultas', icon: 'event_note', badge: null },
    { href: '/medico', label: 'Corpo Clínico', icon: 'stethoscope', badge: 'Médico' },
    { href: '/perfil', label: 'Meu Perfil & Saúde', icon: 'badge', badge: null },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-surface text-on-surface">
      {/* Top Disclaimer */}
      <div className="bg-amber-100 text-amber-900 px-4 py-1.5 text-center font-medium text-xs border-b border-amber-200 z-50 flex items-center justify-center gap-1.5">
        <span className="material-symbols-outlined text-[15px]">info</span>
        <span>Ambiente de Demonstração CMAC — Dados Sintéticos Locais • SOUL MV Simulado</span>
      </div>

      {!isAuthPage ? (
        <div className="flex-1 flex flex-col md:flex-row w-full">
          {/* Desktop Sidebar (visible on md: and above) */}
          <aside
            aria-label="Menu principal lateral"
            className="hidden md:flex flex-col w-64 lg:w-72 bg-surface-container-lowest border-r border-slate-200 shrink-0 sticky top-0 h-screen overflow-y-auto"
          >
            {/* Desktop Brand Header */}
            <div className="p-5 border-b border-slate-100 flex items-center gap-3">
              <img
                alt="Clínica Adventista"
                className="w-10 h-10 rounded-xl object-contain shadow-sm bg-primary p-1 shrink-0"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDrk3vT9w5PgltHzhH3M6CDRfoi4uKJJeeX4UiFhgKiEkObRjBYPJ4qSt6HxxPdEa2zxCEG8-_AhLPoWEm0A8OkaU7BNU2zKTx6R_1hoeCJtggc67-PlNJ37bK1fQ5F3_1juA2_C-WxnMGHzQ_Ga1nkWlz6WhWcLC3rz2HUEghccWwhaHGoC3WadFBUCR0JH1da8X4N51WAm8bTthLprdHNpKLCkq2RieoYLMl93gjPR4nR9Jq48PTx_To2hquGOnRKpw"
              />
              <div className="flex flex-col min-w-0">
                <span className="font-bold text-sm tracking-tight text-primary leading-tight truncate">
                  Clínica Adventista
                </span>
                <span className="text-xs text-on-surface-variant font-medium truncate">
                  Curitiba • Autoatendimento
                </span>
              </div>
            </div>

            {/* Navigation Links */}
            <nav className="p-4 flex-1 flex flex-col gap-1.5" aria-label="Navegação desktop">
              <span className="text-[11px] font-bold text-outline uppercase tracking-wider px-3 mb-1">
                Navegação
              </span>
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <a
                    key={item.href}
                    href={item.href}
                    className={`flex items-center justify-between px-3.5 py-3 rounded-xl font-medium text-sm transition-all ${
                      isActive
                        ? 'bg-primary text-on-primary shadow-sm font-semibold'
                        : 'text-on-surface-variant hover:bg-surface-container hover:text-primary'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`material-symbols-outlined text-[22px] ${isActive ? 'text-secondary-fixed' : 'text-outline'}`}>
                        {item.icon}
                      </span>
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                          isActive
                            ? 'bg-white/20 text-white'
                            : 'bg-surface-container text-secondary font-semibold'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </a>
                );
              })}

              <div className="my-3 border-t border-slate-100" />

              <span className="text-[11px] font-bold text-outline uppercase tracking-wider px-3 mb-1">
                Suporte & Acesso
              </span>
              <a
                href="/ajuda"
                className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm text-on-surface-variant hover:bg-surface-container transition-colors"
              >
                <span className="material-symbols-outlined text-[20px] text-outline">help_outline</span>
                <span>Central de Ajuda</span>
              </a>
              <a
                href="/cadastro"
                className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm text-on-surface-variant hover:bg-surface-container transition-colors"
              >
                <span className="material-symbols-outlined text-[20px] text-outline">swap_horiz</span>
                <span>Alternar Perfil</span>
              </a>
            </nav>

            {/* Desktop User Footer / Unit Badge */}
            <div className="p-4 border-t border-slate-100 bg-surface-container-low/50">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold text-xs shrink-0">
                  <span className="material-symbols-outlined text-[18px]">account_circle</span>
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-bold text-on-surface truncate">Unidade Curitiba</span>
                  <span className="text-[11px] text-secondary font-medium truncate">Recepção Digital Ativa</span>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col min-w-0 pb-20 md:pb-8">
            {children}
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col">{children}</div>
      )}

      {/* Mobile Bottom Navigation (only on mobile screens < md) */}
      {!isAuthPage && (
        <nav
          className="md:hidden fixed bottom-0 inset-x-0 z-50 pb-safe bg-surface-container-lowest/95 backdrop-blur-xl shadow-[0_-2px_12px_rgba(13,28,46,0.08)] border-t border-slate-200"
          aria-label="Navegação mobile inferior"
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
