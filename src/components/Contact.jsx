
import { business } from "../data/barbershop";

export default function Contact() {
  return (
    <section className="contact" id="contato">
      <div className="container contact-layout">
        <div className="contact-intro">
          <span className="eyebrow">ONDE ESTAMOS</span>

          <h2>
            Seu próximo estilo
            <br />
            começa aqui.
          </h2>

          <p>
            Um espaço pensado para oferecer conforto,
            cuidado e uma experiência única.
          </p>

          <div className="contact-location">
            <span className="eyebrow">LOCALIZAÇÃO</span>

            <address>
              {business.city}
              <span>
                {business.address ||
                  "Endereço a definir — projeto demonstrativo"}
              </span>
            </address>
          </div>
        </div>

        <div className="contact-card">
          <span className="eyebrow">NOSSA ROTINA</span>

          <h3>Horários de funcionamento</h3>

          <div className="contact-hours">
            {business.openingHours.map((item) => (
              <div className="contact-hours-row" key={item.days}>
                <span>{item.days}</span>
                <strong>{item.hours}</strong>
              </div>
            ))}
          </div>

          <a href="#agendamento" className="button-primary">
            Solicitar agendamento
            <span aria-hidden="true">↗</span>
          </a>

          <p className="contact-note">
            Atendimento mediante confirmação de horário.
            Horários ilustrativos.
          </p>
        </div>
      </div>
    </section>
  );
}
