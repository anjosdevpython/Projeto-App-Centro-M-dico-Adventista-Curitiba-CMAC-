'use client';

import { useState } from 'react';

import { getOrCreateDemoSession } from '../../lib/demo/demo-auth';
import { bookDemoAppointment } from '../../lib/demo/demo-service';
import type { DemoAppointment } from '../../lib/demo/types';

export default function AgendarPage() {
  const [channel, setChannel] = useState<'presencial' | 'teleconsulta'>('presencial');
  const [serviceType, setServiceType] = useState<'consulta' | 'exame'>('consulta');
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('Cardiologia');
  const [selectedUnit, setSelectedUnit] = useState<string>('Unidade Curitiba (Juvevê)');
  const [selectedSlotTime, setSelectedSlotTime] = useState<string>('10:45');
  const [paymentOption, setPaymentOption] = useState<'unimed' | 'particular'>('unimed');
  const [bookedAppointment, setBookedAppointment] = useState<DemoAppointment | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [doctorModalOpen, setDoctorModalOpen] = useState<boolean>(false);
  const [selectedShift, setSelectedShift] = useState<'todos' | 'manha' | 'tarde'>('todos');

  function handleConfirmBooking() {
    setIsSubmitting(true);
    const session = getOrCreateDemoSession();
    try {
      const apt = bookDemoAppointment({
        slotId: 'slot-c1',
        patientEmail: session.email,
      });
      setBookedAppointment(apt);
    } finally {
      setIsSubmitting(false);
    }
  }

  if (bookedAppointment) {
    return (
      <div className="flex flex-col min-h-screen bg-background pb-12">
        <header className="sticky top-0 inset-x-0 z-40 bg-primary-container text-on-primary shadow-md">
          <div className="h-16 px-4 lg:px-8 flex items-center justify-between max-w-7xl mx-auto w-full">
            <div className="flex items-center gap-2">
              <a
                href="/inicio"
                className="w-10 h-10 flex items-center justify-center rounded-lg text-on-primary hover:bg-white/10"
              >
                <span className="material-symbols-outlined text-[24px]">arrow_back</span>
              </a>
              <span className="font-bold text-base text-surface-container-lowest">
                Comprovante de Agendamento
              </span>
            </div>
            <span className="text-xs px-3 py-1 rounded-full bg-tertiary-fixed text-on-tertiary-fixed-variant font-bold">
              SOUL MV Confirmado
            </span>
          </div>
        </header>

        <main className="flex-1 w-full max-w-2xl mx-auto px-4 py-8 flex flex-col gap-5">
          <div className="bg-surface-container-lowest rounded-2xl shadow-md p-6 md:p-8 flex flex-col gap-5 border border-slate-200/80" role="status" aria-live="polite">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-tertiary-fixed text-on-tertiary-fixed-variant flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[32px]">check_circle</span>
              </div>
              <div className="min-w-0">
                <span className="text-xs text-tertiary font-bold uppercase tracking-wider block">
                  Agendamento Concluído com Sucesso
                </span>
                <h1 className="text-xl md:text-2xl font-bold text-primary">
                  Vaga Reservada e Integrada ao Prontuário
                </h1>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-surface-container-low flex flex-col gap-2.5 text-xs md:text-sm border border-surface-container">
              <div className="flex justify-between items-baseline">
                <span className="text-outline text-xs uppercase font-medium">Protocolo MV:</span>
                <code className="text-primary font-bold text-base">{bookedAppointment.protocol}</code>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="text-outline text-xs uppercase font-medium">Especialidade:</span>
                <strong className="text-on-surface">{selectedSpecialty}</strong>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="text-outline text-xs uppercase font-medium">Profissional:</span>
                <span className="text-on-surface">Dra. Juliana Prado Mendes (CRM-PR 31.904)</span>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="text-outline text-xs uppercase font-medium">Data e Horário:</span>
                <span className="text-on-surface font-semibold">Amanhã às {selectedSlotTime}</span>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="text-outline text-xs uppercase font-medium">Local:</span>
                <span className="text-on-surface">{selectedUnit} • Sala 204</span>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="text-outline text-xs uppercase font-medium">Convênio:</span>
                <span className="text-secondary font-semibold">
                  {paymentOption === 'unimed' ? 'Unimed Curitiba (Autorizado)' : 'Particular (Tabela Humanizada)'}
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mt-2">
              <a
                href="/agendamentos"
                className="flex-1 min-h-[48px] rounded-xl bg-primary hover:bg-primary-container text-on-primary font-semibold flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.99] text-center"
              >
                <span>Ver em Minhas Consultas</span>
                <span className="material-symbols-outlined text-[20px]">event_note</span>
              </a>
              <a
                href="/inicio"
                className="min-h-[48px] px-6 rounded-xl bg-surface-container hover:bg-surface-container-high text-primary font-semibold flex items-center justify-center transition-colors text-center text-sm"
              >
                Voltar ao Início
              </a>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background pb-12">
      {/* Top Header from Stitch */}
      <header className="sticky top-0 inset-x-0 z-40 bg-primary-container text-on-primary shadow-md">
        <div className="h-16 px-4 lg:px-8 flex items-center justify-between max-w-7xl mx-auto w-full">
          <div className="flex items-center gap-3">
            <a
              href="/inicio"
              className="w-9 h-9 flex items-center justify-center rounded-lg text-on-primary hover:bg-white/10"
            >
              <span className="material-symbols-outlined text-[22px]">arrow_back</span>
            </a>
            <div className="flex flex-col">
              <span className="font-bold text-sm text-surface-container-lowest leading-tight">
                Clínica Adventista
              </span>
              <span className="text-xs text-surface-container-low font-normal">
                Agendar Consulta ou Exame
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <a
              href="/ajuda"
              className="w-9 h-9 flex items-center justify-center rounded-lg text-surface-container-lowest hover:bg-white/10"
            >
              <span className="material-symbols-outlined text-[20px]">contact_support</span>
            </a>
          </div>
        </div>
      </header>

      {/* Stepper Linear Acessível (4 Passos do Stitch) */}
      <section className="w-full bg-surface-container-lowest px-4 lg:px-8 py-4 shadow-sm border-b border-slate-100">
        <div className="grid grid-cols-4 relative max-w-3xl mx-auto">
          <div
            aria-hidden="true"
            className="absolute top-5 left-10 right-10 h-0.5 bg-surface-container-high z-0"
          ></div>
          <div className="relative z-10 flex flex-col items-center text-center">
            <div
              aria-current="step"
              className="w-10 h-10 rounded-full bg-surface-container-lowest flex items-center justify-center shadow-md ring-2 ring-secondary text-primary font-bold text-sm"
            >
              1
            </div>
            <span className="text-xs text-primary font-bold mt-1.5">Especialidade</span>
          </div>
          <div className="relative z-10 flex flex-col items-center text-center">
            <div className="w-9 h-9 rounded-full bg-surface-container-high text-on-surface-variant flex items-center justify-center text-xs font-semibold mt-0.5">
              2
            </div>
            <span className="text-xs text-on-surface-variant mt-1.5">Data &amp; Hora</span>
          </div>
          <div className="relative z-10 flex flex-col items-center text-center">
            <div className="w-9 h-9 rounded-full bg-surface-container-high text-on-surface-variant flex items-center justify-center text-xs font-semibold mt-0.5">
              3
            </div>
            <span className="text-xs text-on-surface-variant mt-1.5">Convênio</span>
          </div>
          <div className="relative z-10 flex flex-col items-center text-center">
            <div className="w-9 h-9 rounded-full bg-surface-container-high text-on-surface-variant flex items-center justify-center text-xs font-semibold mt-0.5">
              4
            </div>
            <span className="text-xs text-on-surface-variant mt-1.5">Confirmação</span>
          </div>
        </div>
      </section>

      {/* Responsive Layout: 1 col on mobile, 2 cols on desktop */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Booking Form: 8 cols desktop */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            {/* Toggle Canal & Modalidade */}
            <section className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-on-surface-variant font-semibold">Canal &amp; Agilidade</span>
                <span className="text-xs text-secondary font-medium flex items-center gap-1">
                  <span className="material-symbols-outlined text-[15px]">bolt</span>
                  Primeiro Horário Disponível
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setChannel('presencial')}
                  className={`h-12 px-4 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
                    channel === 'presencial'
                      ? 'bg-primary text-on-primary shadow-sm'
                      : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-container'
                  }`}
                >
                  <span className="material-symbols-outlined text-[20px]">apartment</span>
                  <span>Presencial</span>
                </button>
                <button
                  type="button"
                  onClick={() => setChannel('teleconsulta')}
                  className={`h-12 px-4 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
                    channel === 'teleconsulta'
                      ? 'bg-primary text-on-primary shadow-sm'
                      : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-container'
                  }`}
                >
                  <span className="material-symbols-outlined text-[20px]">video_camera_front</span>
                  <span>Teleconsulta</span>
                </button>
              </div>
            </section>

            {/* Alternar Consulta vs Exame */}
            <section className="flex bg-surface-container p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setServiceType('consulta')}
                className={`flex-1 py-2.5 rounded-lg text-xs md:text-sm font-bold transition-all ${
                  serviceType === 'consulta'
                    ? 'bg-surface-container-lowest text-primary shadow-sm'
                    : 'text-on-surface-variant'
                }`}
              >
                Consulta Médica
              </button>
              <button
                type="button"
                onClick={() => setServiceType('exame')}
                className={`flex-1 py-2.5 rounded-lg text-xs md:text-sm font-bold transition-all ${
                  serviceType === 'exame'
                    ? 'bg-surface-container-lowest text-primary shadow-sm'
                    : 'text-on-surface-variant'
                }`}
              >
                Exames &amp; Diagnósticos
              </button>
            </section>

            {/* Especialidade */}
            <section className="flex flex-col gap-2">
              <label htmlFor="specialty-select" className="text-sm text-primary font-bold">
                Especialidade ou Procedimento
              </label>
              <select
                id="specialty-select"
                value={selectedSpecialty}
                onChange={(e) => setSelectedSpecialty(e.target.value)}
                className="w-full h-12 px-4 rounded-xl bg-surface-container-lowest border border-slate-200/80 text-on-surface text-sm font-medium focus:ring-2 focus:ring-secondary focus:outline-none"
              >
                <option value="Cardiologia">Cardiologia Clínica</option>
                <option value="Dermatologia">Dermatologia</option>
                <option value="Ortopedia">Ortopedia e Traumatologia</option>
                <option value="Ginecologia">Ginecologia e Obstetrícia</option>
                <option value="Oftalmologia">Oftalmologia</option>
                <option value="Pediatria">Pediatria Humanizada</option>
              </select>
            </section>

            {/* Unidade */}
            <section className="flex flex-col gap-2">
              <label htmlFor="unit-select" className="text-sm text-primary font-bold">
                Unidade de Atendimento
              </label>
              <select
                id="unit-select"
                value={selectedUnit}
                onChange={(e) => setSelectedUnit(e.target.value)}
                className="w-full h-12 px-4 rounded-xl bg-surface-container-lowest border border-slate-200/80 text-on-surface text-sm font-medium focus:ring-2 focus:ring-secondary focus:outline-none"
              >
                <option value="Unidade Curitiba (Juvevê)">
                  Clínica Adventista - Unidade Curitiba (Juvevê)
                </option>
                <option value="Hospital Adventista de Curitiba">
                  Hospital Adventista de Curitiba - Vista Alegre
                </option>
              </select>
            </section>

            {/* Profissional e Horários com Bio Modal e Filtro por Turno */}
            <section className="flex flex-col gap-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <h2 className="text-sm text-primary font-bold">Profissional &amp; Próximos Horários</h2>
                <div className="flex items-center gap-1 bg-surface-container p-1 rounded-lg">
                  <button
                    type="button"
                    onClick={() => setSelectedShift('todos')}
                    className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-all ${
                      selectedShift === 'todos' ? 'bg-white text-primary shadow-xs' : 'text-on-surface-variant'
                    }`}
                  >
                    Todos
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedShift('manha')}
                    className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-all ${
                      selectedShift === 'manha' ? 'bg-white text-primary shadow-xs' : 'text-on-surface-variant'
                    }`}
                  >
                    Manhã (4 vagas)
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedShift('tarde')}
                    className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-all ${
                      selectedShift === 'tarde' ? 'bg-white text-primary shadow-xs' : 'text-on-surface-variant'
                    }`}
                  >
                    Tarde (2 vagas)
                  </button>
                </div>
              </div>

              {/* Card Dra. Juliana */}
              <div className="p-4 md:p-5 rounded-2xl bg-surface-container-lowest shadow-sm flex flex-col gap-3 border border-slate-200/80">
                <div className="flex items-start justify-between gap-3.5 flex-wrap">
                  <div className="flex items-start gap-3.5">
                    <div className="w-12 h-12 rounded-full bg-secondary-fixed text-on-secondary-fixed flex items-center justify-center font-bold text-sm shrink-0">
                      JP
                    </div>
                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-base font-bold text-primary truncate">
                          Dra. Juliana Prado Mendes
                        </h3>
                        <span className="px-2 py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed-variant text-[10px] font-bold">
                          Unimed &amp; Particular
                        </span>
                      </div>
                      <span className="text-xs text-on-surface-variant">
                        CRM-PR 31.904 • RQE 18.204 • Cardiologista &amp; Ecocardiografia
                      </span>
                      <div className="flex items-center gap-2 mt-1 text-xs">
                        <span className="flex items-center gap-0.5 text-amber-500 font-bold">
                          <span className="material-symbols-outlined text-[15px]">star</span>
                          4.9
                        </span>
                        <span className="text-on-surface-variant">• 12 anos exp.</span>
                        <span className="text-emerald-700 font-semibold">• 98% pontualidade</span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setDoctorModalOpen(true)}
                    className="h-8 px-3 rounded-lg bg-surface-container hover:bg-surface-container-high text-secondary text-xs font-semibold flex items-center gap-1 transition-colors self-start"
                  >
                    <span className="material-symbols-outlined text-[15px]">badge</span>
                    <span>Ver Currículo &amp; Avaliações</span>
                  </button>
                </div>

                <div className="flex flex-col gap-1.5 pt-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-outline font-medium">Horários disponíveis amanhã:</span>
                    <span className="text-[11px] text-secondary font-semibold">
                      {selectedShift === 'manha'
                        ? '4 horários matutinos'
                        : selectedShift === 'tarde'
                        ? '2 horários vespertinos'
                        : '6 horários no total'}
                    </span>
                  </div>
                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                    {[
                      { time: '08:30', shift: 'manha' },
                      { time: '09:15', shift: 'manha' },
                      { time: '10:00', shift: 'manha' },
                      { time: '10:45', shift: 'manha' },
                      { time: '14:00', shift: 'tarde' },
                      { time: '15:30', shift: 'tarde' },
                    ]
                      .filter((slot) => selectedShift === 'todos' || slot.shift === selectedShift)
                      .map((slot) => (
                        <button
                          key={slot.time}
                          type="button"
                          onClick={() => setSelectedSlotTime(slot.time)}
                          className={`h-10 rounded-xl text-xs font-bold transition-all ${
                            selectedSlotTime === slot.time
                              ? 'bg-secondary text-white shadow-sm ring-2 ring-secondary/30'
                              : 'bg-surface-container-low text-primary hover:bg-surface-container'
                          }`}
                        >
                          {slot.time}
                        </button>
                      ))}
                  </div>
                </div>
              </div>
            </section>

            {/* Convênio e Cobertura */}
            <section className="flex flex-col gap-2">
              <h2 className="text-sm text-primary font-bold">Forma de Pagamento ou Convênio</h2>
              <label className="p-4 rounded-xl bg-surface-container-lowest shadow-sm flex items-start gap-3 cursor-pointer border border-slate-200/80">
                <input
                  type="radio"
                  name="convenio"
                  checked={paymentOption === 'unimed'}
                  onChange={() => setPaymentOption('unimed')}
                  className="mt-1 w-4 h-4 text-secondary accent-secondary cursor-pointer"
                />
                <div className="flex flex-col flex-1 text-xs">
                  <div className="flex items-center justify-between">
                    <strong className="text-sm text-on-surface">Unimed Curitiba</strong>
                    <span className="px-2 py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-container font-bold text-[11px]">
                      Elegível
                    </span>
                  </div>
                  <span className="text-on-surface-variant mt-0.5">
                    Plano Nacional • Matrícula 0029.****.8102
                  </span>
                  <span className="text-secondary font-semibold mt-1">
                    Isento de carência para consulta eletiva
                  </span>
                </div>
              </label>

              <label className="p-4 rounded-xl bg-surface-container-low shadow-sm flex items-start gap-3 cursor-pointer border border-slate-200/80">
                <input
                  type="radio"
                  name="convenio"
                  checked={paymentOption === 'particular'}
                  onChange={() => setPaymentOption('particular')}
                  className="mt-1 w-4 h-4 text-secondary accent-secondary cursor-pointer"
                />
                <div className="flex flex-col flex-1 text-xs">
                  <div className="flex items-center justify-between">
                    <strong className="text-sm text-on-surface">Particular (Tabela Humanizada)</strong>
                    <strong className="text-sm text-primary">R$ 250,00</strong>
                  </div>
                  <span className="text-on-surface-variant mt-0.5">
                    Pagamento via PIX, Débito ou Cartão no check-in
                  </span>
                </div>
              </label>
            </section>
          </div>

          {/* Desktop Summary Sidebar: 4 cols */}
          <div className="lg:col-span-4 flex flex-col gap-4 sticky top-24">
            <div className="p-5 rounded-2xl bg-surface-container-lowest shadow-sm border border-slate-200/80 flex flex-col gap-4">
              <div className="flex items-center gap-2 text-primary font-bold text-base">
                <span className="material-symbols-outlined text-[22px] text-secondary">fact_check</span>
                <span>Resumo da Consulta</span>
              </div>

              <div className="flex flex-col gap-2.5 text-xs pb-3 border-b border-slate-100">
                <div className="flex justify-between">
                  <span className="text-outline">Especialidade:</span>
                  <span className="font-semibold text-primary">{selectedSpecialty}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-outline">Profissional:</span>
                  <span className="font-semibold text-primary">Dra. Juliana Prado</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-outline">Data &amp; Horário:</span>
                  <span className="font-semibold text-secondary">Amanhã às {selectedSlotTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-outline">Canal:</span>
                  <span className="font-semibold capitalize">{channel}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-outline">Pagamento:</span>
                  <span className="font-semibold text-tertiary">
                    {paymentOption === 'unimed' ? 'Unimed (Autorizado)' : 'Particular'}
                  </span>
                </div>
              </div>

              {/* Alerta Clínico */}
              <div className="p-3 rounded-xl bg-error-container/30 text-on-error-container flex flex-col gap-1 text-xs">
                <div className="flex items-center gap-1.5 text-error font-bold">
                  <span className="material-symbols-outlined text-[16px]">medical_services</span>
                  <span>Urgências</span>
                </div>
                <p className="leading-relaxed text-[11px]">
                  Para dor aguda intensa no peito, acione imediatamente o SAMU (192).
                </p>
              </div>

              {/* Botão de Confirmação */}
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleConfirmBooking}
                className="w-full min-h-[50px] py-3 px-4 rounded-xl bg-primary-container text-on-primary font-bold shadow-md flex items-center justify-between hover:bg-primary active:scale-[0.98] transition-all cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[20px]">event_available</span>
                  <span className="text-xs md:text-sm font-semibold">
                    {isSubmitting ? 'Confirmando...' : 'Confirmar Agendamento'}
                  </span>
                </div>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Modal / Bottom Sheet: Currículo & Avaliações da Médica */}
      {doctorModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-3xl p-6 sm:p-7 max-w-lg w-full shadow-2xl border border-slate-100 space-y-4 animate-scaleUp max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-[22px]">verified</span>
                <span className="text-sm font-bold text-primary">Perfil do Corpo Clínico CMAC</span>
              </div>
              <button
                type="button"
                onClick={() => setDoctorModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
                aria-label="Fechar"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-2xl bg-secondary-fixed text-on-secondary-fixed flex items-center justify-center font-bold text-xl shrink-0">
                JP
              </div>
              <div>
                <h3 className="font-bold text-lg text-primary">Dra. Juliana Prado Mendes</h3>
                <p className="text-xs text-secondary font-semibold">Cardiologia Clínica &amp; Ecocardiografia</p>
                <p className="text-xs text-on-surface-variant mt-0.5">CRM-PR 31.904 • RQE 18.204</p>
                <div className="flex items-center gap-1.5 mt-1.5">
                  <div className="flex text-amber-500">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <span key={i} className="material-symbols-outlined text-[16px]">star</span>
                    ))}
                  </div>
                  <span className="text-xs font-bold text-on-surface">4.9</span>
                  <span className="text-xs text-on-surface-variant">(182 consultas avaliadas)</span>
                </div>
              </div>
            </div>

            {/* Formação e Residência */}
            <div className="bg-surface-container-low p-3.5 rounded-2xl text-xs space-y-1.5 border border-slate-100">
              <span className="font-bold text-primary block">Formação &amp; Títulos:</span>
              <p className="text-on-surface-variant">• Graduação em Medicina pela Universidade Federal do Paraná (UFPR).</p>
              <p className="text-on-surface-variant">• Residência em Cardiologia no Hospital de Clínicas de Curitiba.</p>
              <p className="text-on-surface-variant">• Título de Especialista pela Sociedade Brasileira de Cardiologia (SBC).</p>
              <p className="text-on-surface-variant">• Membro ativo do Corpo Clínico da Clínica Adventista de Curitiba há 8 anos.</p>
            </div>

            {/* Depoimentos Recentes */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-primary block">Avaliações Recentes de Pacientes:</span>
              <div className="p-3 rounded-xl bg-surface-container text-xs space-y-1">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-on-surface">Mariana C.</span>
                  <span className="text-[11px] text-amber-600 font-bold">★ 5.0</span>
                </div>
                <p className="text-on-surface-variant text-[11px] leading-relaxed">
                  "Excelente profissional! Muito atenciosa, explicou detalhadamente o ecocardiograma e tirou todas as dúvidas com paciência."
                </p>
              </div>
              <div className="p-3 rounded-xl bg-surface-container text-xs space-y-1">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-on-surface">Roberto L.</span>
                  <span className="text-[11px] text-amber-600 font-bold">★ 5.0</span>
                </div>
                <p className="text-on-surface-variant text-[11px] leading-relaxed">
                  "Pontualidade exemplar e acolhimento humanizado. Recomendo de olhos fechados."
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setDoctorModalOpen(false)}
              className="w-full h-11 rounded-xl bg-primary text-on-primary font-bold text-xs hover:bg-primary-container transition-all"
            >
              Prosseguir com Agendamento
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
