import "./Hero.css";
import { useSiteContent } from "../../context/SiteContentContext";

interface HeroProps {
  onOpenPalette?: () => void;
}

export const Hero = ({ onOpenPalette }: HeroProps) => {
  const { content } = useSiteContent();
  const hero = content.hero;

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
          <div className="hero-badge">{hero.badge}</div>
          <h1 className="hero-title">
            {hero.titleLine1} <br />
            <span>{hero.titleLine2}</span>
          </h1>
          <p className="hero-description">{hero.description}</p>
          <div className="hero-buttons">
            <button onClick={scrollToContacts} className="btn-primary">
              {hero.btnBookText || "Записаться"}
            </button>
            {onOpenPalette && (
              <button
                type="button"
                className="btn-primary"
                style={{
                  background: "var(--secondary)",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px"
                }}
                onClick={onOpenPalette}
              >
                <span>{hero.btnPaletteText || "Палитра цветов"}</span>
                <span style={{
                  background: "var(--primary)",
                  padding: "2px 6px",
                  borderRadius: "8px",
                  fontSize: "11px",
                  fontWeight: 700
                }}>2 фото</span>
              </button>
            )}
            <button
              className="btn-secondary"
              onClick={() => {
                const element = document.getElementById("portfolio");
                if (element) element.scrollIntoView({ behavior: "smooth" });
              }}
            >
              {hero.btnPortfolioText || "Смотреть работы"}
            </button>
          </div>

          <div className="hero-stats">
            <div className="stat">
              <span className="stat-number">{hero.statYears}</span>
              <span className="stat-label">{hero.statYearsLabel}</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat">
              <span className="stat-number">{hero.statClients}</span>
              <span className="stat-label">{hero.statClientsLabel}</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat">
              <span className="stat-number">{hero.statSterility}</span>
              <span className="stat-label">{hero.statSterilityLabel}</span>
            </div>
          </div>
        </div>
        <div className="hero-image">
          <div className="hero-image-placeholder">
            <span>{hero.avatarEmoji || "💅"}</span>
          </div>
        </div>
      </div>
    </section>
  );
};


