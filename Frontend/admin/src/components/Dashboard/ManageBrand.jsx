import { useState, useEffect, useRef } from "react";
import Breadcrumb from "../common/Breadcrumb";
import {
  FiImage, FiSave, FiX, FiCheck, FiTrash2, FiPlus,
  FiPower, FiClock, FiEdit2
} from "react-icons/fi";
import "../../assets/style/ManageBrand.css";

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

  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editLogoFile, setEditLogoFile] = useState(null);
  const [editLogoPreview, setEditLogoPreview] = useState(null);
  const [editSaving, setEditSaving] = useState(false);
  const editFileRef = useRef(null);

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

  const startEdit = (brand) => {
    setEditId(brand.id);
    setEditName(brand.brand_name);
    setEditLogoFile(null);
    setEditLogoPreview(null);
  };

  const cancelEdit = () => {
    setEditId(null);
    setEditName("");
    setEditLogoFile(null);
    setEditLogoPreview(null);
  };

  const handleEditLogoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setEditLogoFile(file);
    setEditLogoPreview(URL.createObjectURL(file));
  };

  const handleUpdateBrand = async () => {
    if (!editName.trim()) return showToast("error", "Brand name is required");
    setEditSaving(true);
    try {
      const fd = new FormData();
      fd.append("brand_name", editName.trim());
      if (editLogoFile) fd.append("logo", editLogoFile);
      const res = await fetch(`${API}/api/site-brand/${editId}`, { method: "PUT", body: fd });
      const json = await res.json();
      if (json.success) {
        setBrands(json.data);
        cancelEdit();
        showToast("success", "Brand updated!");
        window.dispatchEvent(new Event("brand-updated"));
      } else {
        showToast("error", json.message || "Failed");
      }
    } catch (err) {
      showToast("error", "Failed");
    } finally {
      setEditSaving(false);
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

  const getImageUrl = (imgPath) => {
    if (!imgPath) return null;
    return `${API}${imgPath.replace(/\\/g, "/")}`;
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

      <div className="mb-wrap">

        {/* Active Brand Card */}
        <div className="mb-card">
          <div className="mb-card-header">
            <h3><FiPower /> Active Brand</h3>
            <span className="mb-badge mb-badge-live">Live</span>
          </div>
          {activeBrand ? (
            <div className="mb-card-body">
              <div className="mb-active-brand">
                <div className="mb-active-logo">
                  {activeBrand.logo_path ? (
                    <img src={getImageUrl(activeBrand.logo_path)} alt="Logo" />
                  ) : (
                    <div className="mb-active-fallback">
                      {activeBrand.brand_name.charAt(0)}
                    </div>
                  )}
                </div>
                <div className="mb-active-info">
                  <h2 className="mb-active-name">{activeBrand.brand_name}</h2>
                  <p className="mb-active-date">
                    Created {new Date(activeBrand.created_at).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="mb-empty">No active brand</div>
          )}
        </div>

        {/* Add New Brand */}
        <div className="mb-card">
          <div className="mb-add-toggle" onClick={() => setShowAdd(!showAdd)}>
            <h3><FiPlus /> Add New Brand</h3>
            <span className={`mb-chevron ${showAdd ? "mb-chevron-open" : ""}`}>▾</span>
          </div>

          {showAdd && (
            <div className="mb-add-form">
              <div className="mb-add-grid">
                <div>
                  <label className="mb-label">Logo</label>
                  <div className="mb-logo-upload" onClick={() => fileRef.current?.click()}>
                    {logoPreview ? (
                      <img src={logoPreview} alt="Preview" />
                    ) : (
                      <>
                        <FiImage size={28} color="#94a3b8" />
                        <span className="mb-logo-upload-text">Upload</span>
                      </>
                    )}
                  </div>
                  <input ref={fileRef} type="file" accept="image/*" className="mb-hidden-input" onChange={handleLogoChange} />
                </div>

                <div className="mb-form-col">
                  <label className="mb-label">Brand Name</label>
                  <input
                    type="text"
                    className="mb-input"
                    value={brandName}
                    onChange={(e) => setBrandName(e.target.value)}
                    placeholder="Enter brand name"
                  />
                  <div className="mb-actions">
                    <button
                      className="mb-btn mb-btn-cancel"
                      onClick={() => { setShowAdd(false); setBrandName(""); setLogoFile(null); setLogoPreview(null); }}
                    >
                      <FiX /> Cancel
                    </button>
                    <button
                      className="mb-btn mb-btn-save"
                      onClick={handleAddBrand}
                      disabled={saving}
                    >
                      <FiSave /> {saving ? "Adding..." : "Add Brand"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Brand History */}
        <div className="mb-card">
          <div className="mb-card-header">
            <h3><FiClock /> Brand History</h3>
            <span className="mb-badge-count">{brands.length} total</span>
          </div>

          {brands.length === 0 ? (
            <div className="mb-empty">No brands yet</div>
          ) : (
            <div className="mb-table-wrap">
              <table className="mb-table">
                <thead>
                  <tr>
                    <th>Logo</th>
                    <th>Brand Name</th>
                    <th>Status</th>
                    <th>Created</th>
                    <th className="mb-th-actions">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {brands.map((brand) => (
                    <tr key={brand.id}>
                      <td>
                        {editId === brand.id ? (
                          <div>
                            <div className="mb-logo-cell mb-logo-cell-edit" onClick={() => editFileRef.current?.click()}>
                              {editLogoPreview ? (
                                <img src={editLogoPreview} alt="Preview" />
                              ) : brand.logo_path ? (
                                <img src={getImageUrl(brand.logo_path)} alt="Logo" />
                              ) : (
                                <span className="mb-logo-initial">{brand.brand_name.charAt(0)}</span>
                              )}
                            </div>
                            <input ref={editFileRef} type="file" accept="image/*" className="mb-hidden-input" onChange={handleEditLogoChange} />
                          </div>
                        ) : (
                          <div className="mb-logo-cell">
                            {brand.logo_path ? (
                              <img src={getImageUrl(brand.logo_path)} alt="Logo" />
                            ) : (
                              <span className="mb-logo-initial">{brand.brand_name.charAt(0)}</span>
                            )}
                          </div>
                        )}
                      </td>
                      <td>
                        {editId === brand.id ? (
                          <input
                            type="text"
                            className="mb-input mb-input-edit"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            placeholder="Brand name"
                            autoFocus
                          />
                        ) : (
                          <span className="mb-brand-name">{brand.brand_name}</span>
                        )}
                      </td>
                      <td>
                        <span className={`mb-badge ${brand.is_active ? "mb-badge-active" : "mb-badge-inactive"}`}>
                          {brand.is_active ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td>
                        <span className="mb-date">
                          {new Date(brand.created_at).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                        </span>
                      </td>
                      <td>
                        <div className="mb-action-btns">
                          {editId === brand.id ? (
                            <>
                              <button className="mb-icon-btn mb-icon-btn-save" onClick={handleUpdateBrand} disabled={editSaving} title="Save">
                                <FiSave />
                              </button>
                              <button className="mb-icon-btn mb-icon-btn-delete" onClick={cancelEdit} title="Cancel">
                                <FiX />
                              </button>
                            </>
                          ) : (
                            <>
                              <button className="mb-icon-btn mb-icon-btn-edit" onClick={() => startEdit(brand)} title="Edit">
                                <FiEdit2 />
                              </button>
                              {!brand.is_active && (
                                <>
                                  <button className="mb-icon-btn mb-icon-btn-activate" onClick={() => handleActivate(brand.id)} title="Activate">
                                    <FiPower />
                                  </button>
                                  <button className="mb-icon-btn mb-icon-btn-delete" onClick={() => handleDelete(brand.id)} title="Delete">
                                    <FiTrash2 />
                                  </button>
                                </>
                              )}
                              {brand.is_active && (
                                <span className="mb-live-text"><FiCheck size={14} /> Live</span>
                              )}
                            </>
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

export default ManageBrand;
