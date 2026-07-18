import { useState, useEffect } from "react";
import Breadcrumb from "../common/Breadcrumb";
import "../../assets/style/FAQ.css";
import {
  FaQuestionCircle, FaPlus, FaEdit, FaTrash, FaCheck, FaTimes,
  FaSpinner, FaChevronDown, FaChevronUp, FaSearch, FaArrowUp,
  FaArrowDown, FaEye, FaEyeSlash
} from "react-icons/fa";

const API = "http://localhost:5000";

const CATEGORIES = ["general", "shipping", "returns", "payment", "account", "products"];

const FAQAdmin = () => {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [bulkDeleteConfirm, setBulkDeleteConfirm] = useState(false);
  const [toast, setToast] = useState(null);
  const [form, setForm] = useState({ question: "", answer: "", category: "general", sort_order: 0, status: "active" });

  useEffect(() => { fetchFaqs(); }, []);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 2500); };

  const fetchFaqs = async () => {
    try {
      const res = await fetch(`${API}/api/faqs`);
      const data = await res.json();
      if (data.success) setFaqs(data.data);
    } catch (err) { console.log(err); }
    finally { setLoading(false); }
  };

  const resetForm = () => {
    setForm({ question: "", answer: "", category: "general", sort_order: 0, status: "active" });
    setEditId(null);
    setShowForm(false);
  };

  const handleSave = async () => {
    if (!form.question.trim() || !form.answer.trim()) {
      showToast("Question and answer are required");
      return;
    }
    try {
      const url = editId ? `${API}/api/faqs/${editId}` : `${API}/api/faqs`;
      const method = editId ? "PUT" : "POST";
      await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      resetForm();
      fetchFaqs();
      showToast(editId ? "FAQ updated" : "FAQ created");
    } catch (err) { console.log(err); }
  };

  const handleEdit = (faq) => {
    setForm({ question: faq.question, answer: faq.answer, category: faq.category, sort_order: faq.sort_order, status: faq.status });
    setEditId(faq.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`${API}/api/faqs/${id}`, { method: "DELETE" });
      setDeleteConfirm(null);
      fetchFaqs();
      showToast("FAQ deleted");
    } catch (err) { console.log(err); }
  };

  const handleBulkDelete = async () => {
    try {
      await fetch(`${API}/api/faqs/bulk-delete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: selected }),
      });
      setBulkDeleteConfirm(false);
      setSelected([]);
      fetchFaqs();
      showToast(`${selected.length} FAQs deleted`);
    } catch (err) { console.log(err); }
  };

  const toggleStatus = async (faq) => {
    const newStatus = faq.status === "active" ? "inactive" : "active";
    try {
      await fetch(`${API}/api/faqs/${faq.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...faq, status: newStatus }),
      });
      fetchFaqs();
      showToast(`FAQ ${newStatus === "active" ? "activated" : "deactivated"}`);
    } catch (err) { console.log(err); }
  };

  const moveSort = async (faq, direction) => {
    const newOrder = faq.sort_order + direction;
    if (newOrder < 0) return;
    try {
      await fetch(`${API}/api/faqs/${faq.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...faq, sort_order: newOrder }),
      });
      fetchFaqs();
    } catch (err) { console.log(err); }
  };

  const toggleSelect = (id) => {
    setSelected((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  };

  const filtered = faqs.filter((f) =>
    f.question.toLowerCase().includes(search.toLowerCase()) ||
    f.answer.toLowerCase().includes(search.toLowerCase()) ||
    f.category.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="content">
        <div className="page-top">
          <h1 className="page-title">FAQ Management</h1>
          <Breadcrumb />
        </div>
        <div className="fq-loading"><FaSpinner className="fq-spinner" /><p>Loading FAQs...</p></div>
      </div>
    );
  }

  return (
    <div className="content">
      <div className="page-top">
        <h1 className="page-title">FAQ Management</h1>
        <Breadcrumb />
      </div>

      {/* HERO */}
      <div className="fq-hero">
        <div className="fq-hero-overlay">
          <h2>Frequently Asked Questions</h2>
          <p>Manage customer FAQ content</p>
        </div>
      </div>

      {/* STATS ROW */}
      <div className="fq-stats-row">
        <div className="fq-stat-card fq-stat-blue">
          <div className="fq-stat-icon"><FaQuestionCircle /></div>
          <div className="fq-stat-info">
            <span className="fq-stat-value">{faqs.length}</span>
            <span className="fq-stat-label">Total FAQs</span>
          </div>
        </div>
        <div className="fq-stat-card fq-stat-green">
          <div className="fq-stat-icon"><FaEye /></div>
          <div className="fq-stat-info">
            <span className="fq-stat-value">{faqs.filter((f) => f.status === "active").length}</span>
            <span className="fq-stat-label">Active</span>
          </div>
        </div>
        <div className="fq-stat-card fq-stat-red">
          <div className="fq-stat-icon"><FaEyeSlash /></div>
          <div className="fq-stat-info">
            <span className="fq-stat-value">{faqs.filter((f) => f.status === "inactive").length}</span>
            <span className="fq-stat-label">Inactive</span>
          </div>
        </div>
        <div className="fq-stat-card fq-stat-purple">
          <div className="fq-stat-icon"><FaPlus /></div>
          <div className="fq-stat-info">
            <span className="fq-stat-value">{new Set(faqs.map((f) => f.category)).size}</span>
            <span className="fq-stat-label">Categories</span>
          </div>
        </div>
      </div>

      {/* TOOLBAR */}
      <div className="fq-toolbar">
        <div className="fq-search-wrap">
          <FaSearch className="fq-search-icon" />
          <input type="text" placeholder="Search FAQs..." value={search} onChange={(e) => setSearch(e.target.value)} />
          {search && <button className="fq-search-clear" onClick={() => setSearch("")}><FaTimes /></button>}
        </div>
        <div className="fq-toolbar-actions">
          {selected.length > 0 && (
            <button className="fq-bulk-delete" onClick={() => setBulkDeleteConfirm(true)}>
              <FaTrash /> Delete ({selected.length})
            </button>
          )}
          <button className="fq-add-btn" onClick={() => { resetForm(); setShowForm(!showForm); }}>
            <FaPlus /> {showForm ? "Cancel" : "Add FAQ"}
          </button>
        </div>
      </div>

      {/* ADD/EDIT FORM */}
      {showForm && (
        <div className="fq-form-card">
          <h3>{editId ? "Edit FAQ" : "Add New FAQ"}</h3>
          <div className="fq-form-grid">
            <div className="fq-form-group full">
              <label>Question</label>
              <input type="text" placeholder="Enter question" value={form.question} onChange={(e) => setForm({ ...form, question: e.target.value })} />
            </div>
            <div className="fq-form-group full">
              <label>Answer</label>
              <textarea rows="4" placeholder="Enter answer" value={form.answer} onChange={(e) => setForm({ ...form, answer: e.target.value })} />
            </div>
            <div className="fq-form-group">
              <label>Category</label>
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
              </select>
            </div>
            <div className="fq-form-group">
              <label>Sort Order</label>
              <input type="number" min="0" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })} />
            </div>
            <div className="fq-form-group">
              <label>Status</label>
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
          <div className="fq-form-actions">
            <button className="fq-form-cancel" onClick={resetForm}><FaTimes /> Cancel</button>
            <button className="fq-form-save" onClick={handleSave}><FaCheck /> {editId ? "Update" : "Create"}</button>
          </div>
        </div>
      )}

      {/* FAQ LIST */}
      {filtered.length === 0 ? (
        <div className="fq-empty">
          <FaQuestionCircle />
          <p>No FAQs found</p>
        </div>
      ) : (
        <div className="fq-list">
          {filtered.map((faq) => (
            <div className={`fq-card ${faq.status === "inactive" ? "inactive" : ""}`} key={faq.id}>
              <div className="fq-card-header">
                <span className="fq-card-check">
                  <input type="checkbox" checked={selected.includes(faq.id)} onChange={() => toggleSelect(faq.id)} />
                </span>
                <div className="fq-card-question" onClick={() => setExpandedId(expandedId === faq.id ? null : faq.id)}>
                  <div className="fq-card-q-text">
                    <span className="fq-card-q">{faq.question}</span>
                    <div className="fq-card-meta">
                      <span className={`fq-category-badge cat-${faq.category}`}>{faq.category}</span>
                      <span className={`fq-status-dot ${faq.status}`}></span>
                      <span className="fq-card-date">Order: {faq.sort_order}</span>
                    </div>
                  </div>
                  <span className="fq-expand-icon">{expandedId === faq.id ? <FaChevronUp /> : <FaChevronDown />}</span>
                </div>
                <div className="fq-card-actions">
                  <button className="fq-action-btn sort-up" onClick={() => moveSort(faq, -1)} title="Move up"><FaArrowUp /></button>
                  <button className="fq-action-btn sort-down" onClick={() => moveSort(faq, 1)} title="Move down"><FaArrowDown /></button>
                  <button className={`fq-action-btn toggle ${faq.status}`} onClick={() => toggleStatus(faq)} title={faq.status === "active" ? "Deactivate" : "Activate"}>
                    {faq.status === "active" ? <FaEye /> : <FaEyeSlash />}
                  </button>
                  <button className="fq-action-btn edit" onClick={() => handleEdit(faq)}><FaEdit /></button>
                  <button className="fq-action-btn delete" onClick={() => setDeleteConfirm(faq)}><FaTrash /></button>
                </div>
              </div>
              {expandedId === faq.id && (
                <div className="fq-card-answer">
                  <p>{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* DELETE CONFIRM */}
      {deleteConfirm && (
        <div className="fq-modal" onClick={() => setDeleteConfirm(null)}>
          <div className="fq-modal-confirm" onClick={(e) => e.stopPropagation()}>
            <FaTrash className="fq-confirm-icon" />
            <h3>Delete FAQ?</h3>
            <p>"{deleteConfirm.question}"</p>
            <div className="fq-confirm-actions">
              <button className="fq-confirm-cancel" onClick={() => setDeleteConfirm(null)}>Cancel</button>
              <button className="fq-confirm-delete" onClick={() => handleDelete(deleteConfirm.id)}>Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* BULK DELETE */}
      {bulkDeleteConfirm && (
        <div className="fq-modal" onClick={() => setBulkDeleteConfirm(false)}>
          <div className="fq-modal-confirm" onClick={(e) => e.stopPropagation()}>
            <FaTrash className="fq-confirm-icon" />
            <h3>Delete {selected.length} FAQs?</h3>
            <p>This action cannot be undone.</p>
            <div className="fq-confirm-actions">
              <button className="fq-confirm-cancel" onClick={() => setBulkDeleteConfirm(false)}>Cancel</button>
              <button className="fq-confirm-delete" onClick={handleBulkDelete}>Delete All</button>
            </div>
          </div>
        </div>
      )}

      {toast && <div className="fq-toast"><FaCheck /> {toast}</div>}
    </div>
  );
};

export default FAQAdmin;
