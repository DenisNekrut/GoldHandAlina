import { useState } from "react";
import { FaStar, FaQuoteLeft } from "react-icons/fa";
import { useSiteContent } from "../../context";
import "./Reviews.css";

export const Reviews = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { content } = useSiteContent();
  const { title, subtitle, items: reviews } = content.reviews;

  // Safe fallback if reviews array is empty or index exceeds length
  const safeIndex = reviews.length > 0 ? currentIndex % reviews.length : 0;
  const currentReview = reviews[safeIndex];

  const nextReview = () => {
    if (reviews.length > 0) {
      setCurrentIndex((prev) => (prev + 1) % reviews.length);
    }
  };

  const prevReview = () => {
    if (reviews.length > 0) {
      setCurrentIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
    }
  };

  const renderStars = (count: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <FaStar key={i} className={i < count ? "star-filled" : "star-empty"} />
    ));
  };

  if (!currentReview) {
    return null;
  }

  return (
    <section id="reviews" className="reviews">
      <div className="container">
        <h2 className="section-title">{title}</h2>
        <p className="section-subtitle">{subtitle}</p>

        <div className="reviews-carousel">
          <button className="carousel-btn prev" onClick={prevReview} aria-label="Предыдущий отзыв">
            ‹
          </button>

          <div className="review-card">
            <FaQuoteLeft className="quote-icon" />
            <div className="review-stars">
              {renderStars(currentReview.rating)}
            </div>
            <p className="review-text">"{currentReview.text}"</p>
            <div className="review-author">
              <strong>{currentReview.name}</strong>
              <span className="review-date">{currentReview.date}</span>
            </div>
          </div>

          <button className="carousel-btn next" onClick={nextReview} aria-label="Следующий отзыв">
            ›
          </button>
        </div>

        {reviews.length > 1 && (
          <div className="review-dots">
            {reviews.map((_, index) => (
              <button
                key={index}
                className={`dot ${index === safeIndex ? "active" : ""}`}
                onClick={() => setCurrentIndex(index)}
                aria-label={`Отзыв ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

