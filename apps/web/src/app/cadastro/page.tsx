import { RegisterForm } from '../../features/auth/register-form';

export default function RegisterPage() {
  return (
    <div className="flex flex-col min-h-screen bg-surface">
      <header className="sticky top-0 w-full z-40 bg-primary-container text-on-primary shadow-sm">
        <div className="h-16 px-4 flex items-center justify-between max-w-xl mx-auto">
          <div className="flex items-center gap-2">
            <a
              href="/"
              aria-label="Voltar para a página inicial"
              className="w-10 h-10 flex items-center justify-center rounded-lg text-on-primary hover:bg-white/10 transition-colors"
            >
              <span className="material-symbols-outlined text-[24px]">arrow_back</span>
            </a>
            <div className="flex flex-col">
              <span className="font-bold text-base text-on-primary leading-tight">
                Acesso Seguro
              </span>
              <span className="text-xs text-primary-fixed-dim uppercase tracking-wider">
                Clínica Adventista de Curitiba
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-secondary text-on-secondary text-xs font-semibold">
              <span className="material-symbols-outlined text-[14px]">verified_user</span>
              Ambiente Seguro
            </span>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full flex flex-col justify-center">
        <RegisterForm />
      </main>
    </div>
  );
}
