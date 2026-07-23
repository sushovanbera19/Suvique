import React, { useState, useEffect } from 'react';
import '../assets/style/FurnitureGallery.css';
import ReusableButton from '../Common/Commonbutton';
import { FaInstagram } from 'react-icons/fa';
import { useTranslation } from "../context/LanguageContext";

const API = "http://localhost:5000";

function FurnitureGallery() {
  const { t, lang } = useTranslation();
  const [section, setSection] = useState(null);
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetch(`${API}/api/instagram`)
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data) {
          setSection(json.data.section || null);
          setItems(json.data.items || []);
        }
      })
      .catch(() => {});
  }, []);

  if (!section || items.length === 0) return null;

  return (
    <div className="gallery-container">
      <div className="gallery-header">
        <h2>{lang === "en" ? section.heading : t("gallery.heading")}</h2>

        <ReusableButton
          href={section.instagram_url}
          target="_blank"
          text={
            <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <FaInstagram /> {lang === "en" ? section.button_text : t("gallery.follow")}
            </span>
          }
          style={{
            padding: "0.6rem 1.2rem",
            fontSize: "1rem",
            borderRadius: "0.5rem",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
        />
      </div>

      <div className="gallery-grid">
        {items.map(item => (
          <div key={item.id} className="gallery-item">
            <div className="image-wrapper">
              {item.link ? (
                <a href={item.link} target="_blank" rel="noopener noreferrer" style={{ display: "block", width: "100%", height: "100%" }}>
                  <img src={item.image_url} alt={item.alt_text} loading="lazy" />
                </a>
              ) : (
                <img src={item.image_url} alt={item.alt_text} loading="lazy" />
              )}
              <div className="gallery-overlay">
                <div className="gallery-overlay-content">
                  <FaInstagram size={28} />
                  <h3>{lang === "en" ? section.overlay_text : t("gallery.viewMore")}</h3>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FurnitureGallery;
