'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Message {
  id: string;
  sender: 'doctor' | 'patient';
  text: string;
  time: string;
}

export default function TeleconsultaPage() {
  const [step, setStep] = useState<'check' | 'waiting' | 'call' | 'feedback'>('check');
  const [micActive, setMicActive] = useState(true);
  const [camActive, setCamActive] = useState(true);
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm1',
      sender: 'doctor',
      text: 'Olá! Sou o Dr. Marcos Vinícius. Estou revisando seus últimos laudos cardiológicos.',
      time: '10:00',
    },
  ]);
  const [inputMsg, setInputMsg] = useState('');
  const [rating, setRating] = useState<number>(5);
  const [feedbackTags, setFeedbackTags] = useState<string[]>([]);
  const [feedbackSent, setFeedbackSent] = useState(false);

  // Timer da chamada em andamento
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (step === 'call') {
      timer = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [step]);

  function formatTime(seconds: number) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  function handleSendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!inputMsg.trim()) return;
    const newMsg: Message = {
      id: String(Date.now()),
      sender: 'patient',
      text: inputMsg.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages((prev) => [...prev, newMsg]);
    setInputMsg('');

    // Resposta automática simulada do médico
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: String(Date.now() + 1),
          sender: 'doctor',
          text: 'Entendido. Seus parâmetros de pressão e exames estão com excelente evolução!',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }, 1500);
  }

  function toggleFeedbackTag(tag: string) {
    if (feedbackTags.includes(tag)) {
      setFeedbackTags(feedbackTags.filter((t) => t !== tag));
    } else {
      setFeedbackTags([...feedbackTags, tag]);
    }
  }

  return (
    <div className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 py-6 pb-24 md:pb-12 space-y-6">
      {/* Etapa 1: Teste Técnico Pré-Chamada */}
      {step === 'check' && (
        <div className="bg-surface-container-lowest rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4 flex-wrap gap-2">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-secondary">
                Telemedicina Segura • CFM nº 2.314/2022
              </span>
              <h1 className="text-xl sm:text-2xl font-bold text-primary mt-0.5">
                Sala de Teleatendimento Adventista
              </h1>
            </div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Criptografia de Ponta a Ponta
            </span>
          </div>

          {/* Card do Médico Solicitante */}
          <div className="bg-surface-container-low p-4 sm:p-5 rounded-2xl flex items-center justify-between flex-wrap gap-4 border border-slate-100">
            <div className="flex items-center gap-3.5">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuB6oEGGfsdak6HYZyP2uwPpiqpRQPzTep61azXHWStmZpImDKHku2-adUyPLjnxHOm6pa5S6o_wRYZ_Rkphh_SXTn9rCLrOrNGWV-DdzWUP-_Qbcg8c2dgAkEOvmSZ34e3aHqkn6hDNQ5ebn7GcGCXdHKb4HOEK0e0Q-_lbUfXKiXJpOf14Z1Ij_O02Yg7OI3_8uSoDN4yqx6ykkgF9IvIMbGmFyeT79lYlgcC8NDk"
                alt="Dr. Marcos Vinícius"
                className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-sm"
              />
              <div>
                <h3 className="font-bold text-base text-primary">Dr. Marcos Vinícius</h3>
                <p className="text-xs text-on-surface-variant">Cardiologia Clínica • CRM-PR 28.412</p>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="text-amber-500 material-symbols-outlined text-[16px]">star</span>
                  <span className="text-xs font-bold text-on-surface">4.9</span>
                  <span className="text-xs text-on-surface-variant">(142 avaliações positivas)</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs text-on-surface-variant font-medium">Horário da Sessão</span>
              <p className="text-base font-bold text-primary">Hoje às 10:00</p>
            </div>
          </div>

          {/* Testes de Hardware e Conexão */}
          <div className="space-y-3">
            <h3 className="font-bold text-sm text-on-surface">Verificação Pré-Consulta</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-4 rounded-2xl bg-surface-container flex items-center justify-between border border-slate-200">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[24px] text-primary">
                    {camActive ? 'videocam' : 'videocam_off'}
                  </span>
                  <div>
                    <p className="text-xs font-bold text-on-surface">Câmera HD</p>
                    <p className="text-[11px] text-emerald-700 font-semibold">Autorizada e pronta</p>
                  </div>
                </div>
                <button
                  onClick={() => setCamActive(!camActive)}
                  className="text-xs text-secondary font-semibold hover:underline"
                >
                  {camActive ? 'Testar' : 'Ativar'}
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-surface-container flex items-center justify-between border border-slate-200">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[24px] text-primary">
                    {micActive ? 'mic' : 'mic_off'}
                  </span>
                  <div>
                    <p className="text-xs font-bold text-on-surface">Microfone</p>
                    <p className="text-[11px] text-emerald-700 font-semibold">Captação excelente</p>
                  </div>
                </div>
                <button
                  onClick={() => setMicActive(!micActive)}
                  className="text-xs text-secondary font-semibold hover:underline"
                >
                  {micActive ? 'Mudo' : 'Ativar'}
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-surface-container flex items-center justify-between border border-slate-200">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[24px] text-emerald-700">wifi</span>
                  <div>
                    <p className="text-xs font-bold text-on-surface">Conexão Estável</p>
                    <p className="text-[11px] text-emerald-700 font-semibold">Latência 18ms • Ótima</p>
                  </div>
                </div>
                <span className="material-symbols-outlined text-emerald-700 text-[18px]">check_circle</span>
              </div>
            </div>
          </div>

          {/* Orientações para a Consulta Online */}
          <div className="bg-surface-container-low p-4 rounded-2xl border border-slate-100 flex items-start gap-3">
            <span className="material-symbols-outlined text-[22px] text-secondary shrink-0 mt-0.5">tips_and_updates</span>
            <div className="text-xs text-on-surface-variant space-y-1">
              <p className="font-semibold text-primary">Dicas para uma boa teleconsulta:</p>
              <p>• Esteja em um ambiente silencioso, privado e bem iluminado.</p>
              <p>• Tenha em mãos seus exames recentes e nomes de remédios em uso contínuo.</p>
              <p>• Caso prefira, utilize fones de ouvido para maior clareza e sigilo.</p>
            </div>
          </div>

          {/* Botão de Entrada */}
          <button
            onClick={() => setStep('waiting')}
            className="w-full h-12 rounded-xl bg-primary text-on-primary hover:bg-primary-container font-bold text-sm flex items-center justify-center gap-2 shadow-sm transition-all active:scale-[0.99]"
          >
            <span className="material-symbols-outlined text-[20px]">video_camera_front</span>
            <span>Entrar na Sala de Espera Virtual</span>
          </button>
        </div>
      )}

      {/* Etapa 2: Sala de Espera Virtual */}
      {step === 'waiting' && (
        <div className="bg-surface-container-lowest rounded-3xl p-8 shadow-sm border border-slate-100 text-center space-y-6 max-w-2xl mx-auto">
          <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border-4 border-secondary/20 border-t-secondary animate-spin" />
            <span className="material-symbols-outlined text-[40px] text-secondary">hourglass_top</span>
          </div>

          <div className="space-y-2">
            <span className="px-3 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed-variant text-xs font-bold uppercase">
              Sala de Espera Segura
            </span>
            <h2 className="text-2xl font-bold text-primary">Aguardando o Dr. Marcos Vinícius...</h2>
            <p className="text-sm text-on-surface-variant max-w-md mx-auto">
              O médico já foi notificado de sua presença. Ele conectará o vídeo em instantes. Você receberá um aviso sonoro.
            </p>
          </div>

          <div className="bg-surface-container-low p-4 rounded-2xl border border-slate-100 text-left space-y-2">
            <div className="flex items-center justify-between text-xs text-on-surface-variant font-medium">
              <span>Posição na fila virtual:</span>
              <strong className="text-primary">1º da fila (Próximo atendimento)</strong>
            </div>
            <div className="flex items-center justify-between text-xs text-on-surface-variant font-medium">
              <span>Tempo médio estimado:</span>
              <strong className="text-secondary">Menos de 2 minutos</strong>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => setStep('call')}
              className="px-6 h-11 rounded-xl bg-primary text-on-primary font-bold text-sm hover:bg-primary-container transition-all flex items-center gap-2 shadow-sm"
            >
              <span className="material-symbols-outlined text-[18px]">call</span>
              <span>Iniciar Consulta Agora (Simulação)</span>
            </button>
            <button
              onClick={() => setStep('check')}
              className="px-4 h-11 rounded-xl bg-surface-container text-on-surface-variant font-semibold text-xs hover:bg-surface-container-high transition-colors"
            >
              Cancelar / Voltar
            </button>
          </div>
        </div>
      )}

      {/* Etapa 3: Chamada Ativa (Videochamada em Tempo Real) */}
      {step === 'call' && (
        <div className="relative bg-slate-950 rounded-3xl overflow-hidden shadow-2xl border border-slate-800 flex flex-col md:flex-row h-[600px]">
          {/* Área Principal de Vídeo (Médico) */}
          <div className="flex-1 relative bg-slate-900 flex items-center justify-center overflow-hidden">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuB6oEGGfsdak6HYZyP2uwPpiqpRQPzTep61azXHWStmZpImDKHku2-adUyPLjnxHOm6pa5S6o_wRYZ_Rkphh_SXTn9rCLrOrNGWV-DdzWUP-_Qbcg8c2dgAkEOvmSZ34e3aHqkn6hDNQ5ebn7GcGCXdHKb4HOEK0e0Q-_lbUfXKiXJpOf14Z1Ij_O02Yg7OI3_8uSoDN4yqx6ykkgF9IvIMbGmFyeT79lYlgcC8NDk"
              alt="Dr. Marcos Vinícius em Consulta"
              className="w-full h-full object-cover opacity-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 pointer-events-none" />

            {/* Informações Superior da Chamada */}
            <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
              <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md px-3.5 py-1.5 rounded-full text-white text-xs">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-bold">Dr. Marcos Vinícius</span>
                <span className="text-slate-300">• {formatTime(callDuration)}</span>
              </div>
              <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-emerald-400 text-xs font-semibold flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">lock</span>
                ICP-Brasil Cripto
              </span>
            </div>

            {/* Picture-in-Picture do Paciente */}
            <div className="absolute bottom-20 right-4 w-32 h-44 rounded-2xl overflow-hidden shadow-xl border-2 border-white/20 bg-slate-800 z-10 flex items-center justify-center">
              {isVideoOff ? (
                <div className="flex flex-col items-center text-slate-400">
                  <span className="material-symbols-outlined text-[24px]">videocam_off</span>
                  <span className="text-[10px] mt-1">Câmera desligada</span>
                </div>
              ) : (
                <img
                  src="https://lh3.googleusercontent.com/aida/AEtjO1WHA_8yu-0NGJgl2ZXPHh5yDDnTwezmhj22fqBjN-DyPe-WLF59iEYnheSPC8tRBduLmlhp6LPwcosl2P1fhD7-cFnLOSI9iJ420OdwniFEcf-cxm2C3E0EkRo9_JnXKmm6VLFC9RvUSYFIYNeTlLki1FOUpYTvikMSTu-CStwY_TtZ467nX8lJhYeq3TxCVD7abTS2Tz-vPcWe_y7igWQvepf1094p415Ek-yNcgxSqKecDENj4WvoUbZpdo4q7rmi5FRT_wmB"
                  alt="Você"
                  className="w-full h-full object-cover"
                />
              )}
              {isMuted && (
                <div className="absolute top-2 right-2 bg-red-600 rounded-full p-1 text-white">
                  <span className="material-symbols-outlined text-[12px]">mic_off</span>
                </div>
              )}
            </div>

            {/* Barra de Controles da Chamada */}
            <div className="absolute bottom-4 inset-x-0 flex items-center justify-center gap-3 z-10 px-4">
              <button
                onClick={() => setIsMuted(!isMuted)}
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                  isMuted ? 'bg-red-600 text-white' : 'bg-white/20 hover:bg-white/30 text-white backdrop-blur-md'
                }`}
                title={isMuted ? 'Desmutar' : 'Mutar'}
              >
                <span className="material-symbols-outlined text-[22px]">{isMuted ? 'mic_off' : 'mic'}</span>
              </button>

              <button
                onClick={() => setIsVideoOff(!isVideoOff)}
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                  isVideoOff ? 'bg-red-600 text-white' : 'bg-white/20 hover:bg-white/30 text-white backdrop-blur-md'
                }`}
                title={isVideoOff ? 'Ligar vídeo' : 'Desligar vídeo'}
              >
                <span className="material-symbols-outlined text-[22px]">{isVideoOff ? 'videocam_off' : 'videocam'}</span>
              </button>

              <button
                onClick={() => setChatOpen(!chatOpen)}
                className="w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 text-white backdrop-blur-md flex items-center justify-center relative transition-all"
                title="Abrir Chat"
              >
                <span className="material-symbols-outlined text-[22px]">chat</span>
                <span className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-secondary-container" />
              </button>

              <button
                onClick={() => setStep('feedback')}
                className="h-12 px-6 rounded-full bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center gap-2 shadow-lg transition-all"
              >
                <span className="material-symbols-outlined text-[20px]">call_end</span>
                <span>Encerrar Consulta</span>
              </button>
            </div>
          </div>

          {/* Painel Lateral de Chat / Prescrições Compartilhadas */}
          {chatOpen && (
            <div className="w-full md:w-80 bg-surface-container-lowest border-l border-slate-200 flex flex-col h-full z-20">
              <div className="p-3.5 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary text-[20px]">forum</span>
                  <span className="text-xs font-bold text-primary">Chat Clínico em Tempo Real</span>
                </div>
                <button
                  onClick={() => setChatOpen(false)}
                  className="text-slate-400 hover:text-slate-600"
                  aria-label="Fechar chat"
                >
                  <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
              </div>

              {/* Lista de Mensagens */}
              <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
                {messages.map((m) => (
                  <div
                    key={m.id}
                    className={`flex flex-col max-w-[85%] ${
                      m.sender === 'patient' ? 'ml-auto items-end' : 'mr-auto items-start'
                    }`}
                  >
                    <div
                      className={`p-2.5 rounded-2xl text-xs leading-relaxed ${
                        m.sender === 'patient'
                          ? 'bg-primary text-on-primary rounded-br-none'
                          : 'bg-surface-container-low text-on-surface rounded-bl-none border border-slate-100'
                      }`}
                    >
                      {m.text}
                    </div>
                    <span className="text-[10px] text-slate-400 mt-0.5 px-1">{m.time}</span>
                  </div>
                ))}
              </div>

              {/* Campo de Envio */}
              <form onSubmit={handleSendMessage} className="p-2.5 border-t border-slate-100 flex gap-2">
                <input
                  type="text"
                  value={inputMsg}
                  onChange={(e) => setInputMsg(e.target.value)}
                  placeholder="Escreva uma mensagem..."
                  className="flex-1 h-9 px-3 rounded-xl bg-surface-container-low text-xs border border-transparent focus:border-secondary focus:outline-none"
                />
                <button
                  type="submit"
                  className="w-9 h-9 rounded-xl bg-primary text-white flex items-center justify-center hover:bg-primary-container shrink-0"
                >
                  <span className="material-symbols-outlined text-[18px]">send</span>
                </button>
              </form>
            </div>
          )}
        </div>
      )}

      {/* Etapa 4: Avaliação Pós-Consulta (NPS & Feedback) */}
      {step === 'feedback' && (
        <div className="bg-surface-container-lowest rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100 max-w-xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto mb-2">
              <span className="material-symbols-outlined text-[28px]">task_alt</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-primary">Consulta Concluída com Sucesso!</h2>
            <p className="text-xs sm:text-sm text-on-surface-variant">
              Como foi sua experiência de teleatendimento com o <strong>Dr. Marcos Vinícius</strong>?
            </p>
          </div>

          {!feedbackSent ? (
            <div className="space-y-5">
              {/* Seletor de Estrelas */}
              <div className="flex justify-center items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="p-1 hover:scale-110 transition-transform"
                    aria-label={`${star} estrelas`}
                  >
                    <span
                      className={`material-symbols-outlined text-[36px] ${
                        star <= rating ? 'text-amber-500 fill-1 font-bold' : 'text-slate-300'
                      }`}
                    >
                      star
                    </span>
                  </button>
                ))}
              </div>

              {/* Tags Rápidas de Avaliação */}
              <div>
                <label className="text-xs font-semibold text-on-surface-variant block mb-2 text-center">
                  O que você mais gostou no atendimento?
                </label>
                <div className="flex flex-wrap gap-2 justify-center">
                  {[
                    'Pontualidade excelente',
                    'Explicação clara e humanizada',
                    'Áudio e vídeo nítidos',
                    'Esclareceu todas as dúvidas',
                    'Ambiente seguro e acolhedor',
                  ].map((tag) => {
                    const selected = feedbackTags.includes(tag);
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => toggleFeedbackTag(tag)}
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                          selected
                            ? 'bg-secondary text-white shadow-sm'
                            : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
                        }`}
                      >
                        {tag}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Campo Opcional de Comentário */}
              <div>
                <label className="text-xs font-semibold text-on-surface-variant block mb-1">
                  Comentário adicional (opcional):
                </label>
                <textarea
                  rows={3}
                  placeholder="Compartilhe seus elogios ou sugestões para aprimorarmos nosso atendimento..."
                  className="w-full p-3 rounded-xl bg-surface-container-low text-xs border border-transparent focus:border-secondary focus:outline-none"
                />
              </div>

              {/* Botões de Ação */}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setFeedbackSent(true)}
                  className="flex-1 h-11 rounded-xl bg-primary text-on-primary font-bold text-xs hover:bg-primary-container transition-all shadow-sm"
                >
                  Enviar Avaliação
                </button>
                <Link
                  href="/inicio"
                  className="px-4 h-11 rounded-xl bg-surface-container text-on-surface font-semibold text-xs hover:bg-surface-container-high flex items-center justify-center transition-colors"
                >
                  Pular
                </Link>
              </div>
            </div>
          ) : (
            <div className="text-center space-y-4 py-4">
              <span className="material-symbols-outlined text-[48px] text-emerald-600">verified</span>
              <h3 className="font-bold text-base text-primary">Agradecemos sua colaboração!</h3>
              <p className="text-xs text-on-surface-variant max-w-sm mx-auto">
                Sua avaliação ajuda a manter a excelência clínica e humana do Centro Médico Adventista.
              </p>
              <div className="flex justify-center gap-3 pt-2">
                <Link
                  href="/prescricoes"
                  className="px-5 h-10 rounded-xl bg-secondary text-white font-semibold text-xs flex items-center gap-1.5 shadow-sm"
                >
                  <span className="material-symbols-outlined text-[16px]">prescriptions</span>
                  <span>Ver Receitas Emitidas</span>
                </Link>
                <Link
                  href="/inicio"
                  className="px-4 h-10 rounded-xl bg-surface-container text-primary font-semibold text-xs flex items-center justify-center"
                >
                  Ir para o Início
                </Link>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
