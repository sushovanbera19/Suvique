import React from "react";
import { useNavigate } from "react-router-dom";
import "../assets/style/Mainblogcard.css"
import { useTranslation } from "../context/LanguageContext";

const API = "http://localhost:5000";

const BlogCard = ({ blog }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  if (!blog) return null;

  const handleClick = () => {
    if (blog.id) {
      navigate(`/blog-single?id=${blog.id}`);
    }
  };

  const imgSrc = blog.image ? (blog.image.startsWith("http") ? blog.image : `${API}${blog.image.replace(/\\/g, "/")}`) : "";

  return (
    <div className="blog-card" onClick={handleClick} style={{ cursor: blog.id ? "pointer" : "default" }}>
      {imgSrc && <img src={imgSrc} alt={blog.title} />}
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
