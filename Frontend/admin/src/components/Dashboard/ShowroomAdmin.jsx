import { useState, useEffect } from "react";
import Breadcrumb from "../common/Breadcrumb";
import "../../assets/style/Showroom.css";
import {
  FaStore, FaPlus, FaEdit, FaTrash, FaCheck, FaTimes,
  FaSpinner, FaSearch, FaEye, FaEyeSlash, FaMapMarkerAlt, FaPhone
} from "react-icons/fa";

const API = "http://localhost:5000";

const ShowroomAdmin = () => {
  const [showrooms, setShowrooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [bulkDeleteConfirm, setBulkDeleteConfirm] = useState(false);
  const [toast, setToast] = useState(null);
  const [form, setForm] = useState({
    name: "", address: "", city: "", phone: "", image: "", latitude: "", longitude: "", status: "active"
  });

  useEffect(() => { fetchShowrooms(); }, []);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 2500); };

  const fetchShowrooms = async () => {
    try {
      const res = await fetch(`${API}/api/showrooms`);
      const data = await res.json();
      if (data.success) setShowrooms(data.data);
    } catch (err) { console.log(err); }
    finally { setLoading(false); }
  };

  const resetForm = () => {
    setForm({ name: "", address: "", city: "", phone: "", image: "", latitude: "", longitude: "", status: "active" });
    setEditId(null);
    setShowForm(false);
  };

  const handleSave = async () => {
    if (!form.name.trim() || !form.address.trim() || !form.city.trim()) {
      showToast("Name, address, and city are required");
      return;
    }
    try {
      const url = editId ? `${API}/api/showrooms/${editId}` : `${API}/api/showrooms`;
      const method = editId ? "PUT" : "POST";
      await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      resetForm();
      fetchShowrooms();
      showToast(editId ? "Showroom updated" : "Showroom created");
    } catch (err) { console.log(err); }
  };

  const handleEdit = (sr) => {
    setForm({
      name: sr.name, address: sr.address, city: sr.city, phone: sr.phone || "",
      image: sr.image || "", latitude: sr.latitude || "", longitude: sr.longitude || "", status: sr.status
    });
    setEditId(sr.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`${API}/api/showrooms/${id}`, { method: "DELETE" });
      setDeleteConfirm(null);
      fetchShowrooms();
      showToast("Showroom deleted");
    } catch (err) { console.log(err); }
  };

  const handleBulkDelete = async () => {
    try {
      await fetch(`${API}/api/showrooms/bulk-delete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: selected }),
      });
      setBulkDeleteConfirm(false);
      setSelected([]);
      fetchShowrooms();
      showToast(`${selected.length} showrooms deleted`);
    } catch (err) { console.log(err); }
  };

  const toggleStatus = async (sr) => {
    const newStatus = sr.status === "active" ? "inactive" : "active";
    try {
      await fetch(`${API}/api/showrooms/${sr.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...sr, status: newStatus }),
      });
      fetchShowrooms();
      showToast(`Showroom ${newStatus === "active" ? "activated" : "deactivated"}`);
    } catch (err) { console.log(err); }
  };

  const toggleSelect = (id) => {
    setSelected((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  };

  const filtered = showrooms.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.address.toLowerCase().includes(search.toLowerCase()) ||
    s.city.toLowerCase().includes(search.toLowerCase())
  );

  const cities = [...new Set(showrooms.map((s) => s.city))];

  if (loading) {
    return (
      <div className="content">
        <div className="page-top">
          <h1 className="page-title">Showroom Management</h1>
          <Breadcrumb />
        </div>
        <div className="sr-loading"><FaSpinner className="sr-spinner" /><p>Loading showrooms...</p></div>
      </div>
    );
  }

  return (
    <div className="content">
      <div className="page-top">
        <h1 className="page-title">Showroom Management</h1>
        <Breadcrumb />
      </div>

      {/* HERO */}
      <div className="sr-hero">
        <div className="sr-hero-overlay">
          <h2>Store Showrooms</h2>
          <p>Manage your physical showroom locations</p>
        </div>
      </div>

      {/* STATS ROW */}
      <div className="sr-stats-row">
        <div className="sr-stat-card sr-stat-blue">
          <div className="sr-stat-icon"><FaStore /></div>
          <div className="sr-stat-info">
            <span className="sr-stat-value">{showrooms.length}</span>
            <span className="sr-stat-label">Total Showrooms</span>
          </div>
        </div>
        <div className="sr-stat-card sr-stat-green">
          <div className="sr-stat-icon"><FaEye /></div>
          <div className="sr-stat-info">
            <span className="sr-stat-value">{showrooms.filter((s) => s.status === "active").length}</span>
            <span className="sr-stat-label">Active</span>
          </div>
        </div>
        <div className="sr-stat-card sr-stat-red">
          <div className="sr-stat-icon"><FaEyeSlash /></div>
          <div className="sr-stat-info">
            <span className="sr-stat-value">{showrooms.filter((s) => s.status === "inactive").length}</span>
            <span className="sr-stat-label">Inactive</span>
          </div>
        </div>
        <div className="sr-stat-card sr-stat-purple">
          <div className="sr-stat-icon"><FaMapMarkerAlt /></div>
          <div className="sr-stat-info">
            <span className="sr-stat-value">{cities.length}</span>
            <span className="sr-stat-label">Cities</span>
          </div>
        </div>
      </div>

      {/* TOOLBAR */}
      <div className="sr-toolbar">
        <div className="sr-search-wrap">
          <FaSearch className="sr-search-icon" />
          <input type="text" placeholder="Search showrooms..." value={search} onChange={(e) => setSearch(e.target.value)} />
          {search && <button className="sr-search-clear" onClick={() => setSearch("")}><FaTimes /></button>}
        </div>
        <div className="sr-toolbar-actions">
          {selected.length > 0 && (
            <button className="sr-bulk-delete" onClick={() => setBulkDeleteConfirm(true)}>
              <FaTrash /> Delete ({selected.length})
            </button>
          )}
          <button className="sr-add-btn" onClick={() => { resetForm(); setShowForm(!showForm); }}>
            <FaPlus /> {showForm ? "Cancel" : "Add Showroom"}
          </button>
        </div>
      </div>

      {/* ADD/EDIT FORM */}
      {showForm && (
        <div className="sr-form-card">
          <h3>{editId ? "Edit Showroom" : "Add New Showroom"}</h3>
          <div className="sr-form-grid">
            <div className="sr-form-group">
              <label>Store Name *</label>
              <input type="text" placeholder="e.g. Suvique Austin" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="sr-form-group">
              <label>City *</label>
              <input type="text" placeholder="e.g. Austin" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
            </div>
            <div className="sr-form-group">
              <label>Phone</label>
              <input type="text" placeholder="e.g. +1 555-123-4567" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </div>
            <div className="sr-form-group full">
              <label>Address *</label>
              <input type="text" placeholder="Full address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
            </div>
            <div className="sr-form-group full">
              <label>Image URL</label>
              <input type="text" placeholder="https://..." value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} />
            </div>
            <div className="sr-form-group">
              <label>Latitude</label>
              <input type="text" placeholder="e.g. 30.2672" value={form.latitude} onChange={(e) => setForm({ ...form, latitude: e.target.value })} />
            </div>
            <div className="sr-form-group">
              <label>Longitude</label>
              <input type="text" placeholder="e.g. -97.7431" value={form.longitude} onChange={(e) => setForm({ ...form, longitude: e.target.value })} />
            </div>
            <div className="sr-form-group">
              <label>Status</label>
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
          {form.image && (
            <div className="sr-image-preview">
              <img src={form.image} alt="preview" onError={(e) => { e.target.style.display = "none"; }} />
            </div>
          )}
          <div className="sr-form-actions">
            <button className="sr-form-cancel" onClick={resetForm}><FaTimes /> Cancel</button>
            <button className="sr-form-save" onClick={handleSave}><FaCheck /> {editId ? "Update" : "Create"}</button>
          </div>
        </div>
      )}

      {/* SHOWROOM LIST */}
      {filtered.length === 0 ? (
        <div className="sr-empty">
          <FaStore />
          <p>No showrooms found</p>
        </div>
      ) : (
        <div className="sr-list">
          {filtered.map((sr) => (
            <div className={`sr-card ${sr.status === "inactive" ? "inactive" : ""}`} key={sr.id}>
              <div className="sr-card-image">
                <img
                  src={sr.image || "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=80"}
                  alt={sr.name}
                  onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=80"; }}
                />
              </div>
              <div className="sr-card-body">
                <div className="sr-card-header">
                  <span className="sr-card-check">
                    <input type="checkbox" checked={selected.includes(sr.id)} onChange={() => toggleSelect(sr.id)} />
                  </span>
                  <div className="sr-card-info">
                    <h4>{sr.name}</h4>
                    <div className="sr-card-meta">
                      <span className="sr-card-city"><FaMapMarkerAlt /> {sr.city}</span>
                      <span className={`sr-status-dot ${sr.status}`}></span>
                    </div>
                  </div>
                  <div className="sr-card-actions">
                    <button className={`sr-action-btn toggle ${sr.status}`} onClick={() => toggleStatus(sr)} title={sr.status === "active" ? "Deactivate" : "Activate"}>
                      {sr.status === "active" ? <FaEye /> : <FaEyeSlash />}
                    </button>
                    <button className="sr-action-btn edit" onClick={() => handleEdit(sr)}><FaEdit /></button>
                    <button className="sr-action-btn delete" onClick={() => setDeleteConfirm(sr)}><FaTrash /></button>
                  </div>
                </div>
                <div className="sr-card-details">
                  <p className="sr-card-address"><FaMapMarkerAlt /> {sr.address}</p>
                  {sr.phone && <p className="sr-card-phone"><FaPhone /> {sr.phone}</p>}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* DELETE CONFIRM */}
      {deleteConfirm && (
        <div className="sr-modal" onClick={() => setDeleteConfirm(null)}>
          <div className="sr-modal-confirm" onClick={(e) => e.stopPropagation()}>
            <FaTrash className="sr-confirm-icon" />
            <h3>Delete Showroom?</h3>
            <p>"{deleteConfirm.name}"</p>
            <div className="sr-confirm-actions">
              <button className="sr-confirm-cancel" onClick={() => setDeleteConfirm(null)}>Cancel</button>
              <button className="sr-confirm-delete" onClick={() => handleDelete(deleteConfirm.id)}>Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* BULK DELETE */}
      {bulkDeleteConfirm && (
        <div className="sr-modal" onClick={() => setBulkDeleteConfirm(false)}>
          <div className="sr-modal-confirm" onClick={(e) => e.stopPropagation()}>
            <FaTrash className="sr-confirm-icon" />
            <h3>Delete {selected.length} Showrooms?</h3>
            <p>This action cannot be undone.</p>
            <div className="sr-confirm-actions">
              <button className="sr-confirm-cancel" onClick={() => setBulkDeleteConfirm(false)}>Cancel</button>
              <button className="sr-confirm-delete" onClick={handleBulkDelete}>Delete All</button>
            </div>
          </div>
        </div>
      )}

      {toast && <div className="sr-toast"><FaCheck /> {toast}</div>}
    </div>
  );
};

export default ShowroomAdmin;
