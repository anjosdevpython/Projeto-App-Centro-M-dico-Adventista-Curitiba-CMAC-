'use client';

import { useState, type FormEvent } from 'react';

import {
  generateDoctorCredentials,
  generatePatientCredentials,
  saveDemoSession,
} from '../../lib/demo/demo-auth';
import type { DemoCredentials, DemoUserRole } from '../../lib/demo/types';

export function RegisterForm({
  onSubmit,
}: {
  onSubmit?: (input: {
    email: string;
    password?: string;
    credentials?: DemoCredentials;
  }) => void | Promise<void>;
}) {
  const [profile, setProfile] = useState<DemoUserRole>('paciente');
  const [identifier, setIdentifier] = useState<string>('382.914.829-00');
  const [password, setPassword] = useState<string>('demo1234');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [createdCredentials, setCreatedCredentials] = useState<DemoCredentials | null>(null);

  function handleProfileSwitch(newProfile: DemoUserRole) {
    setProfile(newProfile);
    if (newProfile === 'medico') {
      setIdentifier('CRM-PR 28.412');
    } else {
      setIdentifier('382.914.829-00');
    }
  }

  function handleLogin(roleToUse = profile) {
    let credentials: DemoCredentials;
    if (roleToUse === 'medico') {
      credentials = generateDoctorCredentials(
        'dr.marcos.vinicius@cmac.demo',
        'Dr. Marcos Vinícius',
        'Cardiologia Clínica',
        'CRM-PR 28.412',
      );
    } else {
      const email = identifier.includes('@') ? identifier : 'carlos.silva@cmac.demo';
      credentials = generatePatientCredentials(email);
    }

    saveDemoSession(credentials);
    setCreatedCredentials(credentials);

    if (onSubmit) {
      void onSubmit({ email: credentials.email, password, credentials });
    }
  }

  function handleFormSubmit(e: FormEvent) {
    e.preventDefault();
    handleLogin(profile);
  }

  const isDoctor = (createdCredentials ? createdCredentials.role : profile) === 'medico';

  if (createdCredentials) {
    return (
      <div className="w-full max-w-[480px] mx-auto px-4 py-6" role="status" aria-live="polite">
        <div className="w-full bg-surface-container-lowest rounded-2xl shadow-md p-6 flex flex-col gap-4 border border-surface-container-high">
          <div className="flex items-center justify-between">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                createdCredentials.role === 'medico'
                  ? 'bg-secondary-fixed text-on-secondary-fixed-variant'
                  : 'bg-tertiary-fixed text-on-tertiary-fixed-variant'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">verified</span>
              {createdCredentials.role === 'medico'
                ? 'Equipe Médica Conectada'
                : 'Paciente Autenticado'}
            </span>
            <span className="text-xs text-outline font-mono">{createdCredentials.protocol}</span>
          </div>

          <div>
            <h2 className="text-xl font-bold text-primary leading-tight">
              Acesso Demonstrativo Liberado!
            </h2>
            <p className="text-sm text-on-surface-variant mt-1">
              Sessão configurada com sucesso para a demonstração da Clínica Adventista de Curitiba.
            </p>
          </div>

          <div className="bg-surface-container-low rounded-xl p-4 flex flex-col gap-2.5 text-sm border border-surface-container">
            <div className="flex justify-between items-baseline">
              <span className="text-outline font-medium">Perfil:</span>
              <strong className="text-primary font-semibold">
                {createdCredentials.role === 'medico'
                  ? 'Corpo Clínico / Médico'
                  : 'Cliente / Paciente'}
              </strong>
            </div>
            <div className="flex justify-between items-baseline">
              <span className="text-outline font-medium">
                {createdCredentials.role === 'medico' ? 'Profissional:' : 'Nome:'}
              </span>
              <span className="text-on-surface font-semibold">{createdCredentials.patientName}</span>
            </div>
            {createdCredentials.role === 'medico' && createdCredentials.crm && (
              <div className="flex justify-between items-baseline">
                <span className="text-outline font-medium">Registro CRM:</span>
                <code className="text-primary font-bold">{createdCredentials.crm}</code>
              </div>
            )}
            <div className="flex justify-between items-baseline">
              <span className="text-outline font-medium">Identificador:</span>
              <code className="text-on-surface font-mono">{createdCredentials.id}</code>
            </div>
            <div className="flex justify-between items-baseline">
              <span className="text-outline font-medium">E-mail:</span>
              <span className="text-on-surface">{createdCredentials.email}</span>
            </div>
            <div className="flex justify-between items-baseline">
              <span className="text-outline font-medium">Ambiente:</span>
              <span className="text-secondary font-semibold text-xs uppercase">
                Simulação SOUL MV • Sem Atendimento Real
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-2.5 mt-2">
            <a
              href={createdCredentials.role === 'medico' ? '/medico' : '/inicio'}
              className="w-full min-h-[48px] rounded-xl bg-primary hover:bg-primary-container text-on-primary font-semibold flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.99] text-center"
            >
              <span>
                {createdCredentials.role === 'medico'
                  ? 'Acessar Agenda do Corpo Clínico'
                  : 'Acessar Portal do Paciente'}
              </span>
              <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
            </a>
            <button
              type="button"
              onClick={() => setCreatedCredentials(null)}
              className="w-full min-h-[44px] rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface text-sm font-semibold transition-colors"
            >
              Alternar para outro perfil
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[480px] mx-auto px-4 py-4 flex flex-col gap-6">
      {/* Header & Brand Presentation (from Stitch) */}
      <header className="flex flex-col items-center text-center pt-2">
        <div className="relative mb-4 flex items-center justify-center">
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCX8qUJ_Hntgs7VSdV3Mq5TOVeB7s1gbfmhuDwL2UA7vDnJddoB0j_Is_HEXxoy6kwnv594jyPUom1R-A_1NwMGP-YGj2RjEVREktz-pVyH_LAxONBlWuRWnF4-CQ0eN7L1iFKqg0CAexzlY3POdWAyBPL8v3E2KGgW9jHvY3yWjc8f7ej9FjAaHMuMrJnQlmns3Kpt6jyne-3pmlH8gcAcNxLDnpLkCVpfS0U-TOToqxj03nwV73_33I9RLtvUhyKLlg"
            alt="Logotipo Clínica Adventista de Curitiba"
            className="w-16 h-16 rounded-2xl object-contain shadow-md mx-auto"
          />
          <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-tertiary-fixed-dim text-tertiary flex items-center justify-center shadow-sm">
            <span className="material-symbols-outlined text-[16px]">health_and_safety</span>
          </div>
        </div>
        <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-surface-container-highest text-primary font-semibold text-xs mb-1">
          <span className="material-symbols-outlined text-[14px]">lock</span>
          Canal Oficial Criptografado
        </span>
        <h1 className="text-2xl sm:text-3xl text-primary font-bold tracking-tight">
          Portal de Atendimento Digital
        </h1>
        <p className="text-sm text-on-surface-variant mt-1 max-w-xs">
          Clínica Adventista de Curitiba • Cuidado que transforma vidas
        </p>
      </header>

      {/* Segmented Profile Selector (Sou Paciente vs Corpo Clínico) */}
      <section aria-label="Seletor de Perfil de Acesso" className="w-full">
        <div role="tablist" aria-label="Perfis de Acesso" className="bg-surface-container p-1 rounded-xl flex items-center shadow-inner gap-1">
          <button
            type="button"
            role="tab"
            id="btn-tab-patient"
            aria-selected={profile === 'paciente'}
            onClick={() => handleProfileSwitch('paciente')}
            className={`flex-1 py-3 px-3 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
              profile === 'paciente'
                ? 'bg-surface-container-lowest text-primary shadow-sm'
                : 'text-on-surface-variant hover:text-primary'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">person</span>
            <span>Sou Paciente</span>
          </button>
          <button
            type="button"
            role="tab"
            id="btn-tab-doctor"
            aria-selected={profile === 'medico'}
            onClick={() => handleProfileSwitch('medico')}
            className={`flex-1 py-3 px-3 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
              profile === 'medico'
                ? 'bg-surface-container-lowest text-primary shadow-sm'
                : 'text-on-surface-variant hover:text-primary'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">stethoscope</span>
            <span>Corpo Clínico</span>
          </button>
        </div>

        {/* Scope Explanation Banner */}
        <div className="mt-2 px-2 flex items-center gap-2 text-on-surface-variant text-xs">
          <span className="material-symbols-outlined text-[16px] text-secondary">info</span>
          <span>
            {profile === 'paciente'
              ? 'Acesso a consultas, laudos digitais e histórico familiar.'
              : 'Acesso à agenda diária de consultas, prontuário e chamada de pacientes.'}
          </span>
        </div>
      </section>

      {/* Main Authentication Card */}
      <main className="w-full bg-surface-container-lowest rounded-2xl shadow-sm p-5 sm:p-6 flex flex-col gap-4 border border-slate-100">
        {/* Doctor ICP Hint */}
        {profile === 'medico' && (
          <div className="bg-surface-container-high rounded-xl p-3 flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-secondary text-on-secondary flex items-center justify-center shrink-0 mt-0.5">
              <span className="material-symbols-outlined text-[18px]">verified</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-primary font-semibold">
                Certificado ICP-Brasil / Nuvem CFM
              </span>
              <span className="text-xs text-on-surface-variant leading-tight">
                Permite assinatura eletrônica de prescrições e prontuário SOAP integrado.
              </span>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleFormSubmit} className="flex flex-col gap-4" noValidate>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm text-on-surface font-semibold" htmlFor="user-identifier">
              {profile === 'medico'
                ? 'CRM / UF ou Matrícula Médica'
                : 'CPF ou Número do Prontuário'}
            </label>
            <div className="relative flex items-center">
              <span className="material-symbols-outlined text-outline absolute left-3.5 text-[22px] pointer-events-none">
                badge
              </span>
              <input
                id="user-identifier"
                name="email"
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder={
                  profile === 'medico'
                    ? 'CRM-PR 28.412 ou Matrícula'
                    : '000.000.000-00 ou Nº Prontuário'
                }
                className="w-full h-12 pl-12 pr-4 bg-surface-container-low rounded-lg text-sm text-on-surface placeholder:text-outline outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary-container transition-all"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label className="text-sm text-on-surface font-semibold" htmlFor="user-password">
                Senha de Acesso
              </label>
              <button
                type="button"
                className="text-xs text-secondary hover:underline"
                onClick={() => alert('Para o modo de demonstração, qualquer senha é válida.')}
              >
                Esqueceu a senha?
              </button>
            </div>
            <div className="relative flex items-center">
              <span className="material-symbols-outlined text-outline absolute left-3.5 text-[22px] pointer-events-none">
                lock
              </span>
              <input
                id="user-password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Digite sua senha cadastrada"
                className="w-full h-12 pl-12 pr-12 bg-surface-container-low rounded-lg text-sm text-on-surface placeholder:text-outline outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary-container transition-all"
              />
              <button
                type="button"
                aria-label="Alternar visualização da senha"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 w-10 h-10 flex items-center justify-center text-outline hover:text-on-surface"
              >
                <span className="material-symbols-outlined text-[20px]">
                  {showPassword ? 'visibility_off' : 'visibility'}
                </span>
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between pt-0.5">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                defaultChecked
                className="w-4 h-4 rounded text-primary-container accent-primary-container cursor-pointer"
              />
              <span className="text-xs text-on-surface-variant">
                Lembrar meus dados neste aparelho
              </span>
            </label>
          </div>

          <button
            type="submit"
            id="btn-submit"
            className="w-full min-h-[48px] rounded-xl bg-primary hover:bg-primary-container text-on-primary font-semibold flex items-center justify-center gap-2 shadow-md active:scale-[0.99] transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">login</span>
            <span>Entrar com Segurança</span>
          </button>
        </form>

        {/* Biometric Quick Access */}
        <div className="flex flex-col items-center pt-1">
          <div className="w-full flex items-center gap-2 my-2">
            <div className="flex-1 h-px bg-surface-container-highest"></div>
            <span className="text-[11px] text-outline uppercase tracking-wider">
              ou toque rápido
            </span>
            <div className="flex-1 h-px bg-surface-container-highest"></div>
          </div>
          <button
            type="button"
            onClick={() => handleLogin(profile)}
            className="w-full min-h-[48px] rounded-xl bg-surface-container-low hover:bg-surface-container text-on-surface text-sm font-medium flex items-center justify-center gap-2 active:scale-[0.99] transition-all shadow-sm cursor-pointer"
          >
            <span className="material-symbols-outlined text-secondary text-[22px]">fingerprint</span>
            <span>Entrar com Biometria / Face ID</span>
          </button>
        </div>
      </main>

      {/* First Time Registration Card (from Stitch) */}
      <section className="w-full bg-surface-container-low rounded-xl p-4 flex items-center justify-between gap-3 shadow-sm border border-slate-100">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-full bg-surface-container-highest text-primary flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[22px]">how_to_reg</span>
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-sm text-primary font-semibold truncate">
              Primeira vez na clínica?
            </span>
            <span className="text-xs text-on-surface-variant truncate">
              Ative seu prontuário digital com seu CPF
            </span>
          </div>
        </div>
        <button
          type="button"
          onClick={() => handleLogin('paciente')}
          className="min-h-[40px] px-3.5 rounded-lg bg-surface-container-lowest hover:bg-surface-container-high text-primary text-xs font-bold shrink-0 shadow-sm transition-colors"
        >
          Cadastrar
        </button>
      </section>

      {/* Support Direct Link */}
      <section className="flex flex-col items-center text-center gap-1">
        <span className="text-xs text-on-surface-variant">Precisa de assistência para acessar?</span>
        <a
          href="tel:4130518000"
          className="inline-flex items-center gap-1.5 text-secondary text-sm font-semibold hover:underline"
        >
          <span className="material-symbols-outlined text-[18px]">phone_in_talk</span>
          <span>Recepção Central: (41) 3051-8000</span>
        </a>
      </section>

      {/* Institutional Compliance Footer */}
      <footer className="pt-2 pb-6 flex flex-col items-center text-center gap-1">
        <div className="flex items-center gap-1.5 text-on-surface-variant text-xs">
          <span className="material-symbols-outlined text-[16px] text-tertiary-fixed-dim">
            verified_user
          </span>
          <span>Conexão Segura SSL 256-bit • Padrão LGPD &amp; CFM</span>
        </div>
        <p className="text-xs text-outline text-center leading-relaxed">
          Hospital e Clínica Adventista de Curitiba.
          <br />
          Excelência médica aliada aos 8 remédios naturais.
        </p>
      </footer>
    </div>
  );
}
