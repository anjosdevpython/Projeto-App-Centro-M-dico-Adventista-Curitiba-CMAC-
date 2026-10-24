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

  const remediosNaturais = [
    { nome: 'Água Pura', icon: 'water_drop', desc: 'Hidratação constante ao longo do dia' },
    { nome: 'Ar Puro', icon: 'air', desc: 'Respiração profunda e contato com a natureza' },
    { nome: 'Alimentação Saudável', icon: 'nutrition', desc: 'Dieta equilibrada à base de plantas' },
    { nome: 'Exercício Físico', icon: 'directions_walk', desc: 'Movimento diário regular e consciente' },
    { nome: 'Luz Solar', icon: 'wb_sunny', desc: 'Exposição moderada no início da manhã' },
    { nome: 'Temperança', icon: 'balance', desc: 'Equilíbrio e moderação em todas as coisas' },
    { nome: 'Repouso Reparador', icon: 'bedtime', desc: 'Sono de qualidade e descanso semanal' },
    { nome: 'Confiança em Deus', icon: 'favorite', desc: 'Paz espiritual e fortalecimento mental' },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-surface pb-12">
      {/* Header from Stitch perfil_dependentes_e_sa_de_paciente */}
      <header className="sticky top-0 w-full z-40 bg-primary/95 backdrop-blur-xl shadow-sm pt-safe text-on-primary">
        <div className="h-16 px-4 lg:px-8 flex items-center justify-between max-w-7xl mx-auto w-full">
          <div className="flex items-center gap-3 min-w-0">
            <a
              href="/inicio"
              className="w-9 h-9 flex items-center justify-center rounded-lg text-on-primary hover:bg-white/10"
            >
              <span className="material-symbols-outlined text-[22px]">arrow_back</span>
            </a>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs text-secondary-fixed uppercase tracking-wider font-semibold truncate">
                  Clínica Adventista
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-medium">
                  Curitiba
                </span>
              </div>
              <h1 className="text-base font-bold text-on-primary leading-tight truncate">
                Perfil de Saúde &amp; Dependentes
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-on-primary transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">logout</span>
              <span>Sair</span>
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 lg:px-8 py-6 flex flex-col gap-6">
        {/* Status Banner */}
        <div className="flex items-center justify-between bg-surface-container-low px-5 py-3 rounded-2xl border border-surface-container">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-tertiary-fixed-dim animate-pulse"></span>
            <span className="text-xs md:text-sm font-semibold text-on-surface">
              Prontuário Ativo SOUL MV • Integração Biometria &amp; ICP-Brasil
            </span>
          </div>
          <span className="text-xs text-secondary font-bold font-mono">
            {session?.protocol ?? 'CMAC-DEMO-2026'}
          </span>
        </div>

        {/* Layout em 2 Colunas para Desktop (lg:) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Coluna Principal: 7 cols */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            {/* Header Card: Identificação do Paciente do Stitch */}
            <section className="p-5 md:p-6 rounded-2xl bg-surface-container-lowest shadow-sm flex flex-col gap-4 border border-slate-200/80">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-primary text-secondary-fixed flex items-center justify-center font-bold text-2xl shrink-0 shadow-inner">
                  <span className="material-symbols-outlined text-[36px]">account_circle</span>
                </div>
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-xl font-bold text-primary truncate">
                      {session?.patientName ?? 'Carlos Alberto da Silva'}
                    </h2>
                    <span className="px-2.5 py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed-variant text-xs font-bold">
                      Titular
                    </span>
                  </div>
                  <p className="text-xs text-on-surface-variant mt-0.5">
                    {session?.email ?? 'paciente.demonstrativo@cmac.demo'}
                  </p>
                  <p className="text-xs text-outline font-mono mt-0.5">
                    CPF: ***.482.919-** • Prontuário MV: {session?.id ?? '84920-01'}
                  </p>
                </div>
              </div>
            </section>

            {/* Carteira Digital de Saúde do Stitch */}
            <section className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-primary">Carteira Digital de Saúde</h3>
                <span className="text-xs text-secondary font-semibold">Elegibilidade Ativa</span>
              </div>

              <div className="p-5 rounded-2xl bg-gradient-to-br from-primary to-primary-container text-on-primary shadow-md flex flex-col justify-between gap-4 relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-secondary-fixed text-[24px]">
                      medical_information
                    </span>
                    <strong className="text-sm tracking-wide">Unimed Curitiba / Bradesco Saúde</strong>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-white text-[11px] font-bold">
                    Nacional Top
                  </span>
                </div>

                <div className="py-2">
                  <span className="text-[11px] text-surface-container-high block">Número da Carteirinha</span>
                  <span className="font-mono text-lg font-bold tracking-wider text-white">
                    0029 • 4820 • 9182 • 0019
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs text-surface-container-high border-t border-white/15 pt-2">
                  <span>Validade: 12/2028</span>
                  <span className="text-tertiary-fixed font-semibold">Sem Carências Pendentes</span>
                </div>
              </div>
            </section>

            {/* Prontuário Familiar & Dependentes do Stitch */}
            <section className="p-5 rounded-2xl bg-surface-container-lowest shadow-sm flex flex-col gap-3 border border-slate-200/80">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-primary">Prontuário Familiar &amp; Dependentes</h3>
                <button
                  type="button"
                  onClick={() => alert('Fluxo demonstrativo: inclusão de dependente via validação de certidão/CPF.')}
                  className="text-xs text-secondary font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">person_add</span>
                  <span>Adicionar</span>
                </button>
              </div>

              <div className="flex flex-col gap-2.5">
                <div className="p-3 rounded-xl bg-surface-container-low flex items-center justify-between text-xs border border-surface-container">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-surface-container-high flex items-center justify-center text-primary font-bold">
                      MS
                    </div>
                    <div>
                      <strong className="text-on-surface block font-semibold">Maria Eduarda Silva</strong>
                      <span className="text-outline">Filha • 11 anos • Pediatria</span>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-bold">
                    Dependente
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-surface-container-low flex items-center justify-between text-xs border border-surface-container">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-surface-container-high flex items-center justify-center text-primary font-bold">
                      JS
                    </div>
                    <div>
                      <strong className="text-on-surface block font-semibold">João Pedro Silva</strong>
                      <span className="text-outline">Filho • 6 anos • Pediatria</span>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-bold">
                    Dependente
                  </span>
                </div>
              </div>
            </section>
          </div>

          {/* Coluna Secundária: 5 cols (Alertas & 8 Remédios Naturais) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            {/* Alertas Médicos & Alergias do Stitch */}
            <section className="p-5 rounded-2xl bg-surface-container-lowest shadow-sm flex flex-col gap-3 border border-slate-200/80">
              <div className="flex items-center gap-2 text-error font-bold text-base">
                <span className="material-symbols-outlined text-[20px]">warning</span>
                <span>Alertas Médicos &amp; Alergias</span>
              </div>
              <p className="text-xs text-on-surface-variant">
                Registrados no prontuário eletrônico para segurança em prescrições e procedimentos.
              </p>

              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 rounded-full bg-error-container/40 text-on-error-container text-xs font-bold flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">block</span>
                  Alergia a Dipirona
                </span>
                <span className="px-3 py-1 rounded-full bg-error-container/40 text-on-error-container text-xs font-bold flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">block</span>
                  Contraste Iodado (Moderada)
                </span>
                <span className="px-3 py-1 rounded-full bg-surface-container text-primary text-xs font-semibold flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">favorite</span>
                  Hipertensão Leve Controlada
                </span>
              </div>
            </section>

            {/* Os 8 Remédios Naturais da Tradição Adventista de Saúde (Stitch) */}
            <section className="p-5 rounded-2xl bg-surface-container-lowest shadow-sm flex flex-col gap-3.5 border border-slate-200/80">
              <div className="flex items-center gap-2.5 text-primary font-bold text-base">
                <span className="material-symbols-outlined text-[22px] text-tertiary">eco</span>
                <span>Os 8 Remédios Naturais</span>
              </div>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Princípios de estilo de vida da Rede Adventista de Saúde para promover cura integral e longevidade:
              </p>

              <div className="grid grid-cols-2 gap-2 text-xs">
                {remediosNaturais.map((rem) => (
                  <div
                    key={rem.nome}
                    className="p-2.5 rounded-xl bg-surface-container-low flex items-start gap-2 border border-surface-container"
                  >
                    <span className="material-symbols-outlined text-[18px] text-secondary shrink-0 mt-0.5">
                      {rem.icon}
                    </span>
                    <div className="min-w-0">
                      <strong className="block text-primary font-semibold truncate">{rem.nome}</strong>
                      <span className="text-[10px] text-on-surface-variant line-clamp-2">
                        {rem.desc}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
