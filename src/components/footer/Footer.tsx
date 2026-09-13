import { FaHeart } from "react-icons/fa";
import "./Footer.css";

interface FooterProps {
  onNavigate?: (page: "home" | "palette", sectionId?: string) => void;
}

export const Footer = ({ onNavigate }: FooterProps) => {
  const currentYear = new Date().getFullYear();

  const handleLinkClick = (e: React.MouseEvent, page: "home" | "palette", sectionId?: string) => {
    if (onNavigate) {
      e.preventDefault();
      onNavigate(page, sectionId);
    }
  };

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-brand">
            <span className="footer-logo">💅 GoldHands</span>
            <p className="footer-description">
              Профессиональный маникюр и педикюр с любовью к деталям. Создаём
              красоту вместе!
            </p>
          </div>

          <div className="footer-links">
            <div className="footer-nav">
              <h4>Навигация</h4>
              <ul>
                <li>
                  <a href="#home" onClick={(e) => handleLinkClick(e, "home", "home")}>Главная</a>
                </li>
                <li>
                  <a href="#palette" onClick={(e) => handleLinkClick(e, "palette")} style={{ color: "var(--primary)", fontWeight: 600 }}>
                    Палитра цветов (2 фото)
                  </a>
                </li>
                <li>
                  <a href="#services" onClick={(e) => handleLinkClick(e, "home", "services")}>Услуги</a>
                </li>
                <li>
                  <a href="#portfolio" onClick={(e) => handleLinkClick(e, "home", "portfolio")}>Портфолио</a>
                </li>
                <li>
                  <a href="#about" onClick={(e) => handleLinkClick(e, "home", "about")}>Обо мне</a>
                </li>
                <li>
                  <a href="#reviews" onClick={(e) => handleLinkClick(e, "home", "reviews")}>Отзывы</a>
                </li>
                <li>
                  <a href="#contacts" onClick={(e) => handleLinkClick(e, "home", "contacts")}>Контакты</a>
                </li>
              </ul>
            </div>


            <div className="footer-hours">
              <h4>Часы работы</h4>
              <ul>
                <li>Понедельник - Суббота</li>
                <li>10:00 - 21:00</li>
                <li>Воскресенье</li>
                <li>11:00 - 19:00</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {currentYear} GoldHands. Все права защищены.</p>
          <p className="footer-made-with">
            Сделано с <FaHeart className="heart-icon" /> для вас
          </p>
        </div>
      </div>
    </footer>
  );
};

