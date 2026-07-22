import { useState, useEffect } from "react";
import Breadcrumb from "../common/Breadcrumb";
import { FiShoppingCart, FiTrash2, FiUser, FiPackage, FiRefreshCw, FiSearch } from "react-icons/fi";
import "../../assets/style/ShopAdmin.css";

const API = "http://localhost:5000";

const CartAdmin = () => {
  const [carts, setCarts] = useState([]);
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [userRes, prodRes] = await Promise.allSettled([
          fetch(`${API}/api/users/all-users`),
          fetch(`${API}/api/products`),
        ]);

        const userList = userRes.status === "fulfilled" && userRes.value.ok ? await userRes.value.json() : [];
        const prodJson = prodRes.status === "fulfilled" && prodRes.value.ok ? await prodRes.value.json() : null;

        setUsers(Array.isArray(userList) ? userList : []);
        setProducts(prodJson?.data || (Array.isArray(prodJson) ? prodJson : []));

        // Since admin cart endpoint may not exist, build a mock from orders
        const orderRes = await fetch(`${API}/api/orders`).catch(() => null);
        if (orderRes && orderRes.ok) {
          const orderJson = await orderRes.json();
          const orders = orderJson?.data || (Array.isArray(orderJson) ? orderJson : []);
          // Group orders by user as "carts"
          const cartMap = {};
          orders.forEach((order) => {
            const key = order.user_id || order.email || "guest";
            if (!cartMap[key]) {
              cartMap[key] = {
                user_id: order.user_id,
                customer_name: order.customer_name || order.email || "Guest",
                email: order.email || "",
                items: [],
                total: 0,
                order_count: 0,
                last_active: order.created_at,
              };
            }
            cartMap[key].items.push({
              order_id: order.id,
              product_name: order.product_name || `Order #${order.id}`,
              quantity: order.quantity || 1,
              price: Number(order.total || 0),
              status: order.order_status,
              created_at: order.created_at,
            });
            cartMap[key].total += Number(order.total || 0);
            cartMap[key].order_count += 1;
            if (new Date(order.created_at) > new Date(cartMap[key].last_active)) {
              cartMap[key].last_active = order.created_at;
            }
          });
          setCarts(Object.values(cartMap));
        }
      } catch (err) {
        console.error("Cart admin fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const filtered = carts.filter((c) =>
    c.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalCartValue = carts.reduce((sum, c) => sum + c.total, 0);
  const totalItems = carts.reduce((sum, c) => sum + c.items.length, 0);

  if (loading) {
    return (
      <div className="shop-admin-wrap">
        <div className="settings-page-top">
          <h1 className="settings-page-title">Cart</h1>
          <Breadcrumb />
        </div>
        <div className="shop-loading">Loading cart data...</div>
      </div>
    );
  }

  return (
    <div className="shop-admin-wrap">
      <div className="settings-page-top">
        <h1 className="settings-page-title">Cart Management</h1>
        <Breadcrumb />
      </div>

      <div className="shop-stats-grid">
        <div className="shop-stat-card">
          <div className="shop-stat-icon" style={{ background: "#eef2ff", color: "#667eea" }}><FiShoppingCart /></div>
          <div className="shop-stat-info">
            <span className="shop-stat-value">{carts.length}</span>
            <span className="shop-stat-label">Active Carts</span>
          </div>
        </div>
        <div className="shop-stat-card">
          <div className="shop-stat-icon" style={{ background: "#f0fdf4", color: "#22c55e" }}><FiPackage /></div>
          <div className="shop-stat-info">
            <span className="shop-stat-value">{totalItems}</span>
            <span className="shop-stat-label">Total Items</span>
          </div>
        </div>
        <div className="shop-stat-card">
          <div className="shop-stat-icon" style={{ background: "#fef2f2", color: "#ef4444" }}><FiShoppingCart /></div>
          <div className="shop-stat-info">
            <span className="shop-stat-value">₹{totalCartValue.toLocaleString()}</span>
            <span className="shop-stat-label">Total Value</span>
          </div>
        </div>
      </div>

      <div className="ca-toolbar">
        <div className="ca-search">
          <FiSearch />
          <input type="text" placeholder="Search by name or email..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
      </div>

      <div className="ca-cart-list">
        {filtered.length === 0 && <p className="shop-empty">No carts found</p>}
        {filtered.map((cart, idx) => (
          <div className={`ca-cart-card ${selectedUser === idx ? "expanded" : ""}`} key={idx}>
            <div className="ca-cart-header" onClick={() => setSelectedUser(selectedUser === idx ? null : idx)}>
              <div className="ca-cart-user">
                <div className="ca-cart-avatar"><FiUser /></div>
                <div className="ca-cart-user-info">
                  <h4>{cart.customer_name}</h4>
                  <span>{cart.email}</span>
                </div>
              </div>
              <div className="ca-cart-summary">
                <span className="ca-cart-badge">{cart.items.length} items</span>
                <span className="ca-cart-total">₹{cart.total.toLocaleString()}</span>
                <span className="ca-cart-orders">{cart.order_count} orders</span>
              </div>
            </div>
            {selectedUser === idx && (
              <div className="ca-cart-body">
                <div className="ca-cart-items">
                  <h4>Order History</h4>
                  {cart.items.map((item, i) => (
                    <div className="ca-cart-item" key={i}>
                      <div className="ca-item-info">
                        <span className="ca-item-name">{item.product_name}</span>
                        <span className="ca-item-qty">Qty: {item.quantity}</span>
                      </div>
                      <div className="ca-item-meta">
                        <span className={`ca-item-status ${item.status?.toLowerCase()}`}>{item.status || "Pending"}</span>
                        <span className="ca-item-price">₹{item.price.toLocaleString()}</span>
                      </div>
                      <span className="ca-item-date">{item.created_at ? new Date(item.created_at).toLocaleDateString() : ""}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CartAdmin;
