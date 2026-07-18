import Breadcrumb from "../common/Breadcrumb";
import "../../assets/style/Blog.css";
import { useEffect, useState } from "react";
import { useTranslation } from "../../hooks/useTranslation";
import { useParams, useNavigate } from "react-router-dom";
import {
  FaEdit, FaArrowLeft, FaCalendar, FaUser, FaTag,
  FaCheckCircle, FaClock, FaArchive
} from "react-icons/fa";

const API = "http://localhost:5000";

const BlogDetailsAdmin = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) fetchBlog(id);
  }, [id]);

  const fetchBlog = async (blogId) => {
    try {
      const res = await fetch(`${API}/api/blogs/${blogId}`);
      const data = await res.json();
      if (data.success) setBlog(data.data);
    } catch (err) { console.log(err); }
    finally { setLoading(false); }
  };

  if (loading) {
    return (
      <div className="content">
        <div className="page-top">
          <h1 className="page-title">{t("sidebar.blogDetails")}</h1>
          <Breadcrumb />
        </div>
        <div className="blog-loading">
          <div className="blog-loading-spinner" />
          <p>Loading blog...</p>
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="content">
        <div className="page-top">
          <h1 className="page-title">{t("sidebar.blogDetails")}</h1>
          <Breadcrumb />
        </div>
        <div className="blog-empty">
          <h3>Blog not found</h3>
          <button className="blog-add-btn" onClick={() => navigate("/dashboard/blogs")}>
            <FaArrowLeft /> Back to Blogs
          </button>
        </div>
      </div>
    );
  }

  const metaDate = new Date(blog.created_at).toLocaleDateString("en-GB", {
    day: "2-digit", month: "long", year: "numeric"
  });

  return (
    <div className="content">
      <div className="page-top">
        <h1 className="page-title">{t("sidebar.blogDetails")}</h1>
        <Breadcrumb />
      </div>

      {/* HERO BANNER */}
      <div className="blog-hero-banner blog-hero-details">
        <div className="blog-hero-overlay">
          <h2>Blog Details</h2>
          <p>Preview your blog post before publishing</p>
        </div>
      </div>

      {/* ACTION BAR */}
      <div className="blog-details-action-bar">
        <button className="blog-cancel-btn" onClick={() => navigate("/dashboard/blogs")}>
          <FaArrowLeft /> Back to Blogs
        </button>
        <button className="blog-save-btn" onClick={() => navigate(`/dashboard/blogs/edit/${blog.id}`)}>
          <FaEdit /> Edit Blog
        </button>
      </div>

      {/* BLOG CONTENT CARD */}
      <div className="blog-detail-card">
        {/* Cover Image */}
        {blog.image && (
          <div className="blog-detail-cover">
            <img src={blog.image} alt={blog.title} />
          </div>
        )}

        {/* Meta Info */}
        <div className="blog-detail-meta-row">
          <span className={`blog-status blog-status-${blog.status}`}>
            {blog.status === "published" && <FaCheckCircle />}
            {blog.status === "draft" && <FaClock />}
            {blog.status === "archived" && <FaArchive />}
            {" "}{blog.status}
          </span>
          <span className="blog-detail-meta-item">
            <FaCalendar /> {metaDate}
          </span>
          {blog.author && (
            <span className="blog-detail-meta-item">
              <FaUser /> {blog.author}
            </span>
          )}
          {blog.category && (
            <span className="blog-detail-meta-item">
              <FaTag /> {blog.category}
            </span>
          )}
        </div>

        {/* Title */}
        <h1 className="blog-detail-title">{blog.title}</h1>

        {/* Description */}
        {blog.description && (
          <p className="blog-detail-description">{blog.description}</p>
        )}

        {/* Tags */}
        {blog.tags && (
          <div className="blog-detail-tags">
            {blog.tags.split(",").map((tag, i) => (
              <span key={i} className="blog-tag">{tag.trim()}</span>
            ))}
          </div>
        )}

        {/* Content */}
        {blog.content && (
          <div
            className="blog-detail-content"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />
        )}

        {/* SEO Info */}
        {(blog.meta_title || blog.meta_description) && (
          <div className="blog-detail-seo">
            <h3>SEO Information</h3>
            {blog.meta_title && <p><strong>Meta Title:</strong> {blog.meta_title}</p>}
            {blog.meta_description && <p><strong>Meta Description:</strong> {blog.meta_description}</p>}
          </div>
        )}

        {/* Slug */}
        {blog.slug && (
          <div className="blog-detail-slug">
            <strong>Slug:</strong> <code>{blog.slug}</code>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogDetailsAdmin;
