import React from "react";
import "../assets/style/CategoryStrip.css";

const CategoryStrip = ({ categories }) => {
  return (
    <div className="category-strip">
      {categories.map((cat) => (
        <div key={cat.id} className="category-item">
          <div className="category-image">
            <img src={cat.image} alt={cat.title} />
          </div>

          <h4 className="category-title">{cat.title}</h4>
          <p className="category-count">{cat.count} Products</p>
        </div>
      ))}
    </div>
  );
};

export default CategoryStrip;
