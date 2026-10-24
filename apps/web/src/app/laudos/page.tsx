'use client';

import { useState } from 'react';
import Link from 'next/link';

interface ExamItem {
  id: string;
  title: string;
  category: 'Cardiologia' | 'Análises Clínicas' | 'Imagem';
  date: string;
  physician: string;
  status: 'Pronto' | 'Liberado' | 'Arquivado';
  badgeColor: string;
  description: string;
}

const mockExams: ExamItem[] = [
  {
    id: 'eco-01',
    title: 'Ecocardiograma Transtorácico com Doppler Colorido',
    category: 'Cardiologia',
    date: '28/10/2024',
    physician: 'Dr. Fernando Alencar • CRM-PR 19.821',
    status: 'Pronto',
    badgeColor: 'bg-secondary-fixed text-on-secondary-fixed-variant',
    description: 'Fração de ejeção 64%, cavidades cardíacas com dimensões normais.',
  },
  {
    id: 'hemo-02',
    title: 'Hemograma Completo e Coagulograma',
    category: 'Análises Clínicas',
    date: '18/10/2024',
    physician: 'Laboratório Adventista Curitiba • Dra. Camila S. Rocha CRBM 4192',
    status: 'Liberado',
    badgeColor: 'bg-emerald-100 text-emerald-800',
    description: 'Série vermelha e plaquetas dentro dos parâmetros de referência.',
  },
  {
    id: 'holter-03',
    title: 'Holter 24 Horas Digital',
    category: 'Cardiologia',
    date: '12/09/2024',
    physician: 'Dr. Mauro Gusmão • CRM-PR 14.102',
    status: 'Liberado',
    badgeColor: 'bg-surface-container-high text-on-surface-variant',
    description: 'Ritmo sinusal preservado, sem extrassistolia ventricular complexa.',
  },
  {
    id: 'ecg-04',
    title: 'Eletrocardiograma de Repouso (12 Derivações)',
    category: 'Cardiologia',
    date: '10/08/2024',
    physician: 'Unidade Bom Retiro • Ritmo sinusal regular',
    status: 'Arquivado',
    badgeColor: 'bg-surface-container text-on-surface-variant',
    description: 'Laudo laudado e arquivado em prontuário eletrônico.',
  },
];

