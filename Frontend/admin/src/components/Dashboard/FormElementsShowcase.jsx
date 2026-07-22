import { useState } from "react";
import Breadcrumb from "../common/Breadcrumb";
import { useUISettings } from "../../context/UISettingsContext";
import { FiSave, FiRotateCcw, FiUpload, FiX } from "react-icons/fi";
import "../../assets/style/UIShowcase.css";

const FormElementsShowcase = () => {
  const { getByType, saveSettings, resetType } = useUISettings();
  const forms = getByType("form");
  const [editPanel, setEditPanel] = useState(null);
  const [draft, setDraft] = useState({});
  const [toast, setToast] = useState("");
  const [toggleState, setToggleState] = useState(true);
  const [rangeVal, setRangeVal] = useState(50);
  const [checkVal, setCheckVal] = useState(true);
  const [radioVal, setRadioVal] = useState("option1");
  const [fileVal, setFileVal] = useState(null);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  const openEdit = (name) => {
    setEditPanel(name);
    setDraft({ ...forms[name] });
  };

  const updateDraft = (key, value) => setDraft((p) => ({ ...p, [key]: value }));

  const saveComponent = async () => {
    const rows = Object.entries(draft)
      .filter(([k]) => !["component_type", "component_name", "id"].includes(k))
      .map(([k, v]) => ({
        component_type: "form",
        component_name: editPanel,
        setting_key: k,
        setting_value: String(v),
      }));
    const ok = await saveSettings(rows);
    showToast(ok ? "Saved!" : "Failed");
    if (ok) setEditPanel(null);
  };

  const handleReset = async () => {
    await resetType("form");
    showToast("Form elements reset to defaults");
  };

  const formNames = {
    text_input: "Text Input",
    select: "Select / Dropdown",
    textarea: "Textarea",
    checkbox: "Checkbox",
    radio: "Radio Button",
    toggle: "Toggle / Switch",
    range_slider: "Range Slider",
    file_upload: "File Upload",
  };

  const renderDemo = (name, s) => {
    if (s.enabled === "false") return <div className="ui-chart-disabled">Disabled</div>;

    const inputStyle = {
      background: s.bg_color,
      border: `1px solid ${s.border_color}`,
      borderRadius: s.border_radius,
      fontSize: s.font_size,
      padding: s.padding,
      color: s.text_color,
      boxShadow: s.shadow,
      width: "100%",
      outline: "none",
      fontFamily: "inherit",
      boxSizing: "border-box",
    };

    const labelStyle = {
      color: s.label_color,
      fontSize: s.label_size,
      fontWeight: 600,
      display: "block",
      marginBottom: 6,
    };

    if (name === "text_input") {
      return (
        <div style={{ width: "100%", padding: "0 20px" }}>
          <label style={labelStyle}>Full Name</label>
          <input
            type="text"
            placeholder="Enter your name"
            style={inputStyle}
            onFocus={(e) => (e.target.style.borderColor = s.focus_border)}
            onBlur={(e) => (e.target.style.borderColor = s.border_color)}
          />
        </div>
      );
    }

    if (name === "select") {
      return (
        <div style={{ width: "100%", padding: "0 20px" }}>
          <label style={labelStyle}>Country</label>
          <select
            style={{ ...inputStyle, appearance: "none", backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3Csvg width='12' height='12' fill='${s.arrow_color || "#64748b"}' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M2 4l4 4 4-4'/%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 12px center", paddingRight: 36 }}
          >
            <option>Select country</option>
            <option>India</option>
            <option>USA</option>
            <option>UK</option>
            <option>Germany</option>
          </select>
        </div>
      );
    }

    if (name === "textarea") {
      return (
        <div style={{ width: "100%", padding: "0 20px" }}>
          <label style={labelStyle}>Message</label>
          <textarea
            placeholder="Write your message..."
            rows={4}
            style={{ ...inputStyle, minHeight: s.min_height, resize: "vertical" }}
          />
        </div>
      );
    }

    if (name === "checkbox") {
      return (
        <div style={{ display: "flex", gap: 16, padding: "0 20px", flexWrap: "wrap" }}>
          {["Receive notifications", "Accept terms", "Subscribe newsletter"].map((label) => (
            <label key={label} style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 14, color: "#374151" }}>
              <input
                type="checkbox"
                checked={checkVal}
                onChange={() => setCheckVal(!checkVal)}
                style={{ display: "none" }}
              />
              <span style={{
                width: s.size,
                height: s.size,
                border: `2px solid ${checkVal ? s.check_color : s.border_color}`,
                borderRadius: s.border_radius,
                background: checkVal ? s.check_color : "transparent",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                fontSize: 12,
                transition: "all 0.2s",
              }}>
                {checkVal ? "✓" : ""}
              </span>
              {label}
            </label>
          ))}
        </div>
      );
    }

    if (name === "radio") {
      return (
        <div style={{ display: "flex", gap: 16, padding: "0 20px" }}>
          {["option1", "option2", "option3"].map((opt) => (
            <label key={opt} style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 14, color: "#374151" }}>
              <input type="radio" name="demo-radio" value={opt} checked={radioVal === opt} onChange={() => setRadioVal(opt)} style={{ display: "none" }} />
              <span style={{
                width: s.size,
                height: s.size,
                border: `2px solid ${radioVal === opt ? s.check_color : s.border_color}`,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.2s",
              }}>
                {radioVal === opt && <span style={{ width: s.size * 0.5, height: s.size * 0.5, borderRadius: "50%", background: s.check_color }} />}
              </span>
              {opt}
            </label>
          ))}
        </div>
      );
    }

    if (name === "toggle") {
      return (
        <div style={{ display: "flex", gap: 24, padding: "0 20px", alignItems: "center" }}>
          <span style={{ fontSize: 14, color: "#374151" }}>Dark Mode</span>
          <div
            onClick={() => setToggleState(!toggleState)}
            style={{
              width: s.width,
              height: s.height,
              borderRadius: s.height,
              background: toggleState ? s.active_bg : s.inactive_bg,
              cursor: "pointer",
              position: "relative",
              transition: "background 0.3s",
              padding: 2,
            }}
          >
            <span style={{
              width: s.height - 4,
              height: s.height - 4,
              borderRadius: "50%",
              background: s.knob_color,
              position: "absolute",
              top: 2,
              left: toggleState ? s.width - s.height + 2 : 2,
              transition: "left 0.3s",
              boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
            }} />
          </div>
          <span style={{ fontSize: 14, color: toggleState ? s.active_bg : "#94a3b8" }}>{toggleState ? "On" : "Off"}</span>
        </div>
      );
    }

    if (name === "range_slider") {
      return (
        <div style={{ width: "100%", padding: "0 20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <label style={labelStyle}>Price Range</label>
            <span style={{ fontSize: 14, fontWeight: 600, color: s.fill_color }}>{rangeVal}%</span>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            value={rangeVal}
            onChange={(e) => setRangeVal(e.target.value)}
            style={{
              width: "100%",
              height: s.height,
              appearance: "none",
              background: `linear-gradient(to right, ${s.fill_color} ${rangeVal}%, ${s.track_color} ${rangeVal}%)`,
              borderRadius: s.height,
              outline: "none",
              cursor: "pointer",
            }}
          />
        </div>
      );
    }

    if (name === "file_upload") {
      return (
        <div style={{ width: "100%", padding: "0 20px" }}>
          <label
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "24px",
              border: `2px ${s.border_style} ${s.border_color}`,
              borderRadius: s.border_radius,
              background: s.bg_color,
              color: s.text_color,
              cursor: "pointer",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = s.hover_bg)}
            onMouseLeave={(e) => (e.currentTarget.style.background = s.bg_color)}
          >
            <FiUpload style={{ fontSize: 28, color: s.icon_color, marginBottom: 8 }} />
            <span style={{ fontWeight: 600, fontSize: 14 }}>Click to upload</span>
            <span style={{ fontSize: 12, marginTop: 4 }}>PNG, JPG, PDF up to 10MB</span>
            <input type="file" style={{ display: "none" }} onChange={(e) => setFileVal(e.target.files?.[0]?.name || null)} />
          </label>
          {fileVal && <p style={{ fontSize: 13, color: "#22c55e", marginTop: 8 }}>Selected: {fileVal}</p>}
        </div>
      );
    }

    return null;
  };

  return (
    <div className="ui-page-wrap">
      {toast && <div className="ui-toast">{toast}</div>}
      <div className="settings-page-top">
        <h1 className="settings-page-title">Form Elements</h1>
        <Breadcrumb />
      </div>

      <div className="ui-showcase-header">
        <p>All form input types with live preview. Customize colors, borders, radius, focus states. Both admin & client forms use these settings.</p>
        <button className="ui-reset-btn" onClick={handleReset}><FiRotateCcw /> Reset</button>
      </div>

      <div className={`ui-page-body ${editPanel ? "with-panel" : ""}`}>
        <div className="ui-showcase-grid">
        {Object.entries(forms).map(([name, style]) => (
          <div className="ui-showcase-card" key={name}>
            <div className="ui-showcase-card-header">
              <h3>{formNames[name]}</h3>
              <div className="ui-showcase-actions">
                <button className="ui-action-btn" onClick={() => openEdit(name)}>✎ Edit</button>
              </div>
            </div>
            <div className="ui-showcase-preview" style={{ minHeight: name === "textarea" ? 160 : name === "file_upload" ? 160 : 100 }}>
              {renderDemo(name, style)}
            </div>
            <div className="ui-showcase-meta">
              <span>Radius: {style.border_radius || style.border_radius}</span>
              <span className={`ui-enabled-badge ${style.enabled === "false" ? "disabled" : "active"}`}>
                {style.enabled === "false" ? "Disabled" : "Active"}
              </span>
            </div>
          </div>
          ))}
        </div>

        {editPanel && (
          <div className="ui-side-panel">
            <div className="ui-side-panel-header">
              <h3>Edit: {formNames[editPanel]}</h3>
              <button className="ui-side-close" onClick={() => setEditPanel(null)}><FiX /></button>
            </div>
            <div className="ui-side-panel-body">
              <div className="ui-edit-grid">
              {Object.entries(draft).map(([key, val]) => {
                if (["component_type", "component_name", "id"].includes(key)) return null;
                if (key === "enabled") {
                  return (
                    <label key={key}>
                      Enabled
                      <select value={val || "true"} onChange={(e) => updateDraft("enabled", e.target.value)}>
                        <option value="true">Active</option>
                        <option value="false">Disabled</option>
                      </select>
                    </label>
                  );
                }
                if (key.includes("color") || key.includes("bg") || key === "focus_border" || key === "border_color" || key === "knob_color" || key === "active_bg" || key === "inactive_bg" || key === "fill_color" || key === "thumb_color" || key === "track_color" || key === "icon_color" || key === "check_color" || key === "radio_color" || key === "arrow_color" || key === "label_color" || key === "placeholder_color" || key === "text_color") {
                  return (
                    <label key={key}>
                      {key.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                      <div className="ui-color-input">
                        <input type="color" value={(val || "#667eea").startsWith("#") ? val : "#667eea"} onChange={(e) => updateDraft(key, e.target.value)} />
                        <input type="text" value={val || ""} onChange={(e) => updateDraft(key, e.target.value)} />
                      </div>
                    </label>
                  );
                }
                return (
                  <label key={key}>
                    {key.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                    <input type="text" value={val || ""} onChange={(e) => updateDraft(key, e.target.value)} />
                  </label>
                );
              })}
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

export default FormElementsShowcase;
