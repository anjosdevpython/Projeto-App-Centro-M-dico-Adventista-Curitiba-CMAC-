export default function HomePage() {
  return (
    <main className="page">
      <p className="eyebrow">Portal do paciente</p>
      <h1>Sua saúde, organizada em um só lugar.</h1>
      <p className="lead">Agende atendimentos, acompanhe seus horários e consulte protocolos administrativos.</p>
      <section className="panel">
        <h2>Comece por aqui</h2>
        <p>Esta versão usa somente dados sintéticos e não realiza atendimento real.</p>
        <div style={{ display: 'grid', gap: '12px', marginTop: '16px' }}>
          <a
            className="primary-button"
            style={{ display: 'grid', placeItems: 'center', textDecoration: 'none' }}
            href="/cadastro"
          >
            Criar acesso demonstrativo
          </a>
          <a
            className="secondary-button"
            style={{ display: 'grid', placeItems: 'center', textDecoration: 'none' }}
            href="/inicio"
          >
            Entrar no Portal Demonstrativo
          </a>
        </div>
      </section>
    </main>
  );
}
