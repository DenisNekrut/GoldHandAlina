import React, { useState } from "react";
import { FaStar, FaQuoteLeft } from "react-icons/fa";
import "./Reviews.css";

const Reviews = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const reviews = [
    {
      name: "Екатерина",
      text: "Анна — настоящий профессионал! Сделала маникюр, который держится уже 3 недели. Дизайн просто волшебный, все аккуратно и стерильно. Обязательно вернусь ещё!",
      rating: 5,
      date: "2 недели назад",
    },
    {
      name: "Мария",
      text: "Очень довольна результатом! Спасибо за индивидуальный подход и внимание к деталям. Парафинотерапия — это отдельное удовольствие. Рекомендую всем!",
      rating: 5,
      date: "1 месяц назад",
    },
    {
      name: "Ольга",
      text: "Прекрасный мастер! Нарастила ногти к свадьбе, выглядели просто шикарно. Анна учла все мои пожелания и сделала ногти идеальной формы. Спасибо огромное!",
      rating: 5,
      date: "2 месяца назад",
    },
    {
      name: "Светлана",
      text: "Всегда хожу только к Анне! Отличное качество, приятная атмосфера и всегда свежие идеи для дизайна. Мои любимые ногти теперь только здесь.",
      rating: 5,
      date: "3 месяца назад",
    },
  ];

  const nextReview = () => {
    setCurrentIndex((prev) => (prev + 1) % reviews.length);
  };

  const prevReview = () => {
    setCurrentIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  const renderStars = (count) => {
    return Array.from({ length: 5 }, (_, i) => (
      <FaStar key={i} className={i < count ? "star-filled" : "star-empty"} />
    ));
  };

  return (
    <section id="reviews" className="reviews">
      <div className="container">
        <h2 className="section-title">Отзывы</h2>
        <p className="section-subtitle">Что говорят мои клиенты</p>

        <div className="reviews-carousel">
          <button className="carousel-btn prev" onClick={prevReview}>
            ‹
          </button>

          <div className="review-card">
            <FaQuoteLeft className="quote-icon" />
            <div className="review-stars">
              {renderStars(reviews[currentIndex].rating)}
            </div>
            <p className="review-text">"{reviews[currentIndex].text}"</p>
            <div className="review-author">
              <strong>{reviews[currentIndex].name}</strong>
              <span className="review-date">{reviews[currentIndex].date}</span>
            </div>
          </div>

          <button className="carousel-btn next" onClick={nextReview}>
            ›
          </button>
        </div>

        <div className="review-dots">
          {reviews.map((_, index) => (
            <button
              key={index}
              className={`dot ${index === currentIndex ? "active" : ""}`}
              onClick={() => setCurrentIndex(index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Reviews;
