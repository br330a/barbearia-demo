
export default function Hero() {
  return (
    <section className="hero container" id="inicio">
      <div className="hero-content">
        <span className="eyebrow">BARBEARIA & ESTILO</span>

        <h1>
          Seu estilo.
          <br />
          Nosso <em>cuidado.</em>
        </h1>

        <p>
          Mais do que um corte. Uma experiência pensada
          para quem valoriza os detalhes.
        </p>

        <a href="#servicos" className="button-primary">
          Conhecer nossos serviços
          <span aria-hidden="true">↗</span>
        </a>

        <span className="hero-caption">
          Tradição no cuidado. Essência contemporânea.
        </span>
      </div>

      <div className="hero-image">
        <img
          src="https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=1200&q=85"
          alt="Ambiente de barbearia"
          width="1000"
          height="1200"
          fetchPriority="high"
        />
      </div>
    </section>
  );
}
