import { useState, useEffect } from "react";
import Breadcrumb from "../common/Breadcrumb";
import "../../assets/style/Contact.css";
import {
  FaEnvelope, FaPhone, FaCalendarAlt, FaSearch, FaTrash,
  FaEye, FaReply, FaCheck, FaTimes, FaSpinner, FaEnvelopeOpen,
  FaArchive, FaChevronDown, FaArrowLeft, FaExclamationCircle
} from "react-icons/fa";

const API = "http://localhost:5000";

const STATUS_MAP = {
  unread: { label: "Unread", color: "#ef4444", icon: <FaExclamationCircle /> },
  read: { label: "Read", color: "#3b82f6", icon: <FaEnvelopeOpen /> },
  replied: { label: "Replied", color: "#22c55e", icon: <FaReply /> },
  archived: { label: "Archived", color: "#94a3b8", icon: <FaArchive /> },
};

const formatDate = (d) => new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" });

const ContactAdmin = () => {
  const [contacts, setContacts] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState([]);
  const [viewContact, setViewContact] = useState(null);
  const [viewLoading, setViewLoading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [bulkDeleteConfirm, setBulkDeleteConfirm] = useState(false);
  const [toast, setToast] = useState(null);
  const [statusDropdown, setStatusDropdown] = useState(null);

  useEffect(() => { fetchContacts(); fetchStats(); }, []);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 2500); };

  const fetchContacts = async () => {
    try {
      const res = await fetch(`${API}/api/contact`);
      const data = await res.json();
      if (data.success) setContacts(data.data);
    } catch (err) { console.log(err); }
    finally { setLoading(false); }
  };

  const fetchStats = async () => {
    try {
      const res = await fetch(`${API}/api/contact/stats`);
      const data = await res.json();
      if (data.success) setStats(data.data);
    } catch (err) { console.log(err); }
  };

  const fetchContactById = async (id) => {
    setViewLoading(true);
    try {
      const res = await fetch(`${API}/api/contact/${id}`);
      const data = await res.json();
      if (data.success) setViewContact(data.data);
    } catch (err) { console.log(err); }
    finally { setViewLoading(false); }
  };

  const updateStatus = async (id, status) => {
    try {
      await fetch(`${API}/api/contact/${id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      setStatusDropdown(null);
      fetchContacts();
      fetchStats();
      if (viewContact && viewContact.id === id) {
        setViewContact((prev) => ({ ...prev, status }));
      }
      showToast(`Marked as ${status}`);
    } catch (err) { console.log(err); }
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`${API}/api/contact/${id}`, { method: "DELETE" });
      setDeleteConfirm(null);
      setViewContact(null);
      fetchContacts();
      fetchStats();
      showToast("Contact deleted");
    } catch (err) { console.log(err); }
  };

  const handleBulkDelete = async () => {
    try {
      await fetch(`${API}/api/contact/bulk-delete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: selected }),
      });
      setBulkDeleteConfirm(false);
      setSelected([]);
      fetchContacts();
      fetchStats();
      showToast(`${selected.length} contacts deleted`);
    } catch (err) { console.log(err); }
  };

  const toggleSelect = (id) => {
    setSelected((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  };

  const selectAll = () => {
    const filtered = getFiltered();
    if (selected.length === filtered.length) setSelected([]);
    else setSelected(filtered.map((c) => c.id));
  };

  const openContact = (contact) => {
    fetchContactById(contact.id);
    if (contact.status === "unread") updateStatus(contact.id, "read");
  };

  const goBack = () => {
    setViewContact(null);
    fetchContacts();
    fetchStats();
  };

  const getFiltered = () => {
    return contacts.filter((c) => {
      const matchSearch =
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.email.toLowerCase().includes(search.toLowerCase()) ||
        c.message.toLowerCase().includes(search.toLowerCase());
      const matchFilter = filter === "all" || c.status === filter;
      return matchSearch && matchFilter;
    });
  };

  const filtered = getFiltered();

  /* DETAIL VIEW */
  if (viewLoading) {
    return (
      <div className="content">
        <div className="page-top">
          <h1 className="page-title">Contact Messages</h1>
          <Breadcrumb />
        </div>
        <div className="ct-loading"><FaSpinner className="ct-spinner" /><p>Loading contact...</p></div>
      </div>
    );
  }

  if (viewContact) {
    return (
      <div className="content">
        <div className="page-top">
          <h1 className="page-title">Contact Messages</h1>
          <Breadcrumb />
        </div>

        <button className="ct-back-btn" onClick={goBack}>
          <FaArrowLeft /> Back to Messages
        </button>

        <div className="ct-detail">
          <div className="ct-detail-header">
            <div className="ct-detail-avatar">{viewContact.name.charAt(0).toUpperCase()}</div>
            <div className="ct-detail-user">
              <h2>{viewContact.name}</h2>
              <span className="ct-detail-email">{viewContact.email}</span>
            </div>
            <span className={`ct-status-badge ct-status-${viewContact.status}`}>
              {STATUS_MAP[viewContact.status]?.icon} {STATUS_MAP[viewContact.status]?.label}
            </span>
          </div>

          <div className="ct-detail-meta">
            <div className="ct-detail-date">
              <FaCalendarAlt /> {formatDate(viewContact.created_at)}
            </div>
          </div>

          <div className="ct-detail-message">
            <h4>Message</h4>
            <p>{viewContact.message}</p>
          </div>

          <div className="ct-detail-actions">
            <h4>Change Status</h4>
            <div className="ct-detail-status-row">
              {Object.entries(STATUS_MAP).map(([key, val]) => (
                <button key={key} className={`ct-detail-status-btn ${viewContact.status === key ? "active" : ""}`} onClick={() => updateStatus(viewContact.id, key)}>
                  {val.icon} {val.label}
                </button>
              ))}
            </div>
          </div>

          <div className="ct-detail-danger">
            <button className="ct-detail-delete-btn" onClick={() => setDeleteConfirm(viewContact)}>
              <FaTrash /> Delete this message
            </button>
          </div>
        </div>

        {deleteConfirm && (
          <div className="ct-modal" onClick={() => setDeleteConfirm(null)}>
            <div className="ct-modal-confirm" onClick={(e) => e.stopPropagation()}>
              <FaTrash className="ct-confirm-icon" />
              <h3>Delete Contact?</h3>
              <p>Message from <strong>{deleteConfirm.name}</strong> will be permanently deleted.</p>
              <div className="ct-confirm-actions">
                <button className="ct-confirm-cancel" onClick={() => setDeleteConfirm(null)}>Cancel</button>
                <button className="ct-confirm-delete" onClick={() => handleDelete(deleteConfirm.id)}>Delete</button>
              </div>
            </div>
          </div>
        )}

        {toast && <div className="ct-toast"><FaCheck /> {toast}</div>}
      </div>
    );
  }

  /* LIST VIEW */
  if (loading) {
    return (
      <div className="content">
        <div className="page-top">
          <h1 className="page-title">Contact Messages</h1>
          <Breadcrumb />
        </div>
        <div className="ct-loading"><FaSpinner className="ct-spinner" /><p>Loading contacts...</p></div>
      </div>
    );
  }

  return (
    <div className="content">
      <div className="page-top">
        <h1 className="page-title">Contact Messages</h1>
        <Breadcrumb />
      </div>

      <div className="ct-hero">
        <div className="ct-hero-overlay">
          <h2>Contact Inbox</h2>
          <p>Manage customer messages from your contact form</p>
        </div>
      </div>

      {stats && (
        <div className="ct-stats-row">
          <div className="ct-stat-card ct-stat-blue">
            <div className="ct-stat-icon"><FaEnvelope /></div>
            <div className="ct-stat-info">
              <span className="ct-stat-value">{stats.total}</span>
              <span className="ct-stat-label">Total Messages</span>
            </div>
          </div>
          <div className="ct-stat-card ct-stat-red">
            <div className="ct-stat-icon"><FaExclamationCircle /></div>
            <div className="ct-stat-info">
              <span className="ct-stat-value">{stats.unread}</span>
              <span className="ct-stat-label">Unread</span>
            </div>
          </div>
          <div className="ct-stat-card ct-stat-blue-light">
            <div className="ct-stat-icon"><FaEnvelopeOpen /></div>
            <div className="ct-stat-info">
              <span className="ct-stat-value">{stats.read}</span>
              <span className="ct-stat-label">Read</span>
            </div>
          </div>
          <div className="ct-stat-card ct-stat-green">
            <div className="ct-stat-icon"><FaReply /></div>
            <div className="ct-stat-info">
              <span className="ct-stat-value">{stats.replied}</span>
              <span className="ct-stat-label">Replied</span>
            </div>
          </div>
        </div>
      )}

      <div className="ct-toolbar">
        <div className="ct-search-wrap">
          <FaSearch className="ct-search-icon" />
          <input type="text" placeholder="Search by name, email, message..." value={search} onChange={(e) => setSearch(e.target.value)} />
          {search && <button className="ct-search-clear" onClick={() => setSearch("")}><FaTimes /></button>}
        </div>
        <div className="ct-toolbar-actions">
          <div className="ct-filter-tabs">
            {["all", "unread", "read", "replied", "archived"].map((f) => (
              <button key={f} className={`ct-filter-tab ${filter === f ? "active" : ""}`} onClick={() => setFilter(f)}>
                {f === "all" ? "All" : STATUS_MAP[f].label}
                {f === "unread" && stats?.unread > 0 && <span className="ct-filter-badge">{stats.unread}</span>}
              </button>
            ))}
          </div>
          {selected.length > 0 && (
            <button className="ct-bulk-delete" onClick={() => setBulkDeleteConfirm(true)}>
              <FaTrash /> Delete ({selected.length})
            </button>
          )}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="ct-empty">
          <FaEnvelope />
          <p>No contact messages found</p>
        </div>
      ) : (
        <div className="ct-table">
          <div className="ct-table-header">
            <span className="ct-col-check">
              <input type="checkbox" checked={selected.length === filtered.length && filtered.length > 0} onChange={selectAll} />
            </span>
            <span className="ct-col-name">From</span>
            <span className="ct-col-message">Message</span>
            <span className="ct-col-date">Date</span>
            <span className="ct-col-status">Status</span>
            <span className="ct-col-actions">Actions</span>
          </div>
          {filtered.map((contact) => (
            <div className={`ct-table-row ${contact.status === "unread" ? "unread" : ""}`} key={contact.id}>
              <span className="ct-col-check">
                <input type="checkbox" checked={selected.includes(contact.id)} onChange={() => toggleSelect(contact.id)} />
              </span>
              <span className="ct-col-name" onClick={() => openContact(contact)}>
                <div className="ct-avatar">{contact.name.charAt(0).toUpperCase()}</div>
                <div className="ct-name-info">
                  <span className="ct-name">{contact.name}</span>
                  <span className="ct-email">{contact.email}</span>
                </div>
              </span>
              <span className="ct-col-message" onClick={() => openContact(contact)}>
                {contact.message.length > 80 ? contact.message.substring(0, 80) + "..." : contact.message}
              </span>
              <span className="ct-col-date">{formatDate(contact.created_at)}</span>
              <span className="ct-col-status">
                <div className="ct-status-wrap">
                  <button className={`ct-status-badge ct-status-${contact.status}`} onClick={() => setStatusDropdown(statusDropdown === contact.id ? null : contact.id)}>
                    {STATUS_MAP[contact.status]?.icon} {STATUS_MAP[contact.status]?.label} <FaChevronDown className="ct-status-arrow" />
                  </button>
                  {statusDropdown === contact.id && (
                    <div className="ct-status-dropdown">
                      {Object.entries(STATUS_MAP).map(([key, val]) => (
                        <button key={key} className={`ct-status-option ${contact.status === key ? "active" : ""}`} onClick={() => updateStatus(contact.id, key)}>
                          {val.icon} {val.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </span>
              <span className="ct-col-actions">
                <button className="ct-action-btn view" onClick={() => openContact(contact)}><FaEye /></button>
                <button className="ct-action-btn delete" onClick={() => setDeleteConfirm(contact)}><FaTrash /></button>
              </span>
            </div>
          ))}
        </div>
      )}

      {deleteConfirm && (
        <div className="ct-modal" onClick={() => setDeleteConfirm(null)}>
          <div className="ct-modal-confirm" onClick={(e) => e.stopPropagation()}>
            <FaTrash className="ct-confirm-icon" />
            <h3>Delete Contact?</h3>
            <p>Message from <strong>{deleteConfirm.name}</strong> will be permanently deleted.</p>
            <div className="ct-confirm-actions">
              <button className="ct-confirm-cancel" onClick={() => setDeleteConfirm(null)}>Cancel</button>
              <button className="ct-confirm-delete" onClick={() => handleDelete(deleteConfirm.id)}>Delete</button>
            </div>
          </div>
        </div>
      )}

      {bulkDeleteConfirm && (
        <div className="ct-modal" onClick={() => setBulkDeleteConfirm(false)}>
          <div className="ct-modal-confirm" onClick={(e) => e.stopPropagation()}>
            <FaTrash className="ct-confirm-icon" />
            <h3>Delete {selected.length} Contacts?</h3>
            <p>This action cannot be undone.</p>
            <div className="ct-confirm-actions">
              <button className="ct-confirm-cancel" onClick={() => setBulkDeleteConfirm(false)}>Cancel</button>
              <button className="ct-confirm-delete" onClick={handleBulkDelete}>Delete All</button>
            </div>
          </div>
        </div>
      )}

      {toast && <div className="ct-toast"><FaCheck /> {toast}</div>}
    </div>
  );
};

export default ContactAdmin;
