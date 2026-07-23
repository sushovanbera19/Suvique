import { useState, useEffect, useRef } from "react";
import Breadcrumb from "../common/Breadcrumb";
import {
  FiImage, FiSave, FiX, FiTrash2, FiPlus, FiEdit2,
  FiSettings, FiGrid, FiArrowUp, FiArrowDown
} from "react-icons/fi";
import { FaInstagram } from "react-icons/fa";
import "../../assets/style/InstagramAdmin.css";

const API = "http://localhost:5000";

const InstagramAdmin = () => {
  const [section, setSection] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ type: "", msg: "" });

  // Section form
  const [secForm, setSecForm] = useState({ heading: "", instagram_url: "", button_text: "", overlay_text: "" });
  const [secSaving, setSecSaving] = useState(false);

  // Item form
  const [showItemForm, setShowItemForm] = useState(false);
  const [editItemId, setEditItemId] = useState(null);
  const [itemForm, setItemForm] = useState({ alt_text: "", link: "", sort_order: 0, is_active: 1 });
  const [itemImageFile, setItemImageFile] = useState(null);
  const [itemImagePreview, setItemImagePreview] = useState(null);
  const [itemImageUrl, setItemImageUrl] = useState("");
  const [itemSaving, setItemSaving] = useState(false);
  const fileRef = useRef(null);

  const showToast = (type, msg) => {
    setToast({ type, msg });
    setTimeout(() => setToast({ type: "", msg: "" }), 3000);
  };

  const fetchData = () => {
    setLoading(true);
    Promise.all([
      fetch(`${API}/api/instagram/section`).then((r) => r.json()),
      fetch(`${API}/api/instagram/items`).then((r) => r.json()),
    ])
      .then(([secRes, itemsRes]) => {
        if (secRes.success && secRes.data) {
          setSection(secRes.data);
          setSecForm({
            heading: secRes.data.heading || "",
            instagram_url: secRes.data.instagram_url || "",
            button_text: secRes.data.button_text || "",
            overlay_text: secRes.data.overlay_text || "",
          });
        }
        if (itemsRes.success) setItems(itemsRes.data || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, []);

  const handleSecSave = async () => {
    if (!secForm.heading.trim()) return showToast("error", "Heading is required");
    setSecSaving(true);
    try {
      const res = await fetch(`${API}/api/instagram/section`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(secForm),
      });
      const json = await res.json();
      if (json.success) {
        setSection(json.data);
        showToast("success", "Settings saved!");
      } else {
        showToast("error", json.message || "Failed");
      }
    } catch {
      showToast("error", "Failed");
    } finally {
      setSecSaving(false);
    }
  };

  // Item form handlers
  const resetItemForm = () => {
    setItemForm({ alt_text: "", link: "", sort_order: 0, is_active: 1 });
    setItemImageFile(null);
    setItemImagePreview(null);
    setEditItemId(null);
    setShowItemForm(false);
  };

  const startEditItem = (item) => {
    setItemForm({
      alt_text: item.alt_text || "",
      link: item.link || "",
      sort_order: item.sort_order || 0,
      is_active: item.is_active,
    });
    setItemImageFile(null);
    setItemImagePreview(item.image_url || null);
    setEditItemId(item.id);
    setShowItemForm(true);
  };

  const handleItemImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setItemImageFile(file);
    setItemImagePreview(URL.createObjectURL(file));
  };

  const handleItemSave = async () => {
    const fd = new FormData();
    Object.entries(itemForm).forEach(([k, v]) => fd.append(k, v));
    if (itemImageFile) fd.append("image", itemImageFile);
    else if (editItemId && itemImagePreview && !itemImagePreview.startsWith("blob:")) {
      fd.append("image_url", itemForm.image_url || itemImagePreview);
    }

    const url = editItemId ? `${API}/api/instagram/items/${editItemId}` : `${API}/api/instagram/items`;
    const method = editItemId ? "PUT" : "POST";
    try {
      const res = await fetch(url, { method, body: fd });
      const json = await res.json();
      if (json.success) {
        setItems(json.data);
        resetItemForm();
        showToast("success", editItemId ? "Item updated!" : "Item added!");
      } else {
        showToast("error", json.message || "Failed");
      }
    } catch {
      showToast("error", "Failed");
    }
  };

  const handleDeleteItem = async (id) => {
    if (!window.confirm("Delete this item?")) return;
    try {
      const res = await fetch(`${API}/api/instagram/items/${id}`, { method: "DELETE" });
      const json = await res.json();
      if (json.success) {
        setItems(json.data);
        showToast("success", "Deleted!");
      }
    } catch {
      showToast("error", "Failed");
    }
  };

  const handleSortItem = async (id, dir) => {
    const item = items.find((i) => i.id === id);
    if (!item) return;
    try {
      const res = await fetch(`${API}/api/instagram/items/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sort_order: item.sort_order + dir }),
      });
      const json = await res.json();
      if (json.success) setItems(json.data);
    } catch {}
  };

  const handleToggleItem = async (id, current) => {
    try {
      const res = await fetch(`${API}/api/instagram/items/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_active: current ? 0 : 1 }),
      });
      const json = await res.json();
      if (json.success) setItems(json.data);
    } catch {}
  };

  if (loading) {
    return (
      <div className="shop-admin-wrap">
        <div className="settings-page-top">
          <h1 className="settings-page-title">Instagram Gallery</h1>
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
        <h1 className="settings-page-title">Instagram Gallery</h1>
        <Breadcrumb />
      </div>

      <div className="ig-wrap">

        {/* Section Settings Card */}
        <div className="ig-card">
          <div className="ig-card-header">
            <h3><FiSettings /> Section Settings</h3>
          </div>
          <div className="ig-card-body">
            <div className="ig-settings-grid">
              <div className="ig-field">
                <label className="ig-label">Heading</label>
                <input type="text" className="ig-input" value={secForm.heading} onChange={(e) => setSecForm({ ...secForm, heading: e.target.value })} placeholder="Section heading" />
              </div>
              <div className="ig-field">
                <label className="ig-label">Instagram URL</label>
                <input type="url" className="ig-input" value={secForm.instagram_url} onChange={(e) => setSecForm({ ...secForm, instagram_url: e.target.value })} placeholder="https://instagram.com/yourprofile" />
              </div>
              <div className="ig-field">
                <label className="ig-label">Button Text</label>
                <input type="text" className="ig-input" value={secForm.button_text} onChange={(e) => setSecForm({ ...secForm, button_text: e.target.value })} placeholder="Follow Us" />
              </div>
              <div className="ig-field">
                <label className="ig-label">Overlay Text</label>
                <input type="text" className="ig-input" value={secForm.overlay_text} onChange={(e) => setSecForm({ ...secForm, overlay_text: e.target.value })} placeholder="View More" />
              </div>
            </div>
            <div className="ig-settings-actions">
              <a href={secForm.instagram_url} target="_blank" rel="noopener noreferrer" className="ig-btn ig-btn-link"><FaInstagram /> Preview Profile</a>
              <button className="ig-btn ig-btn-save" onClick={handleSecSave} disabled={secSaving}><FiSave /> {secSaving ? "Saving..." : "Save Settings"}</button>
            </div>
          </div>
        </div>

        {/* Gallery Items Card */}
        <div className="ig-card">
          <div className="ig-card-header">
            <h3><FiGrid /> Gallery Items ({items.length})</h3>
            <button className="ig-btn ig-btn-primary" onClick={() => { resetItemForm(); setShowItemForm(!showItemForm); }}>
              <FiPlus /> {showItemForm ? "Close" : "Add Image"}
            </button>
          </div>

          {/* Add/Edit Item Form */}
          {showItemForm && (
            <div className="ig-item-form">
              <div className="ig-item-form-grid">
                <div>
                  <label className="ig-label">Image</label>
                  <div className="ig-image-upload" onClick={() => document.getElementById("ig-file-input").click()}>
                    {itemImagePreview ? (
                      <img src={itemImagePreview} alt="Preview" />
                    ) : (
                      <>
                        <FiImage size={32} color="#94a3b8" />
                        <span className="ig-image-upload-text">Click to upload</span>
                      </>
                    )}
                  </div>
                  <input id="ig-file-input" type="file" accept="image/*" style={{ display: "none" }} onChange={handleItemImageChange} />
                </div>
                <div className="ig-item-form-fields">
                  <div className="ig-field">
                    <label className="ig-label">Alt Text</label>
                    <input type="text" className="ig-input" value={itemForm.alt_text} onChange={(e) => setItemForm({ ...itemForm, alt_text: e.target.value })} placeholder="Describe the image" />
                  </div>
                  <div className="ig-field">
                    <label className="ig-label">Link (optional)</label>
                    <input type="url" className="ig-input" value={itemForm.link} onChange={(e) => setItemForm({ ...itemForm, link: e.target.value })} placeholder="https://instagram.com/p/..." />
                  </div>
                  <div className="ig-field-row">
                    <div className="ig-field">
                      <label className="ig-label">Sort Order</label>
                      <input type="number" className="ig-input" value={itemForm.sort_order} onChange={(e) => setItemForm({ ...itemForm, sort_order: parseInt(e.target.value) || 0 })} />
                    </div>
                    <div className="ig-field">
                      <label className="ig-label">Status</label>
                      <label className="ig-toggle">
                        <input type="checkbox" checked={itemForm.is_active === 1} onChange={(e) => setItemForm({ ...itemForm, is_active: e.target.checked ? 1 : 0 })} />
                        <span className="ig-toggle-slider"></span>
                        <span className="ig-toggle-label">{itemForm.is_active ? "Active" : "Inactive"}</span>
                      </label>
                    </div>
                  </div>
                  <div className="ig-item-form-btns">
                    <button className="ig-btn ig-btn-cancel" onClick={resetItemForm}><FiX /> Cancel</button>
                    <button className="ig-btn ig-btn-save" onClick={handleItemSave}><FiSave /> {editItemId ? "Update" : "Add"}</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Items Grid */}
          {items.length === 0 ? (
            <div className="ig-empty">No gallery items. Click "Add Image" to start.</div>
          ) : (
            <div className="ig-items-grid">
              {items.map((item) => (
                <div className="ig-item-card" key={item.id}>
                  <div className="ig-item-card-image">
                    <img src={item.image_url} alt={item.alt_text} />
                    <div className="ig-item-card-overlay">
                      <span className={`ig-badge ${item.is_active ? "ig-badge-active" : "ig-badge-inactive"}`}>
                        {item.is_active ? "Active" : "Off"}
                      </span>
                    </div>
                  </div>
                  <div className="ig-item-card-body">
                    <p className="ig-item-card-alt">{item.alt_text || "No description"}</p>
                    <div className="ig-item-card-actions">
                      <button className="ig-icon-btn ig-icon-btn-edit" onClick={() => startEditItem(item)} title="Edit"><FiEdit2 /></button>
                      <button className="ig-icon-btn ig-icon-btn-toggle" onClick={() => handleToggleItem(item.id, item.is_active)} title={item.is_active ? "Hide" : "Show"}>
                        {item.is_active ? <FiGrid /> : <FiGrid />}
                      </button>
                      <button className="ig-icon-btn ig-icon-btn-up" onClick={() => handleSortItem(item.id, -1)} title="Move up"><FiArrowUp /></button>
                      <button className="ig-icon-btn ig-icon-btn-down" onClick={() => handleSortItem(item.id, 1)} title="Move down"><FiArrowDown /></button>
                      <button className="ig-icon-btn ig-icon-btn-delete" onClick={() => handleDeleteItem(item.id)} title="Delete"><FiTrash2 /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default InstagramAdmin;
