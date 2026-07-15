import React from "react";
import { useTranslation } from "../context/LanguageContext";

const tags = ["Furniture", "Bedroom", "Living room", "Decor", "Office"];

const BlogTags = () => {
  const { t } = useTranslation();
  return (
    <div className="sidebar-box">
      <h4>{t("blog.tags")}</h4>
      <div className="tag-list">
        {tags.map((tag, i) => (
          <span key={i} className="tag">
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
};

export default BlogTags;
