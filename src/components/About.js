import React from "react";
import { FaCheckCircle, FaHeart, FaShieldAlt, FaStar } from "react-icons/fa";
import "./About.css";

const About = () => {
  const features = [
    { icon: <FaCheckCircle />, text: "Более 5 лет профессионального опыта" },
    { icon: <FaHeart />, text: "Индивидуальный подход к каждой клиентке" },
    { icon: <FaShieldAlt />, text: "Стерильность и безопасность на 100%" },
    { icon: <FaStar />, text: "Постоянное обучение новым техникам" },
  ];

  return (
    <section id="about" className="about">
      <div className="container">
        <div className="about-grid">
          <div className="about-image">
            <div className="about-image-placeholder">
              <span>👩‍🎨</span>
            </div>
          </div>
          <div className="about-content">
            <h2 className="section-title" style={{ textAlign: "left" }}>
              Обо мне
            </h2>
            <p className="about-text">
              Привет! Меня зовут Анна, я профессиональный мастер маникюра и
              педикюра. Моя страсть — создавать красоту и дарить уверенность
              каждой женщине.
            </p>
            <p className="about-text">
              Я постоянно совершенствую свои навыки, прохожу мастер-классы и
              слежу за новейшими трендами в нейл-индустрии. Для меня важно,
              чтобы каждая клиентка чувствовала себя особенной и уходила с
              отличным настроением.
            </p>
            <ul className="about-features">
              {features.map((feat, index) => (
                <li key={index}>
                  <span className="feature-icon">{feat.icon}</span>
                  {feat.text}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
