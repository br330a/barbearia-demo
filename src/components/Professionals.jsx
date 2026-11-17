
import { professionals } from "../data/barbershop";

export default function Professionals() {
  return (
    <section className="professionals" id="profissionais">
      <div className="container">
        <div className="professionals-heading">
          <div>
            <span className="eyebrow">QUEM CUIDA DE VOCÊ</span>
            <h2>Experiência em cada detalhe.</h2>
          </div>

          <p>
            Profissionais que entendem que cada pessoa
            tem seu próprio estilo.
          </p>
        </div>

        <div className="professionals-grid">
          {professionals.map((professional, index) => (
            <article
              className="professional-card"
              key={professional.id}
            >
              <div className="professional-portrait">
                <span className="professional-number">
                  0{index + 1}
                </span>

                <span className="professional-initials">
                  {professional.initials}
                </span>
              </div>

              <div className="professional-info">
                <div>
                  <h3>{professional.name}</h3>
                  <p>{professional.specialty}</p>
                </div>

                <a
                  href="#agendamento"
                  aria-label={`Agendar com ${professional.name}`}
                >
                  ↗
                </a>
              </div>
            </article>
          ))}
        </div>

        <p className="demo-note">
          Profissionais fictícios para demonstração.
        </p>
      </div>
    </section>
  );
}
