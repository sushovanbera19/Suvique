import { useState, useEffect, useRef } from "react";
import Breadcrumb from "../common/Breadcrumb";
import {
  FiImage, FiSave, FiX, FiTrash2, FiPlus, FiEdit2, FiEye, FiEyeOff, FiClock, FiArrowUp, FiArrowDown
} from "react-icons/fi";
import "../../assets/style/InspiredAdmin.css";

const API = "http://localhost:5000";

const emptyForm = {
  heading: "", description: "", point1: "", point2: "", point3: "",
  button_text: "", button_link: "", sort_order: 0, is_active: 1,
};

const InspiredAdmin = () => {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ ...emptyForm });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState({ type: "", msg: "" });
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const fileRef = useRef(null);

  const showToast = (type, msg) => {
    setToast({ type, msg });
    setTimeout(() => setToast({ type: "", msg: "" }), 3000);
  };

  const fetchSections = () => {
    fetch(`${API}/api/inspired-sections/all`)
      .then((res) => res.json())
      .then((json) => { if (json.success) setSections(json.data || []); })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchSections(); }, []);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const resetForm = () => {
    setForm({ ...emptyForm });
    setImageFile(null);
    setImagePreview(null);
    setEditId(null);
    setShowForm(false);
  };

  const startEdit = (section) => {
    setForm({
      heading: section.heading || "",
      description: section.description || "",
      point1: section.point1 || "",
      point2: section.point2 || "",
      point3: section.point3 || "",
      button_text: section.button_text || "",
      button_link: section.button_link || "",
      sort_order: section.sort_order || 0,
      is_active: section.is_active,
    });
    setImageFile(null);
    setImagePreview(section.image ? `${API}${section.image}` : null);
    setEditId(section.id);
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.heading.trim()) return showToast("error", "Heading is required");
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (imageFile) fd.append("image", imageFile);
      const url = editId ? `${API}/api/inspired-sections/${editId}` : `${API}/api/inspired-sections`;
      const method = editId ? "PUT" : "POST";
      const res = await fetch(url, { method, body: fd });
      const json = await res.json();
      if (json.success) {
        setSections(json.data);
        resetForm();
        showToast("success", editId ? "Section updated!" : "Section created!");
      } else {
        showToast("error", json.message || "Failed");
      }
    } catch (err) {
      showToast("error", "Failed");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this section?")) return;
    try {
      const res = await fetch(`${API}/api/inspired-sections/${id}`, { method: "DELETE" });
      const json = await res.json();
      if (json.success) {
        setSections(json.data);
        showToast("success", "Deleted!");
      }
    } catch (err) {
      showToast("error", "Failed");
    }
  };

  const handleToggle = async (id, current) => {
    try {
      const res = await fetch(`${API}/api/inspired-sections/${id}/toggle`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_active: current ? 0 : 1 }),
      });
      const json = await res.json();
      if (json.success) {
        setSections(json.data);
        showToast("success", current ? "Deactivated" : "Activated");
      }
    } catch (err) {
      showToast("error", "Failed");
    }
  };

  const handleSort = async (id, dir) => {
    const idx = sections.findIndex((s) => s.id === id);
    if (idx === -1) return;
    const section = sections[idx];
    try {
      await fetch(`${API}/api/inspired-sections/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sort_order: section.sort_order + dir }),
      });
      fetchSections();
    } catch (err) {}
  };

  const getImageUrl = (imgPath) => {
    if (!imgPath) return null;
    return `${API}${imgPath.replace(/\\/g, "/")}`;
  };

  if (loading) {
    return (
      <div className="shop-admin-wrap">
        <div className="settings-page-top">
          <h1 className="settings-page-title">Inspired Sections</h1>
          <Breadcrumb />
        </div>
        <div className="shop-loading">Loading...</div>
      </div>
    );
  }

  return (
    <div className="shop-admin-wrap">
      {toast.msg && (
        <div className={`ui-toast ${toast.type === "error" ? "error" : ""}`}>{toast.msg}</div>
      )}

      <div className="settings-page-top">
        <h1 className="settings-page-title">Inspired Sections</h1>
        <Breadcrumb />
      </div>

      <div className="ia-wrap">

        {/* Header Card */}
        <div className="ia-card">
          <div className="ia-card-header">
            <h3><FiClock /> All Sections ({sections.length})</h3>
            <button className="ia-btn ia-btn-primary" onClick={() => { resetForm(); setShowForm(!showForm); }}>
              <FiPlus /> {showForm ? "Close" : "Add New"}
            </button>
          </div>

          {/* Add/Edit Form */}
          {showForm && (
            <div className="ia-form">
              <div className="ia-form-grid">
                {/* Left: Image */}
                <div>
                  <label className="ia-label">Section Image</label>
                  <div className="ia-image-upload" onClick={() => fileRef.current?.click()}>
                    {imagePreview ? (
                      <img src={imagePreview} alt="Preview" />
                    ) : (
                      <>
                        <FiImage size={32} color="#94a3b8" />
                        <span className="ia-image-upload-text">Click to upload</span>
                      </>
                    )}
                  </div>
                  <input ref={fileRef} type="file" accept="image/*" className="ia-hidden" onChange={handleImageChange} />
                </div>

                {/* Right: Fields */}
                <div className="ia-form-fields">
                  <div className="ia-field">
                    <label className="ia-label">Heading *</label>
                    <input type="text" className="ia-input" value={form.heading} onChange={(e) => setForm({ ...form, heading: e.target.value })} placeholder="Section heading" />
                  </div>
                  <div className="ia-field">
                    <label className="ia-label">Description</label>
                    <textarea className="ia-textarea" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Section description" />
                  </div>
                  <div className="ia-field-row">
                    <div className="ia-field">
                      <label className="ia-label">Point 1</label>
                      <input type="text" className="ia-input" value={form.point1} onChange={(e) => setForm({ ...form, point1: e.target.value })} placeholder="Feature point 1" />
                    </div>
                    <div className="ia-field">
                      <label className="ia-label">Point 2</label>
                      <input type="text" className="ia-input" value={form.point2} onChange={(e) => setForm({ ...form, point2: e.target.value })} placeholder="Feature point 2" />
                    </div>
                  </div>
                  <div className="ia-field-row">
                    <div className="ia-field">
                      <label className="ia-label">Point 3</label>
                      <input type="text" className="ia-input" value={form.point3} onChange={(e) => setForm({ ...form, point3: e.target.value })} placeholder="Feature point 3" />
                    </div>
                    <div className="ia-field">
                      <label className="ia-label">Button Text</label>
                      <input type="text" className="ia-input" value={form.button_text} onChange={(e) => setForm({ ...form, button_text: e.target.value })} placeholder="e.g. Shop Now" />
                    </div>
                  </div>
                  <div className="ia-field-row">
                    <div className="ia-field">
                      <label className="ia-label">Button Link</label>
                      <input type="text" className="ia-input" value={form.button_link} onChange={(e) => setForm({ ...form, button_link: e.target.value })} placeholder="e.g. /Shop-1?category=15" />
                    </div>
                    <div className="ia-field">
                      <label className="ia-label">Sort Order</label>
                      <input type="number" className="ia-input" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })} />
                    </div>
                  </div>

                  <div className="ia-form-actions">
                    <label className="ia-toggle">
                      <input type="checkbox" checked={form.is_active === 1} onChange={(e) => setForm({ ...form, is_active: e.target.checked ? 1 : 0 })} />
                      <span className="ia-toggle-slider"></span>
                      <span className="ia-toggle-label">{form.is_active ? "Active" : "Inactive"}</span>
                    </label>
                    <div className="ia-form-btns">
                      <button className="ia-btn ia-btn-cancel" onClick={resetForm}><FiX /> Cancel</button>
                      <button className="ia-btn ia-btn-save" onClick={handleSave} disabled={saving}>
                        <FiSave /> {saving ? "Saving..." : editId ? "Update" : "Create"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sections List */}
        {sections.length === 0 ? (
          <div className="ia-card">
            <div className="ia-empty">No inspired sections yet. Click "Add New" to create one.</div>
          </div>
        ) : (
          sections.map((section) => (
            <div className="ia-card" key={section.id}>
              <div className="ia-item">
                <div className="ia-item-image">
                  {section.image ? (
                    <img src={getImageUrl(section.image)} alt={section.heading} />
                  ) : (
                    <div className="ia-item-image-fallback"><FiImage size={24} /></div>
                  )}
                </div>
                <div className="ia-item-content">
                  <div className="ia-item-top">
                    <h4 className="ia-item-heading">{section.heading}</h4>
                    <div className="ia-item-badges">
                      <span className={`ia-badge ${section.is_active ? "ia-badge-active" : "ia-badge-inactive"}`}>
                        {section.is_active ? "Active" : "Inactive"}
                      </span>
                      <span className="ia-badge ia-badge-order">#{section.sort_order}</span>
                    </div>
                  </div>
                  <p className="ia-item-desc">{section.description}</p>
                  <div className="ia-item-points">
                    {section.point1 && <span className="ia-point">{section.point1}</span>}
                    {section.point2 && <span className="ia-point">{section.point2}</span>}
                    {section.point3 && <span className="ia-point">{section.point3}</span>}
                  </div>
                  {(section.button_text || section.button_link) && (
                    <div className="ia-item-link">
                      {section.button_text} → {section.button_link}
                    </div>
                  )}
                  <div className="ia-item-actions">
                    <button className="ia-icon-btn ia-icon-btn-edit" onClick={() => startEdit(section)} title="Edit"><FiEdit2 /></button>
                    <button className="ia-icon-btn ia-icon-btn-toggle" onClick={() => handleToggle(section.id, section.is_active)} title={section.is_active ? "Deactivate" : "Activate"}>
                      {section.is_active ? <FiEyeOff /> : <FiEye />}
                    </button>
                    <button className="ia-icon-btn ia-icon-btn-up" onClick={() => handleSort(section.id, -1)} title="Move up"><FiArrowUp /></button>
                    <button className="ia-icon-btn ia-icon-btn-down" onClick={() => handleSort(section.id, 1)} title="Move down"><FiArrowDown /></button>
                    <button className="ia-icon-btn ia-icon-btn-delete" onClick={() => handleDelete(section.id)} title="Delete"><FiTrash2 /></button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}

      </div>
    </div>
  );
};

export default InspiredAdmin;
