export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-surface">
      <header className="sticky top-0 w-full z-40 bg-primary-container text-on-primary shadow-sm">
        <div className="h-16 px-4 flex items-center justify-between max-w-xl mx-auto">
          <div className="flex items-center gap-2">
            <img
              alt="Clínica Adventista"
              className="w-8 h-8 rounded-lg object-contain shadow-sm bg-white/10 p-0.5"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDrk3vT9w5PgltHzhH3M6CDRfoi4uKJJeeX4UiFhgKiEkObRjBYPJ4qSt6HxxPdEa2zxCEG8-_AhLPoWEm0A8OkaU7BNU2zKTx6R_1hoeCJtggc67-PlNJ37bK1fQ5F3_1juA2_C-WxnMGHzQ_Ga1nkWlz6WhWcLC3rz2HUEghccWwhaHGoC3WadFBUCR0JH1da8X4N51WAm8bTthLprdHNpKLCkq2RieoYLMl93gjPR4nR9Jq48PTx_To2hquGOnRKpw"
            />
            <div className="flex flex-col">
              <span className="font-bold text-sm text-surface-container-lowest leading-tight">
                Clínica Adventista
              </span>
              <span className="text-xs text-primary-fixed-dim uppercase tracking-wider">
                Curitiba • Autoatendimento
              </span>
            </div>
          </div>
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-secondary text-on-secondary text-xs font-semibold">
            <span className="material-symbols-outlined text-[14px]">verified_user</span>
            Ambiente Seguro
          </span>
        </div>
      </header>

      <main className="flex-1 w-full max-w-xl mx-auto px-4 py-8 flex flex-col gap-6 items-center text-center">
        <div className="relative mb-2">
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCX8qUJ_Hntgs7VSdV3Mq5TOVeB7s1gbfmhuDwL2UA7vDnJddoB0j_Is_HEXxoy6kwnv594jyPUom1R-A_1NwMGP-YGj2RjEVREktz-pVyH_LAxONBlWuRWnF4-CQ0eN7L1iFKqg0CAexzlY3POdWAyBPL8v3E2KGgW9jHvY3yWjc8f7ej9FjAaHMuMrJnQlmns3Kpt6jyne-3pmlH8gcAcNxLDnpLkCVpfS0U-TOToqxj03nwV73_33I9RLtvUhyKLlg"
            alt="Logotipo Clínica Adventista"
            className="w-20 h-20 rounded-2xl object-contain shadow-md mx-auto"
          />
          <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-tertiary-fixed-dim text-tertiary flex items-center justify-center shadow-sm">
            <span className="material-symbols-outlined text-[18px]">health_and_safety</span>
          </div>
        </div>

        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-highest text-primary font-semibold text-xs mb-2">
            <span className="material-symbols-outlined text-[14px]">lock</span>
            Canal Oficial Criptografado
          </span>
          <h1 className="text-3xl text-primary font-bold tracking-tight">
            Portal de Atendimento Digital
          </h1>
          <p className="text-sm text-on-surface-variant mt-1.5 max-w-md mx-auto">
            Clínica Adventista de Curitiba • Cuidado que transforma vidas. Autoatendimento
            administrativo e gestão de consultas.
          </p>
        </div>

        {/* Seleção de Acesso Rápido */}
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-3.5 mt-2">
          <a
            href="/cadastro"
            className="p-5 rounded-2xl bg-gradient-to-br from-secondary to-primary-container text-on-primary shadow-sm hover:shadow-md transition-all active:scale-[0.98] flex flex-col items-center text-center gap-2"
          >
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center text-white">
              <span className="material-symbols-outlined text-[28px]">person</span>
            </div>
            <strong className="text-lg">Acesso do Paciente</strong>
            <span className="text-xs text-surface-container-high">
              Agende consultas, exames e consulte protocolos
            </span>
          </a>

          <a
            href="/medico"
            className="p-5 rounded-2xl bg-surface-container-lowest text-primary shadow-sm hover:shadow-md transition-all active:scale-[0.98] flex flex-col items-center text-center gap-2 border border-slate-200"
          >
            <div className="w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center text-secondary">
              <span className="material-symbols-outlined text-[28px]">stethoscope</span>
            </div>
            <strong className="text-lg">Corpo Clínico</strong>
            <span className="text-xs text-on-surface-variant">
              Agenda do dia, fila de espera e chamada de consultório
            </span>
          </a>
        </div>

        <a
          href="/cadastro"
          className="w-full min-h-[50px] rounded-xl bg-primary hover:bg-primary-container text-on-primary font-bold flex items-center justify-center gap-2 shadow-md transition-all text-sm mt-2"
        >
          <span>Entrar no Sistema</span>
          <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
        </a>
      </main>

      <footer className="py-6 text-center text-xs text-outline border-t border-slate-200">
        Hospital e Clínica Adventista de Curitiba • Rede Adventista de Saúde
      </footer>
    </div>
  );
}
