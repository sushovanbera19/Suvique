import React, { useEffect, useState } from "react";
import "../assets/style/AboutUs.css";
import AccountHeader from "./AccountHeader";
import HeroImg from "../../public/images/about 1.webp";
import AboutImg from "/images/about2.webp";
import LivingImg from "../../public/images/about 3.webp";
import ReviewSlider from "../Common/ReviewSlider";
import { FaArrowRight, FaArrowLeft } from "react-icons/fa";
import AboutVideoBanner from "../../public/images/AboutVideo.jpg";


/* ---------------- COUNTER COMPONENT ---------------- */
const Counter = ({ end, duration = 2000 }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        let start = 0;
        const stepTime = 16;
        const steps = duration / stepTime;
        const increment = Math.ceil(end / steps);

        const timer = setInterval(() => {
            start += increment;
            if (start >= end) {
                setCount(end);
                clearInterval(timer);
            } else {
                setCount(start);
            }
        }, stepTime);

        return () => clearInterval(timer);
    }, [end, duration]);

    const formatValue = (num) => (num >= 1000 ? `${Math.floor(num / 1000)}k` : num);

    return <h3>{formatValue(count)}</h3>;
};

/* ---------------- HERO SECTION ---------------- */
const HeroSection = ({ image }) => (
    <section className="about-hero">
        <img src={image} alt="Furniture" />
    </section>
);

/* ---------------- ABOUT SECTION ---------------- */
const AboutSection = ({ title, description, stats, image }) => (
    <section className="about-info">
        <div className="about-text">
            <h2>{title}</h2>
            {description.map((text, index) => (
                <p key={index}>{text}</p>
            ))}
            <div className="about-stats">
                {stats.map((item, index) => (
                    <div key={index}>
                        <Counter end={item.value} />
                        <span>{item.label}</span>
                    </div>
                ))}
            </div>
        </div>
        <div className="about-image">
            <img src={image} alt="Chair" />
        </div>
    </section>
);

/* ---------------- EXPERIENCE SECTION ---------------- */
const ExperienceSection = ({ title, text, features, image }) => (
    <section className="experience">
        <div className="experience-text">
            <h2>{title}</h2>
            <p>{text}</p>
            <ul>
                {features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                ))}
            </ul>
        </div>
        <div className="experience-image">
            <img src={image} alt="Living room" />
        </div>
    </section>
);

/* ---------------- BANNER SECTION ---------------- */
/* ---------------- VIDEO BANNER SECTION ---------------- */
const Aboutus_Video_BannerSection = ({ image }) => {
    const [isPlaying, setIsPlaying] = useState(false);

    return (
        <section className="about-banner">
            <div className="banner-wrapper">
                <img src={image} alt="Bedroom" className="banner-image" />

                <div className="overlay">
                    <button
                        className="play-button"
                        onClick={() => setIsPlaying(true)}
                    >
                        Play
                    </button>
                </div>

                {isPlaying && (
                    <div className="video-modal">
                        <div className="video-content">
                            <button
                                className="close-btn"
                                onClick={() => setIsPlaying(false)}
                            >
                                ✕
                            </button>

                            {/* Replace with your real video */}
                            <iframe
                                width="100%"
                                height="400"
                                src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                                title="Video"
                                frameBorder="0"
                                allowFullScreen
                            ></iframe>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};


/* ---------------- BRANDS SECTION ---------------- */
const BrandsSection = () => {
    const logos = [
        "/images/brand1.webp",
        "/images/brand2.webp",
        "/images/brand 3.webp",
        "/images/brand4.webp",
        "/images/brand5.webp",
        "/images/brand10.webp",
        "/images/brand9.webp",
        "/images/brand 8.webp",
        "/images/brand7.webp",
        "/images/brand6.webp",
    ];

    const [currentIndex, setCurrentIndex] = useState(0);
    const logosPerSlide = 5;

    const prevSlide = () => {
        setCurrentIndex((prev) =>
            prev === 0 ? Math.max(logos.length - logosPerSlide, 0) : prev - logosPerSlide
        );
    };

    const nextSlide = () => {
        setCurrentIndex((prev) =>
            prev + logosPerSlide >= logos.length ? 0 : prev + logosPerSlide
        );
    };

    const visibleLogos = logos.slice(currentIndex, currentIndex + logosPerSlide);

    return (
        <section className="brands-section">
            <div className="brand-slider">
                <button className="brand-arrow prev" onClick={prevSlide}>
                    <FaArrowLeft />
                </button>

                <div className="slide-wrapper">
                    {visibleLogos.map((logo, index) => (
                        <img key={index} src={logo} alt={`Brand ${currentIndex + index}`} />
                    ))}
                </div>

                <button className="brand-arrow next" onClick={nextSlide}>
                    <FaArrowRight />
                </button>
            </div>
        </section>
    );
};



/* ---------------- MAIN COMPONENT ---------------- */
const AboutUs = () => {
    const aboutData = {
        heroImage: HeroImg,
        about: {
            title: "About Furnisy",
            description: [
                "Our goal is to provide you with furniture that not only looks stunning but also serves your needs and lasts for years to come. We prioritize quality in everything we do. From the materials we use to the craftsmanship of our products, we ensure that every piece meets our high standards of excellence.",
                "you with furniture that not only looks stunning but also serves your needs and lasts for years to come. We prioritize quality in everything we do. From the materials we use to the craftsmanship of our products, we ensure that every piece meets our high standards of excellence.",
            ],
            stats: [
                { value: 12000, label: "Premium products" },
                { value: 25000, label: "Years experience" },
                { value: 20000, label: "Happy customers" },
            ],
            image: AboutImg,
        },
        experience: {
            title: "Discover The Furnisy Shopping Experience",
            text: "Explore our carefully curated collections, featuring the latest furniture design home decor. Our diverse range of styles fits every taste and space.",
            features: [
                "User-Friendly Website",
                "Fast & Free Shipping",
                "24/7 Customer Support",
                "High-Quality Furniture",
                "Easy Exchanges & Returns",
            ],
            image: LivingImg,
        },
    };

    return (
        <>
            <AccountHeader />
            <div className="about-wrapper">
                <HeroSection image={aboutData.heroImage} />
                <AboutSection
                    title={aboutData.about.title}
                    description={aboutData.about.description}
                    stats={aboutData.about.stats}
                    image={aboutData.about.image}
                />
                <ExperienceSection
                    title={aboutData.experience.title}
                    text={aboutData.experience.text}
                    features={aboutData.experience.features}
                    image={aboutData.experience.image}
                />
                <Aboutus_Video_BannerSection image={AboutVideoBanner} />
                <ReviewSlider />
                <BrandsSection />
            </div>
        </>
    );
};

export default AboutUs;