import { useState } from "react";
import Breadcrumb from "../common/Breadcrumb";
import { useUISettings } from "../../context/UISettingsContext";
import { FiSave, FiRotateCcw, FiX } from "react-icons/fi";
import "../../assets/style/UIShowcase.css";

const FormValidationShowcase = () => {
  const { getByType, saveSettings, resetType } = useUISettings();
  const validations = getByType("validation");
  const [editPanel, setEditPanel] = useState(null);
  const [draft, setDraft] = useState({});
  const [toast, setToast] = useState("");
  const [demoEmail, setDemoEmail] = useState("");
  const [demoPhone, setDemoPhone] = useState("");
  const [demoPassword, setDemoPassword] = useState("");
  const [demoName, setDemoName] = useState("");

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  const openEdit = (name) => {
    setEditPanel(name);
    setDraft({ ...validations[name] });
  };

  const updateDraft = (key, value) => setDraft((p) => ({ ...p, [key]: value }));

  const saveComponent = async () => {
    const rows = Object.entries(draft)
      .filter(([k]) => !["component_type", "component_name", "id"].includes(k))
      .map(([k, v]) => ({
        component_type: "validation",
        component_name: editPanel,
        setting_key: k,
        setting_value: String(v),
      }));
    const ok = await saveSettings(rows);
    showToast(ok ? "Saved!" : "Failed");
    if (ok) setEditPanel(null);
  };

  const handleReset = async (type) => {
    await resetType(type);
    showToast("Reset to defaults");
  };

  const valNames = {
    error: "Error State",
    success: "Success State",
    warning: "Warning State",
    rules: "Validation Rules",
  };

  const validateEmail = (email) => {
    const rules = validations.rules;
    if (!rules || !email) return null;
    const regex = new RegExp(rules.email_regex);
    return regex.test(email);
  };

  const validatePhone = (phone) => {
    const rules = validations.rules;
    if (!rules || !phone) return null;
    const regex = new RegExp(rules.phone_regex);
    return regex.test(phone);
  };

  const validatePassword = (pw) => {
    const rules = validations.rules;
    if (!rules || !pw) return null;
    const checks = [];
    if (pw.length < Number(rules.password_min || 8)) checks.push(`Min ${rules.password_min} characters`);
    if (Number(rules.password_uppercase || 0) > 0 && !/[A-Z]/.test(pw)) checks.push("Needs uppercase letter");
    if (Number(rules.password_number || 0) > 0 && !/[0-9]/.test(pw)) checks.push("Needs a number");
    if (Number(rules.password_special || 0) > 0 && !/[!@#$%^&*(),.?\":{}|<>]/.test(pw)) checks.push("Needs special character");
    return checks.length === 0 ? true : checks;
  };

  const validateName = (name) => {
    const rules = validations.rules;
    if (!rules || !name) return null;
    const min = Number(rules.name_min || 2);
    const max = Number(rules.name_max || 100);
    return name.length >= min && name.length <= max;
  };

  const inputStyle = {
    width: "100%",
    padding: "10px 14px",
    borderRadius: 8,
    border: "1px solid #e2e8f0",
    fontSize: 14,
    outline: "none",
    boxSizing: "border-box",
    fontFamily: "inherit",
  };

  return (
    <div className="ui-page-wrap">
      {toast && <div className="ui-toast">{toast}</div>}
      <div className="settings-page-top">
        <h1 className="settings-page-title">Form Validation</h1>
        <Breadcrumb />
      </div>

      <div className="ui-showcase-header">
        <p>Validation styles and rules. Edit error/success/warning appearance, and configure validation patterns (email, phone, password). Both admin & client use these rules.</p>
        <button className="ui-reset-btn" onClick={() => handleReset("validation")}><FiRotateCcw /> Reset</button>
      </div>

      <div className={`ui-page-body ${editPanel ? "with-panel" : ""}`}>
        <div className="ui-showcase-grid ui-validation-grid">
        {/* ERROR STATE */}
        {validations.error && (
          <div className="ui-showcase-card">
            <div className="ui-showcase-card-header">
              <h3>Error State</h3>
              <button className="ui-action-btn" onClick={() => openEdit("error")}>✎ Edit</button>
            </div>
            <div className="ui-showcase-preview" style={{ flexDirection: "column", gap: 12, padding: "20px" }}>
              <div style={{
                border: `2px solid ${validations.error.border_color}`,
                borderRadius: 8,
                background: validations.error.bg_color,
                padding: "10px 14px",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                  <span>{validations.error.icon}</span>
                  <input type="text" placeholder="Enter email" style={{ ...inputStyle, border: `2px solid ${validations.error.border_color}`, borderColor: validations.error.border_color }} />
                </div>
                <p style={{ color: validations.error.text_color, fontSize: validations.error.font_size, margin: 0 }}>This field is required</p>
              </div>
              <div style={{
                border: `2px solid ${validations.error.border_color}`,
                borderRadius: 8,
                background: validations.error.bg_color,
                padding: "10px 14px",
              }}>
                <input type="text" placeholder="Invalid email format" style={{ ...inputStyle, border: `2px solid ${validations.error.border_color}` }} />
                <p style={{ color: validations.error.text_color, fontSize: validations.error.font_size, margin: "4px 0 0" }}>{validations.error.icon} Please enter a valid email</p>
              </div>
            </div>
            <div className="ui-showcase-meta">
              <span className="ui-color-dot" style={{ background: validations.error.text_color }} />
              <span>{validations.error.text_color}</span>
              <span className="ui-enabled-badge active">Active</span>
            </div>
          </div>
        )}

        {/* SUCCESS STATE */}
        {validations.success && (
          <div className="ui-showcase-card">
            <div className="ui-showcase-card-header">
              <h3>Success State</h3>
              <button className="ui-action-btn" onClick={() => openEdit("success")}>✎ Edit</button>
            </div>
            <div className="ui-showcase-preview" style={{ flexDirection: "column", gap: 12, padding: "20px" }}>
              <div style={{
                border: `2px solid ${validations.success.border_color}`,
                borderRadius: 8,
                background: validations.success.bg_color,
                padding: "10px 14px",
              }}>
                <input type="text" value="user@example.com" readOnly style={{ ...inputStyle, border: `2px solid ${validations.success.border_color}` }} />
                <p style={{ color: validations.success.text_color, fontSize: validations.success.font_size, margin: "4px 0 0" }}>{validations.success.icon} Email is valid</p>
              </div>
            </div>
            <div className="ui-showcase-meta">
              <span className="ui-color-dot" style={{ background: validations.success.text_color }} />
              <span>{validations.success.text_color}</span>
              <span className="ui-enabled-badge active">Active</span>
            </div>
          </div>
        )}

        {/* WARNING STATE */}
        {validations.warning && (
          <div className="ui-showcase-card">
            <div className="ui-showcase-card-header">
              <h3>Warning State</h3>
              <button className="ui-action-btn" onClick={() => openEdit("warning")}>✎ Edit</button>
            </div>
            <div className="ui-showcase-preview" style={{ flexDirection: "column", gap: 12, padding: "20px" }}>
              <div style={{
                border: `2px solid ${validations.warning.border_color}`,
                borderRadius: 8,
                background: validations.warning.bg_color,
                padding: "10px 14px",
              }}>
                <input type="text" placeholder="Weak password" style={{ ...inputStyle, border: `2px solid ${validations.warning.border_color}` }} />
                <p style={{ color: validations.warning.text_color, fontSize: validations.warning.font_size, margin: "4px 0 0" }}>{validations.warning.icon} Consider using a stronger password</p>
              </div>
            </div>
            <div className="ui-showcase-meta">
              <span className="ui-color-dot" style={{ background: validations.warning.text_color }} />
              <span>{validations.warning.text_color}</span>
              <span className="ui-enabled-badge active">Active</span>
            </div>
          </div>
        )}

        {/* VALIDATION RULES */}
        {validations.rules && (
          <div className="ui-showcase-card">
            <div className="ui-showcase-card-header">
              <h3>Validation Rules (Live Demo)</h3>
              <button className="ui-action-btn" onClick={() => openEdit("rules")}>✎ Edit</button>
            </div>
            <div className="ui-showcase-preview" style={{ flexDirection: "column", gap: 14, padding: "20px", alignItems: "stretch" }}>
              {/* Name */}
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 4 }}>Name</label>
                <input
                  type="text"
                  value={demoName}
                  onChange={(e) => setDemoName(e.target.value)}
                  placeholder={`Min ${validations.rules.name_min} chars`}
                  style={{ ...inputStyle, borderColor: demoName && !validateName(demoName) ? validations.error.border_color : demoName && validateName(demoName) ? validations.success.border_color : "#e2e8f0" }}
                />
                {demoName && !validateName(demoName) && <p style={{ color: validations.error.text_color, fontSize: validations.error.font_size, margin: "2px 0 0" }}>Name must be {validations.rules.name_min}-{validations.rules.name_max} characters</p>}
                {demoName && validateName(demoName) && <p style={{ color: validations.success.text_color, fontSize: validations.success.font_size, margin: "2px 0 0" }}>{validations.success.icon} Valid name</p>}
              </div>

              {/* Email */}
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 4 }}>Email</label>
                <input
                  type="email"
                  value={demoEmail}
                  onChange={(e) => setDemoEmail(e.target.value)}
                  placeholder="you@example.com"
                  style={{ ...inputStyle, borderColor: demoEmail && !validateEmail(demoEmail) ? validations.error.border_color : demoEmail && validateEmail(demoEmail) ? validations.success.border_color : "#e2e8f0" }}
                />
                {demoEmail && !validateEmail(demoEmail) && <p style={{ color: validations.error.text_color, fontSize: validations.error.font_size, margin: "2px 0 0" }}>Invalid email format</p>}
                {demoEmail && validateEmail(demoEmail) && <p style={{ color: validations.success.text_color, fontSize: validations.success.font_size, margin: "2px 0 0" }}>{validations.success.icon} Valid email</p>}
              </div>

              {/* Phone */}
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 4 }}>Phone</label>
                <input
                  type="tel"
                  value={demoPhone}
                  onChange={(e) => setDemoPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  style={{ ...inputStyle, borderColor: demoPhone && !validatePhone(demoPhone) ? validations.error.border_color : demoPhone && validatePhone(demoPhone) ? validations.success.border_color : "#e2e8f0" }}
                />
                {demoPhone && !validatePhone(demoPhone) && <p style={{ color: validations.error.text_color, fontSize: validations.error.font_size, margin: "2px 0 0" }}>Invalid phone number</p>}
                {demoPhone && validatePhone(demoPhone) && <p style={{ color: validations.success.text_color, fontSize: validations.success.font_size, margin: "2px 0 0" }}>{validations.success.icon} Valid phone</p>}
              </div>

              {/* Password */}
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 4 }}>Password</label>
                <input
                  type="password"
                  value={demoPassword}
                  onChange={(e) => setDemoPassword(e.target.value)}
                  placeholder={`Min ${validations.rules.password_min} chars`}
                  style={{ ...inputStyle, borderColor: demoPassword && validatePassword(demoPassword) !== true ? validations.warning.border_color : demoPassword && validatePassword(demoPassword) === true ? validations.success.border_color : "#e2e8f0" }}
                />
                {demoPassword && validatePassword(demoPassword) !== true && Array.isArray(validatePassword(demoPassword)) && (
                  <div style={{ marginTop: 4 }}>
                    {validatePassword(demoPassword).map((err, i) => (
                      <p key={i} style={{ color: validations.warning.text_color, fontSize: validations.warning.font_size, margin: "1px 0 0" }}>{validations.warning.icon} {err}</p>
                    ))}
                  </div>
                )}
                {demoPassword && validatePassword(demoPassword) === true && <p style={{ color: validations.success.text_color, fontSize: validations.success.font_size, margin: "2px 0 0" }}>{validations.success.icon} Strong password</p>}
              </div>
            </div>
            <div className="ui-showcase-meta">
              <span>Email regex configured</span>
              <span className="ui-enabled-badge active">Active</span>
            </div>
          </div>
        )}
      </div>

      {editPanel && (
        <div className="ui-side-panel">
          <div className="ui-side-panel-header">
            <h3>Edit: {valNames[editPanel]}</h3>
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
                if (key.includes("color") || key === "border_color" || key === "bg_color" || key === "text_color") {
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

export default FormValidationShowcase;
