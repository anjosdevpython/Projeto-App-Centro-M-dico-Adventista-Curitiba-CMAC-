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

  return (
    <main className="page">
      <p className="eyebrow">Informações e Conformidade</p>
      <h1>Ajuda e Limitações do MVP</h1>
      <p className="lead">
        Entenda o escopo desta demonstração e as garantias de segurança adotadas.
      </p>

      <section className="panel" style={{ display: 'grid', gap: '16px', marginBottom: '20px' }}>
        <h2>Sobre este Ambiente Demonstrativo</h2>
        <p>
          Este aplicativo é um <strong>Protótipo Funcional (MVP de Demonstração)</strong> voltado à validação da experiência de autoatendimento para o Centro Médico Adventista Curitiba (CMAC).
        </p>

        <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '10px', border: '1px solid var(--border)' }}>
          <h3 style={{ margin: '0 0 8px', fontSize: '16px' }}>Diretrizes de Segurança e Privacidade:</h3>
          <ul style={{ margin: 0, paddingLeft: '20px', lineHeight: '1.6', fontSize: '15px' }}>
            <li><strong>Sem Atendimento Real:</strong> Nenhuma consulta real é agendada e nenhum médico ou profissional é notificado.</li>
            <li><strong>Sem Integração de Prontuário:</strong> Não há conexão ativa com o sistema hospitalar SOUL MV ou bancos de dados reais.</li>
            <li><strong>Armazenamento Local:</strong> Todas as credenciais simuladas e agendamentos são mantidos exclusivamente na memória local do seu navegador (<code>localStorage</code>).</li>
            <li><strong>Sem Coleta de Dados Pessoais:</strong> CPF, dados de cartão de crédito e documentos clínicos não são solicitados nem armazenados.</li>
          </ul>
        </div>
      </section>

      <section className="panel" style={{ display: 'grid', gap: '16px' }}>
        <h2>Redefinir Demonstração</h2>
        <p style={{ color: 'var(--muted)', fontSize: '14px', margin: 0 }}>
          Caso queira reiniciar o teste do zero, apagar as credenciais ativas e restaurar a lista inicial de consultas demonstrativas:
        </p>
        <button
          type="button"
          onClick={handleResetAll}
          className="danger-button"
          style={{ maxWidth: '300px', minHeight: '44px' }}
        >
          Limpar todos os dados demonstrativos
        </button>
      </section>
    </main>
  );
}
