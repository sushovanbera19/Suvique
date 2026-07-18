import Breadcrumb from "../common/Breadcrumb";
import "../../assets/style/Blog.css";
import { useEffect, useState } from "react";
import { useTranslation } from "../../hooks/useTranslation";
import {
  FaSave, FaTimes, FaImage, FaTag, FaSearch, FaPenFancy
} from "react-icons/fa";

const API = "http://localhost:5000";

const emptyForm = {
  title: "", description: "", content: "",
  category: "", author: "", image: "",
  slug: "", status: "draft", tags: "",
  meta_title: "", meta_description: "",
};

const BlogCreate = () => {
  const { t } = useTranslation();
  const [form, setForm] = useState(emptyForm);
  const [saved, setSaved] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const res = await fetch(`${API}/api/blogs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
        setForm(emptyForm);
      } else {
        alert(data.message || "Save failed");
      }
    } catch (err) { console.log(err); alert("Server Error"); }
  };

  return (
    <div className="content">
      <div className="page-top">
        <h1 className="page-title">{t("sidebar.createBlog")}</h1>
        <Breadcrumb />
      </div>

      {/* HERO BANNER */}
      <div className="blog-hero-banner blog-hero-create">
        <div className="blog-hero-overlay">
          <h2>Create New Blog</h2>
          <p>Write and publish a new blog post</p>
        </div>
      </div>

      {/* EDITOR HEADER */}
      <div className="blog-editor-header">
        <h2>New Blog Post</h2>
        <div className="blog-editor-header-actions">
          <button className="blog-cancel-btn" onClick={() => setForm(emptyForm)}>
            <FaTimes /> Clear
          </button>
          <button className="blog-save-btn" onClick={handleSave}>
            <FaSave /> Publish Blog
          </button>
        </div>
      </div>

      {/* EDITOR LAYOUT */}
      <div className="blog-editor-layout">
        <div className="blog-editor-main">
          <div className="blog-form-card">
            <div className="blog-form-card-header">
              <FaPenFancy /><h3>Post Content</h3>
            </div>
            <div className="blog-form-group">
              <label>Title *</label>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Enter blog title"
              />
            </div>
            <div className="blog-form-group">
              <label>Description</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Short description for blog listing..."
                rows="3"
              />
            </div>
            <div className="blog-form-group">
              <label>Content</label>
              <textarea
                name="content"
                value={form.content}
                onChange={handleChange}
                placeholder="Write your full blog content here..."
                rows="12"
                className="blog-content-textarea"
              />
            </div>
          </div>

          <div className="blog-form-card">
            <div className="blog-form-card-header">
              <FaImage /><h3>Featured Image</h3>
            </div>
            <div className="blog-form-group">
              <label>Image URL</label>
              <input
                type="text"
                name="image"
                value={form.image}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg"
              />
            </div>
            {form.image && (
              <div className="blog-img-preview">
                <img src={form.image} alt="Preview" />
              </div>
            )}
          </div>
        </div>

        <div className="blog-editor-sidebar">
          <div className="blog-form-card">
            <div className="blog-form-card-header">
              <FaTag /><h3>Post Settings</h3>
            </div>
            <div className="blog-form-group">
              <label>Status</label>
              <select name="status" value={form.status} onChange={handleChange}>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            </div>
            <div className="blog-form-group">
              <label>Category</label>
              <input
                type="text"
                name="category"
                value={form.category}
                onChange={handleChange}
                placeholder="e.g. Office Furniture"
              />
            </div>
            <div className="blog-form-group">
              <label>Author</label>
              <input
                type="text"
                name="author"
                value={form.author}
                onChange={handleChange}
                placeholder="Author name"
              />
            </div>
            <div className="blog-form-group">
              <label>Tags</label>
              <input
                type="text"
                name="tags"
                value={form.tags}
                onChange={handleChange}
                placeholder="furniture, home, design"
              />
            </div>
            <div className="blog-form-group">
              <label>Slug</label>
              <input
                type="text"
                name="slug"
                value={form.slug}
                onChange={handleChange}
                placeholder="auto-generated-from-title"
              />
            </div>
          </div>

          <div className="blog-form-card">
            <div className="blog-form-card-header">
              <FaSearch /><h3>SEO</h3>
            </div>
            <div className="blog-form-group">
              <label>Meta Title</label>
              <input
                type="text"
                name="meta_title"
                value={form.meta_title}
                onChange={handleChange}
                placeholder="SEO title"
              />
            </div>
            <div className="blog-form-group">
              <label>Meta Description</label>
              <textarea
                name="meta_description"
                value={form.meta_description}
                onChange={handleChange}
                placeholder="SEO description"
                rows="3"
              />
            </div>
          </div>
        </div>
      </div>

      {saved && (
        <div className="blog-toast">
          Blog created successfully!
        </div>
      )}
    </div>
  );
};

export default BlogCreate;
