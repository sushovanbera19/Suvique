import { useState, useEffect } from "react";
import Breadcrumb from "../common/Breadcrumb";
import { FiPackage, FiShoppingCart, FiUsers, FiDollarSign, FiArrowRight } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import "../../assets/style/ShopAdmin.css";

const API = "http://localhost:5000";

const ShopAdmin = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ products: 0, orders: 0, users: 0, revenue: 0 });
  const [categories, setCategories] = useState([]);
  const [recentProducts, setRecentProducts] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [prodRes, orderRes, userRes, catRes, statsRes] = await Promise.allSettled([
          fetch(`${API}/api/products`),
          fetch(`${API}/api/orders`),
          fetch(`${API}/api/users/all-users`),
          fetch(`${API}/api/product-category/all`),
          fetch(`${API}/api/stats/overview`),
        ]);

        const safeJson = async (res) => {
          if (!res || res.status !== "fulfilled" || !res.value.ok) return null;
          try { return await res.value.json(); } catch { return null; }
        };

        const statsData = await safeJson(statsRes);
        const prodsData = await safeJson(prodRes);
        const ordersData = await safeJson(orderRes);
        const usersData = await safeJson(userRes);
        const catsData = await safeJson(catRes);

        const productsList = prodsData?.data || (Array.isArray(prodsData) ? prodsData : []);
        const ordersList = ordersData?.data || (Array.isArray(ordersData) ? ordersData : []);
        const usersList = usersData || (Array.isArray(usersData) ? usersData : []);

        if (statsData?.data?.counts) {
          const c = statsData.data.counts;
          setStats({
            products: Number(c.totalProducts) || productsList.length,
            orders: Number(c.totalOrders) || ordersList.length,
            users: Number(c.totalUsers) || usersList.length,
            revenue: Number(c.totalRevenue) || 0,
          });
        } else {
          setStats({
            products: productsList.length,
            orders: ordersList.length,
            users: usersList.length,
            revenue: ordersList.reduce((sum, o) => sum + (Number(o.total) || 0), 0),
          });
        }

        setRecentProducts(productsList.slice(0, 6));
        setRecentOrders(ordersList.slice(0, 5));

        if (catsData?.categories) {
          setCategories(catsData.categories);
        } else if (Array.isArray(catsData)) {
          setCategories(catsData);
        }
      } catch (err) {
        console.error("Shop admin fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const statCards = [
    { label: "Total Products", value: stats.products, icon: <FiPackage />, color: "#667eea", bg: "#eef2ff" },
    { label: "Total Orders", value: stats.orders, icon: <FiShoppingCart />, color: "#22c55e", bg: "#f0fdf4" },
    { label: "Total Customers", value: stats.users, icon: <FiUsers />, color: "#f59e0b", bg: "#fffbeb" },
    { label: "Total Revenue", value: `₹${Number(stats.revenue).toLocaleString()}`, icon: <FiDollarSign />, color: "#ef4444", bg: "#fef2f2" },
  ];

  if (loading) {
    return (
      <div className="shop-admin-wrap">
        <div className="settings-page-top">
          <h1 className="settings-page-title">Shop</h1>
          <Breadcrumb />
        </div>
        <div className="shop-loading">Loading shop data...</div>
      </div>
    );
  }

  return (
    <div className="shop-admin-wrap">
      <div className="settings-page-top">
        <h1 className="settings-page-title">Shop Overview</h1>
        <Breadcrumb />
      </div>

      <div className="shop-stats-grid">
        {statCards.map((s) => (
          <div className="shop-stat-card" key={s.label}>
            <div className="shop-stat-icon" style={{ background: s.bg, color: s.color }}>{s.icon}</div>
            <div className="shop-stat-info">
              <span className="shop-stat-value">{s.value}</span>
              <span className="shop-stat-label">{s.label}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="shop-two-col">
        <div className="shop-section">
          <div className="shop-section-header">
            <h3>Categories</h3>
            <button className="shop-link-btn" onClick={() => navigate("/dashboard/categories")}>View All <FiArrowRight /></button>
          </div>
          <div className="shop-categories-grid">
            {categories.length === 0 && <p className="shop-empty">No categories yet</p>}
            {categories.map((cat) => (
              <div className="shop-category-card" key={cat.id}>
                {cat.image ? (
                  <img src={`${API}/uploads/${cat.image}`} alt={cat.name} className="shop-cat-img" />
                ) : (
                  <div className="shop-cat-placeholder"><FiPackage /></div>
                )}
                <span className="shop-cat-name">{cat.name}</span>
                <span className="shop-cat-count">{cat.product_count ?? 0} products</span>
              </div>
            ))}
          </div>
        </div>

        <div className="shop-section">
          <div className="shop-section-header">
            <h3>Recent Orders</h3>
            <button className="shop-link-btn" onClick={() => navigate("/dashboard/orders")}>View All <FiArrowRight /></button>
          </div>
          <div className="shop-orders-list">
            {recentOrders.length === 0 && <p className="shop-empty">No orders yet</p>}
            {recentOrders.map((order) => (
              <div className="shop-order-row" key={order.id}>
                <div className="shop-order-info">
                  <span className="shop-order-id">#{order.id}</span>
                  <span className="shop-order-customer">{order.customer_name || order.email || "Guest"}</span>
                </div>
                <div className="shop-order-meta">
                  <span className={`shop-order-status ${order.order_status?.toLowerCase()}`}>{order.order_status || "Pending"}</span>
                  <span className="shop-order-total">₹{Number(order.total || 0).toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="shop-section">
        <div className="shop-section-header">
          <h3>Recent Products</h3>
          <button className="shop-link-btn" onClick={() => navigate("/dashboard/products")}>View All <FiArrowRight /></button>
        </div>
        <div className="shop-products-grid">
          {recentProducts.length === 0 && <p className="shop-empty">No products yet</p>}
          {recentProducts.map((prod) => (
            <div className="shop-product-card" key={prod.id}>
              <div className="shop-prod-img-wrap">
                {prod.main_image ? (
                  <img src={`${API}/${prod.main_image.replace(/\\/g, "/")}`} alt={prod.product_name} className="shop-prod-img" />
                ) : (
                  <div className="shop-prod-placeholder"><FiPackage /></div>
                )}
                <span className={`shop-prod-status ${prod.status === 1 || prod.status === "active" ? "active" : "inactive"}`}>
                  {prod.status === 1 || prod.status === "active" ? "Active" : "Inactive"}
                </span>
              </div>
              <div className="shop-prod-info">
                <h4>{prod.product_name}</h4>
                <span className="shop-prod-price">₹{Number(prod.base_price || prod.sale_price || 0).toLocaleString()}</span>
                <span className="shop-prod-stock">Stock: {prod.quantity ?? "N/A"}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ShopAdmin;
