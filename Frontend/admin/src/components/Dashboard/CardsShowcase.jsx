import { useState } from "react";
import Breadcrumb from "../common/Breadcrumb";
import { useUISettings } from "../../context/UISettingsContext";
import { FiSave, FiRotateCcw, FiX } from "react-icons/fi";
import "../../assets/style/UIShowcase.css";

const CardsShowcase = () => {
  const { getByType, saveSettings, resetType } = useUISettings();
  const cards = getByType("card");
  const [editPanel, setEditPanel] = useState(null);
  const [draft, setDraft] = useState({});
  const [toast, setToast] = useState("");

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 3000); };
  const openEdit = (name) => { setEditPanel(name); setDraft({ ...cards[name] }); };
  const updateDraft = (key, value) => setDraft((p) => ({ ...p, [key]: value }));

  const saveComponent = async () => {
    const rows = Object.entries(draft)
      .filter(([k]) => !["component_type", "component_name", "id"].includes(k))
      .map(([k, v]) => ({ component_type: "card", component_name: editPanel, setting_key: k, setting_value: String(v) }));
    const ok = await saveSettings(rows);
    showToast(ok ? "Saved!" : "Failed");
    if (ok) setEditPanel(null);
  };

  const handleReset = async () => { await resetType("card"); showToast("Reset to defaults"); };

  const cardNames = { stat: "Stat Card", product: "Product Card", notification: "Notification Card", pricing: "Pricing Card", user: "User Card" };

  const cardPreviews = {
    stat: (s) => (
      <div style={{ background: s.bg_color, border: s.border, borderRadius: s.border_radius, boxShadow: s.shadow, padding: 20 }}>
        <div style={{ background: s.header_color, color: "#fff", width: 40, height: 40, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>📊</div>
        <p style={{ color: "#94a3b8", margin: "4px 0", fontSize: 13 }}>Total Revenue</p>
        <h2 style={{ margin: 0, fontSize: 24, fontWeight: 700, color: "#1e293b" }}>$45,231</h2>
        <p style={{ color: "#22c55e", fontSize: 12, margin: "4px 0 0" }}>+20.1% from last month</p>
      </div>
    ),
    product: (s) => (
      <div style={{ background: s.bg_color, border: s.border, borderRadius: s.border_radius, boxShadow: s.shadow, overflow: "hidden", width: 200 }}>
        <div style={{ height: 120, background: "linear-gradient(135deg,#667eea,#764ba2)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 32 }}>🛋️</div>
        <div style={{ padding: "12px 14px" }}>
          <h4 style={{ margin: 0, fontSize: 13, fontWeight: 600 }}>Modern Sofa</h4>
          <p style={{ margin: "4px 0", fontSize: 16, fontWeight: 700, color: "#667eea" }}>$899</p>
        </div>
      </div>
    ),
    notification: (s) => (
      <div style={{ background: s.bg_color, border: s.border, borderRadius: s.border_radius, padding: "12px 14px", display: "flex", gap: 10, alignItems: "center", borderLeft: `4px solid ${s.accent_color}` }}>
        <div style={{ width: 32, height: 32, borderRadius: "50%", background: s.accent_color, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 14 }}>🔔</div>
        <div>
          <h4 style={{ margin: 0, fontSize: 13, fontWeight: 600 }}>New order</h4>
          <p style={{ margin: 0, fontSize: 11, color: "#64748b" }}>Order #1234</p>
        </div>
      </div>
    ),
    pricing: (s) => (
      <div style={{ background: s.bg_color, border: s.border, borderRadius: s.border_radius, boxShadow: s.shadow, overflow: "hidden", width: 200, textAlign: "center" }}>
        <div style={{ background: s.header_bg, color: s.header_text, padding: "14px 0" }}>
          <h3 style={{ margin: 0, fontSize: 14 }}>Pro Plan</h3>
          <p style={{ margin: "4px 0 0", fontSize: 22, fontWeight: 700 }}>$49<span style={{ fontSize: 11 }}>/mo</span></p>
        </div>
        <div style={{ padding: "14px" }}>
          <button style={{ background: s.header_bg, color: "#fff", border: "none", borderRadius: 8, padding: "6px 20px", cursor: "pointer", fontWeight: 600, fontSize: 12 }}>Choose Plan</button>
        </div>
      </div>
    ),
    user: (s) => (
      <div style={{ background: s.bg_color, border: s.border, borderRadius: s.border_radius, boxShadow: s.shadow, overflow: "hidden", width: 200, textAlign: "center" }}>
        <div style={{ height: 50, background: s.cover_bg || "linear-gradient(135deg,#667eea,#764ba2)" }} />
        <div style={{ marginTop: -25, padding: "0 14px" }}>
          <div style={{ width: 50, height: 50, borderRadius: "50%", background: "#e2e8f0", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, border: "3px solid #fff" }}>👤</div>
          <h4 style={{ margin: "6px 0 2px", fontSize: 13, fontWeight: 600 }}>John Doe</h4>
          <p style={{ margin: 0, fontSize: 11, color: "#64748b" }}>Admin</p>
        </div>
        <div style={{ padding: "10px 14px" }}>
          <button style={{ background: "#667eea", color: "#fff", border: "none", borderRadius: 8, padding: "5px 16px", cursor: "pointer", fontSize: 12, fontWeight: 600 }}>View Profile</button>
        </div>
      </div>
    ),
  };

  return (
    <div className="ui-page-wrap">
      {toast && <div className="ui-toast">{toast}</div>}
      <div className="settings-page-top">
        <h1 className="settings-page-title">Cards</h1>
        <Breadcrumb />
      </div>
      <div className="ui-showcase-header">
        <p>Card styles with live preview. Edit colors, shadows, borders, radius.</p>
        <button className="ui-reset-btn" onClick={handleReset}><FiRotateCcw /> Reset</button>
      </div>

      <div className={`ui-page-body ${editPanel ? "with-panel" : ""}`}>
        <div className="ui-showcase-grid ui-cards-grid">
          {Object.entries(cards).map(([name, s]) => (
            <div className="ui-showcase-card" key={name}>
              <div className="ui-showcase-card-header">
                <h3>{cardNames[name]}</h3>
                <button className="ui-action-btn" onClick={() => openEdit(name)}>✎</button>
              </div>
              <div className="ui-showcase-preview ui-card-preview">{cardPreviews[name]?.(s)}</div>
              <div className="ui-showcase-meta">
                <span className={`ui-enabled-badge ${s.enabled === "false" ? "disabled" : "active"}`}>{s.enabled === "false" ? "Disabled" : "Active"}</span>
              </div>
            </div>
          ))}
        </div>

        {editPanel && (
          <div className="ui-side-panel">
            <div className="ui-side-panel-header">
              <h3>Edit: {cardNames[editPanel]}</h3>
              <button className="ui-side-close" onClick={() => setEditPanel(null)}><FiX /></button>
            </div>
            <div className="ui-side-panel-body">
              <div className="ui-edit-grid">
                {[
                  ["bg_color", "Background", "color"],
                  ["border", "Border", "text"],
                  ["border_radius", "Border Radius", "text"],
                  ["shadow", "Box Shadow", "text"],
                  ["hover_shadow", "Hover Shadow", "text"],
                ].map(([key, label, type]) => (
                  <label key={key}>{label}
                    {type === "color" ? (
                      <div className="ui-color-input">
                        <input type="color" value={(draft[key] || "#ffffff").startsWith("#") ? draft[key] : "#ffffff"} onChange={(e) => updateDraft(key, e.target.value)} />
                        <input type="text" value={draft[key] || ""} onChange={(e) => updateDraft(key, e.target.value)} />
                      </div>
                    ) : <input type="text" value={draft[key] || ""} onChange={(e) => updateDraft(key, e.target.value)} />}
                  </label>
                ))}
                <label>Accent Color
                  <div className="ui-color-input">
                    <input type="color" value={(draft.header_color || draft.accent_color || "#667eea").startsWith("#") ? (draft.header_color || draft.accent_color) : "#667eea"} onChange={(e) => { updateDraft("header_color", e.target.value); updateDraft("accent_color", e.target.value); }} />
                    <input type="text" value={draft.header_color || draft.accent_color || ""} onChange={(e) => { updateDraft("header_color", e.target.value); updateDraft("accent_color", e.target.value); }} />
                  </div>
                </label>
                <label>Enabled
                  <select value={draft.enabled || "true"} onChange={(e) => updateDraft("enabled", e.target.value)}>
                    <option value="true">Active</option>
                    <option value="false">Disabled</option>
                  </select>
                </label>
              </div>
            </div>
            <div className="ui-side-panel-footer">
              <button className="ui-cancel-btn" onClick={() => setEditPanel(null)}>Cancel</button>
              <button className="ui-save-btn" onClick={saveComponent}><FiSave /> Save</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CardsShowcase;
