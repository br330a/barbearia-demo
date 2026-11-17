
export default function Navbar() {
  return (
    <header className="navbar">
      <div className="container navbar-content">
        <a href="#inicio" className="logo" aria-label="FORMA, início">
          FORMA<span>.</span>
        </a>

        <nav aria-label="Navegação principal">
        <a href="#inicio">Início</a>
        <a href="#servicos">Serviços</a>
        <a href="#profissionais">Profissionais</a>
        <a href="#contato">Contato</a>
        </nav>

        <a href="#agendamento" className="navbar-cta">
            Agendar horário
        </a>
      </div>
    </header>
  );
}
