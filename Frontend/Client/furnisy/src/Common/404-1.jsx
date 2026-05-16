import React from "react";
import "../assets/style/NotFound.css";
import Reuseablebutton from "./Commonbutton";
import { FaArrowRight } from "react-icons/fa";

function NotFound({ backgroundImage }) {
  return (
    <div
      className="notfound-container"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundPosition: "left center",
        backgroundRepeat: "no-repeat",
        backgroundSize: "contain",
        backgroundColor: "#fefefe", // keeps your default color
      }}
    >
      <div className="notfound-content">
        <h1>404</h1>
        <p className="subtitle">Oops! Something Wrong</p>
        <p className="description">
          Sorry but the page you are looking for doesn’t exist.
        </p>
        <Reuseablebutton
          text={
            <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              Shop Now <FaArrowRight />
            </span>
          }
          style={{
            padding:
              "clamp(0.4rem, 1.5vw, 1.2rem) clamp(0.8rem, 3vw, 2.5rem)",
            fontSize: "clamp(1rem, 2vw, 1.5rem)",
            borderRadius: "0.5rem",
            fontWeight: 300,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            justifyContent: "center",
          }}
        />
      </div>
    </div>
  );
}

export default NotFound;
