import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AccountHeader from "../Common/AccountHeader";
import { useTranslation } from "../context/LanguageContext";
import "../assets/style/FooterPages.css";

const API = "http://localhost:5000";
const SLUG = "boutique-store";

const BoutiqueStore = () => {
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
            <AccountHeader title={v("hero_title", "boutique.title")} breadcrumb="Home → Boutique Store" />
            <div className="page-wrapper">
                <section className="page-hero">
                    <img src={d.hero_image || "/images/product 6.webp"} alt="Boutique Furniture Store" />
                    <div className="page-hero-overlay">
                        <h1>{v("hero_title", "boutique.heroTitle")}</h1>
                        <p>{v("hero_subtitle", "boutique.heroSubtitle")}</p>
                    </div>
                </section>

                <section className="page-section">
                    <div className="page-section-text">
                        <h2>{v("section1_title", "boutique.section1Title")}</h2>
                        <p>{v("section1_text1", "boutique.section1Text1")}</p>
                        <p>{v("section1_text2", "boutique.section1Text2")}</p>
                    </div>
                    <div className="page-section-image">
                        <img src={d.section1_image || "/images/product 5.webp"} alt="Store Interior" />
                    </div>
                </section>

                <section className="page-features">
                    <h2>{v("features_title", "boutique.categoriesTitle")}</h2>
                    <div className="features-grid">
                        {[
                            { icon: d.feature1_icon || "🪑", title: "feature1_title", tx: "boutique.cat1Title", desc: "feature1_desc", txd: "boutique.cat1Desc" },
                            { icon: d.feature2_icon || "🛏️", title: "feature2_title", tx: "boutique.cat2Title", desc: "feature2_desc", txd: "boutique.cat2Desc" },
                            { icon: d.feature3_icon || "💡", title: "feature3_title", tx: "boutique.cat3Title", desc: "feature3_desc", txd: "boutique.cat3Desc" },
                            { icon: d.feature4_icon || "🖼️", title: "feature4_title", tx: "boutique.cat4Title", desc: "feature4_desc", txd: "boutique.cat4Desc" },
                        ].map((f, i) => (
                            <div className="feature-card" key={i}>
                                <div className="feature-icon">{f.icon}</div>
                                <h3>{v(f.title, f.tx)}</h3>
                                <p>{v(f.desc, f.txd)}</p>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="page-section reverse">
                    <div className="page-section-text">
                        <h2>{v("section2_title", "boutique.section2Title")}</h2>
                        <p>{v("section2_text1", "boutique.section2Text1")}</p>
                        <p>{v("section2_text2", "boutique.section2Text2")}</p>
                    </div>
                    <div className="page-section-image">
                        <img src={d.section2_image || "/images/product 7.webp"} alt="Quality Furniture" />
                    </div>
                </section>

                <section className="page-cta">
                    <h2>{v("cta_title", "boutique.ctaTitle")}</h2>
                    <p>{v("cta_text", "boutique.ctaText")}</p>
                    <Link to={d.cta_link || "/Shop-1"}>{v("cta_btn", "boutique.ctaBtn")}</Link>
                </section>
            </div>
        </>
    );
};

export default BoutiqueStore;
