import { useState } from "react";
import "./Header.css";

interface PropsActiveSection {
  id: string;
  label?: string;
}

export const Header = ({ id }: PropsActiveSection) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { id: "home", label: "Главная" },
    { id: "services", label: "Услуги" },
    { id: "portfolio", label: "Портфолио" },
    { id: "about", label: "Обо мне" },
    { id: "reviews", label: "Отзывы" },
    { id: "contacts", label: "Контакты" },
  ];

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const elementPosition = element.offsetTop - offset;
      window.scrollTo({
        top: elementPosition,
        behavior: "smooth",
      });
    }
    setIsMenuOpen(false);
  };

  return (
    <header className="header">
      <div className="header-container">
        <div className="logo" onClick={() => scrollToSection("home")}>
          <span className="logo-icon">💅</span>
          <span className="logo-text">
            Gold<span>Hands</span>
          </span>
        </div>

        <nav className={`nav ${isMenuOpen ? "open" : ""}`}>
          <ul className="nav-list">
            {navItems.map((item) => (
              <li key={item.id}>
                <button
                  className={`nav-link ${id === item.id ? "active" : ""
                    }`}
                  onClick={() => scrollToSection(item.id)}
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <button
          className="burger-menu"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          <span className={`burger-line ${isMenuOpen ? "open" : ""}`}></span>
          <span className={`burger-line ${isMenuOpen ? "open" : ""}`}></span>
          <span className={`burger-line ${isMenuOpen ? "open" : ""}`}></span>
        </button>
      </div>
    </header>
  );
};
