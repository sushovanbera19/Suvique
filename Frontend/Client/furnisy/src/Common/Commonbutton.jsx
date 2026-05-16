import React from "react";
import "../assets/style/Button.css";

const Reuseablebutton = ({ text, onClick, type = "button", className = "", style }) => {
  return (
    <button
      type={type}
      className={`custom-button ${className}`}
      onClick={onClick}
      style={style} // ✅ apply the inline style here
    >
      {text}
    </button>
  );
};

export default Reuseablebutton;

