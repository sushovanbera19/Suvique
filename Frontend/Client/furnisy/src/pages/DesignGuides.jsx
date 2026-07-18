import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AccountHeader from "../Common/AccountHeader";
import { useTranslation } from "../context/LanguageContext";
import "../assets/style/FooterPages.css";

const API = "http://localhost:5000";
const SLUG = "guides";

const DesignGuides = () => {
    const { t, lang } = useTranslation();
    const [page, setPage] = useState(null);

    useEffect(() => {
        fetch(`${API}/api/static-pages/${SLUG}?lang=${lang}`)
            .then((r) => r.json())
            .then((d) => { if (d.success && d.data) setPage(d.data); })
            .catch(console.log);
    }, [lang]);

    const d = page || {};
    const isEn = lang === "en";
    const v = (dbKey, txKey) => (isEn && d[dbKey] ? d[dbKey] : t(txKey));

    const guides = [
        { title: "guides.guide1Title", desc: "guides.guide1Desc", img: "/images/about 1.webp" },
        { title: "guides.guide2Title", desc: "guides.guide2Desc", img: "/images/product 6.webp" },
        { title: "guides.guide3Title", desc: "guides.guide3Desc", img: "/images/inspired.webp" },
        { title: "guides.guide4Title", desc: "guides.guide4Desc", img: "/images/product1.webp" },
        { title: "guides.guide5Title", desc: "guides.guide5Desc", img: "/images/about2.webp" },
        { title: "guides.guide6Title", desc: "guides.guide6Desc", img: "/images/product 5.webp" },
    ];

    return (
        <>
            <AccountHeader title={v("hero_title", "guides.title")} breadcrumb={`${t("breadcrumb.home")} → ${t("breadcrumb.designGuides")}`} />
            <div className="page-wrapper">
                <section className="page-hero">
                    <img src={d.hero_image || "/images/product 3.webp"} alt="Furniture Design Guides" />
                    <div className="page-hero-overlay">
                        <h1>{v("hero_title", "guides.heroTitle")}</h1>
                        <p>{v("hero_subtitle", "guides.heroSubtitle")}</p>
                    </div>
                </section>

                <section className="page-section">
                    <div className="page-section-text">
                        <h2>{v("section1_title", "guides.section1Title")}</h2>
                        <p>{v("section1_text1", "guides.section1Text1")}</p>
                        <p>{v("section1_text2", "guides.section1Text2")}</p>
                    </div>
                    <div className="page-section-image">
                        <img src={d.section1_image || "/images/about 3.webp"} alt="Design Inspiration" />
                    </div>
                </section>

                <section className="page-features">
                    <h2>{v("features_title", "guides.guidesTitle")}</h2>
                    <div className="guides-grid">
                        {guides.map((guide, i) => (
                            <div className="guide-card" key={i}>
                                <img src={guide.img} alt={t(guide.title)} />
                                <div className="guide-card-body">
                                    <h3>{t(guide.title)}</h3>
                                    <p>{t(guide.desc)}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="page-cta">
                    <h2>{v("cta_title", "guides.ctaTitle")}</h2>
                    <p>{v("cta_text", "guides.ctaText")}</p>
                    <Link to={d.cta_link || "/blog-1"}>{v("cta_btn", "guides.ctaBtn")}</Link>
                </section>
            </div>
        </>
    );
};

export default DesignGuides;
