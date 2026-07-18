import { useState, useEffect } from "react";
import "../../assets/style/Banner.css";
import FilePicker from "../common/FilePicker";
import {
  FaVideo, FaPlus, FaEdit, FaTrash, FaTimes,
  FaSpinner, FaEye, FaEyeSlash, FaSortUp, FaSortDown, FaPlay, FaImage
} from "react-icons/fa";

const API = "http://localhost:5000";

const VideoAdmin = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [bulkDeleteConfirm, setBulkDeleteConfirm] = useState(false);
  const [toast, setToast] = useState(null);
  const [form, setForm] = useState({
    title: "", video_url: "", thumbnail: "", sort_order: 0, status: "active"
  });

  useEffect(() => { fetchVideos(); }, []);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 2500); };

  const fetchVideos = async () => {
    try {
      const res = await fetch(`${API}/api/videos`);
      const data = await res.json();
      if (data.success) setVideos(data.data);
    } catch (err) { console.log(err); }
    finally { setLoading(false); }
  };

  const resetForm = () => {
    setForm({ title: "", video_url: "", thumbnail: "", sort_order: 0, status: "active" });
    setEditId(null);
    setShowForm(false);
  };

  const handleSave = async () => {
    if (!form.video_url.trim()) { showToast("Video URL is required"); return; }
    try {
      const url = editId ? `${API}/api/videos/${editId}` : `${API}/api/videos`;
      const method = editId ? "PUT" : "POST";
      await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      resetForm();
      fetchVideos();
      showToast(editId ? "Video updated" : "Video created");
    } catch (err) { console.log(err); }
  };

  const handleEdit = (v) => {
    setForm({ title: v.title || "", video_url: v.video_url || "", thumbnail: v.thumbnail || "", sort_order: v.sort_order || 0, status: v.status });
    setEditId(v.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`${API}/api/videos/${id}`, { method: "DELETE" });
      setDeleteConfirm(null);
      fetchVideos();
      showToast("Video deleted");
    } catch (err) { console.log(err); }
  };

  const toggleSelect = (id) => {
    setSelected((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  };

  const toggleAll = () => {
    if (selected.length === videos.length) setSelected([]);
    else setSelected(videos.map((v) => v.id));
  };

  const handleBulkDelete = async () => {
    try {
      await Promise.all(selected.map((id) => fetch(`${API}/api/videos/${id}`, { method: "DELETE" })));
      setSelected([]);
      setBulkDeleteConfirm(false);
      fetchVideos();
      showToast(`${selected.length} video(s) deleted`);
    } catch (err) { console.log(err); }
  };

  const toggleStatus = async (v) => {
    const newStatus = v.status === "active" ? "inactive" : "active";
    try {
      await fetch(`${API}/api/videos/${v.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...v, status: newStatus }),
      });
      fetchVideos();
      showToast(`Video ${newStatus}`);
    } catch (err) { console.log(err); }
  };

  const moveSortOrder = async (v, dir) => {
    const newOrder = v.sort_order + dir;
    if (newOrder < 0) return;
    try {
      await fetch(`${API}/api/videos/${v.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...v, sort_order: newOrder }),
      });
      fetchVideos();
    } catch (err) { console.log(err); }
  };

  const activeCount = videos.filter((v) => v.status === "active").length;
  const inactiveCount = videos.length - activeCount;

  return (
    <div className="bn-page">
      {toast && <div className="bn-toast">{toast}</div>}

      {/* Hero */}
      <div className="bn-hero bn-hero-video">
        <div className="bn-hero-overlay">
          <h2><FaVideo /> Video Management</h2>
          <p>Manage homepage video slider</p>
        </div>
      </div>

      {/* Stats */}
      <div className="bn-stats-row">
        <div className="bn-stat-card bn-stat-blue">
          <div className="bn-stat-icon"><FaVideo /></div>
          <div><span className="bn-stat-value">{videos.length}</span><span className="bn-stat-label">Total</span></div>
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
            <FaPlus /> Add Video
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
            <h3><FaVideo /> {editId ? "Edit Video" : "Add New Video"}</h3>
            <button className="bn-inline-close" onClick={resetForm}><FaTimes /></button>
          </div>
          <div className="bn-inline-card-body">
            <div className="bn-form-group">
              <label>Title</label>
              <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Product showcase video" />
            </div>
              <div className="bn-form-group">
                <label><FaPlay /> Video File</label>
                <FilePicker value={form.video_url} onChange={(val) => setForm({ ...form, video_url: val })} type="video" placeholder="Click to select video file" />
              </div>
              <div className="bn-form-group">
                <label><FaImage /> Thumbnail Image</label>
                <FilePicker value={form.thumbnail} onChange={(val) => setForm({ ...form, thumbnail: val })} type="image" placeholder="Click to select thumbnail image" />
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
              <h3><FaTrash /> Delete {selected.length} Video(s)</h3>
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
      ) : videos.length === 0 ? (
        <div className="bn-empty"><FaVideo /> No videos yet. Add your first video!</div>
      ) : (
        <div className="bn-table-wrapper">
          <table className="bn-table">
            <thead>
              <tr>
                <th><input type="checkbox" checked={selected.length === videos.length && videos.length > 0} onChange={toggleAll} /></th>
                <th>Thumbnail</th>
                <th>Title</th>
                <th>Video URL</th>
                <th>Order</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {videos.map((v) => (
                <tr key={v.id} className={selected.includes(v.id) ? "bn-row-selected" : ""}>
                  <td><input type="checkbox" checked={selected.includes(v.id)} onChange={() => toggleSelect(v.id)} /></td>
                  <td>
                    <div className="bn-thumb">
                      <img src={v.thumbnail?.startsWith("/") ? v.thumbnail : `/images/${v.thumbnail}`} alt="" onError={(e) => e.target.src = "/images/placeholder.png"} />
                    </div>
                  </td>
                  <td className="bn-text-max">{v.title || "-"}</td>
                  <td className="bn-text-max">{v.video_url || "-"}</td>
                  <td>
                    <div className="bn-sort-btns">
                      <button onClick={() => moveSortOrder(v, -1)}><FaSortUp /></button>
                      <span>{v.sort_order}</span>
                      <button onClick={() => moveSortOrder(v, 1)}><FaSortDown /></button>
                    </div>
                  </td>
                  <td>
                    <button className={`bn-status-badge ${v.status === "active" ? "bn-status-active" : "bn-status-inactive"}`} onClick={() => toggleStatus(v)}>
                      {v.status === "active" ? <><FaEye /> Active</> : <><FaEyeSlash /> Inactive</>}
                    </button>
                  </td>
                  <td>
                    <div className="bn-action-btns">
                      <button className="bn-action-edit" onClick={() => handleEdit(v)}><FaEdit /></button>
                      <button className="bn-action-delete" onClick={() => setDeleteConfirm(v.id)}><FaTrash /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Single Delete Confirm */}
      {deleteConfirm && (
        <div className="bn-modal-overlay" onClick={() => setDeleteConfirm(null)}>
          <div className="bn-modal bn-modal-sm" onClick={(e) => e.stopPropagation()}>
            <div className="bn-modal-header bn-modal-header-danger">
              <h3><FaTrash /> Delete Video</h3>
            </div>
            <div className="bn-modal-body">
              <p>Are you sure you want to delete this video?</p>
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

export default VideoAdmin;
