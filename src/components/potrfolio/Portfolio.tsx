import { useState } from "react";
import { useSiteContent } from "../../context/SiteContentContext";
import "./Portfolio.css";

export const Portfolio = () => {
  const [filter, setFilter] = useState("all");
  const { content } = useSiteContent();
  const { title, subtitle, categories, items } = content.portfolio;

  const filteredWorks =
    filter === "all" ? items : items.filter((w) => w.category === filter);

  return (
    <section id="portfolio" className="portfolio">
      <div className="container">
        <h2 className="section-title">{title}</h2>
        <p className="section-subtitle">{subtitle}</p>

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

