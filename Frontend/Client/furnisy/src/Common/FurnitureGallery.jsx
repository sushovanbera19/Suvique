import React from 'react';
import '../assets/style/FurnitureGallery.css';
import ReusableButton from '../Common/Commonbutton';
import { FaInstagram } from 'react-icons/fa';

const furnitureItems = [
  {
    id: 1,
    src: "https://images.unsplash.com/photo-1615529182904-14819c35db37?w=800",
    alt: "Cozy bedroom with beige bedding and built-in shelves",
    
  },
];

function FurnitureGallery() {
  return (
    <div className="gallery-container">
      <div className="gallery-header">
        <h2>Furniture Gallery</h2>
        
        <ReusableButton
          href="https://instagram.com"
          target="_blank"
          text={
            <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <FaInstagram /> Follow 
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
        {furnitureItems.map(item => (
          <div key={item.id} className="gallery-item">
            <div className="image-wrapper">
              <img 
                src={item.src} 
                alt={item.alt} 
                loading="lazy"
              />
              <div className="gallery-overlay">
                <div className="gallery-overlay-content">
                  <h3>View more in<br></br> @furnisy</h3>
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
