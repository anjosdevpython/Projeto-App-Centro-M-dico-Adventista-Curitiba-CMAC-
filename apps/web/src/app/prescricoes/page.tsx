'use client';

import { useState } from 'react';
import Link from 'next/link';

interface Prescription {
  id: string;
  medication: string;
  dosage: string;
  instructions: string;
  doctor: string;
  crm: string;
  issuedDate: string;
  expiryDate: string;
  status: 'Ativa' | 'Concluída';
  schedule: string;
  takenToday: boolean;
  qrCodeUrl: string;
  tokenCode: string;
}

const initialPrescriptions: Prescription[] = [
  {
    id: 'rx-1',
    medication: 'Losartana Potássica 50mg',
    dosage: '1 comprimido pela manhã',
    instructions: 'Tomar em jejum com água. Monitorar pressão arterial semanalmente.',
    doctor: 'Dr. Marcos Vinícius',
    crm: 'CRM-PR 28.412',
    issuedDate: '24/10/2024',
    expiryDate: '24/04/2025',
    status: 'Ativa',
    schedule: '08:00',
    takenToday: true,
    qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=CMAC-RX-8921A',
    tokenCode: 'RX-8921A-BR',
  },
  {
    id: 'rx-2',
    medication: 'Rosuvastatina Cálcica 10mg',
    dosage: '1 comprimido à noite',
    instructions: 'Tomar após o jantar para controle otimizado do perfil lipídico (LDL).',
    doctor: 'Dr. Marcos Vinícius',
    crm: 'CRM-PR 28.412',
    issuedDate: '24/10/2024',
    expiryDate: '24/04/2025',
    status: 'Ativa',
    schedule: '21:00',
    takenToday: false,
    qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=CMAC-RX-7432B',
    tokenCode: 'RX-7432B-BR',
  },
  {
    id: 'rx-3',
    medication: 'Amoxicilina + Clavulanato 875mg',
    dosage: '1 comprimido a cada 12 horas por 7 dias',
    instructions: 'Tratamento de infecção respiratória alta.',
    doctor: 'Dra. Beatriz Santos',
    crm: 'CRM-PR 31.908',
    issuedDate: '15/08/2024',
    expiryDate: '22/08/2024',
    status: 'Concluída',
    schedule: 'Concluído',
    takenToday: false,
    qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=CMAC-RX-1109C',
    tokenCode: 'RX-1109C-BR',
  },
];

