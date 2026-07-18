import { useState, useEffect } from "react";
import "../../assets/style/Banner.css";
import FilePicker from "../common/FilePicker";
import {
  FaImage, FaPlus, FaEdit, FaTrash, FaCheck, FaTimes,
  FaSpinner, FaEye, FaEyeSlash, FaSortUp, FaSortDown, FaLink, FaAlignLeft
} from "react-icons/fa";

const API = "http://localhost:5000";

const BannerAdmin = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [bulkDeleteConfirm, setBulkDeleteConfirm] = useState(false);
  const [toast, setToast] = useState(null);
  const [form, setForm] = useState({
    title: "", subtitle: "", image: "", link: "", sort_order: 0, status: "active"
  });

  useEffect(() => { fetchBanners(); }, []);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 2500); };

  const fetchBanners = async () => {
    try {
      const res = await fetch(`${API}/api/banners`);
      const data = await res.json();
      if (data.success) setBanners(data.data);
    } catch (err) { console.log(err); }
    finally { setLoading(false); }
  };

  const resetForm = () => {
    setForm({ title: "", subtitle: "", image: "", link: "", sort_order: 0, status: "active" });
    setEditId(null);
    setShowForm(false);
  };

  const handleSave = async () => {
    if (!form.image.trim()) { showToast("Image path is required"); return; }
    try {
      const url = editId ? `${API}/api/banners/${editId}` : `${API}/api/banners`;
      const method = editId ? "PUT" : "POST";
      await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      resetForm();
      fetchBanners();
      showToast(editId ? "Banner updated" : "Banner created");
    } catch (err) { console.log(err); }
  };

  const handleEdit = (b) => {
    setForm({ title: b.title || "", subtitle: b.subtitle || "", image: b.image || "", link: b.link || "", sort_order: b.sort_order || 0, status: b.status });
    setEditId(b.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`${API}/api/banners/${id}`, { method: "DELETE" });
      setDeleteConfirm(null);
      fetchBanners();
      showToast("Banner deleted");
    } catch (err) { console.log(err); }
  };

  const toggleSelect = (id) => {
    setSelected((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  };

  const toggleAll = () => {
    if (selected.length === banners.length) setSelected([]);
    else setSelected(banners.map((b) => b.id));
  };

  const handleBulkDelete = async () => {
    try {
      await Promise.all(selected.map((id) => fetch(`${API}/api/banners/${id}`, { method: "DELETE" })));
      setSelected([]);
      setBulkDeleteConfirm(false);
      fetchBanners();
      showToast(`${selected.length} banner(s) deleted`);
    } catch (err) { console.log(err); }
  };

  const toggleStatus = async (b) => {
    const newStatus = b.status === "active" ? "inactive" : "active";
    try {
      await fetch(`${API}/api/banners/${b.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...b, status: newStatus }),
      });
      fetchBanners();
      showToast(`Banner ${newStatus}`);
    } catch (err) { console.log(err); }
  };

  const moveSortOrder = async (b, dir) => {
    const newOrder = b.sort_order + dir;
    if (newOrder < 0) return;
    try {
      await fetch(`${API}/api/banners/${b.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...b, sort_order: newOrder }),
      });
      fetchBanners();
    } catch (err) { console.log(err); }
  };

  const activeCount = banners.filter((b) => b.status === "active").length;
  const inactiveCount = banners.length - activeCount;

  return (
    <div className="bn-page">
      {toast && <div className="bn-toast">{toast}</div>}

      {/* Hero */}
      <div className="bn-hero">
        <div className="bn-hero-overlay">
          <h2><FaImage /> Banner Management</h2>
          <p>Manage homepage banner slides</p>
        </div>
      </div>

      {/* Stats */}
      <div className="bn-stats-row">
        <div className="bn-stat-card bn-stat-blue">
          <div className="bn-stat-icon"><FaImage /></div>
          <div><span className="bn-stat-value">{banners.length}</span><span className="bn-stat-label">Total</span></div>
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

      {/* Toolbar */}
      <div className="bn-toolbar">
        {!showForm && (
          <button className="bn-btn bn-btn-primary" onClick={() => { resetForm(); setShowForm(true); }}>
            <FaPlus /> Add Banner
          </button>
        )}
        {selected.length > 0 && (
          <button className="bn-btn bn-btn-danger" onClick={() => setBulkDeleteConfirm(true)}>
            <FaTrash /> Delete ({selected.length})
          </button>
        )}
      </div>

      {/* Inline Form Card */}
      {showForm && (
        <div className="bn-inline-card">
          <div className="bn-inline-card-header">
            <h3><FaImage /> {editId ? "Edit Banner" : "Add New Banner"}</h3>
            <button className="bn-inline-close" onClick={resetForm}><FaTimes /></button>
          </div>
          <div className="bn-inline-card-body">
            <div className="bn-form-group">
              <label><FaAlignLeft /> Title (supports \n for line breaks)</label>
              <textarea rows={3} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Minimalist\nFurniture\nCollection" />
            </div>
            <div className="bn-form-group">
              <label><FaAlignLeft /> Subtitle</label>
              <input value={form.subtitle} onChange={(e) => setForm({ ...form, subtitle: e.target.value })} placeholder="Handcrafted for modern living spaces" />
            </div>
            <div className="bn-form-group">
              <label><FaImage /> Banner Image</label>
              <FilePicker value={form.image} onChange={(val) => setForm({ ...form, image: val })} type="image" placeholder="Click to select banner image" />
            </div>
            <div className="bn-form-group">
              <label><FaLink /> Link URL</label>
              <input value={form.link} onChange={(e) => setForm({ ...form, link: e.target.value })} placeholder="/Shop-1" />
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

      {/* Bulk Delete Confirm */}
      {bulkDeleteConfirm && (
        <div className="bn-modal-overlay" onClick={() => setBulkDeleteConfirm(false)}>
          <div className="bn-modal bn-modal-sm" onClick={(e) => e.stopPropagation()}>
            <div className="bn-modal-header bn-modal-header-danger">
              <h3><FaTrash /> Delete {selected.length} Banner(s)</h3>
            </div>
            <div className="bn-modal-body">
              <p>Are you sure? This cannot be undone.</p>
            </div>
            <div className="bn-modal-footer">
              <button className="bn-btn bn-btn-cancel" onClick={() => setBulkDeleteConfirm(false)}>Cancel</button>
              <button className="bn-btn bn-btn-danger" onClick={handleBulkDelete}>Delete All</button>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      {loading ? (
        <div className="bn-loading"><FaSpinner className="fa-spin" /> Loading...</div>
      ) : banners.length === 0 ? (
        <div className="bn-empty"><FaImage /> No banners yet. Add your first banner!</div>
      ) : (
        <div className="bn-table-wrapper">
          <table className="bn-table">
            <thead>
              <tr>
                <th><input type="checkbox" checked={selected.length === banners.length && banners.length > 0} onChange={toggleAll} /></th>
                <th>Preview</th>
                <th>Title</th>
                <th>Subtitle</th>
                <th>Link</th>
                <th>Order</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {banners.map((b) => (
                <tr key={b.id} className={selected.includes(b.id) ? "bn-row-selected" : ""}>
                  <td><input type="checkbox" checked={selected.includes(b.id)} onChange={() => toggleSelect(b.id)} /></td>
                  <td>
                    <div className="bn-thumb">
                      <img src={b.image?.startsWith("/") ? b.image : `/images/${b.image}`} alt="" onError={(e) => e.target.src = "/images/placeholder.png"} />
                    </div>
                  </td>
                  <td className="bn-text-max">{b.title?.replace(/\n/g, " ") || "-"}</td>
                  <td className="bn-text-max">{b.subtitle || "-"}</td>
                  <td><a href={b.link} target="_blank" rel="noreferrer" className="bn-link">{b.link || "-"}</a></td>
                  <td>
                    <div className="bn-sort-btns">
                      <button onClick={() => moveSortOrder(b, -1)}><FaSortUp /></button>
                      <span>{b.sort_order}</span>
                      <button onClick={() => moveSortOrder(b, 1)}><FaSortDown /></button>
                    </div>
                  </td>
                  <td>
                    <button className={`bn-status-badge ${b.status === "active" ? "bn-status-active" : "bn-status-inactive"}`} onClick={() => toggleStatus(b)}>
                      {b.status === "active" ? <><FaEye /> Active</> : <><FaEyeSlash /> Inactive</>}
                    </button>
                  </td>
                  <td>
                    <div className="bn-action-btns">
                      <button className="bn-action-edit" onClick={() => handleEdit(b)}><FaEdit /></button>
                      <button className="bn-action-delete" onClick={() => setDeleteConfirm(b.id)}><FaTrash /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {deleteConfirm && (
        <div className="bn-modal-overlay" onClick={() => setDeleteConfirm(null)}>
          <div className="bn-modal bn-modal-sm" onClick={(e) => e.stopPropagation()}>
            <div className="bn-modal-header bn-modal-header-danger">
              <h3><FaTrash /> Delete Banner</h3>
            </div>
            <div className="bn-modal-body">
              <p>Are you sure you want to delete this banner?</p>
            </div>
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

export default BannerAdmin;
