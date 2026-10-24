'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState, type ReactNode } from 'react';

import { getOrCreateDemoSession } from '../lib/demo/demo-auth';
import type { DemoCredentials } from '../lib/demo/types';

export function PortalShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [session, setSession] = useState<DemoCredentials | null>(null);

  useEffect(() => {
    setSession(getOrCreateDemoSession());
  }, [pathname]);

  const isAuthPage = pathname === '/cadastro' || pathname === '/';
  const isDoctorRoute = Boolean(pathname?.startsWith('/medico') || session?.role === 'medico');

  // Navigation Items for Patient Profile (from Stitch: in_cio, agendar, meus_agendamentos, perfil)
  const patientNavItems = [
    { href: '/inicio', label: 'Início', icon: 'home' },
    { href: '/agendar', label: 'Agendar', icon: 'calendar_add_on' },
    { href: '/agendamentos', label: 'Consultas', icon: 'event_note' },
    { href: '/perfil', label: 'Perfil & Saúde', icon: 'badge' },
  ];

  // Navigation Items for Medical Team Profile (from Stitch: agenda_do_dia, fila_de_espera, prontuario, interconsultas)
  const doctorNavItems = [
    { href: '/medico?tab=agenda', label: 'Agenda do Dia', icon: 'calendar_today', pathKey: 'agenda' },
    { href: '/medico?tab=fila', label: 'Fila & Chamada', icon: 'groups', pathKey: 'fila' },
    { href: '/medico?tab=prontuario', label: 'Prontuário PEP', icon: 'clinical_notes', pathKey: 'prontuario' },
    { href: '/medico?tab=interconsultas', label: 'Interconsultas', icon: 'forum', pathKey: 'interconsultas' },
  ];

  const currentNavItems = isDoctorRoute ? doctorNavItems : patientNavItems;

  return (
    <div className="min-h-screen flex flex-col bg-surface text-on-surface">
      {/* Top Disclaimer */}
      <div className="bg-amber-100 text-amber-900 px-4 py-1.5 text-center font-medium text-xs border-b border-amber-200 z-50 flex items-center justify-center gap-1.5">
        <span className="material-symbols-outlined text-[15px]">info</span>
        <span>
          Ambiente Demonstrativo CMAC — {isDoctorRoute ? 'Visão do Corpo Clínico (CRM)' : 'Visão do Paciente (Autoatendimento)'}
        </span>
      </div>

      {!isAuthPage ? (
        <div className="flex-1 flex flex-col md:flex-row w-full">
          {/* Desktop Sidebar (visible on md: and above) */}
          <aside
            aria-label="Menu lateral principal"
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
                  {isDoctorRoute ? 'Corpo Clínico • Curitiba' : 'Portal do Paciente • Curitiba'}
                </span>
              </div>
            </div>

            {/* Profile Context Switcher Badge */}
            <div className="p-3 mx-4 my-3 rounded-xl bg-surface-container-low border border-surface-container flex items-center justify-between">
              <div className="flex items-center gap-2 min-w-0">
                <span className={`w-2.5 h-2.5 rounded-full ${isDoctorRoute ? 'bg-secondary' : 'bg-tertiary-fixed-dim'} animate-pulse`}></span>
                <div className="flex flex-col min-w-0 text-xs">
                  <span className="font-bold text-primary truncate">
                    {isDoctorRoute ? 'Médico Ativo' : 'Paciente Ativo'}
                  </span>
                  <span className="text-outline truncate">
                    {isDoctorRoute ? (session?.crm ?? 'CRM-PR 28.412') : (session?.patientName ?? 'Carlos Silva')}
                  </span>
                </div>
              </div>
              <a
                href="/cadastro"
                title="Trocar perfil paciente/médico"
                className="p-1.5 rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-secondary transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">swap_horiz</span>
              </a>
            </div>

            {/* Navigation Links */}
            <nav className="p-4 flex-1 flex flex-col gap-1.5" aria-label="Navegação desktop">
              <span className="text-[11px] font-bold text-outline uppercase tracking-wider px-3 mb-1">
                {isDoctorRoute ? 'Menu Clínico' : 'Menu Autoatendimento'}
              </span>
              {currentNavItems.map((item) => {
                const isActive = pathname === item.href || (isDoctorRoute && pathname === '/medico' && item.href.includes('agenda'));
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
                  </a>
                );
              })}

              <div className="my-3 border-t border-slate-100" />

              <span className="text-[11px] font-bold text-outline uppercase tracking-wider px-3 mb-1">
                Apoio Institucional
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
                <span className="material-symbols-outlined text-[20px] text-outline">logout</span>
                <span>Encerrar / Alternar</span>
              </a>
            </nav>

            {/* Desktop User Footer / Unit Badge */}
            <div className="p-4 border-t border-slate-100 bg-surface-container-low/50">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold text-xs shrink-0">
                  <span className="material-symbols-outlined text-[18px]">
                    {isDoctorRoute ? 'stethoscope' : 'person'}
                  </span>
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-bold text-on-surface truncate">Unidade Curitiba - Juvevê</span>
                  <span className="text-[11px] text-secondary font-medium truncate">
                    {isDoctorRoute ? 'Consultório 04 • Ala Médica' : 'Recepção Digital Integrada'}
                  </span>
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
          aria-label={isDoctorRoute ? 'Navegação clínica inferior' : 'Navegação paciente inferior'}
        >
          <div className="flex justify-around items-center h-16 px-2 max-w-lg mx-auto">
            {currentNavItems.map((item) => {
              const isActive = pathname === item.href || (isDoctorRoute && pathname === '/medico' && item.href.includes('agenda'));
              return (
                <a
                  key={item.href}
                  href={item.href}
                  className={`flex flex-col items-center justify-center min-w-[56px] h-12 px-1 ${
                    isActive
                      ? 'text-secondary font-semibold'
                      : 'text-on-surface-variant hover:text-secondary'
                  }`}
                >
                  <span className="material-symbols-outlined text-[24px]">{item.icon}</span>
                  <span className="font-label-sm text-[11px] tracking-tight mt-0.5">{item.label}</span>
                </a>
              );
            })}
          </div>
        </nav>
      )}
    </div>
  );
}
