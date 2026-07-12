import React, { useState, useEffect, useRef } from "react";
import { FaStar } from "react-icons/fa";
import ReviewAvatar from "../../public/images/user-1.webp";
import "../assets/style/ReviewSlider.css";

const reviews = [
  {
    text: "I am thrilled with my new living Furnisy. The quality of furniture is outstanding, the customization option allowed me get exactly what I wanted. Customer support team was incredibly helpful. Highly recommend I couldn't be happier with my purchase!",
    name: "Liam Smith",
    role: "Co-Founder",
    avatar: ReviewAvatar,
    rating: 5,
  },
];

const ReviewSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const sliderRef = useRef(null);
  const isDragging = useRef(false);
  const startX = useRef(0);

  // Auto-slide every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % reviews.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Mouse events
  const handleMouseDown = (e) => {
    isDragging.current = true;
    startX.current = e.pageX;
  };

  const handleMouseMove = (e) => {
    if (!isDragging.current) return;
    const deltaX = e.pageX - startX.current;
    setDragOffset(deltaX);
  };

  const handleMouseUp = () => {
    if (!isDragging.current) return;
    if (dragOffset > 50) {
      // Previous slide
      setCurrentIndex((prev) => (prev === 0 ? reviews.length - 1 : prev - 1));
    } else if (dragOffset < -50) {
      // Next slide
      setCurrentIndex((prev) => (prev + 1) % reviews.length);
    }
    setDragOffset(0);
    isDragging.current = false;
  };

  const handleMouseLeave = () => {
    if (isDragging.current) handleMouseUp();
  };

  return (
    <div
      className="review-slider-container"
      ref={sliderRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
    >
      <h2>What People Are Saying</h2>
      <div
        className="review-slides-wrapper"
        style={{
          display: "flex",
          transition: isDragging.current ? "none" : "transform 0.5s ease",
          transform: `translateX(calc(${-currentIndex * 100}% + ${dragOffset}px))`,
        }}
      >
        {reviews.map((review, idx) => (
          <div className="review-slide" key={idx} style={{ minWidth: "100%" }}>
            <div className="review-rating">
              {Array.from({ length: review.rating }).map((_, i) => (
                <FaStar key={i} />
              ))}
            </div>
            <p className="review-text">"{review.text}"</p>
            <div className="review-author">
              <img src={review.avatar} alt={review.name} />
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
