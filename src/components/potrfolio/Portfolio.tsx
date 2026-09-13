import { useState } from "react";
import "./Portfolio.css";

export const Portfolio = () => {
  const [filter, setFilter] = useState("all");

  const categories = [
    { id: "all", label: "Все работы" },
    { id: "classic", label: "Классика" },
    { id: "design", label: "Дизайн" },
    { id: "extensions", label: "Наращивание" },
  ];

  const works = [
    { id: 1, category: "classic", title: "Френч с золотом", emoji: "✨" },
    { id: 2, category: "design", title: "Мраморный дизайн", emoji: "🖤" },
    { id: 3, category: "extensions", title: "Укрепление гелем", emoji: "💪" },
    { id: 4, category: "classic", title: "Розовый омбре", emoji: "🌸" },
    { id: 5, category: "design", title: "Стразы и блеск", emoji: "💎" },
    { id: 6, category: "extensions", title: "Длинные ногти", emoji: "🌟" },
  ];

  const filteredWorks =
    filter === "all" ? works : works.filter((w) => w.category === filter);

  return (
    <section id="portfolio" className="portfolio">
      <div className="container">
        <h2 className="section-title">Портфолио</h2>
        <p className="section-subtitle">
          Каждая работа — результат вдохновения и профессионализма
        </p>

        <div className="portfolio-filters">
          {categories.map((cat) => (
            <button
              key={cat.id}
              className={`filter-btn ${filter === cat.id ? "active" : ""}`}
              onClick={() => setFilter(cat.id)}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="portfolio-grid">
          {filteredWorks.map((work) => (
            <div key={work.id} className="portfolio-item">
              <div className="portfolio-placeholder">
                <span>{work.emoji}</span>
              </div>
              <div className="portfolio-overlay">
                <h4>{work.title}</h4>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
