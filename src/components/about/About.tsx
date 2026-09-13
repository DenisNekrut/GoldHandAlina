import { FaCheckCircle, FaHeart, FaShieldAlt, FaStar } from "react-icons/fa";
import { useSiteContent } from "../../context";
import "./About.css";

export const About = () => {
  const { content } = useSiteContent();
  const { title, paragraph1, paragraph2, features, avatarEmoji, avatarUrl } = content.about;

  const getFeatureIcon = (index: number) => {
    switch (index % 4) {
      case 0:
        return <FaCheckCircle />;
      case 1:
        return <FaHeart />;
      case 2:
        return <FaShieldAlt />;
      case 3:
      default:
        return <FaStar />;
    }
  };

  return (
    <section id="about" className="about">
      <div className="container">
        <div className="about-grid">
          <div className="about-image">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={title}
                className="about-photo-img"
                loading="lazy"
              />
            ) : (
              <div className="about-image-placeholder">
                <span>{avatarEmoji || "👩‍🎨"}</span>
              </div>
            )}
          </div>
          <div className="about-content">
            <h2 className="section-title" style={{ textAlign: "left" }}>
              {title}
            </h2>
            <p className="about-text">{paragraph1}</p>
            <p className="about-text">{paragraph2}</p>
            <ul className="about-features">
              {features.map((feat, index) => (
                <li key={feat.id || index}>
                  <span className="feature-icon">{getFeatureIcon(index)}</span>
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


