import { useState, useEffect, useRef } from "react";
import Breadcrumb from "../common/Breadcrumb";
import { FiImage, FiSave, FiX, FiCheck, FiTrash2 } from "react-icons/fi";

const API = "http://localhost:5000";

const ManageBrand = () => {
  const [brand, setBrand] = useState(null);
  const [loading, setLoading] = useState(true);
  const [brandName, setBrandName] = useState("Suvique");
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState({ type: "", msg: "" });
  const fileRef = useRef(null);

  const showToast = (type, msg) => {
    setToast({ type, msg });
    setTimeout(() => setToast({ type: "", msg: "" }), 3000);
  };

  const fetchBrand = () => {
    fetch(`${API}/api/site-brand`)
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data) {
          setBrand(json.data);
          setBrandName(json.data.brand_name || "Suvique");
          if (json.data.logo_path) {
            setLogoPreview(`${API}${json.data.logo_path}`);
          }
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchBrand(); }, []);

  const handleLogoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLogoFile(file);
    setLogoPreview(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    if (!brandName.trim()) return showToast("error", "Brand name is required");
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("brand_name", brandName);
      if (logoFile) fd.append("logo", logoFile);
      const res = await fetch(`${API}/api/site-brand`, { method: "POST", body: fd });
      const json = await res.json();
      if (json.success) {
        setBrand(json.data);
        if (json.data.logo_path) {
          setLogoPreview(`${API}${json.data.logo_path}`);
        }
        setLogoFile(null);
        showToast("success", "Brand updated successfully!");
        window.dispatchEvent(new Event("brand-updated"));
      } else {
        showToast("error", json.message || "Update failed");
      }
    } catch (err) {
      showToast("error", "Update failed");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setBrandName(brand?.brand_name || "Suvique");
    setLogoPreview(brand?.logo_path ? `${API}${brand.logo_path}` : null);
    setLogoFile(null);
  };

  if (loading) {
    return (
      <div className="shop-admin-wrap">
        <div className="settings-page-top">
          <h1 className="settings-page-title">Manage Brand</h1>
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
        <h1 className="settings-page-title">Manage Brand</h1>
        <Breadcrumb />
      </div>

      <div style={{ maxWidth: 640 }}>
        {/* Logo Card */}
        <div style={{
          background: "var(--card-bg, #fff)",
          border: "1px solid var(--border-color, #e2e8f0)",
          borderRadius: 14,
          overflow: "hidden",
          marginBottom: 24,
        }}>
          <div style={{ padding: "18px 24px", borderBottom: "1px solid var(--border-color, #e2e8f0)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "var(--text-primary, #1e293b)", display: "flex", alignItems: "center", gap: 8 }}>
              <FiImage /> Logo
            </h3>
          </div>
          <div style={{ padding: 24 }}>
            <div
              onClick={() => fileRef.current?.click()}
              style={{
                width: 180,
                height: 180,
                borderRadius: 14,
                border: "2px dashed var(--border-color, #e2e8f0)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                overflow: "hidden",
                background: "var(--input-bg, #f8fafc)",
                transition: "border-color 0.2s",
                margin: "0 auto",
              }}
            >
              {logoPreview ? (
                <img src={logoPreview} alt="Logo" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
              ) : (
                <>
                  <FiImage size={36} color="#94a3b8" />
                  <span style={{ fontSize: 12, color: "#94a3b8", marginTop: 8 }}>Click to upload</span>
                </>
              )}
            </div>
            <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleLogoChange} />
            <p style={{ textAlign: "center", fontSize: 12, color: "#94a3b8", marginTop: 12 }}>
              Recommended: 200×200px, PNG or SVG
            </p>
          </div>
        </div>

        {/* Brand Name Card */}
        <div style={{
          background: "var(--card-bg, #fff)",
          border: "1px solid var(--border-color, #e2e8f0)",
          borderRadius: 14,
          overflow: "hidden",
          marginBottom: 24,
        }}>
          <div style={{ padding: "18px 24px", borderBottom: "1px solid var(--border-color, #e2e8f0)" }}>
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "var(--text-primary, #1e293b)" }}>
              Brand Name
            </h3>
          </div>
          <div style={{ padding: 24 }}>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: 0.3, marginBottom: 6 }}>
              Brand / Company Name
            </label>
            <input
              type="text"
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
              placeholder="Enter brand name"
              style={{
                width: "100%",
                padding: "10px 14px",
                border: "1px solid var(--border-color, #e2e8f0)",
                borderRadius: 8,
                fontSize: 14,
                background: "var(--input-bg, #fff)",
                color: "var(--text-primary, #1e293b)",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
          <button
            onClick={handleCancel}
            style={{
              height: 42,
              padding: "0 22px",
              borderRadius: 10,
              border: "1px solid var(--border-color, #e5e7eb)",
              background: "var(--input-bg, #f1f5f9)",
              color: "#64748b",
              fontSize: 14,
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: 8,
              cursor: "pointer",
            }}
          >
            <FiX /> Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            style={{
              height: 42,
              padding: "0 22px",
              borderRadius: 10,
              border: "none",
              background: "var(--btn-primary-bg, #667eea)",
              color: "#fff",
              fontSize: 14,
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: 8,
              cursor: saving ? "not-allowed" : "pointer",
              opacity: saving ? 0.6 : 1,
            }}
          >
            <FiSave /> {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>

        {/* Preview */}
        <div style={{
          marginTop: 32,
          padding: 24,
          background: "var(--card-bg, #fff)",
          border: "1px solid var(--border-color, #e2e8f0)",
          borderRadius: 14,
        }}>
          <h3 style={{ margin: "0 0 16px", fontSize: 14, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: 0.3 }}>
            Preview
          </h3>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {logoPreview ? (
              <img src={logoPreview} alt="Logo" style={{ width: 40, height: 40, borderRadius: 8, objectFit: "contain" }} />
            ) : (
              <div style={{ width: 40, height: 40, borderRadius: 8, background: "linear-gradient(135deg, #667eea, #764ba2)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 16 }}>
                {brandName.charAt(0)}
              </div>
            )}
            <span style={{ fontSize: 20, fontWeight: 700, color: "var(--text-primary, #1e293b)" }}>{brandName}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageBrand;
