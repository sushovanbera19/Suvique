import { useState, useEffect, useRef } from "react";
import Breadcrumb from "../common/Breadcrumb";
import {
  FiImage, FiSave, FiX, FiCheck, FiTrash2, FiPlus,
  FiPower, FiClock
} from "react-icons/fi";

const API = "http://localhost:5000";

const ManageBrand = () => {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [brandName, setBrandName] = useState("");
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState({ type: "", msg: "" });
  const [showAdd, setShowAdd] = useState(false);
  const fileRef = useRef(null);

  const showToast = (type, msg) => {
    setToast({ type, msg });
    setTimeout(() => setToast({ type: "", msg: "" }), 3000);
  };

  const fetchBrands = () => {
    fetch(`${API}/api/site-brand/all`)
      .then((res) => res.json())
      .then((json) => {
        if (json.success) setBrands(json.data || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchBrands(); }, []);

  const activeBrand = brands.find((b) => b.is_active);

  const handleLogoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLogoFile(file);
    setLogoPreview(URL.createObjectURL(file));
  };

  const handleAddBrand = async () => {
    if (!brandName.trim()) return showToast("error", "Brand name is required");
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("brand_name", brandName);
      if (logoFile) fd.append("logo", logoFile);
      const res = await fetch(`${API}/api/site-brand`, { method: "POST", body: fd });
      const json = await res.json();
      if (json.success) {
        setBrands(json.data);
        setBrandName("");
        setLogoFile(null);
        setLogoPreview(null);
        setShowAdd(false);
        showToast("success", "Brand added! Click Activate to make it live.");
      } else {
        showToast("error", json.message || "Failed");
      }
    } catch (err) {
      showToast("error", "Failed");
    } finally {
      setSaving(false);
    }
  };

  const handleActivate = async (id) => {
    try {
      const res = await fetch(`${API}/api/site-brand/${id}/activate`, { method: "PUT" });
      const json = await res.json();
      if (json.success) {
        setBrands(json.data);
        showToast("success", "Brand activated!");
        window.dispatchEvent(new Event("brand-updated"));
      }
    } catch (err) {
      showToast("error", "Failed to activate");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this brand?")) return;
    try {
      const res = await fetch(`${API}/api/site-brand/${id}`, { method: "DELETE" });
      const json = await res.json();
      if (json.success) {
        setBrands(json.data);
        showToast("success", "Brand deleted");
      } else {
        showToast("error", json.message || "Cannot delete active brand");
      }
    } catch (err) {
      showToast("error", "Failed to delete");
    }
  };

  const getImageUrl = (path) => {
    if (!path) return null;
    return `${API}${path.replace(/\\/g, "/")}`;
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

      <div style={{ maxWidth: 720 }}>
        {/* Active Brand Card */}
        <div style={{
          background: "var(--card-bg, #fff)",
          border: "1px solid var(--border-color, #e2e8f0)",
          borderRadius: 14,
          overflow: "hidden",
          marginBottom: 24,
        }}>
          <div style={{
            padding: "18px 24px",
            borderBottom: "1px solid var(--border-color, #e2e8f0)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}>
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "var(--text-primary, #1e293b)", display: "flex", alignItems: "center", gap: 8 }}>
              <FiPower /> Active Brand
            </h3>
            <span style={{ padding: "4px 12px", borderRadius: 20, fontSize: 12, fontWeight: 700, background: "#dcfce7", color: "#16a34a" }}>
              Live
            </span>
          </div>
          {activeBrand ? (
            <div style={{ padding: 24, display: "flex", alignItems: "center", gap: 20 }}>
              <div style={{
                width: 80,
                height: 80,
                borderRadius: 14,
                border: "2px solid var(--border-color, #e2e8f0)",
                overflow: "hidden",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "var(--input-bg, #f8fafc)",
                flexShrink: 0,
              }}>
                {activeBrand.logo_path ? (
                  <img src={getImageUrl(activeBrand.logo_path)} alt="Logo" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                ) : (
                  <div style={{ width: "100%", height: "100%", background: "linear-gradient(135deg, #667eea, #764ba2)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 28, fontWeight: 700 }}>
                    {activeBrand.brand_name.charAt(0)}
                  </div>
                )}
              </div>
              <div>
                <h2 style={{ margin: "0 0 4px", fontSize: 22, fontWeight: 700, color: "var(--text-primary, #1e293b)" }}>
                  {activeBrand.brand_name}
                </h2>
                <p style={{ margin: 0, fontSize: 13, color: "#94a3b8" }}>
                  Created {new Date(activeBrand.created_at).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                </p>
              </div>
            </div>
          ) : (
            <div style={{ padding: 32, textAlign: "center", color: "#94a3b8" }}>No active brand</div>
          )}
        </div>

        {/* Add New Brand */}
        <div style={{
          background: "var(--card-bg, #fff)",
          border: "1px solid var(--border-color, #e2e8f0)",
          borderRadius: 14,
          overflow: "hidden",
          marginBottom: 24,
        }}>
          <div
            style={{
              padding: "18px 24px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              cursor: "pointer",
            }}
            onClick={() => setShowAdd(!showAdd)}
          >
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "var(--text-primary, #1e293b)", display: "flex", alignItems: "center", gap: 8 }}>
              <FiPlus /> Add New Brand
            </h3>
            <FiChevronIcon open={showAdd} />
          </div>

          {showAdd && (
            <div style={{ padding: "0 24px 24px", borderTop: "1px solid var(--border-color, #e2e8f0)", paddingTop: 20 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 20, alignItems: "start" }}>
                {/* Logo Upload */}
                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: 0.3, marginBottom: 8 }}>
                    Logo
                  </label>
                  <div
                    onClick={() => fileRef.current?.click()}
                    style={{
                      width: 120,
                      height: 120,
                      borderRadius: 14,
                      border: "2px dashed var(--border-color, #e2e8f0)",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      overflow: "hidden",
                      background: "var(--input-bg, #f8fafc)",
                    }}
                  >
                    {logoPreview ? (
                      <img src={logoPreview} alt="Preview" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                    ) : (
                      <>
                        <FiImage size={28} color="#94a3b8" />
                        <span style={{ fontSize: 11, color: "#94a3b8", marginTop: 4 }}>Upload</span>
                      </>
                    )}
                  </div>
                  <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleLogoChange} />
                </div>

                {/* Brand Name */}
                <div style={{ flex: 1 }}>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: 0.3, marginBottom: 8 }}>
                    Brand Name
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
                  <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 16 }}>
                    <button
                      onClick={() => { setShowAdd(false); setBrandName(""); setLogoFile(null); setLogoPreview(null); }}
                      style={{
                        height: 38,
                        padding: "0 18px",
                        borderRadius: 8,
                        border: "1px solid var(--border-color, #e5e7eb)",
                        background: "var(--input-bg, #f1f5f9)",
                        color: "#64748b",
                        fontSize: 13,
                        fontWeight: 600,
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        cursor: "pointer",
                      }}
                    >
                      <FiX /> Cancel
                    </button>
                    <button
                      onClick={handleAddBrand}
                      disabled={saving}
                      style={{
                        height: 38,
                        padding: "0 18px",
                        borderRadius: 8,
                        border: "none",
                        background: "var(--btn-primary-bg, #667eea)",
                        color: "#fff",
                        fontSize: 13,
                        fontWeight: 600,
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        cursor: saving ? "not-allowed" : "pointer",
                        opacity: saving ? 0.6 : 1,
                      }}
                    >
                      <FiSave /> {saving ? "Adding..." : "Add Brand"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* All Brands History */}
        <div style={{
          background: "var(--card-bg, #fff)",
          border: "1px solid var(--border-color, #e2e8f0)",
          borderRadius: 14,
          overflow: "hidden",
        }}>
          <div style={{
            padding: "18px 24px",
            borderBottom: "1px solid var(--border-color, #e2e8f0)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}>
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "var(--text-primary, #1e293b)", display: "flex", alignItems: "center", gap: 8 }}>
              <FiClock /> Brand History
            </h3>
            <span style={{ padding: "3px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600, background: "#f1f5f9", color: "#64748b" }}>
              {brands.length} total
            </span>
          </div>

          {brands.length === 0 ? (
            <div style={{ padding: 32, textAlign: "center", color: "#94a3b8" }}>No brands yet</div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "#f8fafc" }}>
                    <th style={{ padding: "12px 18px", textAlign: "left", fontSize: 12, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 0.3 }}>Logo</th>
                    <th style={{ padding: "12px 18px", textAlign: "left", fontSize: 12, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 0.3 }}>Brand Name</th>
                    <th style={{ padding: "12px 18px", textAlign: "left", fontSize: 12, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 0.3 }}>Status</th>
                    <th style={{ padding: "12px 18px", textAlign: "left", fontSize: 12, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 0.3 }}>Created</th>
                    <th style={{ padding: "12px 18px", textAlign: "right", fontSize: 12, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 0.3 }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {brands.map((brand) => (
                    <tr key={brand.id} style={{ borderTop: "1px solid #f1f5f9" }}>
                      <td style={{ padding: "14px 18px" }}>
                        <div style={{
                          width: 48,
                          height: 48,
                          borderRadius: 10,
                          border: "1px solid #e2e8f0",
                          overflow: "hidden",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          background: "#f8fafc",
                        }}>
                          {brand.logo_path ? (
                            <img src={getImageUrl(brand.logo_path)} alt="Logo" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                          ) : (
                            <span style={{ fontSize: 18, fontWeight: 700, color: "#667eea" }}>{brand.brand_name.charAt(0)}</span>
                          )}
                        </div>
                      </td>
                      <td style={{ padding: "14px 18px", fontSize: 14, fontWeight: 600, color: "var(--text-primary, #1e293b)" }}>
                        {brand.brand_name}
                      </td>
                      <td style={{ padding: "14px 18px" }}>
                        <span style={{
                          padding: "4px 12px",
                          borderRadius: 20,
                          fontSize: 12,
                          fontWeight: 700,
                          background: brand.is_active ? "#dcfce7" : "#f1f5f9",
                          color: brand.is_active ? "#16a34a" : "#94a3b8",
                        }}>
                          {brand.is_active ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td style={{ padding: "14px 18px", fontSize: 13, color: "#94a3b8" }}>
                        {new Date(brand.created_at).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                      </td>
                      <td style={{ padding: "14px 18px", textAlign: "right" }}>
                        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                          {!brand.is_active && (
                            <>
                              <button
                                onClick={() => handleActivate(brand.id)}
                                title="Activate"
                                style={{
                                  width: 34,
                                  height: 34,
                                  borderRadius: 8,
                                  border: "none",
                                  background: "#dcfce7",
                                  color: "#16a34a",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  cursor: "pointer",
                                  fontSize: 14,
                                }}
                              >
                                <FiPower />
                              </button>
                              <button
                                onClick={() => handleDelete(brand.id)}
                                title="Delete"
                                style={{
                                  width: 34,
                                  height: 34,
                                  borderRadius: 8,
                                  border: "none",
                                  background: "#fee2e2",
                                  color: "#dc2626",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  cursor: "pointer",
                                  fontSize: 14,
                                }}
                              >
                                <FiTrash2 />
                              </button>
                            </>
                          )}
                          {brand.is_active && (
                            <span style={{ fontSize: 12, color: "#16a34a", fontWeight: 600, display: "flex", alignItems: "center", gap: 4 }}>
                              <FiCheck size={14} /> Live
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const FiChevronIcon = ({ open }) => (
  <span style={{
    transform: open ? "rotate(180deg)" : "rotate(0)",
    transition: "transform 0.2s",
    display: "flex",
    fontSize: 18,
    color: "#64748b",
  }}>
    ▾
  </span>
);

export default ManageBrand;
