import Breadcrumb from "../common/Breadcrumb";
import "../../assets/style/Blog.css";
import { useEffect, useState } from "react";
import { useTranslation } from "../../hooks/useTranslation";
import { useNavigate } from "react-router-dom";
import {
  FaPlus, FaEdit, FaTrash, FaEye, FaSave, FaTimes,
  FaNewspaper, FaTag, FaUser, FaImage, FaSearch,
  FaCheckCircle, FaClock, FaArchive, FaPenFancy, FaCheckSquare
} from "react-icons/fa";

const API = "http://localhost:5000";

const emptyForm = {
  title: "", description: "", content: "",
  category: "", author: "", image: "",
  slug: "", status: "draft", tags: "",
  meta_title: "", meta_description: "",
};

const AdminBlog = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("list");
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [saved, setSaved] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const [bulkDeleteConfirm, setBulkDeleteConfirm] = useState(false);

  useEffect(() => { fetchBlogs(); }, []);

  const fetchBlogs = async () => {
    try {
      const res = await fetch(`${API}/api/blogs`);
      const data = await res.json();
      if (data.success) setBlogs(data.data);
    } catch (err) { console.log(err); }
    finally { setLoading(false); }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const url = editId ? `${API}/api/blogs/${editId}` : `${API}/api/blogs`;
      const method = editId ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
        fetchBlogs();
        setView("list");
        setForm(emptyForm);
        setEditId(null);
      } else {
        alert(data.message || "Save failed");
      }
    } catch (err) { console.log(err); alert("Server Error"); }
  };

  const handleEdit = async (blog) => {
    navigate(`/dashboard/blogs/edit/${blog.id}`);
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${API}/api/blogs/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        fetchBlogs();
        setDeleteConfirm(null);
        setSelectedIds((prev) => prev.filter((sid) => sid !== id));
      }
    } catch (err) { console.log(err); }
  };

  const handleBulkDelete = async () => {
    try {
      const res = await fetch(`${API}/api/blogs/bulk-delete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: selectedIds }),
      });
      const data = await res.json();
      if (data.success) {
        fetchBlogs();
        setBulkDeleteConfirm(false);
        setSelectedIds([]);
      }
    } catch (err) { console.log(err); }
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(filteredBlogs.map((b) => b.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    );
  };

  const handleCancel = () => {
    setForm(emptyForm);
    setEditId(null);
    setView("list");
  };

  const filteredBlogs = blogs.filter((blog) => {
    const matchSearch = blog.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.author?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = filterStatus === "all" || blog.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const allSelected = filteredBlogs.length > 0 && selectedIds.length === filteredBlogs.length;
  const someSelected = selectedIds.length > 0 && selectedIds.length < filteredBlogs.length;

  const stats = {
    total: blogs.length,
    published: blogs.filter(b => b.status === "published").length,
    draft: blogs.filter(b => b.status === "draft").length,
    archived: blogs.filter(b => b.status === "archived").length,
  };

  if (loading) {
    return (
      <div className="content">
        <div className="page-top">
          <h1 className="page-title">{t("sidebar.blog")}</h1>
          <Breadcrumb />
        </div>
        <div className="blog-loading">
          <div className="blog-loading-spinner" />
          <p>Loading blogs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="content">
      <div className="page-top">
        <h1 className="page-title">{t("sidebar.blog")}</h1>
        <Breadcrumb />
      </div>

      {/* HERO BANNER */}
      <div className="blog-hero-banner">
        <div className="blog-hero-overlay">
          <h2>Blog Manager</h2>
          <p>Create, edit, and manage your blog posts from one place</p>
        </div>
      </div>

      {/* STAT CARDS */}
      <div className="blog-stats-row">
        <div className="blog-stat-card blog-stat-purple">
          <div className="blog-stat-icon"><FaNewspaper /></div>
          <div className="blog-stat-info">
            <span className="blog-stat-value">{stats.total}</span>
            <span className="blog-stat-label">Total Posts</span>
          </div>
        </div>
        <div className="blog-stat-card blog-stat-green">
          <div className="blog-stat-icon"><FaCheckCircle /></div>
          <div className="blog-stat-info">
            <span className="blog-stat-value">{stats.published}</span>
            <span className="blog-stat-label">Published</span>
          </div>
        </div>
        <div className="blog-stat-card blog-stat-yellow">
          <div className="blog-stat-icon"><FaClock /></div>
          <div className="blog-stat-info">
            <span className="blog-stat-value">{stats.draft}</span>
            <span className="blog-stat-label">Drafts</span>
          </div>
        </div>
        <div className="blog-stat-card blog-stat-red">
          <div className="blog-stat-icon"><FaArchive /></div>
          <div className="blog-stat-info">
            <span className="blog-stat-value">{stats.archived}</span>
            <span className="blog-stat-label">Archived</span>
          </div>
        </div>
      </div>

      {/* LIST VIEW */}
      {view === "list" && (
        <>
          {/* TOOLBAR */}
          <div className="blog-toolbar">
            <div className="blog-search-box">
              <FaSearch className="blog-search-icon" />
              <input
                type="text"
                placeholder="Search blogs by title, category, author..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="blog-toolbar-right">
              {selectedIds.length > 0 && (
                <button className="blog-bulk-delete-btn" onClick={() => setBulkDeleteConfirm(true)}>
                  <FaTrash /> Delete Selected ({selectedIds.length})
                </button>
              )}
              <select
                className="blog-filter-select"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
                <option value="archived">Archived</option>
              </select>
              <button className="blog-add-btn" onClick={() => navigate("/dashboard/blogs/create")}>
                <FaPlus /> New Blog
              </button>
            </div>
          </div>

          {/* BLOG TABLE */}
          <div className="blog-table-card">
            {filteredBlogs.length === 0 ? (
              <div className="blog-empty">
                <FaNewspaper className="blog-empty-icon" />
                <h3>No blog posts found</h3>
                <p>Create your first blog post to get started.</p>
                <button className="blog-add-btn" onClick={() => navigate("/dashboard/blogs/create")}>
                  <FaPlus /> Create Blog
                </button>
              </div>
            ) : (
              <table className="blog-table">
                <thead>
                  <tr>
                    <th className="blog-th-checkbox">
                      <input
                        type="checkbox"
                        checked={allSelected}
                        ref={(el) => { if (el) el.indeterminate = someSelected; }}
                        onChange={handleSelectAll}
                      />
                    </th>
                    <th>#</th>
                    <th>Title</th>
                    <th>Category</th>
                    <th>Author</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBlogs.map((blog, idx) => (
                    <tr key={blog.id} className={selectedIds.includes(blog.id) ? "blog-row-selected" : ""}>
                      <td className="blog-td-checkbox">
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(blog.id)}
                          onChange={() => handleSelectOne(blog.id)}
                        />
                      </td>
                      <td>{idx + 1}</td>
                      <td>
                        <div className="blog-title-cell">
                          {blog.image && (
                            <img src={blog.image} alt="" className="blog-thumb" />
                          )}
                          <span className="blog-title-text">{blog.title}</span>
                        </div>
                      </td>
                      <td>
                        {blog.category && (
                          <span className="blog-tag">{blog.category}</span>
                        )}
                      </td>
                      <td>{blog.author || "—"}</td>
                      <td>
                        <span className={`blog-status blog-status-${blog.status}`}>
                          {blog.status}
                        </span>
                      </td>
                      <td>{new Date(blog.created_at).toLocaleDateString()}</td>
                      <td>
                        <div className="blog-actions">
                          <button className="blog-action-btn blog-action-view" onClick={() => navigate(`/dashboard/blogs/details/${blog.id}`)} title="View">
                            <FaEye />
                          </button>
                          <button className="blog-action-btn blog-action-edit" onClick={() => handleEdit(blog)} title="Edit">
                            <FaEdit />
                          </button>
                          <button className="blog-action-btn blog-action-delete" onClick={() => setDeleteConfirm(blog.id)} title="Delete">
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}

      {/* EDITOR VIEW (inline create/edit) */}
      {view === "editor" && (
        <>
          <div className="blog-editor-header">
            <h2>{editId ? "Edit Blog" : "Create New Blog"}</h2>
            <div className="blog-editor-header-actions">
              <button className="blog-cancel-btn" onClick={handleCancel}>
                <FaTimes /> Cancel
              </button>
              <button className="blog-save-btn" onClick={handleSave}>
                <FaSave /> {editId ? "Update Blog" : "Publish Blog"}
              </button>
            </div>
          </div>

          <div className="blog-editor-layout">
            <div className="blog-editor-main">
              <div className="blog-form-card">
                <div className="blog-form-card-header">
                  <FaPenFancy /><h3>Post Content</h3>
                </div>
                <div className="blog-form-group">
                  <label>Title *</label>
                  <input type="text" name="title" value={form.title} onChange={handleChange} placeholder="Enter blog title" />
                </div>
                <div className="blog-form-group">
                  <label>Description</label>
                  <textarea name="description" value={form.description} onChange={handleChange} placeholder="Short description..." rows="3" />
                </div>
                <div className="blog-form-group">
                  <label>Content</label>
                  <textarea name="content" value={form.content} onChange={handleChange} placeholder="Write your full blog content..." rows="12" className="blog-content-textarea" />
                </div>
              </div>

              <div className="blog-form-card">
                <div className="blog-form-card-header">
                  <FaImage /><h3>Featured Image</h3>
                </div>
                <div className="blog-form-group">
                  <label>Image URL</label>
                  <input type="text" name="image" value={form.image} onChange={handleChange} placeholder="https://example.com/image.jpg" />
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
                  <input type="text" name="category" value={form.category} onChange={handleChange} placeholder="e.g. Office Furniture" />
                </div>
                <div className="blog-form-group">
                  <label>Author</label>
                  <input type="text" name="author" value={form.author} onChange={handleChange} placeholder="Author name" />
                </div>
                <div className="blog-form-group">
                  <label>Tags</label>
                  <input type="text" name="tags" value={form.tags} onChange={handleChange} placeholder="furniture, home, design" />
                </div>
                <div className="blog-form-group">
                  <label>Slug</label>
                  <input type="text" name="slug" value={form.slug} onChange={handleChange} placeholder="auto-generated-from-title" />
                </div>
              </div>

              <div className="blog-form-card">
                <div className="blog-form-card-header">
                  <FaSearch /><h3>SEO</h3>
                </div>
                <div className="blog-form-group">
                  <label>Meta Title</label>
                  <input type="text" name="meta_title" value={form.meta_title} onChange={handleChange} placeholder="SEO title" />
                </div>
                <div className="blog-form-group">
                  <label>Meta Description</label>
                  <textarea name="meta_description" value={form.meta_description} onChange={handleChange} placeholder="SEO description" rows="3" />
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* SINGLE DELETE CONFIRM MODAL */}
      {deleteConfirm && (
        <div className="blog-modal-overlay" onClick={() => setDeleteConfirm(null)}>
          <div className="blog-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Delete Blog?</h3>
            <p>This action cannot be undone. Are you sure you want to delete this blog post?</p>
            <div className="blog-modal-actions">
              <button className="blog-modal-cancel" onClick={() => setDeleteConfirm(null)}>Cancel</button>
              <button className="blog-modal-delete" onClick={() => handleDelete(deleteConfirm)}>Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* BULK DELETE CONFIRM MODAL */}
      {bulkDeleteConfirm && (
        <div className="blog-modal-overlay" onClick={() => setBulkDeleteConfirm(false)}>
          <div className="blog-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Delete {selectedIds.length} Blog(s)?</h3>
            <p>This action cannot be undone. Are you sure you want to delete all {selectedIds.length} selected blog posts?</p>
            <div className="blog-modal-actions">
              <button className="blog-modal-cancel" onClick={() => setBulkDeleteConfirm(false)}>Cancel</button>
              <button className="blog-modal-delete" onClick={handleBulkDelete}>Delete All</button>
            </div>
          </div>
        </div>
      )}

      {/* SAVED TOAST */}
      {saved && (
        <div className="blog-toast">
          <FaCheckCircle /> Blog saved successfully!
        </div>
      )}
    </div>
  );
};

export default AdminBlog;
