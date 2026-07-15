import { useState, useRef } from "react";
import "../assets/style/BannerSlider.css";
import Reuseablebutton from "../Common/Commonbutton";
import { FaArrowRight } from "react-icons/fa"; // Using react-icons
import { useNavigate } from "react-router-dom";
import { useTranslation } from "../context/LanguageContext";

const slides = [
    {
        img: "../../../public/images/103-MATT-6.jpg",
    },
];

const BannerSlider = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [current, setCurrent] = useState(0);
    const startX = useRef(0);
    const isDragging = useRef(false);

    const handleMouseDown = (e) => {
        isDragging.current = true;
        startX.current = e.clientX;
    };

    const handleMouseUp = (e) => {
        if (!isDragging.current) return;
        const diff = e.clientX - startX.current;
        if (diff > 50) {
            setCurrent(current === 0 ? slides.length - 1 : current - 1); // swipe right
        } else if (diff < -50) {
            setCurrent(current === slides.length - 1 ? 0 : current + 1); // swipe left
        }
        isDragging.current = false;
    };

    const handleTouchStart = (e) => {
        startX.current = e.touches[0].clientX;
    };

    const handleTouchEnd = (e) => {
        const diff = e.changedTouches[0].clientX - startX.current;
        if (diff > 50) {
            setCurrent(current === 0 ? slides.length - 1 : current - 1);
        } else if (diff < -50) {
            setCurrent(current === slides.length - 1 ? 0 : current + 1);
        }
    };

    return (
        <div
            className="banner-slider"
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
        >
            {slides.map((slide, index) => (
                <div
                    key={index}
                    className={`slide ${index === current ? "active" : ""}`}
                    style={{ backgroundImage: `url(${slide.img})` }}
                >
                    {index === current && (
                        <div
                            className="banner-slider_overlay"
                            data-aos="fade-up"
                            data-aos-duration="700"  // animation duration in ms (1.5s)
                            data-aos-easing="ease-in-out" // smooth easing
                        >
                            <h4>
                                {t("banner.title").split("\n").map((line, i) => (
                                    <span key={i}>
                                        {line}
                                        <br />
                                    </span>
                                ))}
                            </h4>

                            <p>
                                {t("banner.subtitle").split("\n").map((line, i) => (
                                    <span key={i}>
                                        {line}
                                        <br />
                                    </span>
                                ))}
                            </p>

                            <Reuseablebutton text={
                                <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                    {t("banner.shopNow")} <FaArrowRight />
                                </span>
                            }  onClick={() => navigate("/Shop-1")} style={{
                                padding: "clamp(0.4rem, 1.5vw, 1.2rem) clamp(0.8rem, 3vw, 2.5rem)",
                                fontSize: "clamp(1rem, 2vw, 1.5rem)",
                                borderRadius: "0.5rem",
                                fontWeight: 300,
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                gap: "0.5rem",
                            }} />
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default BannerSlider;
