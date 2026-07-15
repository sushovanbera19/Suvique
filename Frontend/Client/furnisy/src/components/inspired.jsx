import React from "react";
import ReusableButton from "../Common/Commonbutton";
import "../assets/style/BeInspired.css";
import Inspired from "../../public/images/inspired.webp"
import { FaArrowRight } from "react-icons/fa"; // Using react-icons
import { useTranslation } from "../context/LanguageContext";

const BeInspired = () => {
  const { t } = useTranslation();
  return (
    <section className="be-inspired">
      <div className="be-inspired__container">

        {/* Left Image */}
        <div className="be-inspired__image">
          <img
            src={Inspired}
            alt="Modern Living Room"
          />
        </div>

        {/* Right Content */}
        <div className="be-inspired__content">
          <h2>{t("inspired.heading")}</h2>

          <p>
            {t("inspired.desc")}
          </p>

          <ul className="be-inspired__list">
            <li>{t("inspired.point1")}</li>
            <li>{t("inspired.point2")}</li>
            <li>{t("inspired.point3")}</li>
          </ul>

          <ReusableButton
            text={
              <>
                {t("inspired.shopLiving")} <FaArrowRight />
              </>
            }
            onClick={() => console.log("Navigate to Living Room")}
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

        </div>

      </div>
    </section>
  );
};

export default BeInspired;
