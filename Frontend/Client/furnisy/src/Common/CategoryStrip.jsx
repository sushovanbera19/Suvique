import React from "react";
import "../assets/style/CategoryStrip.css";
import { useTranslation } from "../context/LanguageContext";

const CategoryStrip = ({ categories }) => {
  const { t } = useTranslation();
  return (
    <div className="category-strip">
      {categories.map((cat) => (
        <div key={cat.id} className="category-item">
          <div className="category-image">
            {cat.image ? (
              <img src={cat.image} alt={cat.title} />
            ) : (
              <div className="category-placeholder">
                <span>{cat.title?.charAt(0)}</span>
              </div>
            )}
          </div>

          <h4 className="category-title">{cat.title}</h4>
          {cat.count > 0 && (
            <p className="category-count">{cat.count}{t("common.products")}</p>
          )}
        </div>
      ))}
    </div>
  );
};

export default CategoryStrip;
