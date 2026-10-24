'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState, type ReactNode } from 'react';

import { getOrCreateDemoSession } from '../lib/demo/demo-auth';
import type { DemoCredentials } from '../lib/demo/types';

export function PortalShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [session, setSession] = useState<DemoCredentials | null>(null);
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

  useEffect(() => {
    setSession(getOrCreateDemoSession());
    const savedState = localStorage.getItem('cmac_sidebar_collapsed');
    if (savedState === 'true') {
      setIsCollapsed(true);
    }
  }, [pathname]);

  function toggleSidebar() {
    const nextState = !isCollapsed;
    setIsCollapsed(nextState);
    localStorage.setItem('cmac_sidebar_collapsed', String(nextState));
  }

  const isAuthPage = pathname === '/cadastro' || pathname === '/';
  const isDoctorRoute = Boolean(pathname?.startsWith('/medico') || session?.role === 'medico');

  // Navigation Items for Patient Profile
  const patientNavItems = [
    { href: '/inicio', label: 'Início', icon: 'home' },
    { href: '/agendar', label: 'Agendar', icon: 'calendar_add_on' },
    { href: '/agendamentos', label: 'Consultas', icon: 'event_note' },
    { href: '/teleconsulta', label: 'Teleconsulta', icon: 'video_camera_front', badge: 'Ao Vivo' },
    { href: '/prescricoes', label: 'Receitas', icon: 'prescriptions' },
    { href: '/laudos', label: 'Laudos', icon: 'description' },
    { href: '/checkin', label: 'Check-in', icon: 'qr_code_scanner' },
    { href: '/perfil', label: 'Perfil', icon: 'badge' },
  ];

  // Navigation Items for Medical Team Profile
  const doctorNavItems = [
    { href: '/medico?tab=agenda', label: 'Agenda do Dia', icon: 'calendar_today', pathKey: 'agenda' },
    { href: '/medico?tab=fila', label: 'Fila & Chamada', icon: 'groups', pathKey: 'fila' },
    { href: '/medico?tab=prontuario', label: 'Prontuário PEP', icon: 'clinical_notes', pathKey: 'prontuario' },
    { href: '/medico?tab=interconsultas', label: 'Interconsultas', icon: 'forum', pathKey: 'interconsultas' },
    { href: '/teleconsulta', label: 'Teleatendimento', icon: 'video_camera_front' },
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
          {/* Desktop Sidebar with Toggle Collapse (visible on md: and above) */}
          <aside
            aria-label="Menu lateral principal"
            className={`hidden md:flex flex-col bg-surface-container-lowest border-r border-slate-200 shrink-0 sticky top-0 h-screen overflow-y-auto transition-all duration-300 ${
              isCollapsed ? 'w-20' : 'w-64 lg:w-72'
            }`}
          >
            {/* Desktop Brand Header & Collapse Toggle */}
            <div className={`p-4 border-b border-slate-100 flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
              <div className="flex items-center gap-3 min-w-0">
                <img
                  alt="Clínica Adventista"
                  className="w-10 h-10 rounded-xl object-contain shadow-sm bg-primary p-1 shrink-0"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDrk3vT9w5PgltHzhH3M6CDRfoi4uKJJeeX4UiFhgKiEkObRjBYPJ4qSt6HxxPdEa2zxCEG8-_AhLPoWEm0A8OkaU7BNU2zKTx6R_1hoeCJtggc67-PlNJ37bK1fQ5F3_1juA2_C-WxnMGHzQ_Ga1nkWlz6WhWcLC3rz2HUEghccWwhaHGoC3WadFBUCR0JH1da8X4N51WAm8bTthLprdHNpKLCkq2RieoYLMl93gjPR4nR9Jq48PTx_To2hquGOnRKpw"
                />
                {!isCollapsed && (
                  <div className="flex flex-col min-w-0">
                    <span className="font-bold text-sm tracking-tight text-primary leading-tight truncate">
                      Clínica Adventista
                    </span>
                    <span className="text-xs text-on-surface-variant font-medium truncate">
                      {isDoctorRoute ? 'Corpo Clínico • Curitiba' : 'Portal do Paciente • Curitiba'}
                    </span>
                  </div>
                )}
              </div>
              <button
                onClick={toggleSidebar}
                aria-label={isCollapsed ? 'Expandir menu lateral' : 'Recolher menu lateral'}
                title={isCollapsed ? 'Expandir menu' : 'Recolher menu'}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:text-primary hover:bg-surface-container transition-colors shrink-0"
              >
                <span className="material-symbols-outlined text-[20px]">
                  {isCollapsed ? 'menu_open' : 'keyboard_double_arrow_left'}
                </span>
              </button>
            </div>

            {/* Profile Context Switcher Badge */}
            {!isCollapsed ? (
              <div className="p-3 mx-4 my-3 rounded-xl bg-surface-container-low border border-surface-container flex items-center justify-between">
                <div className="flex items-center gap-2 min-w-0">
                  <span className={`w-2.5 h-2.5 rounded-full ${isDoctorRoute ? 'bg-secondary' : 'bg-tertiary-fixed-dim'} animate-pulse`}></span>
                  <div className="flex flex-col min-w-0 text-xs">
                    <span className="font-bold text-primary truncate">
                      {isDoctorRoute ? 'Médico Ativo' : 'Paciente Ativo'}
                    </span>
                    <span className="text-outline truncate">
                      {isDoctorRoute ? 'CRM-PR 28.412' : 'CPF: 098.***.***-12'}
                    </span>
                  </div>
                </div>
                <a
                  href="/cadastro"
                  className="text-[11px] font-semibold text-secondary hover:underline shrink-0"
                >
                  Alternar
                </a>
              </div>
            ) : (
              <div className="py-3 flex justify-center border-b border-slate-100">
                <div
                  title={isDoctorRoute ? 'Modo Médico: CRM-PR 28.412' : 'Modo Paciente: CPF 098.***.***-12'}
                  className={`w-3 h-3 rounded-full ${isDoctorRoute ? 'bg-secondary' : 'bg-tertiary-fixed-dim'} ring-4 ring-slate-100`}
                />
              </div>
            )}

            {/* Desktop Navigation Links */}
            <nav className="flex-1 p-3 space-y-1">
              {currentNavItems.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (isDoctorRoute && pathname === '/medico' && item.href.includes('agenda'));

                return (
                  <a
                    key={item.href}
                    href={item.href}
                    title={isCollapsed ? item.label : undefined}
                    className={`flex items-center rounded-xl font-medium text-sm transition-all ${
                      isCollapsed
                        ? 'justify-center w-12 h-12 mx-auto'
                        : 'justify-between px-3.5 py-2.5'
                    } ${
                      isActive
                        ? 'bg-primary text-on-primary shadow-sm font-semibold'
                        : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
                    }`}
                  >
                    <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3 min-w-0'}`}>
                      <span className="material-symbols-outlined text-[20px] shrink-0">
                        {item.icon}
                      </span>
                      {!isCollapsed && <span className="truncate">{item.label}</span>}
                    </div>
                    {!isCollapsed && (item as any).badge && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-secondary text-white">
                        {(item as any).badge}
                      </span>
                    )}
                  </a>
                );
              })}

              <div className="pt-4 mt-4 border-t border-slate-100">
                <a
                  href="/ajuda"
                  title={isCollapsed ? 'Central de Ajuda' : undefined}
                  className={`flex items-center rounded-xl font-medium text-sm text-on-surface-variant hover:bg-surface-container transition-colors ${
                    isCollapsed ? 'justify-center w-12 h-12 mx-auto' : 'gap-3 px-3.5 py-2.5'
                  }`}
                >
                  <span className="material-symbols-outlined text-[20px] text-outline">help_outline</span>
                  {!isCollapsed && <span>Central de Ajuda</span>}
                </a>
                <a
                  href="/cadastro"
                  title={isCollapsed ? 'Encerrar / Alternar' : undefined}
                  className={`flex items-center rounded-xl font-medium text-sm text-on-surface-variant hover:bg-surface-container transition-colors ${
                    isCollapsed ? 'justify-center w-12 h-12 mx-auto' : 'gap-3 px-3.5 py-2.5'
                  }`}
                >
                  <span className="material-symbols-outlined text-[20px] text-outline">logout</span>
                  {!isCollapsed && <span>Encerrar / Alternar</span>}
                </a>
              </div>
            </nav>

            {/* Desktop User Footer / Unit Badge */}
            <div className="p-4 border-t border-slate-100 bg-surface-container-low/50">
              <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'}`}>
                <div className="w-9 h-9 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold text-xs shrink-0">
                  <span className="material-symbols-outlined text-[18px]">
                    {isDoctorRoute ? 'stethoscope' : 'person'}
                  </span>
                </div>
                {!isCollapsed && (
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-bold text-on-surface truncate">Unidade Curitiba - Juvevê</span>
                    <span className="text-[11px] text-secondary font-medium truncate">
                      {isDoctorRoute ? 'Consultório 04 • Ala Médica' : 'Recepção Digital Integrada'}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </aside>

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col min-w-0 bg-surface">
            {children}
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col">{children}</div>
      )}

      {/* Mobile Sticky Bottom Navigation */}
      {!isAuthPage && (
        <nav
          className="md:hidden fixed bottom-0 inset-x-0 z-50 pb-safe bg-surface-container-lowest/95 backdrop-blur-xl shadow-[0_-2px_12px_rgba(13,28,46,0.08)] border-t border-slate-200"
          aria-label={isDoctorRoute ? 'Navegação clínica inferior' : 'Navegação paciente inferior'}
        >
          <div className="flex justify-around items-center h-16 px-1 max-w-lg mx-auto overflow-x-auto">
            {currentNavItems.slice(0, 5).map((item) => {
              const isActive = pathname === item.href || (isDoctorRoute && pathname === '/medico' && item.href.includes('agenda'));
              return (
                <a
                  key={item.href}
                  href={item.href}
                  className={`flex flex-col items-center justify-center min-w-[50px] h-12 px-1 ${
                    isActive
                      ? 'text-secondary font-semibold'
                      : 'text-on-surface-variant hover:text-secondary'
                  }`}
                >
                  <span className="material-symbols-outlined text-[22px]">{item.icon}</span>
                  <span className="font-label-sm text-[10px] tracking-tight mt-0.5 whitespace-nowrap">{item.label}</span>
                </a>
              );
            })}
          </div>
        </nav>
      )}
    </div>
  );
}
