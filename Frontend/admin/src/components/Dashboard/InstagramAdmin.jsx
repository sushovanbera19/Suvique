import { useState, useEffect } from "react";
import Breadcrumb from "../common/Breadcrumb";
import {
  FiSave, FiX, FiTrash2, FiSettings, FiGrid,
  FiArrowUp, FiArrowDown, FiEye, FiEyeOff, FiRefreshCw, FiLink, FiImage, FiPlus
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
  const [secForm, setSecForm] = useState({ heading: "", instagram_url: "", instagram_username: "", button_text: "", overlay_text: "" });
  const [secSaving, setSecSaving] = useState(false);

  // Fetch from Instagram
  const [urlsInput, setUrlsInput] = useState("");
  const [fetching, setFetching] = useState(false);
  const [fetchedItems, setFetchedItems] = useState([]);
  const [fetchErrors, setFetchErrors] = useState([]);

  // Manual add
  const [showManual, setShowManual] = useState(false);
  const [manualForm, setManualForm] = useState({ image_url: "", alt_text: "", link: "" });

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
            instagram_username: secRes.data.instagram_username || "",
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
      if (json.success) { setSection(json.data); showToast("success", "Settings saved!"); }
      else showToast("error", json.message || "Failed");
    } catch { showToast("error", "Failed"); }
    finally { setSecSaving(false); }
  };

  const parseUrls = (text) => {
    return text.split(/[\n,]+/).map((u) => u.trim()).filter((u) => u.length > 0 && u.includes("instagram.com"));
  };

  const handleFetch = async () => {
    const urls = parseUrls(urlsInput);
    if (urls.length === 0) return showToast("error", "Paste Instagram post/reel URLs");
    setFetching(true);
    setFetchErrors([]);
    setFetchedItems([]);
    try {
      const res = await fetch(`${API}/api/instagram/fetch`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ urls }),
      });
      const json = await res.json();
      if (json.success) {
        setFetchedItems(json.data.fetched || []);
        setFetchErrors(json.data.errors || []);
        if (json.data.fetched.length === 0 && json.data.errors.length > 0) {
          showToast("error", "Auto-fetch unavailable. Use 'Add Manually' below.");
        } else if (json.data.fetched.length > 0) {
          showToast("success", `${json.data.fetched.length} image(s) fetched!`);
        }
      } else showToast("error", json.message || "Failed");
    } catch { showToast("error", "Fetch failed"); }
    finally { setFetching(false); }
  };

  const handleSaveFetched = async (clearFirst = false) => {
    if (fetchedItems.length === 0) return;
    try {
      const res = await fetch(`${API}/api/instagram/save`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: fetchedItems, clearFirst }),
      });
      const json = await res.json();
      if (json.success) { setItems(json.data); setFetchedItems([]); setUrlsInput(""); showToast("success", `${json.data.length} images saved!`); }
    } catch { showToast("error", "Save failed"); }
  };

  const handleManualAdd = async () => {
    if (!manualForm.image_url.trim()) return showToast("error", "Image URL is required");
    try {
      const res = await fetch(`${API}/api/instagram/items`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(manualForm),
      });
      const json = await res.json();
      if (json.success) {
        setItems(json.data);
        setManualForm({ image_url: "", alt_text: "", link: "" });
        setShowManual(false);
        showToast("success", "Image added!");
      } else showToast("error", json.message || "Failed");
    } catch { showToast("error", "Failed"); }
  };

  const handleToggleItem = async (id, current) => {
    try {
      const res = await fetch(`${API}/api/instagram/items/${id}/toggle`, {
        method: "PUT", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_active: current ? 0 : 1 }),
      });
      const json = await res.json();
      if (json.success) setItems(json.data);
    } catch {}
  };

  const handleSortItem = async (id, dir) => {
    const item = items.find((i) => i.id === id);
    if (!item) return;
    try {
      const res = await fetch(`${API}/api/instagram/items/${id}/reorder`, {
        method: "PUT", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sort_order: item.sort_order + dir }),
      });
      const json = await res.json();
      if (json.success) setItems(json.data);
    } catch {}
  };

  const handleDeleteItem = async (id) => {
    if (!window.confirm("Delete this image?")) return;
    try {
      const res = await fetch(`${API}/api/instagram/items/${id}`, { method: "DELETE" });
      const json = await res.json();
      if (json.success) { setItems(json.data); showToast("success", "Deleted!"); }
    } catch { showToast("error", "Failed"); }
  };

  const handleClearAll = async () => {
    if (!window.confirm("Delete ALL gallery images?")) return;
    try {
      const res = await fetch(`${API}/api/instagram/items`, { method: "DELETE" });
      const json = await res.json();
      if (json.success) { setItems([]); showToast("success", "All images cleared"); }
    } catch { showToast("error", "Failed"); }
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

        {/* Section Settings */}
        <div className="ig-card">
          <div className="ig-card-header">
            <h3><FiSettings /> Section Settings</h3>
          </div>
          <div className="ig-card-body">
            <div className="ig-settings-grid">
              <div className="ig-field">
                <label className="ig-label">Heading</label>
                <input type="text" className="ig-input" value={secForm.heading} onChange={(e) => setSecForm({ ...secForm, heading: e.target.value })} placeholder="Follow Us on Instagram" />
              </div>
              <div className="ig-field">
                <label className="ig-label">Instagram Username</label>
                <div className="ig-input-with-icon">
                  <FaInstagram className="ig-input-icon" />
                  <input type="text" className="ig-input ig-input-icon-field" value={secForm.instagram_username} onChange={(e) => {
                    const username = e.target.value.replace("@", "").trim();
                    setSecForm({ ...secForm, instagram_username: username, instagram_url: `https://instagram.com/${username}` });
                  }} placeholder="your_username" />
                </div>
              </div>
              <div className="ig-field">
                <label className="ig-label">Button Text</label>
                <input type="text" className="ig-input" value={secForm.button_text} onChange={(e) => setSecForm({ ...secForm, button_text: e.target.value })} placeholder="Follow Us" />
              </div>
              <div className="ig-field">
                <label className="ig-label">Overlay Text (on hover)</label>
                <input type="text" className="ig-input" value={secForm.overlay_text} onChange={(e) => setSecForm({ ...secForm, overlay_text: e.target.value })} placeholder="View More" />
              </div>
            </div>
            <div className="ig-settings-actions">
              {secForm.instagram_url && (
                <a href={secForm.instagram_url} target="_blank" rel="noopener noreferrer" className="ig-btn ig-btn-link"><FaInstagram /> Open Profile</a>
              )}
              <button className="ig-btn ig-btn-save" onClick={handleSecSave} disabled={secSaving}><FiSave /> {secSaving ? "Saving..." : "Save Settings"}</button>
            </div>
          </div>
        </div>

        {/* Add Images */}
        <div className="ig-card">
          <div className="ig-card-header">
            <h3><FiLink /> Add Images from Instagram</h3>
          </div>
          <div className="ig-card-body">

            {/* Auto fetch */}
            <p className="ig-help-text">
              <strong>Option 1:</strong> Paste Instagram post/reel URLs below. If oEmbed is available, images auto-fetch.
            </p>
            <div className="ig-field">
              <textarea className="ig-textarea" rows={4} value={urlsInput} onChange={(e) => setUrlsInput(e.target.value)}
                placeholder={"https://www.instagram.com/p/ABC123/\nhttps://www.instagram.com/reel/XYZ789/"} />
            </div>
            <div className="ig-fetch-actions">
              <button className="ig-btn ig-btn-fetch" onClick={handleFetch} disabled={fetching || !urlsInput.trim()}>
                <FiRefreshCw className={fetching ? "ig-spin" : ""} /> {fetching ? "Fetching..." : "Fetch Images"}
              </button>
            </div>

            {/* Fetched preview */}
            {fetchedItems.length > 0 && (
              <div className="ig-fetched">
                <div className="ig-fetched-header">
                  <h4>Fetched {fetchedItems.length} image(s)</h4>
                  <div className="ig-fetched-btns">
                    <button className="ig-btn ig-btn-save" onClick={() => handleSaveFetched(false)}>Add to Gallery</button>
                    <button className="ig-btn ig-btn-primary" onClick={() => handleSaveFetched(true)}>Replace All</button>
                  </div>
                </div>
                <div className="ig-fetched-grid">
                  {fetchedItems.map((item, idx) => (
                    <div className="ig-fetched-card" key={idx}>
                      <img src={item.image_url} alt={item.alt_text} />
                      <p className="ig-fetched-alt">{item.alt_text || "No caption"}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {fetchErrors.length > 0 && (
              <div className="ig-fetch-errors">
                {fetchErrors.map((err, i) => (
                  <p key={i} className="ig-fetch-error"><FiX size={12} /> {err.url} — {err.error}</p>
                ))}
              </div>
            )}

            {/* Divider */}
            <div className="ig-divider"><span>OR</span></div>

            {/* Manual add */}
            <p className="ig-help-text">
              <strong>Option 2:</strong> Right-click any Instagram image → "Copy image address" → paste below. Add the post URL for the "View More" link.
            </p>
            <button className="ig-btn ig-btn-link" onClick={() => setShowManual(!showManual)}>
              <FiImage /> {showManual ? "Close" : "Add Image Manually"}
            </button>

            {showManual && (
              <div className="ig-manual-form">
                <div className="ig-field">
                  <label className="ig-label">Image URL *</label>
                  <input type="url" className="ig-input" value={manualForm.image_url} onChange={(e) => setManualForm({ ...manualForm, image_url: e.target.value })} placeholder="Paste image URL from Instagram" />
                </div>
                <div className="ig-manual-row">
                  <div className="ig-field" style={{ flex: 1 }}>
                    <label className="ig-label">Instagram Post URL (for link)</label>
                    <input type="url" className="ig-input" value={manualForm.link} onChange={(e) => setManualForm({ ...manualForm, link: e.target.value })} placeholder="https://www.instagram.com/p/..." />
                  </div>
                  <div className="ig-field" style={{ flex: 1 }}>
                    <label className="ig-label">Alt Text</label>
                    <input type="text" className="ig-input" value={manualForm.alt_text} onChange={(e) => setManualForm({ ...manualForm, alt_text: e.target.value })} placeholder="Caption or description" />
                  </div>
                </div>
                <div className="ig-manual-actions">
                  <button className="ig-btn ig-btn-cancel" onClick={() => { setShowManual(false); setManualForm({ image_url: "", alt_text: "", link: "" }); }}><FiX /> Cancel</button>
                  <button className="ig-btn ig-btn-save" onClick={handleManualAdd}><FiPlus /> Add Image</button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Current Gallery */}
        <div className="ig-card">
          <div className="ig-card-header">
            <h3><FiGrid /> Gallery ({items.length} images)</h3>
            {items.length > 0 && (
              <button className="ig-btn ig-btn-delete-text" onClick={handleClearAll}><FiTrash2 /> Clear All</button>
            )}
          </div>

          {items.length === 0 ? (
            <div className="ig-empty">
              <FaInstagram size={40} color="#d1d5db" />
              <p>No images yet. Add images using the section above.</p>
            </div>
          ) : (
            <div className="ig-items-grid">
              {items.map((item) => (
                <div className="ig-item-card" key={item.id}>
                  <div className="ig-item-card-image">
                    <img src={item.image_url} alt={item.alt_text} loading="lazy" />
                    <div className="ig-item-card-overlay">
                      <span className={`ig-badge ${item.is_active ? "ig-badge-active" : "ig-badge-inactive"}`}>
                        {item.is_active ? "Live" : "Off"}
                      </span>
                    </div>
                    {item.link && (
                      <a href={item.link} target="_blank" rel="noopener noreferrer" className="ig-item-card-link-overlay" title="Open on Instagram">
                        <FaInstagram />
                      </a>
                    )}
                  </div>
                  <div className="ig-item-card-body">
                    <p className="ig-item-card-alt" title={item.alt_text}>{item.alt_text || "No caption"}</p>
                    <div className="ig-item-card-actions">
                      {item.link && (
                        <a href={item.link} target="_blank" rel="noopener noreferrer" className="ig-icon-btn ig-icon-btn-link" title="Open post"><FiLink /></a>
                      )}
                      <button className="ig-icon-btn ig-icon-btn-toggle" onClick={() => handleToggleItem(item.id, item.is_active)} title={item.is_active ? "Hide" : "Show"}>
                        {item.is_active ? <FiEyeOff /> : <FiEye />}
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
