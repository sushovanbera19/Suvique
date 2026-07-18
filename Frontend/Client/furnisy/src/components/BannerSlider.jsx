import { useState, useRef, useEffect } from "react";
import "../assets/style/BannerSlider.css";
import Reuseablebutton from "../Common/Commonbutton";
import { FaArrowRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "../context/LanguageContext";

const API = "http://localhost:5000";

const fallbackSlides = [
    { id: 1, image: "/images/103-MATT-6.jpg", title: "", subtitle: "", link: "/Shop-1" },
];

const BannerSlider = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [slides, setSlides] = useState(fallbackSlides);
    const [current, setCurrent] = useState(0);
    const startX = useRef(0);
    const isDragging = useRef(false);

    useEffect(() => {
        fetch(`${API}/api/banners/active`)
            .then((r) => r.json())
            .then((d) => { if (d.success && d.data.length > 0) setSlides(d.data); })
            .catch(() => {});
    }, []);

    const handleMouseDown = (e) => {
        isDragging.current = true;
        startX.current = e.clientX;
    };

    const handleMouseUp = (e) => {
        if (!isDragging.current) return;
        const diff = e.clientX - startX.current;
        if (diff > 50) {
            setCurrent(current === 0 ? slides.length - 1 : current - 1);
        } else if (diff < -50) {
            setCurrent(current === slides.length - 1 ? 0 : current + 1);
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
                    key={slide.id || index}
                    className={`slide ${index === current ? "active" : ""}`}
                    style={{ backgroundImage: `url(${slide.image?.startsWith("/") ? slide.image : `/images/${slide.image}`})` }}
                >
                    {index === current && (
                        <div
                            className="banner-slider_overlay"
                            data-aos="fade-up"
                            data-aos-duration="700"
                            data-aos-easing="ease-in-out"
                        >
                            <h4>
                                {(slide.title || t("banner.title")).split("\n").map((line, i) => (
                                    <span key={i}>
                                        {line}
                                        <br />
                                    </span>
                                ))}
                            </h4>

                            <p>
                                {(slide.subtitle || t("banner.subtitle")).split("\n").map((line, i) => (
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
                            } onClick={() => navigate(slide.link || "/Shop-1")} style={{
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
