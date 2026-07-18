import { useState, useEffect } from "react";
import "../../assets/style/Banner.css";
import "../../assets/style/ReviewAdmin.css";
import FilePicker from "../common/FilePicker";
import {
  FaStar, FaPlus, FaEdit, FaTrash, FaTimes,
  FaSpinner, FaEye, FaEyeSlash, FaSortUp, FaSortDown, FaQuoteLeft, FaBox, FaImage
} from "react-icons/fa";

const API = "http://localhost:5000";

const ReviewAdmin = () => {
  const [reviews, setReviews] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [bulkDeleteConfirm, setBulkDeleteConfirm] = useState(false);
  const [toast, setToast] = useState(null);
  const [form, setForm] = useState({
    name: "", role: "", text: "", rating: 5, avatar: "/images/user-1.webp",
    sort_order: 0, status: "active", product_id: ""
  });

  useEffect(() => { fetchReviews(); fetchProducts(); }, []);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 2500); };

  const fetchReviews = async () => {
    try {
      const res = await fetch(`${API}/api/reviews`);
      const data = await res.json();
      if (data.success) setReviews(data.data);
    } catch (err) { console.log(err); }
    finally { setLoading(false); }
  };

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API}/api/products`);
      const data = await res.json();
      if (data.success) setProducts(data.data);
    } catch (err) { console.log(err); }
  };

  const resetForm = () => {
    setForm({ name: "", role: "", text: "", rating: 5, avatar: "/images/user-1.webp", sort_order: 0, status: "active", product_id: "" });
    setEditId(null);
    setShowForm(false);
  };

  const handleSave = async () => {
    if (!form.name.trim() || !form.text.trim()) { showToast("Name and review text are required"); return; }
    try {
      const url = editId ? `${API}/api/reviews/${editId}` : `${API}/api/reviews`;
      const method = editId ? "PUT" : "POST";
      const payload = { ...form, product_id: form.product_id || null };
      await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      resetForm();
      fetchReviews();
      showToast(editId ? "Review updated" : "Review created");
    } catch (err) { console.log(err); }
  };

  const handleEdit = (r) => {
    setForm({
      name: r.name || "", role: r.role || "", text: r.text || "", rating: r.rating || 5,
      avatar: r.avatar || "/images/user-1.webp", sort_order: r.sort_order || 0, status: r.status,
      product_id: r.product_id || ""
    });
    setEditId(r.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`${API}/api/reviews/${id}`, { method: "DELETE" });
      setDeleteConfirm(null);
      fetchReviews();
      showToast("Review deleted");
    } catch (err) { console.log(err); }
  };

  const toggleSelect = (id) => setSelected((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  const toggleAll = () => { if (selected.length === reviews.length) setSelected([]); else setSelected(reviews.map((r) => r.id)); };

  const handleBulkDelete = async () => {
    try {
      await Promise.all(selected.map((id) => fetch(`${API}/api/reviews/${id}`, { method: "DELETE" })));
      setSelected([]); setBulkDeleteConfirm(false); fetchReviews();
      showToast(`${selected.length} review(s) deleted`);
    } catch (err) { console.log(err); }
  };

  const toggleStatus = async (r) => {
    const newStatus = r.status === "active" ? "inactive" : "active";
    try {
      await fetch(`${API}/api/reviews/${r.id}`, {
        method: "PUT", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...r, product_id: r.product_id || null, status: newStatus }),
      });
      fetchReviews(); showToast(`Review ${newStatus}`);
    } catch (err) { console.log(err); }
  };

  const moveSortOrder = async (r, dir) => {
    const newOrder = r.sort_order + dir;
    if (newOrder < 0) return;
    try {
      await fetch(`${API}/api/reviews/${r.id}`, {
        method: "PUT", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...r, product_id: r.product_id || null, sort_order: newOrder }),
      });
      fetchReviews();
    } catch (err) { console.log(err); }
  };

  const activeCount = reviews.filter((r) => r.status === "active").length;
  const inactiveCount = reviews.length - activeCount;

  const getProductName = (id) => {
    if (!id) return "General";
    const p = products.find((x) => x.id === id || x.product_id === id);
    return p ? p.product_name?.substring(0, 40) : `Product #${id}`;
  };

  return (
    <div className="bn-page">
      {toast && <div className="bn-toast">{toast}</div>}

      <div className="rv-hero">
        <div className="bn-hero-overlay">
          <h2><FaStar /> Review Management</h2>
          <p>Manage customer testimonials and product reviews</p>
        </div>
      </div>

      <div className="bn-stats-row">
        <div className="bn-stat-card bn-stat-blue">
          <div className="bn-stat-icon"><FaStar /></div>
          <div><span className="bn-stat-value">{reviews.length}</span><span className="bn-stat-label">Total</span></div>
        </div>
        <div className="bn-stat-card bn-stat-green">
          <div className="bn-stat-icon"><FaEye /></div>
          <div><span className="bn-stat-value">{activeCount}</span><span className="bn-stat-label">Active</span></div>
        </div>
        <div className="bn-stat-card bn-stat-red">
          <div className="bn-stat-icon"><FaEyeSlash /></div>
          <div><span className="bn-stat-value">{inactiveCount}</span><span className="bn-stat-label">Inactive</span></div>
        </div>
      </div>

      <div className="bn-toolbar">
        {!showForm && (
          <button className="bn-btn bn-btn-primary" onClick={() => { resetForm(); setShowForm(true); }}>
            <FaPlus /> Add Review
          </button>
        )}
        {selected.length > 0 && (
          <button className="bn-btn bn-btn-danger" onClick={() => setBulkDeleteConfirm(true)}>
            <FaTrash /> Delete ({selected.length})
          </button>
        )}
      </div>

      {showForm && (
        <div className="bn-inline-card">
          <div className="bn-inline-card-header rv-inline-header">
            <h3><FaStar /> {editId ? "Edit Review" : "Add New Review"}</h3>
            <button className="bn-inline-close" onClick={resetForm}><FaTimes /></button>
          </div>
          <div className="bn-inline-card-body">
            <div className="bn-form-row">
              <div className="bn-form-group">
                <label>Reviewer Name *</label>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="John Smith" />
              </div>
              <div className="bn-form-group">
                <label>Role / Title</label>
                <input value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} placeholder="Interior Designer" />
              </div>
            </div>
            <div className="bn-form-group">
              <label><FaBox /> Assign to Product</label>
              <select value={form.product_id} onChange={(e) => setForm({ ...form, product_id: e.target.value })}>
                <option value="">— General Review (no product) —</option>
                {products.map((p) => (
                  <option key={p.id || p.product_id} value={p.id || p.product_id}>{p.product_name?.substring(0, 60)}</option>
                ))}
              </select>
            </div>
            <div className="bn-form-group">
              <label><FaQuoteLeft /> Review Text *</label>
              <textarea rows={3} value={form.text} onChange={(e) => setForm({ ...form, text: e.target.value })} placeholder="Write the customer review..." />
            </div>
            <div className="bn-form-row">
              <div className="bn-form-group">
                <label>Rating (1-5)</label>
                <div className="rv-rating-select">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <FaStar key={n} className={n <= form.rating ? "rv-star-active" : "rv-star-inactive"} onClick={() => setForm({ ...form, rating: n })} />
                  ))}
                </div>
              </div>
              <div className="bn-form-group">
                <label><FaImage /> Avatar Image</label>
                <FilePicker value={form.avatar} onChange={(val) => setForm({ ...form, avatar: val })} type="image" placeholder="Click to select avatar image" />
              </div>
            </div>
            <div className="bn-form-row">
              <div className="bn-form-group">
                <label>Sort Order</label>
                <input type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })} />
              </div>
              <div className="bn-form-group">
                <label>Status</label>
                <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
          </div>
          <div className="bn-inline-card-footer">
            <button className="bn-btn bn-btn-cancel" onClick={resetForm}>Cancel</button>
            <button className="bn-btn bn-btn-primary" onClick={handleSave}>{editId ? "Update" : "Create"}</button>
          </div>
        </div>
      )}

      {bulkDeleteConfirm && (
        <div className="bn-modal-overlay" onClick={() => setBulkDeleteConfirm(false)}>
          <div className="bn-modal bn-modal-sm" onClick={(e) => e.stopPropagation()}>
            <div className="bn-modal-header bn-modal-header-danger"><h3><FaTrash /> Delete {selected.length} Review(s)</h3></div>
            <div className="bn-modal-body"><p>Are you sure? This cannot be undone.</p></div>
            <div className="bn-modal-footer">
              <button className="bn-btn bn-btn-cancel" onClick={() => setBulkDeleteConfirm(false)}>Cancel</button>
              <button className="bn-btn bn-btn-danger" onClick={handleBulkDelete}>Delete All</button>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="bn-loading"><FaSpinner className="fa-spin" /> Loading...</div>
      ) : reviews.length === 0 ? (
        <div className="bn-empty"><FaStar /> No reviews yet. Add your first review!</div>
      ) : (
        <div className="bn-table-wrapper">
          <table className="bn-table">
            <thead>
              <tr>
                <th><input type="checkbox" checked={selected.length === reviews.length && reviews.length > 0} onChange={toggleAll} /></th>
                <th>Avatar</th>
                <th>Name</th>
                <th>Product</th>
                <th>Review</th>
                <th>Rating</th>
                <th>Order</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {reviews.map((r) => (
                <tr key={r.id} className={selected.includes(r.id) ? "bn-row-selected" : ""}>
                  <td><input type="checkbox" checked={selected.includes(r.id)} onChange={() => toggleSelect(r.id)} /></td>
                  <td>
                    <div className="bn-thumb" style={{ borderRadius: "50%" }}>
                      <img src={r.avatar?.startsWith("/") ? r.avatar : `/images/${r.avatar}`} alt="" onError={(e) => e.target.src = "/images/user-1.webp"} />
                    </div>
                  </td>
                  <td className="bn-text-max">{r.name}</td>
                  <td className="bn-text-max" title={getProductName(r.product_id)}>
                    {r.product_id ? <span className="rv-product-tag"><FaBox /> {getProductName(r.product_id)}</span> : <span className="rv-general-tag">General</span>}
                  </td>
                  <td className="bn-text-max">{r.text?.substring(0, 50)}...</td>
                  <td>
                    <div className="rv-stars-inline">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <FaStar key={i} className={i < r.rating ? "rv-star-active" : "rv-star-inactive"} />
                      ))}
                    </div>
                  </td>
                  <td>
                    <div className="bn-sort-btns">
                      <button onClick={() => moveSortOrder(r, -1)}><FaSortUp /></button>
                      <span>{r.sort_order}</span>
                      <button onClick={() => moveSortOrder(r, 1)}><FaSortDown /></button>
                    </div>
                  </td>
                  <td>
                    <button className={`bn-status-badge ${r.status === "active" ? "bn-status-active" : "bn-status-inactive"}`} onClick={() => toggleStatus(r)}>
                      {r.status === "active" ? <><FaEye /> Active</> : <><FaEyeSlash /> Inactive</>}
                    </button>
                  </td>
                  <td>
                    <div className="bn-action-btns">
                      <button className="bn-action-edit" onClick={() => handleEdit(r)}><FaEdit /></button>
                      <button className="bn-action-delete" onClick={() => setDeleteConfirm(r.id)}><FaTrash /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {deleteConfirm && (
        <div className="bn-modal-overlay" onClick={() => setDeleteConfirm(null)}>
          <div className="bn-modal bn-modal-sm" onClick={(e) => e.stopPropagation()}>
            <div className="bn-modal-header bn-modal-header-danger"><h3><FaTrash /> Delete Review</h3></div>
            <div className="bn-modal-body"><p>Are you sure you want to delete this review?</p></div>
            <div className="bn-modal-footer">
              <button className="bn-btn bn-btn-cancel" onClick={() => setDeleteConfirm(null)}>Cancel</button>
              <button className="bn-btn bn-btn-danger" onClick={() => handleDelete(deleteConfirm)}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewAdmin;
