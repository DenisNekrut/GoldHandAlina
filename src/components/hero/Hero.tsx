import "./Hero.css";

export const Hero = () => {
  const scrollToContacts = () => {
    const element = document.getElementById("contacts");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="home" className="hero">
      <div className="hero-container">
        <div className="hero-content">
          <div className="hero-badge">✨ Профессиональный мастер</div>
          <h1 className="hero-title">
            Идеальный маникюр <br />
            <span>для ваших рук</span>
          </h1>
          <p className="hero-description">
            Создаю неповторимый дизайн ногтей с любовью к деталям.
            Индивидуальный подход и стерильность — мой главный принцип.
          </p>
          <div className="hero-buttons">
            <button onClick={scrollToContacts} className="btn-primary">
              Записаться
            </button>
            <button
              className="btn-secondary"
              onClick={() => {
                const element = document.getElementById("portfolio");
                if (element) element.scrollIntoView({ behavior: "smooth" });
              }}
            >
              Смотреть работы
            </button>
          </div>
          <div className="hero-stats">
            <div className="stat">
              <span className="stat-number">5+</span>
              <span className="stat-label">лет опыта</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat">
              <span className="stat-number">500+</span>
              <span className="stat-label">довольных клиентов</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat">
              <span className="stat-number">100%</span>
              <span className="stat-label">стерильность</span>
            </div>
          </div>
        </div>
        <div className="hero-image">
          <div className="hero-image-placeholder">
            <span>💅</span>
          </div>
        </div>
      </div>
    </section>
  );
};

