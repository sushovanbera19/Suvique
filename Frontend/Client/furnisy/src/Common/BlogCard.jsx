import React from "react";
import "../assets/style/Mainblogcard.css"
import { useTranslation } from "../context/LanguageContext";

const BlogCard = ({ blog }) => {
  const { t } = useTranslation();
  if (!blog) return null; // prevents crash

  return (
    <div className="blog-card">
      <img src={blog.image} alt={blog.title} />
      <div className="blog-info">
        <p className="blog-meta">
          {blog.date} • {blog.category} • {t("blog.by")} {blog.author}
        </p>
        <h3>{blog.title}</h3>
        <p>{blog.description}</p>
      </div>
    </div>
  );
};

export default BlogCard;
