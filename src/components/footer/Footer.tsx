import { FaHeart } from "react-icons/fa";
import "./Footer.css";

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-brand">
            <span className="footer-logo">💅 NailStudio</span>
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
                  <a href="#home">Главная</a>
                </li>
                <li>
                  <a href="#services">Услуги</a>
                </li>
                <li>
                  <a href="#portfolio">Портфолио</a>
                </li>
                <li>
                  <a href="#about">Обо мне</a>
                </li>
                <li>
                  <a href="#reviews">Отзывы</a>
                </li>
                <li>
                  <a href="#contacts">Контакты</a>
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
          <p>© {currentYear} NailStudio. Все права защищены.</p>
          <p className="footer-made-with">
            Сделано с <FaHeart className="heart-icon" /> для вас
          </p>
        </div>
      </div>
    </footer>
  );
};

