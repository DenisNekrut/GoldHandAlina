import { useState } from "react";
import "./Header.css";

interface HeaderProps {
  id: string;
  activePage?: "home" | "palette";
  onNavigate?: (page: "home" | "palette", sectionId?: string) => void;
}

export const Header = ({ id, activePage = "home", onNavigate }: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { id: "home", label: "Главная" },
    { id: "services", label: "Услуги" },
    { id: "portfolio", label: "Портфолио" },
    { id: "about", label: "Обо мне" },
    { id: "reviews", label: "Отзывы" },
    { id: "contacts", label: "Контакты" },
  ];

  const handleNavClick = (sectionId: string) => {
    if (onNavigate) {
      onNavigate("home", sectionId);
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        const offset = 80;
        const elementPosition = element.offsetTop - offset;
        window.scrollTo({
          top: elementPosition,
          behavior: "smooth",
        });
      }
    }
    setIsMenuOpen(false);
  };

  const handlePaletteClick = () => {
    if (onNavigate) {
      onNavigate("palette");
    }
    setIsMenuOpen(false);
  };

  return (
    <header className="header">
      <div className="header-container">
        <div className="logo" onClick={() => handleNavClick("home")}>
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
                  className={`nav-link ${
                    activePage === "home" && id === item.id ? "active" : ""
                  }`}
                  onClick={() => handleNavClick(item.id)}
                >
                  {item.label}
                </button>
              </li>
            ))}

            {/* Специальная кнопка страницы Палитра цветов */}
            <li>
              <button
                className={`nav-link palette-nav-btn ${
                  activePage === "palette" ? "active" : ""
                }`}
                onClick={handlePaletteClick}
                title="Каталог: Цвет лака + Маникюр на ногтях"
              >
                <span>Палитра цветов</span>
                <span className="palette-nav-badge">2 фото</span>
              </button>
            </li>
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

