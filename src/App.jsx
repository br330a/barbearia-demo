
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Professionals from "./components/Professionals";
import Booking from "./components/Booking";
import { services } from "./data/barbershop";
import Contact from "./components/Contact";

export default function App() {
  return (
    <>
      <Navbar />

      <main>
        <Hero />

        <section className="services" id="servicos">
          <div className="container">
            <span className="eyebrow">O QUE FAZEMOS</span>

            <h2>O cuidado está nos detalhes.</h2>

            <p className="section-description">
              Serviços pensados para o seu estilo,
              com atenção em cada etapa.
            </p>

            <div className="services-grid">
              {services.map((service) => (
                <article className="service-card" key={service.id}>
                  <h3>{service.name}</h3>
                  <p>{service.description}</p>
                  <strong>
                    {service.price.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </strong>
                </article>
              ))}
            </div>

            <p className="demo-note">
              Serviços e valores fictícios para demonstração.
            </p>
          </div>
        </section>

        <Professionals />
        <Booking />
        <Contact />
      </main>

      <footer className="footer">
        <div className="container footer-content">
          <span className="logo">FORMA.</span>
          <span>Projeto demonstrativo — Barbearia fictícia</span>
        </div>
      </footer>
    </>
  );
}
