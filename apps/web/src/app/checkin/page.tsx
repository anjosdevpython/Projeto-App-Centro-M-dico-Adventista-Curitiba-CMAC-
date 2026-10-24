'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function CheckinPage() {
  const [hasNotified, setHasNotified] = useState(false);
  const [isNotifying, setIsNotifying] = useState(false);

  function handleNotifyArrival() {
    setIsNotifying(true);
    setTimeout(() => {
      setIsNotifying(false);
      setHasNotified(true);
    }, 1200);
  }

  return (
    <div className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 py-6 pb-24 md:pb-12 space-y-6">
      {/* Top Banner de Localização */}
      <div className="flex items-center justify-between bg-surface-container-low px-4 py-3 rounded-2xl border border-slate-100 flex-wrap gap-2">
        <div className="flex items-center gap-2 text-secondary">
          <span className="material-symbols-outlined text-[20px]">domain</span>
          <span className="text-xs sm:text-sm font-semibold">Unidade Curitiba - Juvevê</span>
        </div>
        <div className="flex items-center gap-1.5 bg-tertiary-fixed text-on-tertiary-fixed px-3 py-1 rounded-full text-xs font-semibold">
          <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
          <span>RECEPÇÃO DIGITAL INTEGRADA</span>
        </div>
      </div>

      {/* Senha Digital de Chamada (Destaque Principal) */}
      <div className="relative overflow-hidden bg-primary-container text-on-primary rounded-3xl p-6 sm:p-8 shadow-md flex flex-col items-center text-center">
        <div className="absolute -top-12 -right-12 w-40 h-40 bg-secondary/20 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-36 h-36 bg-secondary-container/20 rounded-full blur-xl pointer-events-none" />

        <div className="flex items-center gap-1.5 bg-primary/60 text-secondary-fixed px-3.5 py-1 rounded-full text-xs font-semibold mb-3">
          <span className="material-symbols-outlined text-[16px]">tv</span>
          <span>Painel TV • Recepção Central</span>
        </div>

        <span className="text-xs sm:text-sm font-semibold tracking-wider uppercase text-on-primary-container">
          Sua Senha de Atendimento
        </span>

        <div className="text-5xl sm:text-6xl font-extrabold tracking-tight text-white my-3 select-all drop-shadow-sm">
          C-042
        </div>

        <p className="text-xs sm:text-sm text-on-primary-container max-w-md">
          Prioridade Normal • Chamada por voz e sinal visual nos monitores da Ala B.
        </p>
      </div>

      {/* Dados da Consulta Médica Agendada */}
      <div className="bg-surface-container-lowest p-5 sm:p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col gap-4">
        <div className="flex items-start gap-4">
          <img
            className="w-14 h-14 rounded-full object-cover shrink-0 bg-surface-container-high border-2 border-secondary/20"
            alt="Dr. Marcos Vinícius"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuB6oEGGfsdak6HYZyP2uwPpiqpRQPzTep61azXHWStmZpImDKHku2-adUyPLjnxHOm6pa5S6o_wRYZ_Rkphh_SXTn9rCLrOrNGWV-DdzWUP-_Qbcg8c2dgAkEOvmSZ34e3aHqkn6hDNQ5ebn7GcGCXdHKb4HOEK0e0Q-_lbUfXKiXJpOf14Z1Ij_O02Yg7OI3_8uSoDN4yqx6ykkgF9IvIMbGmFyeT79lYlgcC8NDk"
          />
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs text-secondary font-semibold">Cardiologia Clínica</span>
              <span className="w-1 h-1 rounded-full bg-slate-300" />
              <span className="text-xs text-on-surface-variant">Consulta Eletiva</span>
            </div>
            <h3 className="font-bold text-base sm:text-lg text-primary truncate mt-0.5">
              Dr. Marcos Vinícius
            </h3>
            <span className="text-xs text-on-surface-variant">CRM-PR 28.412 • RQE 19.340</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-1">
          <div className="bg-surface-container-low p-3.5 rounded-xl flex flex-col border border-slate-100">
            <div className="flex items-center gap-1 text-on-surface-variant text-xs mb-1">
              <span className="material-symbols-outlined text-[16px]">schedule</span>
              <span>Horário Previsto</span>
            </div>
            <span className="font-bold text-lg sm:text-xl text-primary">10:00</span>
            <span className="text-xs text-secondary font-medium">Em atendimento em instantes</span>
          </div>
          <div className="bg-surface-container-low p-3.5 rounded-xl flex flex-col border border-slate-100">
            <div className="flex items-center gap-1 text-on-surface-variant text-xs mb-1">
              <span className="material-symbols-outlined text-[16px]">meeting_room</span>
              <span>Local</span>
            </div>
            <span className="font-bold text-lg sm:text-xl text-on-surface">Consultório 04</span>
            <span className="text-xs text-on-surface-variant">Ala B • 2º Andar</span>
          </div>
        </div>
      </div>

      {/* Etapas de Validação do Check-in Digital (3 de 3 Prontos) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h4 className="font-bold text-sm text-primary">Etapas do Check-in Digital</h4>
          <span className="text-xs font-semibold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
            3 de 3 Concluídas
          </span>
        </div>

        <div className="grid grid-cols-1 gap-2.5">
          <div className="bg-surface-container-lowest p-4 rounded-xl shadow-sm border border-slate-100 flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5">
              <span className="material-symbols-outlined text-[18px]">check</span>
            </div>
            <div className="flex flex-col flex-1 min-w-0">
              <div className="flex items-baseline justify-between gap-2">
                <span className="text-sm font-bold text-on-surface truncate">Convênio Bradesco Saúde</span>
                <span className="text-xs text-emerald-700 font-semibold shrink-0">Elegibilidade Confirmada</span>
              </div>
              <p className="text-xs text-on-surface-variant mt-0.5">
                Top Nacional QP • Token Eletrônico <span className="font-mono text-on-surface font-semibold">#8921A</span>
              </p>
            </div>
          </div>

          <div className="bg-surface-container-lowest p-4 rounded-xl shadow-sm border border-slate-100 flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5">
              <span className="material-symbols-outlined text-[18px]">check</span>
            </div>
            <div className="flex flex-col flex-1 min-w-0">
              <div className="flex items-baseline justify-between gap-2">
                <span className="text-sm font-bold text-on-surface truncate">Documento Oficial com Foto</span>
                <span className="text-xs text-emerald-700 font-semibold shrink-0">RG / CNH Validado</span>
              </div>
              <p className="text-xs text-on-surface-variant mt-0.5">
                Identidade autenticada e conferida digitalmente com biometria facial
              </p>
            </div>
          </div>

          <div className="bg-surface-container-lowest p-4 rounded-xl shadow-sm border border-slate-100 flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5">
              <span className="material-symbols-outlined text-[18px]">check</span>
            </div>
            <div className="flex flex-col flex-1 min-w-0">
              <div className="flex items-baseline justify-between gap-2">
                <span className="text-sm font-bold text-on-surface truncate">Acolhimento Pré-Consulta</span>
                <span className="text-xs text-emerald-700 font-semibold shrink-0">Aguardando na Ala B</span>
              </div>
              <p className="text-xs text-on-surface-variant mt-0.5">
                Triagem de sinais vitais realizada na recepção • Sem sintomas respiratórios agudos
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Orientações de Acesso */}
      <div className="bg-surface-container p-4 sm:p-5 rounded-2xl flex items-start gap-3.5 border border-slate-200">
        <div className="w-10 h-10 rounded-full bg-secondary text-on-secondary flex items-center justify-center shrink-0 mt-0.5">
          <span className="material-symbols-outlined text-[22px]">stairs</span>
        </div>
        <div className="space-y-1">
          <h4 className="font-bold text-sm text-on-surface">Orientações de Acesso</h4>
          <p className="text-xs text-on-surface-variant leading-relaxed">
            Dirija-se à <strong>Sala de Espera da Ala B (2º Andar)</strong>. Utilize o elevador principal da recepção. Seu nome e senha aparecerão no televisor quando o <strong>Dr. Marcos Vinícius</strong> chamar.
          </p>
        </div>
      </div>

      {/* Ações do Paciente */}
      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <button
          onClick={handleNotifyArrival}
          disabled={hasNotified || isNotifying}
          className={`flex-1 h-12 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-sm transition-all ${
            hasNotified
              ? 'bg-emerald-700 text-white'
              : 'bg-primary text-on-primary hover:bg-primary-container active:scale-[0.99]'
          }`}
        >
          <span className="material-symbols-outlined text-[20px]">
            {hasNotified ? 'done_all' : isNotifying ? 'sync' : 'notifications_active'}
          </span>
          <span>
            {hasNotified
              ? 'Recepção e Médico Notificados!'
              : isNotifying
              ? 'Notificando Guichê...'
              : 'Notificar Recepção que Cheguei'}
          </span>
        </button>

        <Link
          href="/agendamentos"
          className="h-12 px-5 rounded-xl bg-surface-container-lowest text-on-surface hover:bg-surface-container font-semibold text-sm flex items-center justify-center gap-2 border border-slate-200 shadow-sm"
        >
          <span className="material-symbols-outlined text-[18px] text-secondary">event_note</span>
          <span>Meus Agendamentos</span>
        </Link>
      </div>

      {/* Alerta de Emergência Obrigatório */}
      <div className="bg-error-container/30 border border-error/20 p-4 rounded-xl flex items-start gap-2.5 text-xs text-on-surface">
        <span className="material-symbols-outlined text-error text-[20px] shrink-0 mt-0.5">emergency</span>
        <p className="leading-relaxed">
          <strong>Aviso Clínico Obrigatório:</strong> Este canal destina-se ao acompanhamento presencial de consultas ambulatoriais eletivas. Em situações de emergência (dor precordial súbita, perda de consciência ou falta de ar intensa), dirija-se imediatamente à emergência mais próxima ou acione o <strong>SAMU 192</strong>.
        </p>
      </div>
    </div>
  );
}
