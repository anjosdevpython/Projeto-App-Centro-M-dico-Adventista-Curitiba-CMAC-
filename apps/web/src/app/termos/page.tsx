'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

interface TermItem {
  id: string;
  title: string;
  category: string;
  version: string;
  required: boolean;
  signed: boolean;
  signedAt?: string;
  signatureDataUrl?: string;
  description: string;
  content: string[];
}

const mockTerms: TermItem[] = [
  {
    id: 'tcle-contraste',
    title: 'Termo de Consentimento Livre e Esclarecido (TCLE) — Uso de Meio de Contraste',
    category: 'Procedimentos Diagnósticos & Imagem',
    version: 'v2.4 - SOUL MV 2026',
    required: true,
    signed: false,
    description: 'Obrigatório para realização de Ressonância Magnética, Angiotomografia ou Tomografia Computadorizada.',
    content: [
      '1. Fui devidamente informado(a) pelo corpo clínico do Centro Médico Adventista de Curitiba sobre a necessidade da administração intravenosa de meio de contraste radiológico para melhor definição diagnóstica do exame solicitado.',
      '2. Declaro que informei com veracidade todo meu histórico de alergias, histórico renal prévio, diabetes, asma, uso de medicamentos contínuos (especialmente metformina) e eventual suspeita de gravidez.',
      '3. Fui esclarecido(a) de que os meios de contraste modernos apresentam alta segurança, contudo, reações adversas leves (calor, rubor, náuseas) ou raras reações alérgicas podem ocorrer, existindo equipe médica e suporte de emergência prontos para intervenção imediata nas dependências da unidade.',
      '4. Autorizo voluntariamente a equipe médica e de enfermagem a executar o procedimento e administrar os fármacos necessários para a consecução do exame com segurança clínica.',
    ],
  },
  {
    id: 'tcle-lgpd',
    title: 'Termo de Consentimento para Tratamento de Dados Pessoais e Sensíveis de Saúde (LGPD)',
    category: 'Privacidade & Prontuário Eletrônico',
    version: 'v3.1 - Lei 13.709/2018',
    required: true,
    signed: true,
    signedAt: '24/10/2024 às 09:15',
    description: 'Armazenamento seguro e compartilhamento restrito do Prontuário Eletrônico SOUL MV com a equipe assistencial.',
    content: [
      '1. Autorizo a coleta, guarda e tratamento dos meus dados de saúde pelo Centro Médico Adventista de Curitiba unicamente com finalidade de assistência médica, emissão de laudos diagnósticos e faturamento junto à operadora de saúde contratada.',
      '2. Os dados são protegidos por criptografia de nível bancário e padrão CFM de certificação digital, vedado o compartilhamento com terceiros não autorizados para fins publicitários ou comerciais.',
    ],
  },
  {
    id: 'tcle-telemedicina',
    title: 'Termo de Adesão e Consentimento para Teleatendimento Clínico',
    category: 'Telemedicina • CFM nº 2.314/2022',
    version: 'v1.8 - Telemedicina Segura',
    required: false,
    signed: false,
    description: 'Consentimento para consultas síncronas por videoconferência e prescrição digital certificada ICP-Brasil.',
    content: [
      '1. Reconheço as limitações inerentes ao exame físico à distância, ciente de que o médico assistente poderá, a seu exclusivo critério clínico, converter o teleatendimento em consulta presencial caso identifique risco iminente ou necessidade de palpação/ausculta direta.',
      '2. Comprometo-me a realizar a teleconsulta em ambiente privativo, resguardando meu próprio sigilo e o da relação médico-paciente.',
    ],
  },
];

