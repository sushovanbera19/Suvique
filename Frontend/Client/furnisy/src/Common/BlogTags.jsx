import React from "react";
import { useTranslation } from "../context/LanguageContext";

const BlogTags = ({ tags = [], onTagClick }) => {
  const { t } = useTranslation();
  return (
    <div className="sidebar-box">
      <h4>{t("blog.tags")}</h4>
      <div className="tag-list">
        {tags.map((tag, i) => (
          <span
            key={i}
            className="tag"
            style={{ cursor: onTagClick ? "pointer" : "default" }}
            onClick={() => onTagClick && onTagClick(tag)}
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
};

export default BlogTags;
