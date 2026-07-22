import { useState, useEffect, useRef } from "react";
import Breadcrumb from "../common/Breadcrumb";
import {
  FiPlus, FiEdit2, FiTrash2, FiImage, FiX, FiCheck, FiSearch,
  FiToggleLeft, FiToggleRight, FiArrowUp, FiArrowDown, FiExternalLink,
  FiEye, FiChevronLeft, FiGrid, FiList, FiStar
} from "react-icons/fi";
import "../../assets/style/ShopAdmin.css";

const API = "http://localhost:5000";

const emptyForm = { name: "", website: "", description: "", status: "active", sort_order: 0 };

const Vendors = () => {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("cards");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [detailVendor, setDetailVendor] = useState(null);
  const [toast, setToast] = useState("");
  const [saving, setSaving] = useState(false);
  const fileRef = useRef(null);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 3000); };

  const fetchVendors = async () => {
    try {
      const res = await fetch(`${API}/api/vendors`);
      if (res.ok) {
        const json = await res.json();
        setVendors(json?.data || (Array.isArray(json) ? json : []));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchVendors(); }, []);

  const openAdd = () => {
    setForm(emptyForm);
    setEditingId(null);
    setLogoFile(null);
    setLogoPreview(null);
    setShowForm(true);
    setDetailVendor(null);
  };

  const openEdit = (vendor) => {
    setForm({ name: vendor.name || "", website: vendor.website || "", description: vendor.description || "", status: vendor.status || "active", sort_order: vendor.sort_order || 0 });
    setEditingId(vendor.id);
    setLogoFile(null);
    setLogoPreview(vendor.logo ? `${API}${vendor.logo.replace(/\\/g, "/")}` : null);
    setShowForm(true);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLogoFile(file);
    setLogoPreview(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    if (!form.name.trim()) return showToast("Vendor name is required");
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("name", form.name);
      fd.append("website", form.website);
      fd.append("description", form.description);
      fd.append("status", form.status);
      fd.append("sort_order", form.sort_order);
      if (logoFile) fd.append("logo", logoFile);

      const url = editingId ? `${API}/api/vendors/${editingId}` : `${API}/api/vendors`;
      const res = await fetch(url, { method: editingId ? "PUT" : "POST", body: fd });
      const json = await res.json();

      if (json.success) {
        showToast(editingId ? "Vendor updated!" : "Vendor created!");
        setShowForm(false);
        fetchVendors();
      } else {
        showToast(json.message || "Failed");
      }
    } catch (err) {
      showToast("Error saving vendor");
    } finally {
      setSaving(false);
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      const res = await fetch(`${API}/api/vendors/${id}/status`, { method: "PUT" });
      if (res.ok) fetchVendors();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${API}/api/vendors/${id}`, { method: "DELETE" });
      if (res.ok) {
        showToast("Vendor deleted");
        setDeleteConfirm(null);
        if (detailVendor?.id === id) setDetailVendor(null);
        fetchVendors();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSortUp = async (vendor) => {
    if (vendor.sort_order <= 0) return;
    try {
      await fetch(`${API}/api/vendors/${vendor.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sort_order: vendor.sort_order - 1 }),
      });
      fetchVendors();
    } catch (err) { console.error(err); }
  };

  const handleSortDown = async (vendor) => {
    try {
      await fetch(`${API}/api/vendors/${vendor.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sort_order: vendor.sort_order + 1 }),
      });
      fetchVendors();
    } catch (err) { console.error(err); }
  };

  const filtered = vendors.filter((v) =>
    v.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activeCount = vendors.filter((v) => v.status === "active").length;
  const inactiveCount = vendors.filter((v) => v.status === "inactive").length;

  if (detailVendor) {
    return (
      <div className="shop-admin-wrap">
        {toast && <div className="ui-toast">{toast}</div>}

        <div className="settings-page-top">
          <h1 className="settings-page-title">Vendors</h1>
          <Breadcrumb />
        </div>

        <div className="vd-detail-back" onClick={() => setDetailVendor(null)}>
          <FiChevronLeft /> Back to Vendors
        </div>

        <div className="vd-detail-card">
          <div className="vd-detail-header">
            <div className="vd-detail-logo-wrap">
              {detailVendor.logo ? (
                <img src={`${API}${detailVendor.logo.replace(/\\/g, "/")}`} alt={detailVendor.name} />
              ) : (
                <div className="vd-detail-logo-placeholder"><FiImage /></div>
              )}
            </div>
            <div className="vd-detail-info">
              <div className="vd-detail-name-row">
                <h2>{detailVendor.name}</h2>
                <span className={`pd-row-status ${detailVendor.status === "active" ? "active" : "inactive"}`}>
                  {detailVendor.status === "active" ? "Active" : "Inactive"}
                </span>
              </div>
              {detailVendor.website && (
                <a href={detailVendor.website} target="_blank" rel="noreferrer" className="vd-detail-website">
                  <FiExternalLink /> {detailVendor.website}
                </a>
              )}
              <p className="vd-detail-desc">{detailVendor.description || "No description provided."}</p>
              <div className="vd-detail-meta">
                <div className="vd-detail-meta-item">
                  <span className="vd-detail-meta-label">Sort Order</span>
                  <span className="vd-detail-meta-value">{detailVendor.sort_order}</span>
                </div>
                <div className="vd-detail-meta-item">
                  <span className="vd-detail-meta-label">Vendor ID</span>
                  <span className="vd-detail-meta-value">#{detailVendor.id}</span>
                </div>
                {detailVendor.created_at && (
                  <div className="vd-detail-meta-item">
                    <span className="vd-detail-meta-label">Created</span>
                    <span className="vd-detail-meta-value">{new Date(detailVendor.created_at).toLocaleDateString()}</span>
                  </div>
                )}
                {detailVendor.updated_at && (
                  <div className="vd-detail-meta-item">
                    <span className="vd-detail-meta-label">Updated</span>
                    <span className="vd-detail-meta-value">{new Date(detailVendor.updated_at).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
              <div className="vd-detail-actions">
                <button className="vendor-add-btn" onClick={() => openEdit(detailVendor)}><FiEdit2 /> Edit</button>
                <button className="vendor-add-btn vd-detail-toggle-btn" onClick={() => { handleToggleStatus(detailVendor.id); setDetailVendor({ ...detailVendor, status: detailVendor.status === "active" ? "inactive" : "active" }); }}>
                  {detailVendor.status === "active" ? <><FiToggleLeft /> Deactivate</> : <><FiToggleRight /> Activate</>}
                </button>
                <button className="vendor-add-btn vd-detail-delete-btn" onClick={() => setDeleteConfirm(detailVendor.id)}><FiTrash2 /> Delete</button>
              </div>
            </div>
          </div>
        </div>

        {deleteConfirm && (
          <div className="ui-edit-overlay" onClick={() => setDeleteConfirm(null)}>
            <div className="ui-edit-panel" onClick={(e) => e.stopPropagation()} style={{ width: 400, textAlign: "center" }}>
              <h3>Delete Vendor?</h3>
              <p style={{ color: "#64748b", marginBottom: 20 }}>This action cannot be undone.</p>
              <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
                <button className="ui-cancel-btn" onClick={() => setDeleteConfirm(null)}>Cancel</button>
                <button className="ui-save-btn" style={{ background: "#ef4444" }} onClick={() => handleDelete(deleteConfirm)}>Delete</button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="shop-admin-wrap">
      {toast && <div className="ui-toast">{toast}</div>}

      <div className="settings-page-top">
        <h1 className="settings-page-title">Vendors</h1>
        <Breadcrumb />
      </div>

      <div className="vd-stats-row">
        <div className="vd-stat-card">
          <span className="vd-stat-num">{vendors.length}</span>
          <span className="vd-stat-label">Total Vendors</span>
        </div>
        <div className="vd-stat-card active">
          <span className="vd-stat-num">{activeCount}</span>
          <span className="vd-stat-label">Active</span>
        </div>
        <div className="vd-stat-card inactive">
          <span className="vd-stat-num">{inactiveCount}</span>
          <span className="vd-stat-label">Inactive</span>
        </div>
      </div>

      <div className="vendor-toolbar">
        <div className="ca-search">
          <FiSearch />
          <input type="text" placeholder="Search vendors..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
        <div className="vd-toolbar-right">
          <div className="vd-view-toggle">
            <button className={`vd-view-btn ${viewMode === "cards" ? "active" : ""}`} onClick={() => setViewMode("cards")}><FiGrid /></button>
            <button className={`vd-view-btn ${viewMode === "list" ? "active" : ""}`} onClick={() => setViewMode("list")}><FiList /></button>
          </div>
          <button className="vendor-add-btn" onClick={openAdd}><FiPlus /> Add Vendor</button>
        </div>
      </div>

      {showForm && (
        <div className="vendor-form-card">
          <div className="vendor-form-header">
            <h3>{editingId ? "Edit Vendor" : "Add Vendor"}</h3>
            <button className="ui-side-close" onClick={() => setShowForm(false)}><FiX /></button>
          </div>
          <div className="vendor-form-body">
            <div className="vendor-form-grid">
              <div className="vendor-form-field">
                <label>Vendor Name *</label>
                <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Enter vendor name" />
              </div>
              <div className="vendor-form-field">
                <label>Website</label>
                <input type="text" value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} placeholder="https://example.com" />
              </div>
              <div className="vendor-form-field vendor-form-full">
                <label>Description</label>
                <textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Brief description about the vendor" />
              </div>
              <div className="vendor-form-field">
                <label>Status</label>
                <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <div className="vendor-form-field">
                <label>Sort Order</label>
                <input type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })} min={0} />
              </div>
              <div className="vendor-form-field vendor-form-full">
                <label>Logo</label>
                <div className="vendor-logo-upload" onClick={() => fileRef.current?.click()}>
                  {logoPreview ? (
                    <img src={logoPreview} alt="Preview" className="vendor-logo-preview" />
                  ) : (
                    <div className="vendor-logo-placeholder"><FiImage /> <span>Click to upload logo</span></div>
                  )}
                  <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleFileChange} />
                </div>
              </div>
            </div>
            <div className="vendor-form-actions">
              <button className="ui-cancel-btn" onClick={() => setShowForm(false)}>Cancel</button>
              <button className="ui-save-btn" onClick={handleSave} disabled={saving}>{saving ? "Saving..." : <><FiCheck /> {editingId ? "Update" : "Create"}</>}</button>
            </div>
          </div>
        </div>
      )}

      {deleteConfirm && (
        <div className="ui-edit-overlay" onClick={() => setDeleteConfirm(null)}>
          <div className="ui-edit-panel" onClick={(e) => e.stopPropagation()} style={{ width: 400, textAlign: "center" }}>
            <h3>Delete Vendor?</h3>
            <p style={{ color: "#64748b", marginBottom: 20 }}>This action cannot be undone.</p>
            <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
              <button className="ui-cancel-btn" onClick={() => setDeleteConfirm(null)}>Cancel</button>
              <button className="ui-save-btn" style={{ background: "#ef4444" }} onClick={() => handleDelete(deleteConfirm)}>Delete</button>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="shop-loading">Loading vendors...</div>
      ) : filtered.length === 0 ? (
        <div className="vd-empty">
          <FiImage />
          <p>No vendors found</p>
          <button className="vendor-add-btn" onClick={openAdd}><FiPlus /> Add your first vendor</button>
        </div>
      ) : viewMode === "cards" ? (
        <div className="vd-cards-grid">
          {filtered.map((vendor) => (
            <div className="vd-card" key={vendor.id} onClick={() => setDetailVendor(vendor)}>
              <div className="vd-card-logo">
                {vendor.logo ? (
                  <img src={`${API}${vendor.logo.replace(/\\/g, "/")}`} alt={vendor.name} />
                ) : (
                  <div className="vd-card-logo-placeholder"><FiImage /></div>
                )}
                <span className={`pd-row-status ${vendor.status === "active" ? "active" : "inactive"}`}>
                  {vendor.status === "active" ? "Active" : "Inactive"}
                </span>
              </div>
              <div className="vd-card-body">
                <h4 className="vd-card-name">{vendor.name}</h4>
                {vendor.website && (
                  <p className="vd-card-website"><FiExternalLink /> {vendor.website.replace(/^https?:\/\//, "").replace(/\/$/, "")}</p>
                )}
                <p className="vd-card-desc">{vendor.description || "No description"}</p>
              </div>
              <div className="vd-card-footer" onClick={(e) => e.stopPropagation()}>
                <div className="vd-card-order">
                  <button className="vendor-sort-btn" onClick={() => handleSortUp(vendor)}><FiArrowUp /></button>
                  <span>{vendor.sort_order}</span>
                  <button className="vendor-sort-btn" onClick={() => handleSortDown(vendor)}><FiArrowDown /></button>
                </div>
                <div className="vendor-actions">
                  <button className="vendor-action-btn toggle" onClick={() => handleToggleStatus(vendor.id)} title="Toggle Status">
                    {vendor.status === "active" ? <FiToggleRight style={{ color: "#22c55e" }} /> : <FiToggleLeft style={{ color: "#94a3b8" }} />}
                  </button>
                  <button className="vendor-action-btn edit" onClick={() => openEdit(vendor)} title="Edit"><FiEdit2 /></button>
                  <button className="vendor-action-btn delete" onClick={() => setDeleteConfirm(vendor.id)} title="Delete"><FiTrash2 /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="vendor-table-wrap">
          <table className="vendor-table">
            <thead>
              <tr>
                <th style={{ width: 50 }}>#</th>
                <th style={{ width: 70 }}>Logo</th>
                <th>Name</th>
                <th>Website</th>
                <th>Description</th>
                <th style={{ width: 90 }}>Status</th>
                <th style={{ width: 70 }}>Order</th>
                <th style={{ width: 140 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((vendor, idx) => (
                <tr key={vendor.id}>
                  <td>{idx + 1}</td>
                  <td>
                    {vendor.logo ? (
                      <img src={`${API}${vendor.logo.replace(/\\/g, "/")}`} alt={vendor.name} className="vendor-tbl-logo" />
                    ) : (
                      <div className="vendor-tbl-logo-placeholder"><FiImage /></div>
                    )}
                  </td>
                  <td><strong style={{ cursor: "pointer" }} onClick={() => setDetailVendor(vendor)}>{vendor.name}</strong></td>
                  <td>
                    {vendor.website ? (
                      <a href={vendor.website} target="_blank" rel="noreferrer" className="vendor-link">{vendor.website}</a>
                    ) : <span style={{ color: "#94a3b8" }}>—</span>}
                  </td>
                  <td className="vendor-desc-cell">{vendor.description || <span style={{ color: "#94a3b8" }}>—</span>}</td>
                  <td>
                    <span className={`pd-row-status ${vendor.status === "active" ? "active" : "inactive"}`}>
                      {vendor.status === "active" ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td>
                    <div className="vendor-order-btns">
                      <button className="vendor-sort-btn" onClick={() => handleSortUp(vendor)}><FiArrowUp /></button>
                      <span>{vendor.sort_order}</span>
                      <button className="vendor-sort-btn" onClick={() => handleSortDown(vendor)}><FiArrowDown /></button>
                    </div>
                  </td>
                  <td>
                    <div className="vendor-actions">
                      <button className="vendor-action-btn toggle" onClick={() => handleToggleStatus(vendor.id)} title="Toggle Status">
                        {vendor.status === "active" ? <FiToggleRight style={{ color: "#22c55e" }} /> : <FiToggleLeft style={{ color: "#94a3b8" }} />}
                      </button>
                      <button className="vendor-action-btn edit" onClick={() => openEdit(vendor)} title="Edit"><FiEdit2 /></button>
                      <button className="vendor-action-btn delete" onClick={() => setDeleteConfirm(vendor.id)} title="Delete"><FiTrash2 /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Vendors;
