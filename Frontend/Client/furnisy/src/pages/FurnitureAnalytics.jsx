import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AccountHeader from "../Common/AccountHeader";
import { useTranslation } from "../context/LanguageContext";
import "../assets/style/FooterPages.css";

const API = "http://localhost:5000";
const SLUG = "analytics";

const FurnitureAnalytics = () => {
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

    return (
        <>
            <AccountHeader title={v("hero_title", "analytics.title")} breadcrumb="Home → Furniture Analytics" />
            <div className="page-wrapper">
                <section className="page-hero">
                    <img src={d.hero_image || "/images/product1.webp"} alt="Furniture Analytics" />
                    <div className="page-hero-overlay">
                        <h1>{v("hero_title", "analytics.heroTitle")}</h1>
                        <p>{v("hero_subtitle", "analytics.heroSubtitle")}</p>
                    </div>
                </section>

                <section className="page-section">
                    <div className="page-section-text">
                        <h2>{v("section1_title", "analytics.section1Title")}</h2>
                        <p>{v("section1_text1", "analytics.section1Text1")}</p>
                        <p>{v("section1_text2", "analytics.section1Text2")}</p>
                    </div>
                    <div className="page-section-image">
                        <img src={d.section1_image || "/images/product 3.webp"} alt="Analytics Dashboard" />
                    </div>
                </section>

                <section className="page-features">
                    <h2>{v("features_title", "analytics.featuresTitle")}</h2>
                    <div className="features-grid">
                        {[
                            { icon: d.feature1_icon || "📊", title: "feature1_title", tx: "analytics.feature1Title", desc: "feature1_desc", txd: "analytics.feature1Desc" },
                            { icon: d.feature2_icon || "📈", title: "feature2_title", tx: "analytics.feature2Title", desc: "feature2_desc", txd: "analytics.feature2Desc" },
                            { icon: d.feature3_icon || "🔍", title: "feature3_title", tx: "analytics.feature3Title", desc: "feature3_desc", txd: "analytics.feature3Desc" },
                            { icon: d.feature4_icon || "💡", title: "feature4_title", tx: "analytics.feature4Title", desc: "feature4_desc", txd: "analytics.feature4Desc" },
                        ].map((f, i) => (
                            <div className="feature-card" key={i}>
                                <div className="feature-icon">{f.icon}</div>
                                <h3>{v(f.title, f.tx)}</h3>
                                <p>{v(f.desc, f.txd)}</p>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="page-stats">
                    <div className="page-stat">
                        <h3>{d.stat1_value || "10k+"}</h3>
                        <span>{v("stat1_label", "analytics.stat1")}</span>
                    </div>
                    <div className="page-stat">
                        <h3>{d.stat2_value || "35%"}</h3>
                        <span>{v("stat2_label", "analytics.stat2")}</span>
                    </div>
                    <div className="page-stat">
                        <h3>{d.stat3_value || "24/7"}</h3>
                        <span>{v("stat3_label", "analytics.stat3")}</span>
                    </div>
                </section>

                <section className="page-cta">
                    <h2>{v("cta_title", "analytics.ctaTitle")}</h2>
                    <p>{v("cta_text", "analytics.ctaText")}</p>
                    <Link to={d.cta_link || "/contact"}>{v("cta_btn", "analytics.ctaBtn")}</Link>
                </section>
            </div>
        </>
    );
};

export default FurnitureAnalytics;
