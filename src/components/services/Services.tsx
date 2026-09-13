import { FaHands, FaPaintBrush, FaMagic, FaSpa, FaRegGem } from "react-icons/fa";
import { useSiteContent } from "../../context/SiteContentContext";
import "./Services.css";

export const Services = () => {
  const { content } = useSiteContent();
  const { title, subtitle, items } = content.services;

  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case "hands":
        return <FaHands />;
      case "brush":
        return <FaPaintBrush />;
      case "magic":
        return <FaMagic />;
      case "spa":
        return <FaSpa />;
      default:
        return <FaRegGem />;
    }
  };

  return (
    <section id="services" className="services">
      <div className="container">
        <h2 className="section-title">{title}</h2>
        <p className="section-subtitle">{subtitle}</p>
        <div className="services-grid">
          {items.map((service, index) => (
            <div key={service.id || index} className="service-card">
              <div className="service-icon">{renderIcon(service.icon)}</div>
              <h3 className="service-title">{service.title}</h3>
              <p className="service-description">{service.description}</p>
              <span className="service-price">{service.price}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};


