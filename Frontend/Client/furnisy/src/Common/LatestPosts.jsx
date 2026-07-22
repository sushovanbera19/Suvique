import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "../context/LanguageContext";

const API = "http://localhost:5000";

const LatestPosts = () => {
  const { t, lang } = useTranslation();
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetch(`${API}/api/blogs/published?lang=${lang}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setPosts(data.data.slice(0, 4).map((b) => ({
            id: b.id,
            title: b.title,
            image: b.image,
            date: new Date(b.created_at).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
          })));
        }
      })
      .catch(() => {});
  }, [lang]);

  if (posts.length === 0) return null;

  return (
    <div className="sidebar-box">
      <h4>{t("blog.latestPosts")}</h4>

      {posts.map((post) => (
        <div className="latest-post" key={post.id} onClick={() => navigate(`/blog-single?id=${post.id}`)} style={{ cursor: "pointer" }}>
          {post.image && (
            <img src={post.image.startsWith("http") ? post.image : `${API}${post.image.replace(/\\/g, "/")}`} alt={post.title} />
          )}
          <div>
            <p>{post.title}</p>
            <span>{post.date}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default LatestPosts;
