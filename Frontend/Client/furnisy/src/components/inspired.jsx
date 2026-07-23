import React, { useState, useEffect } from "react";
import ReusableButton from "../Common/Commonbutton";
import "../assets/style/BeInspired.css";
import { FaArrowRight } from "react-icons/fa";
import { useTranslation } from "../context/LanguageContext";

const API = "http://localhost:5000";

const BeInspired = () => {
  const { t, lang } = useTranslation();
  const [sections, setSections] = useState([]);

  useEffect(() => {
    fetch(`${API}/api/inspired-sections`)
      .then((res) => res.json())
      .then((json) => { if (json.success) setSections(json.data || []); })
      .catch(() => {});
  }, []);

  if (sections.length === 0) return null;

  return (
    <>
      {sections.map((section) => (
        <section className="be-inspired" key={section.id}>
          <div className="be-inspired__container">

            {/* Left Image */}
            <div className="be-inspired__image">
              {section.image ? (
                <img
                  src={`${API}${section.image.replace(/\\/g, "/")}`}
                  alt={section.heading}
                />
              ) : (
                <div className="be-inspired__image-placeholder" />
              )}
            </div>

            {/* Right Content */}
            <div className="be-inspired__content">
              <h2>{lang === "en" ? section.heading : t("inspired.heading")}</h2>

              <p>
                {lang === "en" ? section.description : t("inspired.desc")}
              </p>

              <ul className="be-inspired__list">
                {section.point1 && <li>{lang === "en" ? section.point1 : t("inspired.point1")}</li>}
                {section.point2 && <li>{lang === "en" ? section.point2 : t("inspired.point2")}</li>}
                {section.point3 && <li>{lang === "en" ? section.point3 : t("inspired.point3")}</li>}
              </ul>

              {section.button_text && (
                <ReusableButton
                  text={
                    <>
                      {lang === "en" ? section.button_text : t("inspired.shopLiving")} <FaArrowRight />
                    </>
                  }
                  onClick={() => { if (section.button_link) window.location.href = section.button_link; }}
                  style={{
                    padding: "clamp(0.4rem, 1.5vw, 1.2rem) clamp(0.8rem, 3vw, 2.5rem)",
                    fontSize: "clamp(1rem, 2vw, 1.5rem)",
                    borderRadius: "0.5rem",
                    fontWeight: 300,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                />
              )}
            </div>

          </div>
        </section>
      ))}
    </>
  );
};

export default BeInspired;
