import { useState, useEffect } from "react";
import Breadcrumb from "../common/Breadcrumb";
import { useTranslation } from "../../hooks/useTranslation";
import "../../assets/style/Tables.css";

const BasicTables = () => {
  const { t } = useTranslation();
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return (
      <div className="basic-tables-page">
        <Breadcrumb />
        <div className="bt-loading">{t("tables.loading") || "Loading..."}</div>
      </div>
    );
  }

  return (
    <div className="basic-tables-page">
      <Breadcrumb />
      <h2>{t("tables.basicTitle") || "Basic Tables"}</h2>
      <p>{t("tables.basicDesc") || "Static overview of your store data"}</p>

      {/* Users Table */}
      <div className="bt-section">
        <div className="bt-section-header">
          <h3>{t("tables.registeredUsers") || "Registered Users"}</h3>
          <span className="bt-section-badge">{users.length}</span>
        </div>
        <div className="bt-table-wrap">
          <table className="bt-table">
            <thead>
              <tr>
                <th>{t("tables.user") || "User"}</th>
                <th>{t("tables.email") || "Email"}</th>
                <th>{t("tables.phone") || "Phone"}</th>
                <th>{t("tables.joined") || "Joined"}</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr><td colSpan="4" className="bt-empty">{t("tables.noUsers") || "No users found"}</td></tr>
              ) : (
                users.map((u) => (
                  <tr key={u.id}>
                    <td>
                      <div className="bt-user-cell">
                        {u.image ? (
                          <img src={`http://localhost:5000/${u.image}`} alt="" className="bt-avatar" />
                        ) : (
                          <div className="bt-avatar" style={{ background: "#667eea", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700 }}>
                            {(u.name || "U").charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div className="bt-user-info">
                          <strong>{u.name || "—"}</strong>
                        </div>
                      </div>
                    </td>
                    <td>{u.email || "—"}</td>
                    <td>{u.phone || "—"}</td>
                    <td>{u.created_at ? new Date(u.created_at).toLocaleDateString() : "—"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bt-section">
        <div className="bt-section-header">
          <h3>{t("tables.recentOrders") || "Recent Orders"}</h3>
          <span className="bt-section-badge">{orders.length}</span>
        </div>
        <div className="bt-table-wrap">
          <table className="bt-table">
            <thead>
              <tr>
                <th>#</th>
                <th>{t("tables.customer") || "Customer"}</th>
                <th>{t("tables.total") || "Total"}</th>
                <th>{t("tables.payment") || "Payment"}</th>
                <th>{t("tables.status") || "Status"}</th>
                <th>{t("tables.date") || "Date"}</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr><td colSpan="6" className="bt-empty">{t("tables.noOrders") || "No orders found"}</td></tr>
              ) : (
                orders.slice(0, 10).map((o) => (
                  <tr key={o.id}>
                    <td>#{o.id}</td>
                    <td>{o.user_name || o.customer_name || "—"}</td>
                    <td>{o.currency || "$"}{Number(o.total).toFixed(2)}</td>
                    <td>{o.payment_method || "—"}</td>
                    <td>
                      <span className={`bt-status ${(o.order_status || "").toLowerCase()}`}>
                        {o.order_status || "—"}
                      </span>
                    </td>
                    <td>{o.created_at ? new Date(o.created_at).toLocaleDateString() : "—"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Products Table */}
      <div className="bt-section">
        <div className="bt-section-header">
          <h3>{t("tables.allProducts") || "All Products"}</h3>
          <span className="bt-section-badge">{products.length}</span>
        </div>
        <div className="bt-table-wrap">
          <table className="bt-table">
            <thead>
              <tr>
                <th>{t("tables.image") || "Image"}</th>
                <th>{t("tables.name") || "Name"}</th>
                <th>{t("tables.price") || "Price"}</th>
                <th>{t("tables.stock") || "Stock"}</th>
                <th>{t("tables.category") || "Category"}</th>
                <th>{t("tables.sku") || "SKU"}</th>
              </tr>
            </thead>
            <tbody>
              {products.length === 0 ? (
                <tr><td colSpan="6" className="bt-empty">{t("tables.noProducts") || "No products found"}</td></tr>
              ) : (
                products.map((p) => (
                  <tr key={p.id}>
                    <td>
                      {p.main_image ? (
                        <img src={`http://localhost:5000/${p.main_image.replace(/\\/g, "/")}`} alt="" style={{ width: 36, height: 36, borderRadius: 6, objectFit: "cover" }} />
                      ) : (
                        <div style={{ width: 36, height: 36, borderRadius: 6, background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", color: "#94a3b8", fontSize: 11 }}>N/A</div>
                      )}
                    </td>
                    <td><strong>{p.product_name || "—"}</strong></td>
                    <td>{p.currency || "$"}{Number(p.base_price || 0).toFixed(2)}</td>
                    <td>{p.quantity ?? "—"}</td>
                    <td>{p.category_name || "—"}</td>
                    <td>{p.sku || "—"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BasicTables;
