import { useState, useEffect } from "react";
import Breadcrumb from "../common/Breadcrumb";
import "../../assets/style/ProductInfo.css";
import {
  FaInfoCircle, FaPlus, FaEdit, FaTrash, FaCheck, FaTimes,
  FaSpinner, FaSearch, FaGripVertical, FaTable, FaListUl, FaAlignLeft
} from "react-icons/fa";

const API = "http://localhost:5000";

const ProductInfoAdmin = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [infoItems, setInfoItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingInfo, setLoadingInfo] = useState(false);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [toast, setToast] = useState(null);
  const [form, setForm] = useState({ heading: "", content: "", info_type: "text", sort_order: 0 });

  // Table editor state
  const [tableRows, setTableRows] = useState([{ key: "", value: "" }]);

  useEffect(() => { fetchProducts(); }, []);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 2500); };

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API}/api/products`);
      const data = await res.json();
      if (data.success) setProducts(data.data);
    } catch (err) { console.log(err); }
    finally { setLoading(false); }
  };

  const fetchInfo = async (productId) => {
    setLoadingInfo(true);
    try {
      const res = await fetch(`${API}/api/product-info/product/${productId}`);
      const data = await res.json();
      if (data.success) setInfoItems(data.data);
    } catch (err) { console.log(err); }
    finally { setLoadingInfo(false); }
  };

  const selectProduct = (product) => {
    setSelectedProduct(product);
    setInfoItems([]);
    setShowForm(false);
    setEditId(null);
    fetchInfo(product.id);
  };

  const resetForm = () => {
    setForm({ heading: "", content: "", info_type: "text", sort_order: 0 });
    setTableRows([{ key: "", value: "" }]);
    setEditId(null);
    setShowForm(false);
  };

  const handleSave = async () => {
    if (!form.heading.trim()) {
      showToast("Heading is required");
      return;
    }

    let content = form.content;
    if (form.info_type === "table") {
      const validRows = tableRows.filter((r) => r.key.trim() || r.value.trim());
      content = JSON.stringify(validRows);
    }

    if (form.info_type === "list" && typeof content === "string") {
      // keep as comma-separated or newline-separated text
    }

    try {
      const url = editId ? `${API}/api/product-info/${editId}` : `${API}/api/product-info`;
      const method = editId ? "PUT" : "POST";
      const body = { ...form, content, product_id: selectedProduct.id };
      await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      resetForm();
      fetchInfo(selectedProduct.id);
      showToast(editId ? "Info updated" : "Info added");
    } catch (err) { console.log(err); }
  };

  const handleEdit = (item) => {
    setForm({
      heading: item.heading,
      content: item.content || "",
      info_type: item.info_type,
      sort_order: item.sort_order
    });
    if (item.info_type === "table") {
      try {
        setTableRows(JSON.parse(item.content || "[]"));
      } catch {
        setTableRows([{ key: "", value: "" }]);
      }
    } else {
      setTableRows([{ key: "", value: "" }]);
    }
    setEditId(item.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`${API}/api/product-info/${id}`, { method: "DELETE" });
      setDeleteConfirm(null);
      fetchInfo(selectedProduct.id);
      showToast("Info deleted");
    } catch (err) { console.log(err); }
  };

  const addTableRow = () => setTableRows([...tableRows, { key: "", value: "" }]);
  const updateTableRow = (index, field, val) => {
    const updated = [...tableRows];
    updated[index][field] = val;
    setTableRows(updated);
  };
  const removeTableRow = (index) => {
    if (tableRows.length <= 1) return;
    setTableRows(tableRows.filter((_, i) => i !== index));
  };

  const filtered = products.filter((p) =>
    p.product_name.toLowerCase().includes(search.toLowerCase()) ||
    (p.sku && p.sku.toLowerCase().includes(search.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="content">
        <div className="page-top">
          <h1 className="page-title">Product Additional Information</h1>
          <Breadcrumb />
        </div>
        <div className="pi-loading"><FaSpinner className="pi-spinner" /><p>Loading products...</p></div>
      </div>
    );
  }

  return (
    <div className="content">
      <div className="page-top">
        <h1 className="page-title">Product Additional Information</h1>
        <Breadcrumb />
      </div>

      {/* HERO */}
      <div className="pi-hero">
        <div className="pi-hero-overlay">
          <h2>Additional Information</h2>
          <p>Manage product specifications, features, and details</p>
        </div>
      </div>

      {/* STATS */}
      <div className="pi-stats-row">
        <div className="pi-stat-card pi-stat-blue">
          <div className="pi-stat-icon"><FaInfoCircle /></div>
          <div className="pi-stat-info">
            <span className="pi-stat-value">{products.length}</span>
            <span className="pi-stat-label">Total Products</span>
          </div>
        </div>
        <div className="pi-stat-card pi-stat-green">
          <div className="pi-stat-icon"><FaTable /></div>
          <div className="pi-stat-info">
            <span className="pi-stat-value">{selectedProduct ? infoItems.filter(i => i.info_type === "table").length : "—"}</span>
            <span className="pi-stat-label">Table Sections</span>
          </div>
        </div>
        <div className="pi-stat-card pi-stat-purple">
          <div className="pi-stat-icon"><FaAlignLeft /></div>
          <div className="pi-stat-info">
            <span className="pi-stat-value">{selectedProduct ? infoItems.filter(i => i.info_type === "text").length : "—"}</span>
            <span className="pi-stat-label">Text Sections</span>
          </div>
        </div>
        <div className="pi-stat-card pi-stat-orange">
          <div className="pi-stat-icon"><FaListUl /></div>
          <div className="pi-stat-info">
            <span className="pi-stat-value">{selectedProduct ? infoItems.filter(i => i.info_type === "list").length : "—"}</span>
            <span className="pi-stat-label">List Sections</span>
          </div>
        </div>
      </div>

      {/* TWO COLUMN LAYOUT */}
      <div className="pi-layout">
        {/* LEFT: Product Selector */}
        <div className="pi-products-panel">
          <h3>Select Product</h3>
          <div className="pi-search-wrap">
            <FaSearch className="pi-search-icon" />
            <input type="text" placeholder="Search products..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <div className="pi-product-list">
            {filtered.map((p) => (
              <div
                key={p.id}
                className={`pi-product-item ${selectedProduct?.id === p.id ? "active" : ""}`}
                onClick={() => selectProduct(p)}
              >
                <img
                  src={p.main_image ? `${API}/uploads/${p.main_image}` : "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=100&q=80"}
                  alt={p.product_name}
                  onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=100&q=80"; }}
                />
                <div className="pi-product-item-info">
                  <span className="pi-product-item-name">{p.product_name}</span>
                  <span className="pi-product-item-sku">SKU: {p.sku || "N/A"}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT: Info Editor */}
        <div className="pi-editor-panel">
          {!selectedProduct ? (
            <div className="pi-empty-state">
              <FaInfoCircle />
              <p>Select a product from the left to manage its additional information</p>
            </div>
          ) : (
            <>
              <div className="pi-editor-header">
                <h3>{selectedProduct.product_name}</h3>
                <button className="pi-add-btn" onClick={() => { resetForm(); setShowForm(!showForm); }}>
                  <FaPlus /> {showForm ? "Cancel" : "Add Info"}
                </button>
              </div>

              {/* ADD/EDIT FORM */}
              {showForm && (
                <div className="pi-form-card">
                  <h4>{editId ? "Edit Information" : "Add New Information"}</h4>
                  <div className="pi-form-grid">
                    <div className="pi-form-group full">
                      <label>Heading *</label>
                      <input
                        type="text"
                        placeholder="e.g. Specifications, Material, Dimensions..."
                        value={form.heading}
                        onChange={(e) => setForm({ ...form, heading: e.target.value })}
                      />
                    </div>
                    <div className="pi-form-group">
                      <label>Type</label>
                      <select value={form.info_type} onChange={(e) => {
                        setForm({ ...form, info_type: e.target.value });
                        if (e.target.value === "table") {
                          try { setTableRows(JSON.parse(form.content || "[]")); } catch { setTableRows([{ key: "", value: "" }]); }
                        }
                      }}>
                        <option value="text">Text</option>
                        <option value="table">Table (Key-Value)</option>
                        <option value="list">List</option>
                      </select>
                    </div>
                    <div className="pi-form-group">
                      <label>Sort Order</label>
                      <input
                        type="number"
                        min="0"
                        value={form.sort_order}
                        onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })}
                      />
                    </div>
                  </div>

                  {/* Content based on type */}
                  {form.info_type === "text" && (
                    <div className="pi-form-group full">
                      <label>Content</label>
                      <textarea
                        rows="5"
                        placeholder="Enter text content..."
                        value={form.content}
                        onChange={(e) => setForm({ ...form, content: e.target.value })}
                      />
                    </div>
                  )}

                  {form.info_type === "list" && (
                    <div className="pi-form-group full">
                      <label>Content (one item per line)</label>
                      <textarea
                        rows="5"
                        placeholder="Enter list items, one per line..."
                        value={form.content}
                        onChange={(e) => setForm({ ...form, content: e.target.value })}
                      />
                    </div>
                  )}

                  {form.info_type === "table" && (
                    <div className="pi-table-editor">
                      <label>Table Rows (Key / Value)</label>
                      {tableRows.map((row, idx) => (
                        <div className="pi-table-row" key={idx}>
                          <input
                            type="text"
                            placeholder="Key (e.g. Material)"
                            value={row.key}
                            onChange={(e) => updateTableRow(idx, "key", e.target.value)}
                          />
                          <input
                            type="text"
                            placeholder="Value (e.g. Solid Oak Wood)"
                            value={row.value}
                            onChange={(e) => updateTableRow(idx, "value", e.target.value)}
                          />
                          <button className="pi-row-remove" onClick={() => removeTableRow(idx)} disabled={tableRows.length <= 1}>
                            <FaTimes />
                          </button>
                        </div>
                      ))}
                      <button className="pi-row-add" onClick={addTableRow}><FaPlus /> Add Row</button>
                    </div>
                  )}

                  <div className="pi-form-actions">
                    <button className="pi-form-cancel" onClick={resetForm}><FaTimes /> Cancel</button>
                    <button className="pi-form-save" onClick={handleSave}><FaCheck /> {editId ? "Update" : "Create"}</button>
                  </div>
                </div>
              )}

              {/* INFO LIST */}
              {loadingInfo ? (
                <div className="pi-loading"><FaSpinner className="pi-spinner" /><p>Loading info...</p></div>
              ) : infoItems.length === 0 ? (
                <div className="pi-empty-info">
                  <FaInfoCircle />
                  <p>No additional information added yet. Click "Add Info" to get started.</p>
                </div>
              ) : (
                <div className="pi-info-list">
                  {infoItems.map((item) => (
                    <div className="pi-info-card" key={item.id}>
                      <div className="pi-info-card-header">
                        <span className="pi-info-type-badge">{item.info_type}</span>
                        <h4>{item.heading}</h4>
                        <div className="pi-info-actions">
                          <button className="pi-action-btn edit" onClick={() => handleEdit(item)}><FaEdit /></button>
                          <button className="pi-action-btn delete" onClick={() => setDeleteConfirm(item)}><FaTrash /></button>
                        </div>
                      </div>
                      <div className="pi-info-card-body">
                        {item.info_type === "text" && <p>{item.content}</p>}
                        {item.info_type === "list" && (
                          <ul>
                            {(item.content || "").split("\n").filter(Boolean).map((line, i) => (
                              <li key={i}>{line.trim()}</li>
                            ))}
                          </ul>
                        )}
                        {item.info_type === "table" && (() => {
                          try {
                            const rows = JSON.parse(item.content || "[]");
                            return (
                              <table className="pi-info-table">
                                <tbody>
                                  {rows.map((row, i) => (
                                    <tr key={i}>
                                      <td className="pi-table-key">{row.key}</td>
                                      <td className="pi-table-value">{row.value}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            );
                          } catch { return <p className="pi-table-error">Invalid table data</p>; }
                        })()}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* DELETE CONFIRM */}
      {deleteConfirm && (
        <div className="pi-modal" onClick={() => setDeleteConfirm(null)}>
          <div className="pi-modal-confirm" onClick={(e) => e.stopPropagation()}>
            <FaTrash className="pi-confirm-icon" />
            <h3>Delete Info?</h3>
            <p>"{deleteConfirm.heading}"</p>
            <div className="pi-confirm-actions">
              <button className="pi-confirm-cancel" onClick={() => setDeleteConfirm(null)}>Cancel</button>
              <button className="pi-confirm-delete" onClick={() => handleDelete(deleteConfirm.id)}>Delete</button>
            </div>
          </div>
        </div>
      )}

      {toast && <div className="pi-toast"><FaCheck /> {toast}</div>}
    </div>
  );
};

export default ProductInfoAdmin;
