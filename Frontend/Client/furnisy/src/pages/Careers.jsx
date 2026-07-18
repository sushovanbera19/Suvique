import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AccountHeader from "../Common/AccountHeader";
import { useTranslation } from "../context/LanguageContext";
import "../assets/style/FooterPages.css";

const API = "http://localhost:5000";
const SLUG = "careers";

const Careers = () => {
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

    const jobs = [
        { title: t("careers.job1Title"), type: t("careers.job1Type") },
        { title: t("careers.job2Title"), type: t("careers.job2Type") },
        { title: t("careers.job3Title"), type: t("careers.job3Type") },
        { title: t("careers.job4Title"), type: t("careers.job4Type") },
    ];

    return (
        <>
            <AccountHeader title={v("hero_title", "careers.title")} breadcrumb={`${t("breadcrumb.home")} → ${t("breadcrumb.careers")}`} />
            <div className="page-wrapper">
                <section className="page-hero">
                    <img src={d.hero_image || "/images/about 3.webp"} alt="Join Our Team" />
                    <div className="page-hero-overlay">
                        <h1>{v("hero_title", "careers.heroTitle")}</h1>
                        <p>{v("hero_subtitle", "careers.heroSubtitle")}</p>
                    </div>
                </section>

                <section className="page-section">
                    <div className="page-section-text">
                        <h2>{v("section1_title", "careers.section1Title")}</h2>
                        <p>{v("section1_text1", "careers.section1Text1")}</p>
                        <p>{v("section1_text2", "careers.section1Text2")}</p>
                    </div>
                    <div className="page-section-image">
                        <img src={d.section1_image || "/images/about2.webp"} alt="Our Team" />
                    </div>
                </section>

                <section className="page-features">
                    <h2>{v("features_title", "careers.benefitsTitle")}</h2>
                    <div className="features-grid">
                        {[
                            { icon: d.feature1_icon || "💼", title: "feature1_title", tx: "careers.benefit1Title", desc: "feature1_desc", txd: "careers.benefit1Desc" },
                            { icon: d.feature2_icon || "📚", title: "feature2_title", tx: "careers.benefit2Title", desc: "feature2_desc", txd: "careers.benefit2Desc" },
                            { icon: d.feature3_icon || "🌍", title: "feature3_title", tx: "careers.benefit3Title", desc: "feature3_desc", txd: "careers.benefit3Desc" },
                            { icon: d.feature4_icon || "🏥", title: "feature4_title", tx: "careers.benefit4Title", desc: "feature4_desc", txd: "careers.benefit4Desc" },
                        ].map((f, i) => (
                            <div className="feature-card" key={i}>
                                <div className="feature-icon">{f.icon}</div>
                                <h3>{v(f.title, f.tx)}</h3>
                                <p>{v(f.desc, f.txd)}</p>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="page-section" style={{ flexDirection: "column", textAlign: "center" }}>
                    <h2 style={{ fontSize: "clamp(26px,3vw,38px)", fontWeight: 400, marginBottom: 30 }}>{t("careers.openingsTitle")}</h2>
                    <div className="job-list">
                        {jobs.map((job, i) => (
                            <div className="job-item" key={i}>
                                <div className="job-info">
                                    <h3>{job.title}</h3>
                                    <p>{job.type}</p>
                                </div>
                                <Link to="/contact">{t("careers.applyBtn")}</Link>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="page-cta">
                    <h2>{v("cta_title", "careers.ctaTitle")}</h2>
                    <p>{v("cta_text", "careers.ctaText")}</p>
                    <Link to={d.cta_link || "/contact"}>{v("cta_btn", "careers.ctaBtn")}</Link>
                </section>
            </div>
        </>
    );
};

export default Careers;
