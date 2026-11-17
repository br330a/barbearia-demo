import { professionals } from "../data/barbershop";

export default function Professionals({ onBook }) {
  return (
    <section className="professionals" id="profissionais">
      <div className="container">
        <div className="professionals-heading">
          <div>
            <span className="eyebrow">QUEM CUIDA DE VOCÊ</span>
            <h2>Experiência em cada detalhe.</h2>
          </div>

          <p>
            Profissionais que entendem que cada pessoa tem seu próprio estilo.
          </p>
        </div>

        <div className="professionals-grid">
          {professionals.map((professional, index) => (
            <article className="professional-card" key={professional.id}>
              <div className="professional-portrait">
                <img
                  src={professional.image}
                  alt={`Retrato ilustrativo do barbeiro ${professional.name}`}
                  width="640"
                  height="800"
                  loading="lazy"
                  decoding="async"
                />
                <span className="professional-number" aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>

              <div className="professional-info">
                <div>
                  <h3>{professional.name}</h3>
                  <p>{professional.specialty}</p>
                </div>

                <button
                  type="button"
                  onClick={() => onBook({ professionalId: professional.id })}
                  aria-label={`Solicitar horário com ${professional.name}`}
                >
                  <span aria-hidden="true">↗</span>
                </button>
              </div>
            </article>
          ))}
        </div>

        <p className="demo-note">
          Profissionais e retratos fictícios para demonstração.
        </p>
      </div>
    </section>
  );
}
