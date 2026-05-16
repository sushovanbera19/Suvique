import React from "react";

const ViewAllButton = ({ 
  text = "View All", 
  onClick = () => {}, 
  style = {} 
}) => {
  // Default inline styles
  const defaultStyle = {
    fontSize: "18px",
    padding: "10px 20px",
    cursor: "pointer",
    fontFamily: "'Dosis', sans-serif",
    fontWeight: 400,
    background: "transparent",
    border: "none",
    borderBottom: "2px solid #000",
   
    ...style, // merge with custom styles
  };

  return (
    <button onClick={onClick} style={defaultStyle}>
      {text}
    </button>
  );
};

export default ViewAllButton;
