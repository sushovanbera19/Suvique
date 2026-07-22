import { useState } from "react";
import Breadcrumb from "../common/Breadcrumb";
import { useUISettings } from "../../context/UISettingsContext";
import { FiCopy, FiCheck, FiSave, FiRotateCcw, FiX } from "react-icons/fi";
import "../../assets/style/UIShowcase.css";

const ButtonsShowcase = () => {
  const { getByType, saveSettings, resetType } = useUISettings();
  const buttons = getByType("button");
  const [editPanel, setEditPanel] = useState(null);
  const [draft, setDraft] = useState({});
  const [copied, setCopied] = useState(null);
  const [toast, setToast] = useState("");

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 3000); };

  const openEdit = (name) => { setEditPanel(name); setDraft({ ...buttons[name] }); };
  const updateDraft = (key, value) => setDraft((p) => ({ ...p, [key]: value }));

  const saveComponent = async () => {
    const rows = Object.entries(draft)
      .filter(([k]) => !["component_type", "component_name", "id"].includes(k))
      .map(([k, v]) => ({ component_type: "button", component_name: editPanel, setting_key: k, setting_value: String(v) }));
    const ok = await saveSettings(rows);
    showToast(ok ? "Saved!" : "Failed");
    if (ok) setEditPanel(null);
  };

  const handleReset = async () => { await resetType("button"); showToast("Reset to defaults"); };

  const copyCode = (name, style) => {
    const code = `<button style={{ background: "${style.bg_color}", color: "${style.text_color}", borderRadius: "${style.border_radius}", fontSize: "${style.font_size}", padding: "${style.padding}", border: "none", cursor: "pointer", boxShadow: "${style.shadow}" }}>  ${name}</button>`;
    navigator.clipboard.writeText(code);
    setCopied(name);
    setTimeout(() => setCopied(null), 2000);
  };

  const btnNames = { primary: "Primary", secondary: "Secondary", success: "Success", danger: "Danger", warning: "Warning", outline: "Outline", ghost: "Ghost", rounded: "Rounded", icon_btn: "Icon Button", gradient: "Gradient" };

  return (
    <div className="ui-page-wrap">
      {toast && <div className="ui-toast">{toast}</div>}

      <div className="settings-page-top">
        <h1 className="settings-page-title">Buttons</h1>
        <Breadcrumb />
      </div>

      <div className="ui-showcase-header">
        <p>All button styles with live preview. Click edit to customize.</p>
        <button className="ui-reset-btn" onClick={handleReset}><FiRotateCcw /> Reset</button>
      </div>

      <div className={`ui-page-body ${editPanel ? "with-panel" : ""}`}>
        <div className="ui-showcase-grid">
          {Object.entries(buttons).map(([name, s]) => (
            <div className="ui-showcase-card" key={name}>
              <div className="ui-showcase-card-header">
                <h3>{btnNames[name] || name}</h3>
                <div className="ui-showcase-actions">
                  <button className="ui-action-btn" onClick={() => copyCode(name, s)}>{copied === name ? <FiCheck /> : <FiCopy />}</button>
                  <button className="ui-action-btn" onClick={() => openEdit(name)}>✎</button>
                </div>
              </div>
              <div className="ui-showcase-preview">
                <button style={{
                  background: s.enabled === "false" ? "#ccc" : s.bg_color, color: s.text_color,
                  borderRadius: s.border_radius, fontSize: s.font_size, padding: s.padding,
                  boxShadow: s.shadow, border: s.border || "none",
                  opacity: s.enabled === "false" ? 0.5 : 1, cursor: s.enabled === "false" ? "not-allowed" : "pointer",
                  fontWeight: 600, transition: "all 0.2s",
                }}>
                  {name === "icon_btn" ? "✦ Add" : btnNames[name]}
                </button>
              </div>
              <div className="ui-showcase-meta">
                <span className="ui-color-dot" style={{ background: s.bg_color }} />
                <span>{s.bg_color}</span>
                <span className={`ui-enabled-badge ${s.enabled === "false" ? "disabled" : "active"}`}>{s.enabled === "false" ? "Disabled" : "Active"}</span>
              </div>
            </div>
          ))}
        </div>

        {editPanel && (
          <div className="ui-side-panel">
            <div className="ui-side-panel-header">
              <h3>Edit: {btnNames[editPanel]}</h3>
              <button className="ui-side-close" onClick={() => setEditPanel(null)}><FiX /></button>
            </div>
            <div className="ui-side-panel-body">
              <div className="ui-edit-grid">
                {[
                  ["bg_color", "Background Color", "color"],
                  ["text_color", "Text Color", "color"],
                  ["hover_bg", "Hover Background", "color"],
                  ["border_radius", "Border Radius", "text"],
                  ["font_size", "Font Size", "text"],
                  ["padding", "Padding", "text"],
                  ["shadow", "Box Shadow", "text"],
                ].map(([key, label, type]) => (
                  <label key={key}>
                    {label}
                    {type === "color" ? (
                      <div className="ui-color-input">
                        <input type="color" value={(draft[key] || "#667eea").startsWith("#") ? draft[key] : "#667eea"} onChange={(e) => updateDraft(key, e.target.value)} />
                        <input type="text" value={draft[key] || ""} onChange={(e) => updateDraft(key, e.target.value)} />
                      </div>
                    ) : (
                      <input type="text" value={draft[key] || ""} onChange={(e) => updateDraft(key, e.target.value)} />
                    )}
                  </label>
                ))}
                <label>
                  Enabled
                  <select value={draft.enabled || "true"} onChange={(e) => updateDraft("enabled", e.target.value)}>
                    <option value="true">Active</option>
                    <option value="false">Disabled</option>
                  </select>
                </label>
              </div>
              <div className="ui-side-preview">
                <h4>Preview</h4>
                <button style={{
                  background: draft.enabled === "false" ? "#ccc" : draft.bg_color, color: draft.text_color,
                  borderRadius: draft.border_radius, fontSize: draft.font_size, padding: draft.padding,
                  boxShadow: draft.shadow, border: draft.border || "none", fontWeight: 600, cursor: "pointer",
                  opacity: draft.enabled === "false" ? 0.5 : 1,
                }}>{btnNames[editPanel]}</button>
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

export default ButtonsShowcase;
