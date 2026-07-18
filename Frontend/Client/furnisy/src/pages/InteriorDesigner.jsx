import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AccountHeader from "../Common/AccountHeader";
import { useTranslation } from "../context/LanguageContext";
import "../assets/style/FooterPages.css";

const API = "http://localhost:5000";
const SLUG = "interior-designer";

const InteriorDesigner = () => {
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
            <AccountHeader title={v("hero_title", "interior.title")} breadcrumb={`${t("breadcrumb.home")} → ${t("breadcrumb.interiorDesigner")}`} />
            <div className="page-wrapper">
                <section className="page-hero">
                    <img src={d.hero_image || "/images/about 1.webp"} alt="Interior Design" />
                    <div className="page-hero-overlay">
                        <h1>{v("hero_title", "interior.heroTitle")}</h1>
                        <p>{v("hero_subtitle", "interior.heroSubtitle")}</p>
                    </div>
                </section>

                <section className="page-section">
                    <div className="page-section-text">
                        <h2>{v("section1_title", "interior.section1Title")}</h2>
                        <p>{v("section1_text1", "interior.section1Text1")}</p>
                        <p>{v("section1_text2", "interior.section1Text2")}</p>
                    </div>
                    <div className="page-section-image">
                        <img src={d.section1_image || "/images/about2.webp"} alt="Design Process" />
                    </div>
                </section>

                <section className="page-features">
                    <h2>{v("features_title", "interior.servicesTitle")}</h2>
                    <div className="features-grid">
                        {[
                            { icon: d.feature1_icon || "🏠", title: "feature1_title", tx: "interior.service1Title", desc: "feature1_desc", txd: "interior.service1Desc" },
                            { icon: d.feature2_icon || "📐", title: "feature2_title", tx: "interior.service2Title", desc: "feature2_desc", txd: "interior.service2Desc" },
                            { icon: d.feature3_icon || "🎨", title: "feature3_title", tx: "interior.service3Title", desc: "feature3_desc", txd: "interior.service3Desc" },
                            { icon: d.feature4_icon || "🛋️", title: "feature4_title", tx: "interior.service4Title", desc: "feature4_desc", txd: "interior.service4Desc" },
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
                        <h2>{v("section2_title", "interior.section2Title")}</h2>
                        <p>{v("section2_text1", "interior.section2Text1")}</p>
                        <p>{v("section2_text2", "interior.section2Text2")}</p>
                    </div>
                    <div className="page-section-image">
                        <img src={d.section2_image || "/images/about 3.webp"} alt="Finished Room" />
                    </div>
                </section>

                <section className="page-stats">
                    <div className="page-stat">
                        <h3>{d.stat1_value || "500+"}</h3>
                        <span>{v("stat1_label", "interior.stat1")}</span>
                    </div>
                    <div className="page-stat">
                        <h3>{d.stat2_value || "98%"}</h3>
                        <span>{v("stat2_label", "interior.stat2")}</span>
                    </div>
                    <div className="page-stat">
                        <h3>{d.stat3_value || "15+"}</h3>
                        <span>{v("stat3_label", "interior.stat3")}</span>
                    </div>
                </section>

                <section className="page-cta">
                    <h2>{v("cta_title", "interior.ctaTitle")}</h2>
                    <p>{v("cta_text", "interior.ctaText")}</p>
                    <Link to={d.cta_link || "/contact"}>{v("cta_btn", "interior.ctaBtn")}</Link>
                </section>
            </div>
        </>
    );
};

export default InteriorDesigner;
