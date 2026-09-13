import { useState, type ChangeEvent, type FormEvent } from "react";
import {
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaInstagram,
  FaTelegram,
  FaVk,
  FaWhatsapp,
  FaClock,
} from "react-icons/fa";
import { useSiteContent } from "../../context/SiteContentContext";
import "./Contacts.css";

interface ContactsProps {
  selectedColorNotes?: string;
  onClearColorNotes?: () => void;
}

export const Contacts = ({ selectedColorNotes, onClearColorNotes }: ContactsProps) => {
  const { content } = useSiteContent();
  const { title, subtitle, infoItems, socials } = content.contacts;

  const [prevColorNote, setPrevColorNote] = useState(selectedColorNotes);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    message: selectedColorNotes
      ? `Здравствуйте! Хочу записаться на маникюр с оттенком: ${selectedColorNotes}`
      : "",
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  // Синхронизация при выборе нового цвета без эффекта с синхронным setState
  if (selectedColorNotes !== prevColorNote) {
    setPrevColorNote(selectedColorNotes);
    if (selectedColorNotes) {
      setFormData((prev) => ({
        ...prev,
        message: `Здравствуйте! Хочу записаться на маникюр с оттенком: ${selectedColorNotes}`,
      }));
    }
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Form data:", formData);
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({ name: "", phone: "", message: "" });
      if (onClearColorNotes) onClearColorNotes();
    }, 3000);
  };

  const renderContactIcon = (iconType: string) => {
    switch (iconType) {
      case "phone":
        return <FaPhone />;
      case "email":
        return <FaEnvelope />;
      case "clock":
        return <FaClock />;
      case "address":
      default:
        return <FaMapMarkerAlt />;
    }
  };

  const renderSocialIcon = (id: string) => {
    switch (id) {
      case "vk":
        return <FaVk />;
      case "instagram":
        return <FaInstagram />;
      case "telegram":
        return <FaTelegram />;
      case "whatsapp":
        return <FaWhatsapp />;
      default:
        return <FaTelegram />;
    }
  };

  return (
    <section id="contacts" className="contacts">
      <div className="container">
        <h2 className="section-title">{title}</h2>
        <p className="section-subtitle">{subtitle}</p>

        <div className="contacts-grid">
          <div className="contacts-info">
            {infoItems.map((item, index) => (
              <div key={item.id || index} className="contact-item">
                <div className="contact-icon">{renderContactIcon(item.type)}</div>
                <div className="contact-details">
                  <h4>{item.title}</h4>
                  {item.link ? (
                    <a href={item.link}>{item.details}</a>
                  ) : (
                    <p>{item.details}</p>
                  )}
                </div>
              </div>
            ))}

            <div className="social-links">
              <p className="social-title">Социальные сети</p>
              <div className="social-icons">
                {socials.map((social, index) => (
                  <a
                    key={social.id || index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-icon"
                    aria-label={social.label}
                  >
                    {renderSocialIcon(social.id)}
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="contacts-form-wrapper">
            <form className="contacts-form" onSubmit={handleSubmit}>
              <h3>Записаться на приём</h3>
              <p className="form-subtitle">
                Оставьте заявку, и я свяжусь с вами
              </p>

              {selectedColorNotes && (
                <div style={{
                  background: "#f5e6e6",
                  border: "1px solid #d4a0a0",
                  padding: "10px 14px",
                  borderRadius: "10px",
                  fontSize: "0.85rem",
                  color: "#5a3d3d",
                  marginBottom: "16px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "8px"
                }}>
                  <span>💅 <strong>Выбран оттенок:</strong> {selectedColorNotes}</span>
                  {onClearColorNotes && (
                    <button
                      type="button"
                      onClick={onClearColorNotes}
                      style={{
                        background: "none",
                        border: "none",
                        color: "#7a5e5e",
                        cursor: "pointer",
                        fontSize: "12px",
                        textDecoration: "underline"
                      }}
                    >
                      Сбросить
                    </button>
                  )}
                </div>
              )}

              <div className="form-group">
                <label htmlFor="name">Ваше имя *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Алина"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone">Телефон *</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+7 (995) 658-96-40"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="message">Сообщение</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Ваши пожелания или вопросы..."
                  rows={4}
                />
              </div>

              <button type="submit" className="btn-primary">
                {isSubmitted ? "✓ Отправлено!" : "Отправить заявку"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

