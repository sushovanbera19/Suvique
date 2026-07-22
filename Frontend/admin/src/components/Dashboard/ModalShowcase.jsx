import { useState } from "react";
import Breadcrumb from "../common/Breadcrumb";
import { useUISettings } from "../../context/UISettingsContext";
import { FiSave, FiRotateCcw, FiX } from "react-icons/fi";
import "../../assets/style/UIShowcase.css";

const ModalShowcase = () => {
  const { getByType, saveSettings, resetType } = useUISettings();
  const modals = getByType("modal");
  const [editPanel, setEditPanel] = useState(null);
  const [draft, setDraft] = useState({});
  const [activeDemo, setActiveDemo] = useState(null);
  const [toast, setToast] = useState("");

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 3000); };
  const openEdit = (name) => { setEditPanel(name); setDraft({ ...modals[name] }); };
  const updateDraft = (key, value) => setDraft((p) => ({ ...p, [key]: value }));

  const saveComponent = async () => {
    const rows = Object.entries(draft)
      .filter(([k]) => !["component_type", "component_name", "id"].includes(k))
      .map(([k, v]) => ({ component_type: "modal", component_name: editPanel, setting_key: k, setting_value: String(v) }));
    const ok = await saveSettings(rows);
    showToast(ok ? "Saved!" : "Failed");
    if (ok) setEditPanel(null);
  };

  const handleReset = async () => { await resetType("modal"); showToast("Reset to defaults"); };

  const modalNames = { standard: "Standard Modal", confirm: "Confirm Dialog", drawer: "Side Drawer", fullscreen: "Fullscreen Modal", alert: "Alert Modal" };

  const renderDemoModal = (name, style) => {
    if (activeDemo !== name) return null;
    const overlayStyle = { position: "fixed", inset: 0, zIndex: 2000, display: "flex", alignItems: "center", justifyContent: "center", animation: "fadeIn 0.2s ease" };

    if (name === "drawer") {
      return (
        <div style={{ ...overlayStyle, background: style.overlay_color }} onClick={() => setActiveDemo(null)}>
          <div style={{ position: "absolute", right: 0, top: 0, height: "100vh", background: style.bg_color, width: style.width, boxShadow: style.shadow, animation: "slideInRight 0.3s ease" }} onClick={(e) => e.stopPropagation()}>
            <div style={{ padding: "16px 20px", borderBottom: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ margin: 0 }}>Settings</h3>
              <button onClick={() => setActiveDemo(null)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 18 }}><FiX /></button>
            </div>
            <div style={{ padding: 20 }}><p style={{ color: "#64748b", fontSize: 14 }}>Side drawer panel content.</p></div>
          </div>
        </div>
      );
    }
    if (name === "fullscreen") {
      return (
        <div style={{ ...overlayStyle, background: style.overlay_color }} onClick={() => setActiveDemo(null)}>
          <div style={{ background: style.bg_color, width: "90vw", height: "80vh", borderRadius: style.border_radius, display: "flex", flexDirection: "column", overflow: "hidden" }} onClick={(e) => e.stopPropagation()}>
            <div style={{ padding: "16px 24px", borderBottom: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ margin: 0 }}>Fullscreen</h3>
              <button onClick={() => setActiveDemo(null)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 18 }}><FiX /></button>
            </div>
            <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: "#94a3b8" }}>Content</div>
          </div>
        </div>
      );
    }
    return (
      <div style={{ ...overlayStyle, background: style.overlay_color }} onClick={() => setActiveDemo(null)}>
        <div style={{ background: style.bg_color, borderRadius: style.border_radius, boxShadow: style.shadow, width: style.width, maxWidth: "90vw" }} onClick={(e) => e.stopPropagation()}>
          <div style={{ padding: "16px 20px", borderBottom: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h3 style={{ margin: 0 }}>{modalNames[name]}</h3>
            <button onClick={() => setActiveDemo(null)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 18 }}><FiX /></button>
          </div>
          <div style={{ padding: 20 }}>
            {name === "confirm" && <div style={{ textAlign: "center" }}><div style={{ width: 50, height: 50, borderRadius: "50%", background: (style.accent_color || "#667eea") + "20", color: style.accent_color || "#667eea", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px", fontSize: 24 }}>⚠</div><p style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>Are you sure?</p><p style={{ color: "#64748b", fontSize: 13 }}>This cannot be undone.</p></div>}
            {name === "alert" && <div style={{ textAlign: "center" }}><div style={{ width: 50, height: 50, borderRadius: "50%", background: (style.accent_color || "#ef4444") + "20", color: style.accent_color || "#ef4444", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px", fontSize: 24 }}>✕</div><p style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>Error!</p><p style={{ color: "#64748b", fontSize: 13 }}>Something went wrong.</p></div>}
            {name === "standard" && <p style={{ color: "#64748b", fontSize: 14 }}>Standard modal dialog content.</p>}
          </div>
          <div style={{ padding: "12px 20px", borderTop: "1px solid #e2e8f0", display: "flex", gap: 8, justifyContent: "flex-end" }}>
            <button onClick={() => setActiveDemo(null)} style={{ padding: "8px 16px", borderRadius: 8, border: "1px solid #e2e8f0", background: "#fff", cursor: "pointer", fontSize: 13 }}>Cancel</button>
            <button style={{ padding: "8px 16px", borderRadius: 8, border: "none", background: style.accent_color || "#667eea", color: "#fff", cursor: "pointer", fontSize: 13, fontWeight: 600 }}>Confirm</button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="ui-page-wrap">
      {toast && <div className="ui-toast">{toast}</div>}
      <div className="settings-page-top">
        <h1 className="settings-page-title">Modals</h1>
        <Breadcrumb />
      </div>
      <div className="ui-showcase-header">
        <p>Modal styles. Click Demo to preview, Edit to customize.</p>
        <button className="ui-reset-btn" onClick={handleReset}><FiRotateCcw /> Reset</button>
      </div>

      <div className={`ui-page-body ${editPanel ? "with-panel" : ""}`}>
        <div className="ui-showcase-grid">
          {Object.entries(modals).map(([name, s]) => (
            <div className="ui-showcase-card" key={name}>
              <div className="ui-showcase-card-header">
                <h3>{modalNames[name]}</h3>
                <div className="ui-showcase-actions">
                  <button className="ui-action-btn ui-demo-btn-trigger" onClick={() => setActiveDemo(name)}>▶ Demo</button>
                  <button className="ui-action-btn" onClick={() => openEdit(name)}>✎</button>
                </div>
              </div>
              <div className="ui-showcase-preview">
                <div style={{ width: "100%", height: 110, background: s.overlay_color || "rgba(0,0,0,0.5)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <div style={{ background: s.bg_color, borderRadius: s.border_radius, width: name === "drawer" ? "60%" : name === "fullscreen" ? "80%" : "70%", height: name === "fullscreen" ? "80%" : "60%", boxShadow: s.shadow, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: "#94a3b8", border: "1px solid #e2e8f0" }}>{modalNames[name]}</div>
                </div>
              </div>
              <div className="ui-showcase-meta">
                <span>Width: {s.width}</span>
                <span className={`ui-enabled-badge ${s.enabled === "false" ? "disabled" : "active"}`}>{s.enabled === "false" ? "Disabled" : "Active"}</span>
              </div>
            </div>
          ))}
        </div>

        {activeDemo && renderDemoModal(activeDemo, modals[activeDemo])}

        {editPanel && (
          <div className="ui-side-panel">
            <div className="ui-side-panel-header">
              <h3>Edit: {modalNames[editPanel]}</h3>
              <button className="ui-side-close" onClick={() => setEditPanel(null)}><FiX /></button>
            </div>
            <div className="ui-side-panel-body">
              <div className="ui-edit-grid">
                <label>Overlay Color
                  <input type="text" value={draft.overlay_color || ""} onChange={(e) => updateDraft("overlay_color", e.target.value)} />
                </label>
                <label>Background
                  <div className="ui-color-input">
                    <input type="color" value={(draft.bg_color || "#ffffff").startsWith("#") ? draft.bg_color : "#ffffff"} onChange={(e) => updateDraft("bg_color", e.target.value)} />
                    <input type="text" value={draft.bg_color || ""} onChange={(e) => updateDraft("bg_color", e.target.value)} />
                  </div>
                </label>
                <label>Border Radius <input type="text" value={draft.border_radius || ""} onChange={(e) => updateDraft("border_radius", e.target.value)} /></label>
                <label>Width <input type="text" value={draft.width || ""} onChange={(e) => updateDraft("width", e.target.value)} /></label>
                <label>Box Shadow <input type="text" value={draft.shadow || ""} onChange={(e) => updateDraft("shadow", e.target.value)} /></label>
                <label>Animation <input type="text" value={draft.animation || ""} onChange={(e) => updateDraft("animation", e.target.value)} /></label>
                <label>Accent Color
                  <div className="ui-color-input">
                    <input type="color" value={(draft.accent_color || "#667eea").startsWith("#") ? draft.accent_color : "#667eea"} onChange={(e) => updateDraft("accent_color", e.target.value)} />
                    <input type="text" value={draft.accent_color || ""} onChange={(e) => updateDraft("accent_color", e.target.value)} />
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

export default ModalShowcase;
