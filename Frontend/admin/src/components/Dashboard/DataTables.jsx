import { useState, useEffect, useMemo } from "react";
import { FiSearch, FiChevronUp, FiChevronDown, FiChevronsLeft, FiChevronsRight, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import Breadcrumb from "../common/Breadcrumb";
import { useTranslation } from "../../hooks/useTranslation";
import "../../assets/style/Tables.css";

const PAGE_SIZE = 10;

const DataTables = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("users");
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState("");
  const [sortDir, setSortDir] = useState("asc");
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [uRes, oRes, pRes] = await Promise.all([
          fetch("http://localhost:5000/api/users/all-users"),
          fetch("http://localhost:5000/api/orders"),
          fetch("http://localhost:5000/api/products"),
        ]);
        const uData = await uRes.json();
        const oData = await oRes.json();
        const pData = await pRes.json();
        setUsers(Array.isArray(uData) ? uData : uData.data || []);
        setOrders(oData.success ? oData.data : []);
        setProducts(pData.success ? pData.data : []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  useEffect(() => {
    setPage(1);
    setSearch("");
  }, [activeTab]);

  const rawData = useMemo(() => {
    if (activeTab === "users") return users;
    if (activeTab === "orders") return orders;
    return products;
  }, [activeTab, users, orders, products]);

  const filtered = useMemo(() => {
    if (!search.trim()) return rawData;
    const q = search.toLowerCase();
    return rawData.filter((row) =>
      Object.values(row).some((v) => v !== null && v !== undefined && String(v).toLowerCase().includes(q))
    );
  }, [rawData, search]);

  const sorted = useMemo(() => {
    if (!sortKey) return filtered;
    return [...filtered].sort((a, b) => {
      let va = a[sortKey] ?? "";
      let vb = b[sortKey] ?? "";
      if (typeof va === "number" && typeof vb === "number") return sortDir === "asc" ? va - vb : vb - va;
      va = String(va).toLowerCase();
      vb = String(vb).toLowerCase();
      if (va < vb) return sortDir === "asc" ? -1 : 1;
      if (va > vb) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
  }, [filtered, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const paged = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const SortHeader = ({ label, field }) => (
    <th onClick={() => handleSort(field)}>
      {label}
      <span className={`dt-sort-icon ${sortKey === field ? "active" : ""}`}>
        {sortKey === field ? (sortDir === "asc" ? <FiChevronUp /> : <FiChevronDown />) : <FiChevronUp />}
      </span>
    </th>
  );

  const renderPagination = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) pages.push(i);
    return (
      <div className="dt-pagination">
        <button className="dt-page-btn" disabled={page <= 1} onClick={() => setPage(1)}><FiChevronsLeft /></button>
        <button className="dt-page-btn" disabled={page <= 1} onClick={() => setPage(page - 1)}><FiChevronLeft /></button>
        {pages.map((p) => (
          <button key={p} className={`dt-page-btn ${p === page ? "active" : ""}`} onClick={() => setPage(p)}>{p}</button>
        ))}
        <button className="dt-page-btn" disabled={page >= totalPages} onClick={() => setPage(page + 1)}><FiChevronRight /></button>
        <button className="dt-page-btn" disabled={page >= totalPages} onClick={() => setPage(totalPages)}><FiChevronsRight /></button>
      </div>
    );
  };

  const renderUsers = () => (
    <table className="dt-table">
      <thead>
        <tr>
          <SortHeader label="#" field="id" />
          <SortHeader label={t("tables.user") || "User"} field="name" />
          <SortHeader label={t("tables.email") || "Email"} field="email" />
          <SortHeader label={t("tables.phone") || "Phone"} field="phone" />
          <SortHeader label={t("tables.joined") || "Joined"} field="created_at" />
        </tr>
      </thead>
      <tbody>
        {paged.length === 0 ? (
          <tr><td colSpan="5" className="dt-empty">{t("tables.noResults") || "No results found"}</td></tr>
        ) : paged.map((u) => (
          <tr key={u.id}>
            <td>{u.id}</td>
            <td>
              <div className="dt-user-cell">
                {u.image ? (
                  <img src={`http://localhost:5000/${u.image}`} alt="" className="dt-avatar" />
                ) : (
                  <div className="dt-avatar" style={{ background: "#667eea", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700 }}>
                    {(u.name || "U").charAt(0).toUpperCase()}
                  </div>
                )}
                <strong>{u.name || "—"}</strong>
              </div>
            </td>
            <td>{u.email || "—"}</td>
            <td>{u.phone || "—"}</td>
            <td>{u.created_at ? new Date(u.created_at).toLocaleDateString() : "—"}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  const renderOrders = () => (
    <table className="dt-table">
      <thead>
        <tr>
          <SortHeader label="#" field="id" />
          <SortHeader label={t("tables.customer") || "Customer"} field="user_name" />
          <SortHeader label={t("tables.total") || "Total"} field="total" />
          <SortHeader label={t("tables.payment") || "Payment"} field="payment_method" />
          <SortHeader label={t("tables.status") || "Status"} field="order_status" />
          <SortHeader label={t("tables.country") || "Country"} field="country" />
          <SortHeader label={t("tables.date") || "Date"} field="created_at" />
        </tr>
      </thead>
      <tbody>
        {paged.length === 0 ? (
          <tr><td colSpan="7" className="dt-empty">{t("tables.noResults") || "No results found"}</td></tr>
        ) : paged.map((o) => (
          <tr key={o.id}>
            <td>#{o.id}</td>
            <td>{o.user_name || o.customer_name || "—"}</td>
            <td>{o.currency || "$"}{Number(o.total || 0).toFixed(2)}</td>
            <td>{o.payment_method || "—"}</td>
            <td>
              <span className={`bt-status ${(o.order_status || "").toLowerCase()}`}>
                {o.order_status || "—"}
              </span>
            </td>
            <td>{o.country || "—"}</td>
            <td>{o.created_at ? new Date(o.created_at).toLocaleDateString() : "—"}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  const renderProducts = () => (
    <table className="dt-table">
      <thead>
        <tr>
          <SortHeader label={t("tables.image") || "Image"} field="main_image" />
          <SortHeader label={t("tables.name") || "Name"} field="product_name" />
          <SortHeader label={t("tables.price") || "Price"} field="base_price" />
          <SortHeader label={t("tables.stock") || "Stock"} field="quantity" />
          <SortHeader label={t("tables.category") || "Category"} field="category_name" />
          <SortHeader label={t("tables.sku") || "SKU"} field="sku" />
        </tr>
      </thead>
      <tbody>
        {paged.length === 0 ? (
          <tr><td colSpan="6" className="dt-empty">{t("tables.noResults") || "No results found"}</td></tr>
        ) : paged.map((p) => (
          <tr key={p.id}>
            <td>
              {p.main_image ? (
                <img src={`http://localhost:5000/${p.main_image.replace(/\\/g, "/")}`} alt="" style={{ width: 34, height: 34, borderRadius: 6, objectFit: "cover" }} />
              ) : (
                <div style={{ width: 34, height: 34, borderRadius: 6, background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", color: "#94a3b8", fontSize: 11 }}>N/A</div>
              )}
            </td>
            <td><strong>{p.product_name || "—"}</strong></td>
            <td>{p.currency || "$"}{Number(p.base_price || 0).toFixed(2)}</td>
            <td>{p.quantity ?? "—"}</td>
            <td>{p.category_name || "—"}</td>
            <td>{p.sku || "—"}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  if (loading) {
    return (
      <div className="dataTables-page">
        <Breadcrumb />
        <div className="dt-loading">{t("tables.loading") || "Loading..."}</div>
      </div>
    );
  }

  return (
    <div className="dataTables-page">
      <Breadcrumb />
      <h2>{t("tables.dataTitle") || "Data Tables"}</h2>
      <p>{t("tables.dataDesc") || "Interactive tables with search, sort and pagination"}</p>

      <div className="dt-toolbar">
        <div className="dt-search-box">
          <FiSearch />
          <input
            type="text"
            placeholder={t("tables.searchPlaceholder") || "Search..."}
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          />
        </div>
        <div className="dt-tabs">
          <button className={`dt-tab ${activeTab === "users" ? "active" : ""}`} onClick={() => setActiveTab("users")}>
            {t("tables.users") || "Users"} ({users.length})
          </button>
          <button className={`dt-tab ${activeTab === "orders" ? "active" : ""}`} onClick={() => setActiveTab("orders")}>
            {t("tables.ordersTab") || "Orders"} ({orders.length})
          </button>
          <button className={`dt-tab ${activeTab === "products" ? "active" : ""}`} onClick={() => setActiveTab("products")}>
            {t("tables.productsTab") || "Products"} ({products.length})
          </button>
        </div>
      </div>

      <div className="dt-card">
        <div className="dt-table-wrap">
          {activeTab === "users" && renderUsers()}
          {activeTab === "orders" && renderOrders()}
          {activeTab === "products" && renderProducts()}
        </div>
        <div className="dt-footer">
          <span>{t("tables.showing") || "Showing"} {paged.length} {t("tables.of") || "of"} {sorted.length} {t("tables.entries") || "entries"}</span>
          {renderPagination()}
        </div>
      </div>
    </div>
  );
};

export default DataTables;
