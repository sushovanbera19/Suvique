import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AccountHeader from "../Common/AccountHeader";
import { useTranslation } from "../context/LanguageContext";
import "../assets/style/FooterPages.css";

const API = "http://localhost:5000";
const SLUG = "smart-finance";

const SmartFinance = () => {
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
            <AccountHeader title={v("hero_title", "finance.title")} breadcrumb="Home → Smart Finance" />
            <div className="page-wrapper">
                <section className="page-hero">
                    <img src={d.hero_image || "/images/product 2.webp"} alt="Smart Furniture Finance" />
                    <div className="page-hero-overlay">
                        <h1>{v("hero_title", "finance.heroTitle")}</h1>
                        <p>{v("hero_subtitle", "finance.heroSubtitle")}</p>
                    </div>
                </section>

                <section className="page-section">
                    <div className="page-section-text">
                        <h2>{v("section1_title", "finance.section1Title")}</h2>
                        <p>{v("section1_text1", "finance.section1Text1")}</p>
                        <p>{v("section1_text2", "finance.section1Text2")}</p>
                    </div>
                    <div className="page-section-image">
                        <img src={d.section1_image || "/images/product 8.webp"} alt="Finance Options" />
                    </div>
                </section>

                <section className="page-features">
                    <h2>{v("features_title", "finance.howTitle")}</h2>
                    <div className="services-grid">
                        {[
                            { title: "feature1_title", tx: "finance.step1Title", desc: "feature1_desc", txd: "finance.step1Desc", num: 1 },
                            { title: "feature2_title", tx: "finance.step2Title", desc: "feature2_desc", txd: "finance.step2Desc", num: 2 },
                            { title: "feature3_title", tx: "finance.step3Title", desc: "feature3_desc", txd: "finance.step3Desc", num: 3 },
                            { title: "feature4_title", tx: "finance.step4Title", desc: "feature4_desc", txd: "finance.step4Desc", num: 4 },
                        ].map((f, i) => (
                            <div className="service-card" key={i}>
                                <div className="service-number">{f.num}</div>
                                <h3>{v(f.title, f.tx)}</h3>
                                <p>{v(f.desc, f.txd)}</p>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="page-stats">
                    <div className="page-stat">
                        <h3>{d.stat1_value || "0%"}</h3>
                        <span>{v("stat1_label", "finance.stat1")}</span>
                    </div>
                    <div className="page-stat">
                        <h3>{d.stat2_value || "36mo"}</h3>
                        <span>{v("stat2_label", "finance.stat2")}</span>
                    </div>
                    <div className="page-stat">
                        <h3>{d.stat3_value || "$500+"}</h3>
                        <span>{v("stat3_label", "finance.stat3")}</span>
                    </div>
                </section>

                <section className="page-cta">
                    <h2>{v("cta_title", "finance.ctaTitle")}</h2>
                    <p>{v("cta_text", "finance.ctaText")}</p>
                    <Link to={d.cta_link || "/Shop-1"}>{v("cta_btn", "finance.ctaBtn")}</Link>
                </section>
            </div>
        </>
    );
};

export default SmartFinance;