export default function TermosPage() {
  const [terms, setTerms] = useState<TermItem[]>(mockTerms);
  const [activeModalTerm, setActiveModalTerm] = useState<TermItem | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Inicializa o canvas de desenho quando abre o modal
  useEffect(() => {
    if (activeModalTerm && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.lineWidth = 2.5;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.strokeStyle = '#00244a';
      }
      setHasDrawn(false);
    }
  }, [activeModalTerm]);

  function getCoords(e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) {
    if (!canvasRef.current) return { x: 0, y: 0 };
    const rect = canvasRef.current.getBoundingClientRect();
    if ('touches' in e) {
      const touch = e.touches[0];
      if (!touch) return { x: 0, y: 0 };
      return {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top,
      };
    } else {
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    }
  }

  function startDrawing(e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const { x, y } = getCoords(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
    setHasDrawn(true);
  }

  function draw(e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) {
    if (!isDrawing || !canvasRef.current) return;
    e.preventDefault();
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;
    const { x, y } = getCoords(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  }

  function stopDrawing() {
    setIsDrawing(false);
  }

  function clearCanvas() {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    setHasDrawn(false);
  }

  function handleSaveSignature() {
    if (!activeModalTerm || !canvasRef.current || !hasDrawn) return;
    const dataUrl = canvasRef.current.toDataURL('image/png');
    const now = new Date();
    const formattedDate = `${now.toLocaleDateString('pt-BR')} às ${now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;

    setTerms((prev) =>
      prev.map((t) =>
        t.id === activeModalTerm.id
          ? {
              ...t,
              signed: true,
              signedAt: formattedDate,
              signatureDataUrl: dataUrl,
            }
          : t
      )
    );

    const termTitle = activeModalTerm.title;
    setActiveModalTerm(null);
    setSuccessToast(`Documento assinado com sucesso e arquivado no prontuário SOUL MV: ${termTitle}`);
    setTimeout(() => setSuccessToast(null), 5000);
  }

  return (
    <div className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 py-6 pb-24 md:pb-12 space-y-6">
      {/* Header com Identidade SOUL MV */}
      <div className="bg-surface-container-lowest rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-100 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary text-on-primary flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[24px]">draw</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-secondary">
                  Pré-Atendimento &amp; Segurança Jurídica
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                  <span className="material-symbols-outlined text-[13px]">verified_user</span>
                  SOUL MV Integrado
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-primary">
                Assinatura Digital de Termos (TCLE &amp; LGPD)
              </h1>
            </div>
          </div>
          <Link
            href="/checkin"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-surface-container text-primary hover:bg-surface-container-high text-xs font-semibold transition-colors"
          >
            <span className="material-symbols-outlined text-[18px] text-secondary">qr_code_scanner</span>
            <span>Voltar ao Check-in</span>
          </Link>
        </div>

        <p className="text-xs sm:text-sm text-on-surface-variant max-w-2xl">
          Assine seus termos de consentimento e declarações de saúde sem papel diretamente pela tela do seu celular ou tablet. Todas as assinaturas são carimbadas com data/hora e hash de integridade arquivadas no prontuário eletrônico.
        </p>

        {/* Resumo de Pendências */}
        <div className="flex items-center gap-2 pt-2 border-t border-slate-100 flex-wrap">
          <div className="flex items-center gap-1.5 text-xs">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
            <span className="font-semibold text-on-surface">
              {terms.filter((t) => !t.signed && t.required).length} pendência obrigatória para o atendimento de hoje
            </span>
          </div>
          <span className="text-slate-300">•</span>
          <span className="text-xs text-on-surface-variant">
            {terms.filter((t) => t.signed).length} de {terms.length} termos assinados
          </span>
        </div>
      </div>

      {/* Alerta de Feedback de Sucesso */}
      {successToast && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-2xl p-4 flex items-center justify-between gap-3 text-xs sm:text-sm shadow-sm animate-fadeIn">
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-emerald-700 text-[22px]">verified</span>
            <div>
              <p className="font-bold">Termo Assinado Digitalmente</p>
              <p className="text-xs text-emerald-800">{successToast}</p>
            </div>
          </div>
          <button
            onClick={() => setSuccessToast(null)}
            className="text-emerald-700 hover:text-emerald-900 p-1"
            aria-label="Fechar alerta"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>
      )}

      {/* Lista de Termos e TCLEs */}
      <div className="grid grid-cols-1 gap-4">
        {terms.map((term) => (
          <div
            key={term.id}
            className={`bg-surface-container-lowest rounded-2xl p-5 sm:p-6 shadow-sm border transition-all ${
              term.signed
                ? 'border-emerald-200 bg-emerald-50/20'
                : term.required
                ? 'border-amber-300 bg-amber-50/10'
                : 'border-slate-100'
            }`}
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1.5 min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[11px] font-semibold text-secondary uppercase tracking-wider">
                    {term.category}
                  </span>
                  <span className="text-slate-300">•</span>
                  <span className="text-[11px] text-on-surface-variant font-medium">{term.version}</span>
                  {term.required && (
                    <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-bold">
                      Obrigatório
                    </span>
                  )}
                </div>

                <h3 className="font-bold text-base text-primary leading-tight">{term.title}</h3>
                <p className="text-xs text-on-surface-variant leading-relaxed">{term.description}</p>

                {term.signed && (
                  <div className="flex items-center gap-2 pt-1 text-xs text-emerald-800 font-medium">
                    <span className="material-symbols-outlined text-[16px] text-emerald-700">task_alt</span>
                    <span>Assinado digitalmente em {term.signedAt}</span>
                  </div>
                )}
              </div>

              <div className="shrink-0 self-end sm:self-center">
                {term.signed ? (
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1.5 rounded-xl bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px]">check</span>
                      <span>Assinado</span>
                    </span>
                    <button
                      onClick={() => setActiveModalTerm(term)}
                      className="h-9 px-3 rounded-xl bg-surface-container hover:bg-surface-container-high text-secondary text-xs font-semibold transition-colors"
                    >
                      Ver Assinatura
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setActiveModalTerm(term)}
                    className="h-10 px-4 rounded-xl bg-primary text-on-primary hover:bg-primary-container text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm active:scale-[0.98]"
                  >
                    <span className="material-symbols-outlined text-[18px]">draw</span>
                    <span>Ler e Assinar Agora</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Interativo com Canvas de Assinatura Tátil */}
      {activeModalTerm && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-surface-container-lowest rounded-3xl p-5 sm:p-7 max-w-2xl w-full shadow-2xl border border-slate-100 space-y-4 my-auto animate-scaleUp max-h-[92vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-slate-100 pb-3 gap-3">
              <div>
                <span className="text-[11px] font-semibold text-secondary uppercase tracking-wider">
                  {activeModalTerm.category} • {activeModalTerm.version}
                </span>
                <h3 className="text-base sm:text-lg font-bold text-primary leading-snug mt-0.5">
                  {activeModalTerm.title}
                </h3>
              </div>
              <button
                onClick={() => setActiveModalTerm(null)}
                className="text-slate-400 hover:text-slate-600 p-1 shrink-0"
                aria-label="Fechar modal"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {/* Texto Completo do Termo com rolagem */}
            <div className="flex-1 overflow-y-auto pr-2 space-y-3 bg-surface-container-low p-4 rounded-2xl border border-slate-100 text-xs sm:text-sm text-on-surface leading-relaxed max-h-60">
              {activeModalTerm.content.map((par, idx) => (
                <p key={idx} className="text-justify">
                  {par}
                </p>
              ))}
              <div className="pt-2 text-[11px] text-on-surface-variant border-t border-slate-200">
                <p>
                  <strong>Identificação do Paciente:</strong> Allan Felipe dos Anjos • CPF: 098.***.***-12 • SOUL MV ID: #88921
                </p>
                <p>
                  <strong>Local e Data:</strong> Centro Médico Adventista de Curitiba — Juvevê, Curitiba/PR.
                </p>
              </div>
            </div>

            {/* Área de Assinatura */}
            {!activeModalTerm.signed ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-primary flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px] text-secondary">gesture</span>
                    <span>Assine no espaço abaixo com o dedo ou mouse:</span>
                  </label>
                  <button
                    type="button"
                    onClick={clearCanvas}
                    className="text-xs text-red-600 hover:underline flex items-center gap-0.5"
                  >
                    <span className="material-symbols-outlined text-[14px]">restart_alt</span>
                    <span>Limpar</span>
                  </button>
                </div>

                {/* Canvas Tátil */}
                <div className="relative border-2 border-dashed border-slate-300 rounded-2xl bg-white overflow-hidden touch-none shadow-inner">
                  <canvas
                    ref={canvasRef}
                    width={560}
                    height={160}
                    className="w-full h-36 cursor-crosshair block"
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    onTouchStart={startDrawing}
                    onTouchMove={draw}
                    onTouchEnd={stopDrawing}
                  />
                  {!hasDrawn && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-slate-300 text-xs italic">
                      Desenhe sua assinatura aqui
                    </div>
                  )}
                </div>

                <p className="text-[11px] text-on-surface-variant text-center">
                  Ao salvar, esta assinatura será associada ao hash de conformidade LGPD e vinculada ao atendimento.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                <span className="text-xs font-bold text-primary block">Assinatura Coletada:</span>
                <div className="border border-emerald-200 rounded-2xl bg-white p-3 flex flex-col items-center justify-center">
                  {activeModalTerm.signatureDataUrl ? (
                    <img
                      src={activeModalTerm.signatureDataUrl}
                      alt="Assinatura Digital Coletada"
                      className="h-24 object-contain"
                    />
                  ) : (
                    <span className="text-xs text-emerald-800 font-mono py-6">
                      ✓ Assinatura Digital Validada em {activeModalTerm.signedAt}
                    </span>
                  )}
                  <span className="text-[10px] text-slate-400 mt-1 font-mono">
                    Hash SHA-256: 7f9b8c2e...4d1a0b38 • Válido SOUL MV
                  </span>
                </div>
              </div>
            )}

            {/* Ações do Modal */}
            <div className="flex items-center gap-3 pt-2 border-t border-slate-100">
              {!activeModalTerm.signed ? (
                <>
                  <button
                    type="button"
                    disabled={!hasDrawn}
                    onClick={handleSaveSignature}
                    className={`flex-1 h-11 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all ${
                      hasDrawn
                        ? 'bg-primary text-on-primary hover:bg-primary-container active:scale-[0.98]'
                        : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[18px]">verified</span>
                    <span>Confirmar e Assinar Termo</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveModalTerm(null)}
                    className="px-4 h-11 rounded-xl bg-surface-container text-on-surface font-semibold text-xs hover:bg-surface-container-high transition-colors"
                  >
                    Cancelar
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => setActiveModalTerm(null)}
                  className="w-full h-11 rounded-xl bg-primary text-on-primary font-bold text-xs hover:bg-primary-container transition-colors"
                >
                  Fechar
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Informativo de Auditoria Clínica */}
      <div className="bg-surface-container-low rounded-2xl p-5 border border-slate-100 flex items-start gap-3.5">
        <div className="w-10 h-10 rounded-full bg-secondary-fixed flex items-center justify-center text-secondary shrink-0">
          <span className="material-symbols-outlined text-[22px]">policy</span>
        </div>
        <div className="space-y-1">
          <h4 className="font-bold text-sm text-primary">Conformidade e Sigilo Médico Resolução CFM</h4>
          <p className="text-xs text-on-surface-variant leading-relaxed">
            As assinaturas capturadas têm validade probatória irrestrita perante a legislação brasileira (Medida Provisória nº 2.200-2/2001 e Lei Federal nº 14.063/2020), sendo integradas instantaneamente ao Prontuário Eletrônico do Paciente (PEP).
          </p>
        </div>
      </div>
    </div>
  );
}
