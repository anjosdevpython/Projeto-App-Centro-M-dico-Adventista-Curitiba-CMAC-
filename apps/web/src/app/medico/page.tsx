'use client';

import { useEffect, useState } from 'react';

import { getOrCreateDemoSession } from '../../lib/demo/demo-auth';
import { listDemoAppointments } from '../../lib/demo/demo-service';
import type { DemoAppointment, DemoCredentials } from '../../lib/demo/types';

export default function MedicoPage() {
  const [session, setSession] = useState<DemoCredentials | null>(null);
  const [appointments, setAppointments] = useState<DemoAppointment[]>([]);
  const [activeTab, setActiveTab] = useState<'agenda' | 'fila' | 'prontuario' | 'interconsultas'>('agenda');
  const [activeCallMessage, setActiveCallMessage] = useState<string | null>(null);
  const [prescriptionSent, setPrescriptionSent] = useState<boolean>(false);

  useEffect(() => {
    setSession(getOrCreateDemoSession());
    setAppointments(listDemoAppointments());
  }, []);

  function handleCallPatient(name: string) {
    setActiveCallMessage(`Chamando paciente ${name} para o Consultório 04 no painel de TV da recepção central...`);
    setTimeout(() => setActiveCallMessage(null), 4000);
  }

  function handleSendPrescription() {
    setPrescriptionSent(true);
    setTimeout(() => setPrescriptionSent(false), 5000);
  }

  return (
    <div className="flex flex-col min-h-screen bg-surface pb-12">
      {/* Header from Stitch Doctor view */}
      <header className="sticky top-0 inset-x-0 z-40 bg-primary text-on-primary shadow-sm pt-safe">
        <div className="h-18 px-4 lg:px-8 py-2.5 flex items-center justify-between gap-3 max-w-7xl mx-auto w-full">
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="relative shrink-0">
              <div className="w-11 h-11 rounded-full bg-secondary-container flex items-center justify-center text-primary font-bold">
                <span className="material-symbols-outlined text-[24px]">stethoscope</span>
              </div>
              <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-tertiary-fixed rounded-full ring-2 ring-primary"></span>
            </div>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm md:text-base font-bold text-on-primary truncate">
                  Dr. Marcos Vinícius
                </span>
                <span className="px-2 py-0.5 rounded-full bg-secondary text-on-secondary text-[10px] uppercase font-bold tracking-wider">
                  CRM-PR 28.412
                </span>
              </div>
              <div className="flex items-center gap-2 mt-0.5 text-xs text-surface-container-high">
                <span className="truncate">Cardiologia Clínica</span>
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-outline-variant"></span>
                <span className="inline-flex items-center gap-1 text-tertiary-fixed-dim font-medium">
                  <span className="w-2 h-2 rounded-full bg-tertiary-fixed-dim animate-pulse"></span>
                  Consultório 04 • Ala Médica
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <a
              href="/cadastro"
              title="Alternar para perfil de paciente"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-on-primary text-xs font-semibold transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">swap_horiz</span>
              <span className="hidden sm:inline">Portal do Paciente</span>
            </a>
          </div>
        </div>
      </header>

      {/* Top Context & Sub-navigation Tabs from Stitch */}
      <div className="border-b border-slate-200 bg-surface-container-low">
        <div className="px-4 lg:px-8 py-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 max-w-7xl mx-auto w-full">
          {/* Tabs: Agenda, Fila & Chamada, Prontuário, Interconsultas */}
          <div className="flex items-center gap-1 bg-surface-container p-1 rounded-xl overflow-x-auto">
            <button
              type="button"
              onClick={() => setActiveTab('agenda')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all whitespace-nowrap ${
                activeTab === 'agenda'
                  ? 'bg-surface-container-lowest text-primary shadow-sm'
                  : 'text-on-surface-variant hover:text-primary'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">calendar_today</span>
              <span>Agenda do Turno</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('fila')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all whitespace-nowrap ${
                activeTab === 'fila'
                  ? 'bg-surface-container-lowest text-primary shadow-sm'
                  : 'text-on-surface-variant hover:text-primary'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">groups</span>
              <span>Fila &amp; Chamada</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('prontuario')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all whitespace-nowrap ${
                activeTab === 'prontuario'
                  ? 'bg-surface-container-lowest text-primary shadow-sm'
                  : 'text-on-surface-variant hover:text-primary'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">clinical_notes</span>
              <span>Prontuário PEP</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('interconsultas')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all whitespace-nowrap ${
                activeTab === 'interconsultas'
                  ? 'bg-surface-container-lowest text-primary shadow-sm'
                  : 'text-on-surface-variant hover:text-primary'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">forum</span>
              <span>Interconsultas</span>
            </button>
          </div>

          <div className="flex items-center gap-2 text-xs text-on-surface-variant">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="font-medium">SOUL MV / Tasy Conectado</span>
            <span>•</span>
            <span className="font-semibold text-primary">Sala C-04</span>
          </div>
        </div>
      </div>

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 lg:px-8 py-6 flex flex-col gap-6">
        {activeCallMessage && (
          <div
            role="status"
            className="p-4 rounded-2xl bg-tertiary-fixed text-on-tertiary-fixed-variant text-sm font-bold flex items-center gap-3 shadow-md animate-pulse border border-tertiary-container/20"
          >
            <span className="material-symbols-outlined text-[24px]">notifications_active</span>
            <span>{activeCallMessage}</span>
          </div>
        )}

        {prescriptionSent && (
          <div
            role="status"
            className="p-4 rounded-2xl bg-secondary-fixed text-on-secondary-fixed text-sm font-bold flex items-center gap-3 shadow-md animate-pulse border border-secondary"
          >
            <span className="material-symbols-outlined text-[24px]">verified</span>
            <span>Prescrição Digital assinada com certificado ICP-Brasil e enviada via SMS/WhatsApp à paciente!</span>
          </div>
        )}

        {/* TAB 1: AGENDA DO TURNO (Stitch agenda_do_dia_corpo_cl_nico) */}
        {activeTab === 'agenda' && (
          <div className="flex flex-col gap-6">
            {/* Bento Grid Metrics on Desktop (4 columns) & Mobile (2 columns) */}
            <section aria-label="Resumo do Turno Clínico" className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <h2 className="text-lg text-primary font-bold">Visão do Turno</h2>
                <span className="text-xs text-on-surface-variant bg-surface-container px-3 py-1 rounded-full font-medium">
                  Segunda-feira • Escala Ambulatorial
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                {/* Total Agendados */}
                <div className="col-span-2 md:col-span-1 p-4 rounded-2xl bg-surface-container-lowest shadow-sm flex flex-col justify-between border border-slate-200/80">
                  <div className="flex items-center justify-between text-outline text-xs">
                    <span className="font-medium">Total de Pacientes</span>
                    <span className="material-symbols-outlined text-[22px] text-primary">event_available</span>
                  </div>
                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-primary leading-none">
                      {Math.max(appointments.length, 8)}
                    </span>
                    <span className="text-xs text-outline font-medium">agendados hoje</span>
                  </div>
                  <p className="text-[11px] text-on-surface-variant mt-1">8 Manhã · 6 Tarde</p>
                </div>

                {/* Atendidos */}
                <div className="p-4 rounded-2xl bg-surface-container-lowest shadow-sm flex flex-col justify-between border border-slate-200/80">
                  <div className="flex items-center justify-between text-outline text-xs">
                    <span className="font-medium">Atendidos</span>
                    <span className="material-symbols-outlined text-[22px] text-tertiary-fixed-dim">
                      check_circle
                    </span>
                  </div>
                  <div className="mt-3 flex items-baseline justify-between">
                    <span className="text-3xl font-bold text-on-surface">3</span>
                    <span className="text-xs text-tertiary font-bold px-2 py-0.5 rounded-full bg-emerald-50">
                      Concluídos
                    </span>
                  </div>
                  <p className="text-[11px] text-on-surface-variant mt-1">Prontuários liberados</p>
                </div>

                {/* Na Recepção */}
                <div className="p-4 rounded-2xl bg-surface-container-lowest shadow-sm flex flex-col justify-between border border-slate-200/80">
                  <div className="flex items-center justify-between text-outline text-xs">
                    <span className="font-medium">Na Recepção</span>
                    <span className="material-symbols-outlined text-[22px] text-secondary">
                      airline_seat_recline_normal
                    </span>
                  </div>
                  <div className="mt-3 flex items-baseline justify-between">
                    <span className="text-3xl font-bold text-secondary">2</span>
                    <span className="text-xs text-secondary font-bold px-2 py-0.5 rounded-full bg-sky-50">
                      Aguardando
                    </span>
                  </div>
                  <p className="text-[11px] text-on-surface-variant mt-1">Triagem realizada</p>
                </div>

                {/* Tempo Médio */}
                <div className="p-4 rounded-2xl bg-surface-container-lowest shadow-sm flex flex-col justify-between border border-slate-200/80">
                  <div className="flex items-center justify-between text-outline text-xs">
                    <span className="font-medium">Tempo Médio</span>
                    <span className="material-symbols-outlined text-[22px] text-secondary">pace</span>
                  </div>
                  <div className="mt-3 flex items-baseline gap-1.5">
                    <span className="text-3xl font-bold text-primary">20</span>
                    <span className="text-xs text-outline font-medium">min / consulta</span>
                  </div>
                  <p className="text-[11px] text-on-surface-variant mt-1">Dentro da meta clínica</p>
                </div>
              </div>
            </section>

            {/* Fila de Pacientes */}
            <section className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <h2 className="text-lg text-primary font-bold">Pacientes Agendados no Turno</h2>
                <span className="text-xs text-outline font-medium">Ordem de Horário &amp; Chegada</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {appointments.map((apt, index) => (
                  <div
                    key={apt.id}
                    className="p-4 rounded-2xl bg-surface-container-lowest shadow-sm flex flex-col justify-between gap-3 border border-slate-200/80 hover:border-secondary transition-all"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 rounded-xl bg-surface-container text-primary text-xs font-bold flex items-center justify-center shrink-0">
                          {index + 1}
                        </span>
                        <div>
                          <strong className="text-sm font-bold text-primary block">{apt.patientEmail}</strong>
                          <span className="text-xs text-on-surface-variant">{apt.specialtyName}</span>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed text-xs font-bold">
                        {new Date(apt.startsAt).toLocaleTimeString('pt-BR', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs text-outline pt-2 border-t border-slate-100">
                      <span>Protocolo: <code className="font-mono text-primary font-semibold">{apt.protocol}</code></span>
                      <span className="text-tertiary font-semibold flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-tertiary-fixed inline-block"></span>
                        Recepção OK
                      </span>
                    </div>

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => handleCallPatient(apt.patientEmail)}
                        className="flex-1 h-9 rounded-xl bg-primary hover:bg-primary-container text-on-primary text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[16px]">campaign</span>
                        <span>Chamar</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveTab('prontuario')}
                        className="h-9 px-3.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-primary text-xs font-semibold flex items-center justify-center gap-1 transition-colors cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[16px]">clinical_notes</span>
                        <span>Abrir PEP</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {/* TAB 2: FILA & CHAMADA (Stitch fila_de_espera_e_chamada_consult_rio) */}
        {activeTab === 'fila' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-8 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg text-primary font-bold">Aguardando no Salão / Recepção</h2>
                <span className="text-xs text-secondary font-semibold">Painel TV Sincronizado</span>
              </div>

              {/* Paciente 1 em Destaque */}
              <div className="p-5 rounded-2xl bg-surface-container-lowest shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 border-2 border-secondary/40">
                <div className="flex items-start gap-3.5">
                  <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center font-bold text-sm shrink-0">
                    C-042
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-primary">Maria de Lourdes Santos</h3>
                      <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-bold">
                        Prioridade Idoso (62 anos)
                      </span>
                    </div>
                    <p className="text-xs text-on-surface-variant mt-0.5">
                      Chegada às 08:05 • Espera: 15 min • Triagem PA 138/86 mmHg
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleCallPatient('Maria de Lourdes Santos (Senha C-042)')}
                    className="h-10 px-4 rounded-xl bg-primary hover:bg-primary-container text-on-primary text-xs font-bold flex items-center gap-2 shadow-sm cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px]">campaign</span>
                    <span>Chamar no Telão</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('prontuario')}
                    className="h-10 px-3 rounded-xl bg-secondary text-white text-xs font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <span>Iniciar Consulta</span>
                  </button>
                </div>
              </div>

              {/* Paciente 2 */}
              <div className="p-4 rounded-2xl bg-surface-container-lowest shadow-sm flex items-center justify-between gap-3 border border-slate-200/80">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-surface-container text-primary flex items-center justify-center font-bold text-xs shrink-0">
                    C-043
                  </div>
                  <div>
                    <strong className="text-sm text-primary block">Roberto Albuquerque</strong>
                    <span className="text-xs text-on-surface-variant">Chegada às 08:18 • Convênio Unimed Curitiba</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleCallPatient('Roberto Albuquerque (Senha C-043)')}
                  className="h-9 px-3.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-primary text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">campaign</span>
                  <span>Chamar</span>
                </button>
              </div>
            </div>

            <div className="lg:col-span-4 p-5 rounded-2xl bg-surface-container-lowest shadow-sm flex flex-col gap-3 border border-slate-200/80">
              <div className="flex items-center gap-2 text-primary font-bold text-sm">
                <span className="material-symbols-outlined text-[20px] text-secondary">speed</span>
                <span>Metas de Pontualidade</span>
              </div>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                O tempo médio de espera no saguão é monitorado pelo painel central para garantir acolhimento humanizado e sem aglomerações.
              </p>
              <div className="p-3 rounded-xl bg-emerald-50 text-emerald-800 text-xs flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">check_circle</span>
                <span className="font-semibold">Índice de Pontualidade hoje: 94%</span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: PRONTUÁRIO ELETRÔNICO PEP (Stitch prontu_rio_e_atendimento_cl_nico) */}
        {activeTab === 'prontuario' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Coluna do Paciente & SOAP: 8 cols */}
            <div className="lg:col-span-8 flex flex-col gap-5">
              {/* Header do Paciente Ativo */}
              <div className="p-5 rounded-2xl bg-surface-container-lowest shadow-sm flex items-center justify-between gap-4 border border-slate-200/80">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-primary text-secondary-fixed flex items-center justify-center font-bold text-xl shrink-0">
                    ML
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-bold text-primary">Maria de Lourdes Santos</h3>
                      <span className="px-2.5 py-0.5 rounded-full bg-surface-container text-xs font-bold text-secondary">
                        62 anos • Feminino
                      </span>
                    </div>
                    <p className="text-xs text-on-surface-variant mt-0.5">
                      Prontuário SOUL MV: <strong>048291</strong> • Convênio Unimed Curitiba Nacional
                    </p>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold shrink-0">
                  Em Atendimento
                </span>
              </div>

              {/* Sinais Vitais da Triagem */}
              <div className="p-5 rounded-2xl bg-surface-container-lowest shadow-sm flex flex-col gap-3 border border-slate-200/80">
                <h4 className="text-sm font-bold text-primary flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px] text-secondary">vital_signs</span>
                  <span>Triagem de Enfermagem (Hoje às 08:15)</span>
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3 rounded-xl bg-surface-container-low text-xs">
                    <span className="text-outline block">Pressão Arterial</span>
                    <strong className="text-base text-primary font-bold">138/86 mmHg</strong>
                  </div>
                  <div className="p-3 rounded-xl bg-surface-container-low text-xs">
                    <span className="text-outline block">Freq. Cardíaca</span>
                    <strong className="text-base text-primary font-bold">78 bpm</strong>
                  </div>
                  <div className="p-3 rounded-xl bg-surface-container-low text-xs">
                    <span className="text-outline block">Saturação SpO2</span>
                    <strong className="text-base text-emerald-700 font-bold">98%</strong>
                  </div>
                  <div className="p-3 rounded-xl bg-surface-container-low text-xs">
                    <span className="text-outline block">Glicemia Capilar</span>
                    <strong className="text-base text-primary font-bold">104 mg/dL</strong>
                  </div>
                </div>
              </div>

              {/* Anamnese Estruturada (SOAP) */}
              <div className="p-5 rounded-2xl bg-surface-container-lowest shadow-sm flex flex-col gap-3 border border-slate-200/80">
                <h4 className="text-sm font-bold text-primary flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px] text-secondary">description</span>
                  <span>Anamnese &amp; Queixa Atual (SOAP)</span>
                </h4>
                <div className="space-y-3 text-xs leading-relaxed">
                  <div className="p-3.5 rounded-xl bg-surface-container-low border border-surface-container">
                    <strong className="text-primary block font-semibold mb-1">Subjetivo (S):</strong>
                    <p className="text-on-surface-variant">
                      Paciente relata episódios esporádicos de palpitação aos esforços moderados nos últimos 20 dias, sem síncope ou dor precordial típica. Nega dispneia paroxística noturna.
                    </p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-surface-container-low border border-surface-container">
                    <strong className="text-primary block font-semibold mb-1">Avaliação &amp; CID-10:</strong>
                    <p className="text-on-surface-variant">
                      I10 - Hipertensão essencial primária • R00.2 - Palpitações. Exames laboratoriais com perfil lipídico controlado.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Painel de Prescrição & Condutas: 4 cols */}
            <div className="lg:col-span-4 flex flex-col gap-4">
              <div className="p-5 rounded-2xl bg-surface-container-lowest shadow-sm flex flex-col gap-4 border border-slate-200/80">
                <h4 className="text-sm font-bold text-primary flex items-center gap-2">
                  <span className="material-symbols-outlined text-[20px] text-secondary">medication</span>
                  <span>Prescrição Digital &amp; Conduta</span>
                </h4>

                <div className="space-y-2 text-xs">
                  <div className="p-2.5 rounded-lg bg-surface-container-low border border-surface-container">
                    <strong className="text-primary block">Losartana Potássica 50mg</strong>
                    <span className="text-outline">1 cp via oral pela manhã (uso contínuo)</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-surface-container-low border border-surface-container">
                    <strong className="text-primary block">Ecocardiograma Transtorácico</strong>
                    <span className="text-outline">Pedido de exame diagnóstico ambulatorial</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleSendPrescription}
                  className="w-full h-11 rounded-xl bg-secondary hover:bg-secondary/90 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">signature</span>
                  <span>Assinar e Enviar ao Paciente</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    alert('Consulta concluída e sincronizada com o prontuário eletrônico do paciente.');
                    setActiveTab('agenda');
                  }}
                  className="w-full h-11 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">check_circle</span>
                  <span>Finalizar Atendimento</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: INTERCONSULTAS (Stitch interconsultas_e_discuss_o_cl_nica_m_dico) */}
        {activeTab === 'interconsultas' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-8 flex flex-col gap-4">
              <h2 className="text-lg text-primary font-bold">Discussões Clínicas &amp; Pareceres</h2>

              <div className="p-5 rounded-2xl bg-surface-container-lowest shadow-sm flex flex-col gap-3 border border-slate-200/80">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                  <strong className="text-sm text-primary">Parecer de Ecocardiografia</strong>
                  <span className="text-xs text-secondary font-semibold">Dra. Juliana Prado</span>
                </div>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  Avaliação da paciente Maria de Lourdes Santos: fração de ejeção preservada (64%), sem déficit segmentar de contratilidade. Função diastólica grau I (alteração de relaxamento).
                </p>
                <div className="pt-2 flex justify-end">
                  <span className="text-[11px] text-outline font-mono">Recebido hoje às 08:40</span>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-surface-container-lowest shadow-sm flex flex-col gap-3 border border-slate-200/80">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                  <strong className="text-sm text-primary">Alerta da Enfermagem • Recepção</strong>
                  <span className="text-xs text-outline">Enf. Chefe Amanda</span>
                </div>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  Paciente Roberto Albuquerque solicitou encaixe para renovação de receita de uso contínuo. Prontuário já anexado à fila de espera.
                </p>
              </div>
            </div>

            <div className="lg:col-span-4 p-5 rounded-2xl bg-surface-container-lowest shadow-sm flex flex-col gap-3 border border-slate-200/80">
              <h4 className="text-sm font-bold text-primary">Corpo Clínico Conectado</h4>
              <p className="text-xs text-on-surface-variant">
                Comunicação segura e criptografada entre médicos, cardiologistas e equipe multidisciplinar da Clínica Adventista de Curitiba.
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
