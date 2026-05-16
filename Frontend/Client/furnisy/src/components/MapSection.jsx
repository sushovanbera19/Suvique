import React from "react";
import "../assets/style/ContactUs.css";

const MapSection = () => {
  return (
    <div className="map-section">
      <iframe
        title="Office Location"
        src="https://www.google.com/maps?q=California%20City%20USA&output=embed"
        width="100%"
        height="400"
        style={{ border: 0 }}
        allowFullScreen=""
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  );
};

export default MapSection;