export default function PrescricoesPage() {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>(initialPrescriptions);
  const [selectedRx, setSelectedRx] = useState<Prescription | null>(null);
  const [activeTab, setActiveTab] = useState<'ativas' | 'todas'>('ativas');
  const [alertSuccess, setAlertSuccess] = useState<string | null>(null);

  const displayedList =
    activeTab === 'ativas'
      ? prescriptions.filter((r) => r.status === 'Ativa')
      : prescriptions;

  function toggleTaken(id: string) {
    setPrescriptions((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const newState = !item.takenToday;
          if (newState) {
            setAlertSuccess(`Horário registrado! Você marcou ${item.medication} como tomado.`);
            setTimeout(() => setAlertSuccess(null), 3500);
          }
          return { ...item, takenToday: newState };
        }
        return item;
      })
    );
  }

  return (
    <div className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 py-6 pb-24 md:pb-12 space-y-6">
      {/* Header Institucional */}
      <div className="bg-surface-container-lowest rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-100 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary text-on-primary flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[24px]">prescriptions</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-secondary">
                  Farmácia Digital & Receituário
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                  <span className="material-symbols-outlined text-[13px]">verified</span>
                  Assinatura CFM Válida
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-primary">Minhas Prescrições Ativas</h1>
            </div>
          </div>
          <Link
            href="/teleconsulta"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-surface-container text-primary hover:bg-surface-container-high text-xs font-semibold transition-colors"
          >
            <span className="material-symbols-outlined text-[18px] text-secondary">video_camera_front</span>
            <span>Sala de Teleconsulta</span>
          </Link>
        </div>

        <p className="text-xs sm:text-sm text-on-surface-variant max-w-2xl">
          Receitas médicas com assinatura ICP-Brasil com validade jurídica nacional em drogarias de todo o país. Acompanhe os horários de tomada e nunca esqueça suas doses diárias.
        </p>

        {/* Abas de Filtro */}
        <div className="flex items-center gap-2 pt-1 border-t border-slate-100">
          <button
            onClick={() => setActiveTab('ativas')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
              activeTab === 'ativas'
                ? 'bg-primary text-on-primary shadow-sm'
                : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
            }`}
          >
            Prescrições em Uso ({prescriptions.filter((r) => r.status === 'Ativa').length})
          </button>
          <button
            onClick={() => setActiveTab('todas')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
              activeTab === 'todas'
                ? 'bg-primary text-on-primary shadow-sm'
                : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
            }`}
          >
            Histórico Completo ({prescriptions.length})
          </button>
        </div>
      </div>

      {/* Alerta de Feedback de Registro */}
      {alertSuccess && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl p-3.5 flex items-center justify-between gap-3 text-xs sm:text-sm animate-fadeIn">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-emerald-700 text-[20px]">check_circle</span>
            <span>{alertSuccess}</span>
          </div>
          <button onClick={() => setAlertSuccess(null)} className="text-emerald-700 hover:text-emerald-900">
            <span className="material-symbols-outlined text-[16px]">close</span>
          </button>
        </div>
      )}

      {/* Lista de Medicamentos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {displayedList.map((rx) => (
          <div
            key={rx.id}
            className="bg-surface-container-lowest rounded-2xl p-5 shadow-sm border border-slate-100 flex flex-col justify-between gap-4 hover:border-slate-200 transition-all"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-surface-container flex items-center justify-center text-secondary shrink-0">
                    <span className="material-symbols-outlined text-[20px]">medication</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-sm sm:text-base text-primary leading-tight">
                      {rx.medication}
                    </h3>
                    <p className="text-xs text-secondary font-semibold mt-0.5">{rx.dosage}</p>
                  </div>
                </div>
                <span
                  className={`px-2 py-0.5 rounded-full text-[11px] font-semibold shrink-0 ${
                    rx.status === 'Ativa'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-surface-container text-on-surface-variant'
                  }`}
                >
                  {rx.status}
                </span>
              </div>

              <p className="text-xs text-on-surface-variant bg-surface-container-low p-2.5 rounded-xl border border-slate-100 leading-relaxed">
                {rx.instructions}
              </p>

              <div className="flex items-center justify-between text-xs text-on-surface-variant pt-1 border-t border-slate-50">
                <span>
                  Médico: <strong>{rx.doctor}</strong> ({rx.crm})
                </span>
                <span>Validade: {rx.expiryDate}</span>
              </div>
            </div>

            {/* Ações Rápidas: Lembrete diário & Dispensação Digital */}
            <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100 flex-wrap">
              {rx.status === 'Ativa' ? (
                <button
                  onClick={() => toggleTaken(rx.id)}
                  className={`h-9 px-3 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    rx.takenToday
                      ? 'bg-emerald-700 text-white shadow-sm'
                      : 'bg-surface-container hover:bg-surface-container-high text-primary'
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px]">
                    {rx.takenToday ? 'check_circle' : 'schedule'}
                  </span>
                  <span>{rx.takenToday ? 'Dose tomada hoje' : `Tomar às ${rx.schedule}`}</span>
                </button>
              ) : (
                <span className="text-xs text-on-surface-variant">Tratamento encerrado</span>
              )}

              <button
                onClick={() => setSelectedRx(rx)}
                className="h-9 px-3.5 rounded-xl bg-primary text-on-primary hover:bg-primary-container text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm ml-auto"
              >
                <span className="material-symbols-outlined text-[16px]">qr_code_2</span>
                <span>Dispensar em Farmácia</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal de Dispensação com QRCode */}
      {selectedRx && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl border border-slate-100 space-y-4 animate-scaleUp">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-[22px]">verified</span>
                <span className="text-sm font-bold text-primary">Receita Digital Dispensável</span>
              </div>
              <button
                onClick={() => setSelectedRx(null)}
                className="text-slate-400 hover:text-slate-600"
                aria-label="Fechar"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="text-center space-y-3">
              <h3 className="font-bold text-base text-primary">{selectedRx.medication}</h3>
              <p className="text-xs text-on-surface-variant">{selectedRx.dosage}</p>

              {/* QR Code de Dispensação */}
              <div className="bg-white p-3 rounded-2xl border border-slate-200 inline-block shadow-inner">
                <img
                  src={selectedRx.qrCodeUrl}
                  alt="QR Code da Receita"
                  className="w-40 h-40 object-contain mx-auto"
                />
              </div>

              <div className="bg-surface-container-low p-2.5 rounded-xl text-xs space-y-1">
                <span className="text-on-surface-variant">Código de Autenticação CFM:</span>
                <p className="font-mono font-bold text-sm text-primary tracking-wider">{selectedRx.tokenCode}</p>
                <p className="text-[11px] text-emerald-700 font-semibold">
                  Aceito em Farmácias Nacionais (Raia, Pague Menos, Nissei, Panvel)
                </p>
              </div>
            </div>

            <button
              onClick={() => setSelectedRx(null)}
              className="w-full h-11 rounded-xl bg-primary text-on-primary font-bold text-xs hover:bg-primary-container transition-all"
            >
              Concluído
            </button>
          </div>
        </div>
      )}

      {/* Informativo de Desconto em Farmácias Conveniadas */}
      <div className="bg-surface-container-low rounded-2xl p-5 border border-slate-100 flex items-start gap-3.5">
        <div className="w-10 h-10 rounded-full bg-secondary-fixed flex items-center justify-center text-secondary shrink-0">
          <span className="material-symbols-outlined text-[22px]">local_pharmacy</span>
        </div>
        <div className="space-y-1">
          <h4 className="font-bold text-sm text-primary">Convênio Farmacêutico Adventista</h4>
          <p className="text-xs text-on-surface-variant leading-relaxed">
            Apresente o QR Code no balcão da farmácia para obter descontos exclusivos de <strong>até 45%</strong> em medicamentos de uso contínuo pelo convênio da Clínica Adventista de Curitiba.
          </p>
        </div>
      </div>
    </div>
  );
}
