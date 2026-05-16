import React from "react";
import ReusableButton from "../Common/Commonbutton";
import "../assets/style/BeInspired.css";
import Inspired from "../../public/images/inspired.webp"
import { FaArrowRight } from "react-icons/fa"; // Using react-icons

const BeInspired = () => {
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
          <h2>Be Inspired...</h2>

          <p>
            Are you planning on redecorating your living room or freshening things up a bit? Find soft furnishings to create a brand-new look in no time, or discover your next vibe for a complete refresh...
          </p>

          <ul className="be-inspired__list">
            <li>Effortless browsing experience</li>
            <li>Access to the finest 5% of designers for your living space</li>
            <li>Secure payment options for peace of mind</li>
          </ul>

          <ReusableButton
            text={
              <>
                Shop Living Room <FaArrowRight />
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
