
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";

const services = [
  {
    id: 1,
    name: "Corte masculino",
    description: "Um corte que valoriza sua identidade.",
    price: 45,
  },
  {
    id: 2,
    name: "Barba",
    description: "Precisão, cuidado e acabamento.",
    price: 30,
  },
  {
    id: 3,
    name: "Corte + barba",
    description: "A experiência completa de cuidado.",
    price: 65,
  },
];

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
                    R$ {service.price.toFixed(2).replace(".", ",")}
                  </strong>
                </article>
              ))}
            </div>
            <p className="demo-note">
              Serviços e valores fictícios para demonstração.
            </p>
          </div>
        </section>
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
