'use client';

import { resetAllDemoData } from '../../lib/demo/demo-service';

export default function AjudaPage() {
  function handleResetAll() {
    if (confirm('Tem certeza de que deseja limpar todos os agendamentos e credenciais demonstrativas salvos neste navegador?')) {
      resetAllDemoData();
      alert('Dados demonstrativos redefinidos com sucesso.');
      window.location.href = '/cadastro';
    }
  }

  const faqs = [
    {
      pergunta: 'Como funciona o check-in prévio digital?',
      resposta: 'O check-in prévio permite que o paciente confirme sua chegada pelo celular ao se aproximar da unidade, gerando sua senha de atendimento e integrando sua chamada ao painel de TV da recepção.',
    },
    {
      pergunta: 'Quais convênios são aceitos no autoatendimento?',
      resposta: 'Neste ambiente demonstrativo são simulados os fluxos para Unimed Curitiba, Bradesco Saúde, planos com coparticipação e a modalidade Particular com Tabela Humanizada.',
    },
    {
      pergunta: 'Como acessar a visão do médico cardiologista?',
      resposta: 'Você pode acessar pelo menu lateral/inferior na opção "Médico" ou na tela de login escolhendo a aba "Corpo Clínico". Lá é possível vivenciar a fila de chamada, a triagem e o Prontuário Eletrônico (PEP).',
    },
    {
      pergunta: 'Meus dados reais foram transmitidos?',
      resposta: 'Não. Este ambiente é 100% isolado na memória do seu navegador (localStorage). Nenhuma informação médica ou pessoal real é enviada para servidores externos.',
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-surface pb-12 animate-fade-in-up">
      {/* Header */}
      <header className="sticky top-0 w-full z-40 bg-primary-container text-on-primary shadow-sm">
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
                Central de Ajuda &amp; Orientações
              </span>
            </div>
          </div>

          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-secondary text-white text-xs font-semibold">
            <span className="material-symbols-outlined text-[15px]">help_center</span>
            Suporte
          </span>
        </div>
      </header>

      <main className="flex-1 w-full max-w-5xl mx-auto px-4 lg:px-8 py-6 flex flex-col gap-6">
        {/* Banner Institucional de Suporte */}
        <section className="card-interactive p-6 rounded-2xl bg-radial-hero text-on-primary shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4 border border-white/10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-secondary-fixed shrink-0 ring-2 ring-white/15">
              <span className="material-symbols-outlined text-[32px]">support_agent</span>
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-white">Central de Ajuda e Acolhimento</h1>
              <p className="text-xs md:text-sm text-on-primary-container mt-0.5">
                Tire dúvidas sobre o fluxo de autoatendimento, agendamentos e regras da demonstração.
              </p>
            </div>
          </div>

          <a
            href="https://wa.me/554130518000"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-glow inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-secondary hover:bg-secondary/90 text-white font-bold text-xs md:text-sm shadow-sm transition-all"
          >
            <span className="material-symbols-outlined text-[20px]">chat</span>
            <span>Falar no WhatsApp</span>
          </a>
        </section>

        {/* FAQs em Cards Interativos */}
        <section className="flex flex-col gap-3">
          <h2 className="text-lg font-bold text-primary">Dúvidas Frequentes</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {faqs.map((faq) => (
              <div
                key={faq.pergunta}
                className="card-interactive p-5 rounded-2xl bg-surface-container-lowest shadow-sm flex flex-col gap-2 border border-slate-200/80 hover:border-secondary"
              >
                <div className="flex items-start gap-2.5 text-primary font-bold text-sm">
                  <span className="material-symbols-outlined text-[20px] text-secondary shrink-0 mt-0.5">
                    quiz
                  </span>
                  <span>{faq.pergunta}</span>
                </div>
                <p className="text-xs text-on-surface-variant leading-relaxed pl-7">
                  {faq.resposta}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Painel de Transparência e Reinício de Demonstração */}
        <section className="p-6 rounded-2xl bg-surface-container-low border border-surface-container flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <h3 className="text-base font-bold text-primary">Redefinir Dados Demonstrativos</h3>
            <p className="text-xs text-on-surface-variant">
              Caso queira reiniciar sua sessão demonstrativa e recarregar os dados padrão de testes.
            </p>
          </div>

          <button
            type="button"
            onClick={handleResetAll}
            className="px-5 py-2.5 rounded-xl bg-error/10 hover:bg-error/20 text-error font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer shrink-0"
          >
            <span className="material-symbols-outlined text-[18px]">restart_alt</span>
            <span>Reiniciar Demonstração</span>
          </button>
        </section>
      </main>
    </div>
  );
}
