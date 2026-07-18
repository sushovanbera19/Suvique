import { useState, useEffect, useRef } from "react";
import { FaStar } from "react-icons/fa";
import ReviewAvatar from "../../public/images/user-1.webp";
import "../assets/style/ReviewSlider.css";
import { useTranslation } from "../context/LanguageContext";

const API = "http://localhost:5000";

const fallbackReviews = [
  { text: "Outstanding furniture quality and amazing customer service!", name: "Liam Smith", role: "Co-Founder", avatar: ReviewAvatar, rating: 5 },
];

const ReviewSlider = ({ productId }) => {
  const { t } = useTranslation();
  const [reviews, setReviews] = useState(fallbackReviews);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const sliderRef = useRef(null);
  const isDragging = useRef(false);
  const startX = useRef(0);

  useEffect(() => {
    const url = productId
      ? `${API}/api/reviews/product/${productId}`
      : `${API}/api/reviews/active`;
    fetch(url)
      .then((r) => r.json())
      .then((d) => { if (d.success && d.data.length > 0) setReviews(d.data); })
      .catch(() => {});
  }, [productId]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % reviews.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [reviews.length]);

  const handleMouseDown = (e) => { isDragging.current = true; startX.current = e.pageX; };
  const handleMouseMove = (e) => { if (!isDragging.current) return; setDragOffset(e.pageX - startX.current); };
  const handleMouseUp = () => {
    if (!isDragging.current) return;
    if (dragOffset > 50) setCurrentIndex((prev) => (prev === 0 ? reviews.length - 1 : prev - 1));
    else if (dragOffset < -50) setCurrentIndex((prev) => (prev + 1) % reviews.length);
    setDragOffset(0);
    isDragging.current = false;
  };
  const handleMouseLeave = () => { if (isDragging.current) handleMouseUp(); };

  if (reviews.length === 0) return null;

  return (
    <div className="review-slider-container" ref={sliderRef}
      onMouseDown={handleMouseDown} onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp} onMouseLeave={handleMouseLeave}>
      {!productId && <h2>{t("review.heading")}</h2>}
      <div className="review-slides-wrapper"
        style={{
          display: "flex",
          transition: isDragging.current ? "none" : "transform 0.5s ease",
          transform: `translateX(calc(${-currentIndex * 100}% + ${dragOffset}px))`,
        }}>
        {reviews.map((review, idx) => (
          <div className="review-slide" key={review.id || idx} style={{ minWidth: "100%" }}>
            <div className="review-rating">
              {Array.from({ length: review.rating || 5 }).map((_, i) => <FaStar key={i} />)}
            </div>
            <p className="review-text">"{review.text}"</p>
            <div className="review-author">
              <img
                src={review.avatar?.startsWith("/") ? review.avatar : `/images/${review.avatar}`}
                alt={review.name}
                onError={(e) => e.target.src = "/images/user-1.webp"}
              />
              <div className="review-author-info">
                <strong>{review.name}</strong>
                <span>{review.role}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewSlider;
