
import { useState } from "react";

const links = [
  { label: "Início", href: "#inicio" },
  { label: "Serviços", href: "#servicos" },
  { label: "Profissionais", href: "#profissionais" },
  { label: "Contato", href: "#contato" },
];

export default function Navbar({ onBook }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="navbar">
      <div className="container navbar-content">
        <a
          href="#inicio"
          className="logo"
          aria-label="FORMA, início"
          onClick={() => setMenuOpen(false)}
        >
          FORMA<span>.</span>
        </a>

        <nav
          id="main-navigation"
          className={menuOpen ? "is-open" : ""}
          aria-label="Navegação principal"
        >
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="navbar-actions">
          <button
            type="button"
            className="navbar-cta"
            onClick={() => {
              setMenuOpen(false);
              onBook();
            }}
          >
            Agendar horário
          </button>

          <button
            type="button"
            className="menu-toggle"
            aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
            aria-expanded={menuOpen}
            aria-controls="main-navigation"
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span aria-hidden="true">
              {menuOpen ? "×" : "☰"}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
