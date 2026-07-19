import { FaHands, FaPaintBrush, FaMagic, FaSpa } from "react-icons/fa";
import "./Services.css";

export const Services = () => {
  const services = [
    {
      icon: <FaHands />,
      title: "Классический маникюр",
      description:
        "Аккуратный уход за руками и ногтями, обрезной или европейский метод.",
      price: "от 1500 ₽",
    },
    {
      icon: <FaPaintBrush />,
      title: "Дизайн ногтей",
      description:
        "Любой дизайн: френч, градиент, стемпинг, слайдеры, роспись, стразы.",
      price: "от 500 ₽",
    },
    {
      icon: <FaMagic />,
      title: "Наращивание ногтей",
      description:
        "Укрепление и моделирование ногтей гелем или акрилом любой длины.",
      price: "от 2500 ₽",
    },
    {
      icon: <FaSpa />,
      title: "SPA-уход для рук",
      description:
        "Пилинг, маски, парафинотерапия и расслабляющий массаж кистей.",
      price: "от 800 ₽",
    },
  ];

  return (
    <section id="services" className="services">
      <div className="container">
        <h2 className="section-title">Мои услуги</h2>
        <p className="section-subtitle">
          Выбирайте то, что подходит именно вам — каждый сеанс создаётся с
          заботой о вас
        </p>
        <div className="services-grid">
          {services.map((service, index) => (
            <div key={index} className="service-card">
              <div className="service-icon">{service.icon}</div>
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

