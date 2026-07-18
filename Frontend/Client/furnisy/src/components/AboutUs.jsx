
import React, { useEffect, useState } from "react";
import "../assets/style/AboutUs.css";
import AccountHeader from "./AccountHeader";
import ReviewSlider from "../Common/ReviewSlider";
import { FaArrowRight, FaArrowLeft } from "react-icons/fa";
import { useTranslation } from "../context/LanguageContext";


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

/* ---------------- VIDEO BANNER SECTION ---------------- */
const Aboutus_Video_BannerSection = ({ image, videoUrl }) => {
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

                            <iframe
                                width="100%"
                                height="400"
                                src={videoUrl || "https://www.youtube.com/embed/dQw4w9WgXcQ"}
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
    const { t, lang } = useTranslation();
    const [aboutContent, setAboutContent] = useState(null);

    useEffect(() => {
        const fetchAbout = async () => {
            try {
                const res = await fetch(`http://localhost:5000/api/about?lang=${lang}`);
                const data = await res.json();
                if (data.success && data.data) {
                    setAboutContent(data.data);
                }
            } catch (err) {
                console.log(err);
            }
        };
        fetchAbout();
    }, [lang]);

    const isEnglish = lang === "en";

    const aboutData = {
        heroImage: aboutContent?.hero_image || "",
        about: {
            title: isEnglish && aboutContent?.heading ? aboutContent.heading : t("about.heading"),
            description: [isEnglish && aboutContent?.description ? aboutContent.description : t("about.desc")],
            stats: [
                { value: aboutContent?.stat1_value || 12000, label: isEnglish && aboutContent?.stat1_label ? aboutContent.stat1_label : t("about.premiumProducts") },
                { value: aboutContent?.stat2_value || 25000, label: isEnglish && aboutContent?.stat2_label ? aboutContent.stat2_label : t("about.yearsExperience") },
                { value: aboutContent?.stat3_value || 20000, label: isEnglish && aboutContent?.stat3_label ? aboutContent.stat3_label : t("about.happyCustomers") },
            ],
            image: aboutContent?.about_image || "",
        },
        experience: {
            title: isEnglish && aboutContent?.experience_title ? aboutContent.experience_title : t("about.experienceTitle"),
            text: isEnglish && aboutContent?.experience_text ? aboutContent.experience_text : t("about.explore"),
            features: [
                isEnglish && aboutContent?.feature1 ? aboutContent.feature1 : t("about.userFriendly"),
                isEnglish && aboutContent?.feature2 ? aboutContent.feature2 : t("about.fastShipping"),
                isEnglish && aboutContent?.feature3 ? aboutContent.feature3 : t("about.customerSupport"),
                isEnglish && aboutContent?.feature4 ? aboutContent.feature4 : t("about.highQuality"),
                isEnglish && aboutContent?.feature5 ? aboutContent.feature5 : t("about.easyReturns"),
            ],
            image: aboutContent?.experience_image || "",
        },
        videoBanner: aboutContent?.video_banner_image || "",
        videoUrl: aboutContent?.video_url || "",
    };

    return (
        <>
            <AccountHeader title={t("about.title")} breadcrumb={`${t("breadcrumb.home")} → ${t("breadcrumb.aboutUs")}`} />
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
                <Aboutus_Video_BannerSection image={aboutData.videoBanner} videoUrl={aboutData.videoUrl} />
                <ReviewSlider />
                <BrandsSection />
            </div>
        </>
    );
};

export default AboutUs;
