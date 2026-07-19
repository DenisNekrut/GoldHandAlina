import { useState, type ChangeEvent, type SubmitEvent } from "react";
import {
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaInstagram,
  FaTelegram,
  FaWhatsapp,
  FaClock,
} from "react-icons/fa";
import "./Contacts.css";

export const Contacts = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    message: "",
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Здесь можно добавить отправку данных на сервер
    console.log("Form data:", formData);
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({ name: "", phone: "", message: "" });
    }, 3000);
  };

  const contactInfo = [
    {
      icon: <FaMapMarkerAlt />,
      title: "Адрес",
      details: "г. Москва, г. Троицк, ул. Новая, д. 2, студия 31",
    },
    {
      icon: <FaPhone />,
      title: "Телефон",
      details: "+7 (995) 658-96-40",
      link: "tel:+79956589640",
    },
    {
      icon: <FaEnvelope />,
      title: "Email",
      details: "alina_nekrut1701@mail.ru",
      link: "mailto:anna.nail@studio.ru",
    },
    {
      icon: <FaClock />,
      title: "Часы работы",
      details: "Пн-Сб: 10:00 - 21:00, Вс: 11:00 - 19:00",
    },
  ];

  const socialLinks = [
    { icon: <FaInstagram />, url: "https://instagram.com", label: "Instagram" },
    { icon: <FaTelegram />, url: "https://t.me", label: "Telegram" },
    { icon: <FaWhatsapp />, url: "https://wa.me", label: "WhatsApp" },
  ];

  return (
    <section id="contacts" className="contacts">
      <div className="container">
        <h2 className="section-title">Контакты</h2>
        <p className="section-subtitle">Свяжитесь со мной удобным способом</p>

        <div className="contacts-grid">
          <div className="contacts-info">
            {contactInfo.map((item, index) => (
              <div key={index} className="contact-item">
                <div className="contact-icon">{item.icon}</div>
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
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-icon"
                    aria-label={social.label}
                  >
                    {social.icon}
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

              <div className="form-group">
                <label htmlFor="name">Ваше имя *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Анна"
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
                  placeholder="+7 (999) 123-45-67"
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

