import React, { useEffect, useState } from "react";
import AccountHeader from "../Common/AccountHeader";
import { useTranslation } from "../context/LanguageContext";
import "../assets/style/FooterPages.css";

const API = "http://localhost:5000";
const SLUG = "customers";

const Customers = () => {
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

    const testimonials = [
        { text: t("customers.testimonial1Text"), name: t("customers.testimonial1Name"), role: t("customers.testimonial1Role"), img: "/images/user-1.webp" },
        { text: t("customers.testimonial2Text"), name: t("customers.testimonial2Name"), role: t("customers.testimonial2Role"), img: "/images/user-1.webp" },
        { text: t("customers.testimonial3Text"), name: t("customers.testimonial3Name"), role: t("customers.testimonial3Role"), img: "/images/user-1.webp" },
    ];

    return (
        <>
            <AccountHeader title={v("hero_title", "customers.title")} breadcrumb="Home → Our Customers" />
            <div className="page-wrapper">
                <section className="page-hero">
                    <img src={d.hero_image || "/images/inspired.webp"} alt="Our Customers" />
                    <div className="page-hero-overlay">
                        <h1>{v("hero_title", "customers.heroTitle")}</h1>
                        <p>{v("hero_subtitle", "customers.heroSubtitle")}</p>
                    </div>
                </section>

                <section className="page-section">
                    <div className="page-section-text">
                        <h2>{v("section1_title", "customers.section1Title")}</h2>
                        <p>{v("section1_text1", "customers.section1Text1")}</p>
                        <p>{v("section1_text2", "customers.section1Text2")}</p>
                    </div>
                    <div className="page-section-image">
                        <img src={d.section1_image || "/images/about 1.webp"} alt="Happy Customers" />
                    </div>
                </section>

                <section className="page-features">
                    <h2>{v("features_title", "customers.testimonialsTitle")}</h2>
                    <div className="testimonials-grid">
                        {testimonials.map((item, i) => (
                            <div className="testimonial-card" key={i}>
                                <p>"{item.text}"</p>
                                <div className="testimonial-author">
                                    <img src={item.img} alt={item.name} />
                                    <span>{item.name} — {item.role}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="page-stats">
                    <div className="page-stat">
                        <h3>{d.stat1_value || "25k+"}</h3>
                        <span>{v("stat1_label", "customers.stat1")}</span>
                    </div>
                    <div className="page-stat">
                        <h3>{d.stat2_value || "4.9/5"}</h3>
                        <span>{v("stat2_label", "customers.stat2")}</span>
                    </div>
                    <div className="page-stat">
                        <h3>{d.stat3_value || "99%"}</h3>
                        <span>{v("stat3_label", "customers.stat3")}</span>
                    </div>
                </section>

                <section className="page-section reverse">
                    <div className="page-section-text">
                        <h2>{v("section2_title", "customers.section2Title")}</h2>
                        <p>{v("section2_text1", "customers.section2Text1")}</p>
                        <p>{v("section2_text2", "customers.section2Text2")}</p>
                    </div>
                    <div className="page-section-image">
                        <img src={d.section2_image || "/images/about2.webp"} alt="Customer Success" />
                    </div>
                </section>
            </div>
        </>
    );
};

export default Customers;