export default function LaudosPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  const filteredExams = mockExams.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.physician.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCategory === 'Todos' || item.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  function handleDownload(examId: string, title: string) {
    setDownloadSuccess(title);
    setTimeout(() => {
      setDownloadSuccess(null);
    }, 3500);
  }

  return (
    <div className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 py-6 pb-24 md:pb-12 space-y-6">
      {/* Header com Identidade Clínica */}
      <div className="bg-surface-container-lowest rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-100 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary text-on-primary flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[24px]">description</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-label-sm text-[11px] text-secondary font-semibold uppercase tracking-wider">
                  Histórico Diagnóstico
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                  <span className="material-symbols-outlined text-[13px]">verified_user</span>
                  ICP-Brasil Válido
                </span>
              </div>
              <h1 className="font-headline-lg-mobile sm:font-headline-md text-primary font-bold">
                Central de Laudos & Exames
              </h1>
            </div>
          </div>
          <Link
            href="/checkin"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-surface-container text-primary hover:bg-surface-container-high text-xs font-semibold transition-colors"
          >
            <span className="material-symbols-outlined text-[18px] text-secondary">qr_code_scanner</span>
            <span>Check-in Digital</span>
          </Link>
        </div>

        <p className="text-sm text-on-surface-variant max-w-2xl">
          Consulte e baixe resultados com certificação digital válida (ICP-Brasil MP nº 2.200-2/2001) e acompanhe a evolução dos seus marcadores clínicos.
        </p>

        {/* Barra de Pesquisa */}
        <div className="relative w-full">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-on-surface-variant">
            <span className="material-symbols-outlined text-[20px]">search</span>
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por nome do exame ou médico solicitante..."
            className="w-full h-11 pl-10 pr-10 rounded-xl bg-surface-container-low text-on-surface text-sm placeholder:text-on-surface-variant/70 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all border border-transparent focus:border-primary/20"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-on-surface-variant hover:text-primary"
              aria-label="Limpar busca"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          )}
        </div>

        {/* Filtros por Categoria */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {['Todos', 'Cardiologia', 'Análises Clínicas', 'Imagem'].map((cat) => {
            const active = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  active
                    ? 'bg-primary text-on-primary shadow-sm'
                    : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Alerta de Download Concluído */}
      {downloadSuccess && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl p-3.5 flex items-center justify-between gap-3 text-sm animate-fadeIn">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-emerald-700 text-[20px]">check_circle</span>
            <span>
              Laudo <strong>{downloadSuccess}</strong> baixado com assinatura digital válida.
            </span>
          </div>
          <button
            onClick={() => setDownloadSuccess(null)}
            className="text-emerald-700 hover:text-emerald-900"
            aria-label="Fechar alerta"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>
      )}

      {/* Gráfico Evolutivo de Indicadores (Perfil Lipídico do Stitch) */}
      <section className="bg-surface-container-lowest rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-100 space-y-4">
        <div className="flex items-start justify-between flex-wrap gap-2">
          <div>
            <div className="flex items-center gap-1.5 text-secondary">
              <span className="material-symbols-outlined text-[18px]">query_stats</span>
              <span className="font-label-sm uppercase tracking-wider font-semibold text-xs">
                Análise Longitudinal
              </span>
            </div>
            <h2 className="font-headline-sm text-primary font-bold mt-0.5">Evolução do Perfil Lipídico</h2>
            <p className="text-xs text-on-surface-variant">Comparativo dos últimos 3 exames com meta terapêutica</p>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-semibold">
            Meta Atingida
          </span>
        </div>

        {/* Mini Gráfico SVG Responsivo */}
        <div className="bg-surface-container-low p-4 rounded-xl border border-slate-100">
          <div className="flex items-center justify-between pb-2 text-xs font-medium text-on-surface-variant">
            <span>Mar/24</span>
            <span>Jul/24</span>
            <span className="text-primary font-bold">Out/24 (Atual)</span>
          </div>
          <div className="w-full h-32 flex flex-col justify-end">
            <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 320 120">
              <defs>
                <linearGradient id="grad-ldl-view" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#006398" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#006398" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <line stroke="#737781" strokeDasharray="3,3" strokeWidth="1.2" x1="10" x2="310" y1="55" y2="55" />
              <text fill="#737781" fontSize="9" fontWeight="600" x="12" y="50">
                Meta LDL (&lt; 100 mg/dL)
              </text>
              <polygon fill="url(#grad-ldl-view)" points="30,15 160,35 290,65 290,110 30,110" />
              <polyline
                fill="none"
                points="30,15 160,35 290,65"
                stroke="#006398"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.5"
              />
              <polyline
                fill="none"
                points="30,95 160,85 290,75"
                stroke="#005323"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.5"
              />
              <circle cx="30" cy="15" fill="#00244a" r="4.5" />
              <text fill="#00244a" fontSize="10" fontWeight="700" x="22" y="9">
                142
              </text>
              <circle cx="160" cy="35" fill="#00244a" r="4.5" />
              <text fill="#00244a" fontSize="10" fontWeight="700" x="152" y="29">
                124
              </text>
              <circle className="animate-pulse" cx="290" cy="65" fill="#006398" r="5.5" />
              <text fill="#006398" fontSize="11" fontWeight="700" x="274" y="60">
                94
              </text>
              <circle cx="290" cy="75" fill="#005323" r="4" />
              <text fill="#005323" fontSize="10" fontWeight="600" x="278" y="92">
                58 mg
              </text>
            </svg>
          </div>
          <div className="flex items-center justify-around pt-3 bg-surface-container-lowest/80 rounded-lg p-2 mt-2">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-secondary" />
              <span className="text-xs text-on-surface">
                LDL: <strong>94 mg/dL</strong> (Alvo atingido)
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-700" />
              <span className="text-xs text-on-surface">
                HDL: <strong>58 mg/dL</strong> (Protetor)
              </span>
            </div>
          </div>
        </div>

        {/* Indicadores complementares */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-surface-container-low p-3 rounded-xl border border-slate-100">
            <span className="text-[11px] text-on-surface-variant font-medium">Colesterol Total</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="font-bold text-lg text-primary">168</span>
              <span className="text-[10px] text-on-surface-variant">mg/dL</span>
            </div>
            <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-0.5 mt-0.5">
              <span className="material-symbols-outlined text-[13px]">arrow_downward</span> -18%
            </span>
          </div>
          <div className="bg-surface-container-low p-3 rounded-xl border border-slate-100">
            <span className="text-[11px] text-on-surface-variant font-medium">Triglicérides</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="font-bold text-lg text-primary">118</span>
              <span className="text-[10px] text-on-surface-variant">mg/dL</span>
            </div>
            <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-0.5 mt-0.5">
              <span className="material-symbols-outlined text-[13px]">check_circle</span> Desejável
            </span>
          </div>
          <div className="bg-surface-container-low p-3 rounded-xl border border-slate-100">
            <span className="text-[11px] text-on-surface-variant font-medium">Glicemia Jejum</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="font-bold text-lg text-primary">88</span>
              <span className="text-[10px] text-on-surface-variant">mg/dL</span>
            </div>
            <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-0.5 mt-0.5">
              <span className="material-symbols-outlined text-[13px]">check_circle</span> Normal
            </span>
          </div>
          <div className="bg-surface-container-low p-3 rounded-xl border border-slate-100">
            <span className="text-[11px] text-on-surface-variant font-medium">HbA1c</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="font-bold text-lg text-primary">5.2</span>
              <span className="text-[10px] text-on-surface-variant">%</span>
            </div>
            <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-0.5 mt-0.5">
              <span className="material-symbols-outlined text-[13px]">check_circle</span> Ótimo
            </span>
          </div>
        </div>
      </section>

      {/* Lista de Exames */}
      <section className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h2 className="font-headline-sm text-primary font-bold">Histórico de Exames</h2>
          <span className="text-xs font-semibold text-secondary">
            {filteredExams.length} {filteredExams.length === 1 ? 'resultado' : 'resultados'}
          </span>
        </div>

        {filteredExams.length === 0 ? (
          <div className="bg-surface-container-lowest rounded-2xl p-8 text-center border border-slate-100">
            <span className="material-symbols-outlined text-[36px] text-outline-variant mb-2">find_in_page</span>
            <p className="text-sm font-semibold text-on-surface">Nenhum exame encontrado</p>
            <p className="text-xs text-on-surface-variant mt-1">Tente ajustar os filtros ou o termo de busca.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            {filteredExams.map((exam) => (
              <div
                key={exam.id}
                className="bg-surface-container-lowest rounded-2xl p-5 shadow-sm border border-slate-100 hover:border-slate-200 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-3.5 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center text-primary shrink-0 mt-0.5">
                    <span className="material-symbols-outlined text-[20px]">
                      {exam.category === 'Cardiologia' ? 'ecg_heart' : exam.category === 'Imagem' ? 'radiology' : 'biotech'}
                    </span>
                  </div>
                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`px-2 py-0.5 rounded-full font-label-sm text-[11px] font-semibold ${exam.badgeColor}`}>
                        {exam.status}
                      </span>
                      <span className="text-xs text-on-surface-variant">{exam.date}</span>
                    </div>
                    <h3 className="font-bold text-sm sm:text-base text-on-surface mt-1 truncate">{exam.title}</h3>
                    <p className="text-xs text-on-surface-variant mt-0.5">{exam.physician}</p>
                    <p className="text-xs text-secondary mt-1 font-medium">{exam.description}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  <button
                    onClick={() => handleDownload(exam.id, exam.title)}
                    className="h-9 px-3.5 rounded-xl bg-primary text-on-primary hover:bg-primary-container text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
                  >
                    <span className="material-symbols-outlined text-[16px]">download</span>
                    <span>Baixar PDF</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Card Informativo Jurídico */}
      <section className="bg-surface-container-low rounded-2xl p-5 border border-slate-100 flex items-start gap-3.5">
        <div className="w-10 h-10 rounded-full bg-secondary-fixed flex items-center justify-center text-secondary shrink-0">
          <span className="material-symbols-outlined text-[22px]">policy</span>
        </div>
        <div className="space-y-1">
          <h3 className="font-bold text-sm text-primary">Segurança e Validade Jurídica ICP-Brasil</h3>
          <p className="text-xs text-on-surface-variant leading-relaxed">
            Todos os laudos emitidos pela Clínica Adventista de Curitiba utilizam certificado digital qualificado no padrão <strong>ICP-Brasil (MP nº 2.200-2/2001)</strong>. Possuem fé pública, autenticidade garantida por hash SHA-256 e são legalmente válidos para perícias e convênios.
          </p>
        </div>
      </section>
    </div>
  );
}
