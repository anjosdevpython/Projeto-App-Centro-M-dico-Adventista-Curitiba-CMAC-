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
      <div className="flex flex-col min-h-screen bg-background pb-20">
        <header className="sticky top-0 inset-x-0 z-40 bg-primary-container text-on-primary shadow-md">
          <div className="h-16 px-4 flex items-center justify-between max-w-xl mx-auto">
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
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed-variant font-bold">
              SOUL MV Confirmado
            </span>
          </div>
        </header>

        <main className="flex-1 w-full max-w-xl mx-auto px-4 py-6 flex flex-col gap-4">
          <div className="bg-surface-container-lowest rounded-2xl shadow-sm p-6 flex flex-col gap-4 border border-slate-100" role="status" aria-live="polite">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-tertiary-fixed text-on-tertiary-fixed-variant flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[28px]">check_circle</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-primary">Agendamento Realizado!</h1>
                <p className="text-xs text-on-surface-variant">
                  Protocolo gerado e integrado ao ambiente demonstrativo SOUL MV.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-surface-container-low flex flex-col gap-2.5 text-sm border border-surface-container">
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

            <div className="flex flex-col gap-2.5 mt-2">
              <a
                href="/agendamentos"
                className="w-full min-h-[48px] rounded-xl bg-primary hover:bg-primary-container text-on-primary font-semibold flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.99] text-center"
              >
                <span>Ver em Meus Agendamentos</span>
                <span className="material-symbols-outlined text-[20px]">event_note</span>
              </a>
              <a
                href="/inicio"
                className="w-full min-h-[44px] rounded-xl bg-surface-container hover:bg-surface-container-high text-primary font-semibold flex items-center justify-center transition-colors text-center text-sm"
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
    <div className="flex flex-col min-h-screen bg-background pb-24">
      {/* Top Header from Stitch */}
      <header className="sticky top-0 inset-x-0 z-40 bg-primary-container text-on-primary shadow-md">
        <div className="h-16 px-4 flex items-center justify-between max-w-xl mx-auto">
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
      <section className="w-full bg-surface-container-lowest px-4 py-3 shadow-sm border-b border-slate-100">
        <div className="grid grid-cols-4 relative max-w-xl mx-auto">
          <div
            aria-hidden="true"
            className="absolute top-5 left-8 right-8 h-0.5 bg-surface-container-high z-0"
          ></div>
          <div className="relative z-10 flex flex-col items-center text-center">
            <div
              aria-current="step"
              className="w-9 h-9 rounded-full bg-surface-container-lowest flex items-center justify-center shadow-md ring-2 ring-secondary text-primary font-bold text-sm"
            >
              1
            </div>
            <span className="text-xs text-primary font-bold mt-1">Especialidade</span>
          </div>
          <div className="relative z-10 flex flex-col items-center text-center">
            <div className="w-8 h-8 rounded-full bg-surface-container-high text-on-surface-variant flex items-center justify-center text-xs font-semibold mt-0.5">
              2
            </div>
            <span className="text-xs text-on-surface-variant mt-1">Data &amp; Hora</span>
          </div>
          <div className="relative z-10 flex flex-col items-center text-center">
            <div className="w-8 h-8 rounded-full bg-surface-container-high text-on-surface-variant flex items-center justify-center text-xs font-semibold mt-0.5">
              3
            </div>
            <span className="text-xs text-on-surface-variant mt-1">Convênio</span>
          </div>
          <div className="relative z-10 flex flex-col items-center text-center">
            <div className="w-8 h-8 rounded-full bg-surface-container-high text-on-surface-variant flex items-center justify-center text-xs font-semibold mt-0.5">
              4
            </div>
            <span className="text-xs text-on-surface-variant mt-1">Confirmação</span>
          </div>
        </div>
      </section>

      <main className="flex-1 w-full max-w-xl mx-auto px-4 py-4 flex flex-col gap-5">
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
              className={`h-11 px-4 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
                channel === 'presencial'
                  ? 'bg-primary text-on-primary shadow-sm'
                  : 'bg-surface-container-high text-on-surface-variant'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">apartment</span>
              <span>Presencial</span>
            </button>
            <button
              type="button"
              onClick={() => setChannel('teleconsulta')}
              className={`h-11 px-4 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
                channel === 'teleconsulta'
                  ? 'bg-primary text-on-primary shadow-sm'
                  : 'bg-surface-container-high text-on-surface-variant'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">videocam</span>
              <span>Teleconsulta</span>
            </button>
          </div>
        </section>

        {/* O que deseja agendar? */}
        <section className="flex flex-col gap-2">
          <h2 className="text-sm font-bold text-on-surface">O que você deseja agendar hoje?</h2>
          <div className="grid grid-cols-2 gap-2 p-1 bg-surface-container-high rounded-xl">
            <button
              type="button"
              onClick={() => setServiceType('consulta')}
              className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold transition-all ${
                serviceType === 'consulta'
                  ? 'bg-surface-container-lowest text-primary shadow-sm'
                  : 'text-on-surface-variant'
              }`}
            >
              <span className="material-symbols-outlined text-[18px] text-secondary">stethoscope</span>
              <span>Consulta Médica</span>
            </button>
            <button
              type="button"
              onClick={() => setServiceType('exame')}
              className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold transition-all ${
                serviceType === 'exame'
                  ? 'bg-surface-container-lowest text-primary shadow-sm'
                  : 'text-on-surface-variant'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">biotech</span>
              <span>Exames / Imagem</span>
            </button>
          </div>
        </section>

        {/* Unidades & Especialidades Populares */}
        <section className="flex flex-col gap-2">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            {['Unidade Curitiba (Juvevê)', 'Centro Médico Portão'].map((unit) => (
              <button
                key={unit}
                type="button"
                onClick={() => setSelectedUnit(unit)}
                className={`whitespace-nowrap px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                  selectedUnit === unit
                    ? 'bg-primary-container text-on-primary shadow-sm'
                    : 'bg-surface-container-high text-on-surface-variant'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">location_on</span>
                <span>{unit}</span>
              </button>
            ))}
          </div>

          <div className="flex flex-wrap gap-2 pt-1">
            {['Cardiologia', 'Clínica Geral', 'Pediatria', 'Ortopedia', 'Dermatologia'].map(
              (spec) => (
                <button
                  key={spec}
                  type="button"
                  onClick={() => setSelectedSpecialty(spec)}
                  className={`h-9 px-3.5 rounded-full text-xs font-semibold transition-all ${
                    selectedSpecialty === spec
                      ? 'bg-secondary-fixed text-on-secondary-fixed shadow-sm'
                      : 'bg-surface-container text-on-surface-variant'
                  }`}
                >
                  {spec} {selectedSpecialty === spec ? '✓' : ''}
                </button>
              ),
            )}
          </div>
        </section>

        {/* Card do Profissional & Slots (Stitch) */}
        <section aria-label="Profissionais Disponíveis" className="flex flex-col gap-3">
          <span className="text-sm text-primary font-bold">Profissionais Disponíveis</span>

          <article className="bg-surface-container-lowest rounded-xl p-4 shadow-sm flex flex-col gap-3 relative overflow-hidden border border-slate-100">
            <div
              aria-hidden="true"
              className="absolute top-0 left-0 bottom-0 w-1.5 bg-secondary"
            ></div>
            <div className="flex items-center gap-3 pl-1">
              <div className="w-14 h-14 rounded-full bg-secondary-container flex items-center justify-center text-primary font-bold shrink-0 shadow-sm">
                <span className="material-symbols-outlined text-[28px]">account_circle</span>
              </div>
              <div className="flex flex-col flex-1 min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <h3 className="text-base text-on-surface font-bold leading-tight">
                    Dra. Juliana Prado Mendes
                  </h3>
                  <span className="material-symbols-outlined text-secondary text-[18px]">
                    verified
                  </span>
                </div>
                <span className="text-xs text-on-surface-variant font-medium mt-0.5">
                  Cardiologia e Ecocardiografia
                </span>
                <span className="text-[11px] text-outline mt-0.5">CRM-PR 31.904 • RQE 18.234</span>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex items-center text-amber-500 text-xs font-semibold">
                    <span className="material-symbols-outlined text-[15px]">star</span>
                    <span className="ml-1 text-on-surface">4.9</span>
                  </div>
                  <span className="text-outline-variant">•</span>
                  <span className="text-xs text-secondary font-semibold">
                    Próxima data: Amanhã (25 Out)
                  </span>
                </div>
              </div>
            </div>

            {/* Slots de Horários */}
            <div className="flex flex-col gap-1.5 pt-1">
              <span className="text-xs text-on-surface-variant font-semibold">
                Horários livres em Juvevê (Amanhã):
              </span>
              <div className="grid grid-cols-4 gap-2">
                {['08:30', '09:15', '10:45', '14:00'].map((time) => (
                  <button
                    key={time}
                    type="button"
                    onClick={() => setSelectedSlotTime(time)}
                    className={`h-11 rounded-lg text-xs font-bold transition-all ${
                      selectedSlotTime === time
                        ? 'bg-primary text-on-primary ring-2 ring-secondary shadow-md'
                        : 'bg-surface-container-low text-on-surface hover:bg-surface-container-high'
                    }`}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>

            {/* Trava Temporária de Concorrência SOUL MV */}
            <div className="p-3 rounded-xl bg-secondary-fixed text-on-secondary-fixed flex items-center justify-between gap-3 shadow-sm text-xs">
              <div className="flex items-center gap-2 min-w-0">
                <span className="material-symbols-outlined text-secondary text-[20px] shrink-0">
                  lock_clock
                </span>
                <div className="flex flex-col min-w-0">
                  <span className="font-bold leading-tight">Vaga Pré-selecionada</span>
                  <span className="text-on-secondary-fixed-variant leading-tight">
                    Horário reservado temporariamente
                  </span>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-surface-container-lowest text-secondary font-bold font-mono">
                {selectedSlotTime}
              </span>
            </div>
          </article>
        </section>

        {/* Convênio e Cobertura */}
        <section className="flex flex-col gap-2">
          <h2 className="text-sm text-primary font-bold">Forma de Pagamento ou Convênio</h2>
          <label className="p-3.5 rounded-xl bg-surface-container-lowest shadow-sm flex items-start gap-3 cursor-pointer border border-slate-100">
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

          <label className="p-3.5 rounded-xl bg-surface-container-low shadow-sm flex items-start gap-3 cursor-pointer border border-slate-100">
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

        {/* Alerta de Diretriz e Segurança Clínica */}
        <section className="p-3.5 rounded-xl bg-error-container/30 text-on-error-container flex flex-col gap-1 text-xs">
          <div className="flex items-center gap-1.5 text-error font-bold">
            <span className="material-symbols-outlined text-[18px]">medical_services</span>
            <span>Diretriz Ambulatorial &amp; Urgência</span>
          </div>
          <p className="leading-relaxed">
            Este fluxo destina-se a consultas ambulatoriais eletivas. Em casos de dor aguda no peito
            ou falta de ar severa, acione o SAMU (192) ou procure atendimento de emergência.
          </p>
        </section>

        {/* Botão de Confirmação */}
        <div className="pt-2 pb-6 flex flex-col gap-2">
          <button
            type="button"
            disabled={isSubmitting}
            onClick={handleConfirmBooking}
            className="w-full min-h-[52px] py-3 px-4 rounded-xl bg-primary-container text-on-primary font-bold shadow-md flex items-center justify-between hover:bg-primary active:scale-[0.98] transition-all cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[22px]">event_available</span>
              <span className="text-sm font-semibold">
                {isSubmitting ? 'Confirmando...' : 'Confirmar Agendamento'}
              </span>
            </div>
            <div className="flex items-center gap-1 bg-white/15 px-2.5 py-1 rounded-lg text-xs">
              <span>{selectedSlotTime} • Amanhã</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </div>
          </button>
          <span className="text-center text-[11px] text-outline">
            🔒 Ambiente 100% seguro • Clínica Adventista de Curitiba
          </span>
        </div>
      </main>
    </div>
  );
}
