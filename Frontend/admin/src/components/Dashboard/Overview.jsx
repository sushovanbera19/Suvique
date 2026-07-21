import Breadcrumb from "../common/Breadcrumb";
import Card from "../common/Card";
import React, { useState, useEffect } from "react";
import "../../assets/style/Dashboard.css";
import { Dropdown } from "antd";
import { FaDollarSign, FaWallet, FaUsers, FaShoppingCart, FaChevronDown, FaEllipsisV } from "react-icons/fa";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Cell, Tooltip } from "recharts";
import { useTranslation } from "../../hooks/useTranslation";

const API = "http://localhost:5000";

const Overview = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("Pending");
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API}/api/stats/overview`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setStats(data.data);
      })
      .catch((err) => console.error("Stats fetch error:", err))
      .finally(() => setLoading(false));
  }, []);

  const counts = stats?.counts || {};
  const monthlyRevenue = stats?.monthlyRevenue || [];
  const recentOrders = stats?.recentOrders || [];
  const topSellingProducts = stats?.topSellingProducts || [];
  const topCustomers = stats?.topCustomers || [];
  const ordersByStatus = stats?.ordersByStatus || [];

  const chartData = monthlyRevenue.length > 0
    ? monthlyRevenue.map((item) => ({
        month: item.month,
        value: Number(item.value),
        fill: "#cab5ff",
      }))
    : [
        { month: "Jan", value: 0, fill: "#e5e7eb" },
        { month: "Feb", value: 0, fill: "#e5e7eb" },
        { month: "Mar", value: 0, fill: "#e5e7eb" },
        { month: "Apr", value: 0, fill: "#e5e7eb" },
        { month: "May", value: 0, fill: "#e5e7eb" },
        { month: "Jun", value: 0, fill: "#e5e7eb" },
      ];

  const formatCurrency = (val) => {
    const num = Number(val) || 0;
    return num >= 1000 ? `$${(num / 1000).toFixed(1)}k` : `$${num.toFixed(0)}`;
  };

  const getOrdersForTab = (status) => {
    if (status === "Pending") return recentOrders.filter((o) => o.order_status === "Pending");
    if (status === "Confirmed") return recentOrders.filter((o) => o.order_status === "Confirmed");
    if (status === "Cancelled") return recentOrders.filter((o) => o.order_status === "Cancelled");
    return [];
  };

  const getStatusCount = (status) => {
    const found = ordersByStatus.find((s) => s.order_status === status);
    return found ? found.count : 0;
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  if (loading) {
    return (
      <div className="content">
        <div className="page-top">
          <h1 className="page-title">{t("overview.title")}</h1>
          <Breadcrumb />
        </div>
        <p style={{ color: "#94a3b8", textAlign: "center", marginTop: 60 }}>{t("tables.loading")}</p>
      </div>
    );
  }

  return (
    <div className="content">
      {/* PAGE HEADER */}
      <div className="page-top">
        <h1 className="page-title">{t("overview.title")}</h1>
        <Breadcrumb />
      </div>
      <div className="dashboard-layout">
        {/* LEFT COLUMN */}
        <div className="left-column">
          {/* STATS */}
          <div className="stats-grid">
            <Card
              title={t("overview.totalSales")}
              value={formatCurrency(counts.totalRevenue)}
              subtitle={`${counts.monthOrders || 0} orders this month`}
              icon={<FaDollarSign />}
              iconClass="purple"
            />
            <Card
              title="Monthly Revenue"
              value={formatCurrency(counts.monthRevenue)}
              subtitle={`${counts.pendingOrders || 0} pending orders`}
              icon={<FaWallet />}
              iconClass="blue"
            />
            <Card
              title="Total Reviews"
              value={counts.totalReviews || 0}
              subtitle="Customer feedback"
              icon={<FaUsers />}
              iconClass="green"
            />
            <Card
              title={t("overview.totalOrders")}
              value={counts.totalOrders || 0}
              subtitle={`${counts.totalProducts || 0} products listed`}
              icon={<FaShoppingCart />}
              iconClass="orange"
            />
          </div>

          {/* RECENT ORDERS */}
          <Card
            title={
              <div className="card-title-row">
                <span>{t("overview.recentOrders")}</span>
              </div>
            }
          >
            {recentOrders.length === 0 ? (
              <p style={{ color: "#94a3b8", textAlign: "center", padding: 20 }}>No orders yet</p>
            ) : (
              <div className="table-scroll-wrap">
                <table className="table">
                  <thead>
                    <tr>
                      <th style={{ width: 80 }}>Order</th>
                      <th>{t("overview.customer")}</th>
                      <th style={{ width: 100 }}>{t("overview.price")}</th>
                      <th style={{ width: 110 }}>Status</th>
                      <th style={{ width: 130 }}>{t("overview.date")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map((order) => (
                      <tr key={order.id}>
                        <td>#{order.id}</td>
                        <td title={order.customer_name || "Guest"}>{order.customer_name || "Guest"}</td>
                        <td>{formatCurrency(order.total)}</td>
                        <td>
                          <span
                            className={
                              order.order_status === "Confirmed"
                                ? "status-badge status-delivered"
                                : order.order_status === "Cancelled"
                                ? "status-badge status-cancelled"
                                : "status-badge status-pending"
                            }
                          >
                            {order.order_status}
                          </span>
                        </td>
                        <td>{formatDate(order.created_at)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>

          {/* ORDERS BY STATUS TABLE */}
          <Card>
            <div className="card-header-with-tabs">
              <h3 className="card-title">Orders by Status</h3>
              <div className="card-tabs">
                <button
                  className={activeTab === "Pending" ? "tab active" : "tab"}
                  onClick={() => setActiveTab("Pending")}
                >
                  Pending ({getStatusCount("Pending")})
                </button>
                <button
                  className={activeTab === "Confirmed" ? "tab active" : "tab"}
                  onClick={() => setActiveTab("Confirmed")}
                >
                  {t("overview.completed")} ({getStatusCount("Confirmed")})
                </button>
                <button
                  className={activeTab === "Cancelled" ? "tab active" : "tab"}
                  onClick={() => setActiveTab("Cancelled")}
                >
                  {t("overview.cancelled")} ({getStatusCount("Cancelled")})
                </button>
              </div>
            </div>
            <div className="table-scroll-wrap">
              <table className="table">
                <thead>
                  <tr>
                    <th style={{ width: 80 }}>Order</th>
                    <th>{t("overview.customer")}</th>
                    <th style={{ width: 100 }}>{t("overview.price")}</th>
                    <th style={{ width: 120 }}>Payment</th>
                    <th style={{ width: 130 }}>{t("overview.date")}</th>
                  </tr>
                </thead>
                <tbody>
                  {getOrdersForTab(activeTab).length === 0 ? (
                    <tr>
                      <td colSpan={5} style={{ textAlign: "center", color: "#94a3b8", padding: "20px 0" }}>
                        No {activeTab.toLowerCase()} orders
                      </td>
                    </tr>
                  ) : (
                    getOrdersForTab(activeTab).map((order) => (
                      <tr key={order.id}>
                        <td>#{order.id}</td>
                        <td title={order.customer_name || "Guest"}>{order.customer_name || "Guest"}</td>
                        <td>{formatCurrency(order.total)}</td>
                        <td>
                          <span className="status-badge status-pending">{order.payment_method}</span>
                        </td>
                        <td>{formatDate(order.created_at)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* RIGHT COLUMN */}
        <div className="right-column">
          {/* EARNINGS CHART */}
          <Card
            className="earnings-card"
            title={
              <div className="earnings-header">
                <div className="earnings-title">{t("overview.earnings")}</div>
                <div className="earnings-actions">
                  <span className="view-all">{t("overview.viewAll")}</span>
                </div>
              </div>
            }
          >
            {/* STATS */}
            <div className="earning-stats">
              <div className="earning-box">
                <div className="earning-label purple-light">
                  <span className="dot"></span>
                  Total Revenue
                </div>
                <div className="earning-price">
                  <h2>{formatCurrency(counts.totalRevenue)}</h2>
                </div>
              </div>
              <div className="earning-box">
                <div className="earning-label purple">
                  <span className="dot"></span>
                  This Month
                </div>
                <div className="earning-price">
                  <h2>{formatCurrency(counts.monthRevenue)}</h2>
                </div>
              </div>
            </div>

            {/* CHART */}
            <div className="earnings-chart">
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={chartData}>
                  <XAxis dataKey="month" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip
                    cursor={{ fill: "rgba(124,77,255,0.08)" }}
                    formatter={(val) => [`$${Number(val).toLocaleString()}`, "Revenue"]}
                  />
                  <Bar dataKey="value" radius={[20, 20, 20, 20]} barSize={15}>
                    {chartData.map((entry, index) => (
                      <Cell key={index} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* BOTTOM SECTION */}
          <div className="right-bottom-section">
            {/* TOP SELLING PRODUCTS */}
            <Card title={t("overview.topSellingProducts")}>
              <div className="table-scroll-wrap">
                <table className="table">
                  <thead>
                    <tr>
                      <th style={{ width: 40 }}>#</th>
                      <th>{t("overview.productName")}</th>
                      <th style={{ width: 110 }}>{t("overview.category")}</th>
                      <th style={{ width: 80 }}>Price</th>
                      <th style={{ width: 60 }}>Sold</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topSellingProducts.length === 0 ? (
                      <tr>
                        <td colSpan={5} style={{ textAlign: "center", color: "#94a3b8", padding: "20px 0" }}>
                          No products yet
                        </td>
                      </tr>
                    ) : (
                      topSellingProducts.map((product, index) => (
                        <tr key={product.id}>
                          <td>{index + 1}</td>
                          <td>
                            <div className="product-cell">
                              {product.main_image && (
                                <img
                                  src={`${API}/${product.main_image.replace(/\\/g, "/")}`}
                                  alt=""
                                />
                              )}
                              <span title={product.product_name}>{product.product_name}</span>
                            </div>
                          </td>
                          <td>{product.category_name || "—"}</td>
                          <td>{formatCurrency(product.base_price)}</td>
                          <td>{product.totalSold}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </Card>

            {/* BOTTOM 2 CARDS */}
            <div className="bottom-two-cards">
              <Card title={t("overview.topCustomers")}>
                <ul className="customer-list">
                  {topCustomers.length === 0 ? (
                    <li style={{ color: "#94a3b8", textAlign: "center", padding: 20 }}>No customers yet</li>
                  ) : (
                    topCustomers.map((customer) => (
                      <li key={customer.id} className="customer-item">
                        <div className="customer-item-left">
                          <img
                            src={`https://i.pravatar.cc/100?u=${customer.email || customer.id}`}
                            className="customer-avatar"
                            alt=""
                          />
                          <div className="customer-info">
                            <h4 title={customer.name || "Guest"}>{customer.name || "Guest"}</h4>
                            <span>{customer.orderCount} order{customer.orderCount !== 1 ? "s" : ""}</span>
                          </div>
                        </div>
                        <span className="customer-amount">{formatCurrency(customer.totalSpent)}</span>
                      </li>
                    ))
                  )}
                </ul>
              </Card>

              <Card title={t("overview.topCountriesBySales")}>
                <div className="country-sales-card">
                  <div className="country-sales-header">
                    <h2>{counts.totalOrders || 0}</h2>
                    <div className="country-growth">
                      <p>Total Orders</p>
                    </div>
                  </div>
                  <ul className="country-sales-list">
                    {recentOrders.slice(0, 5).map((order) => (
                      <li key={order.id}>
                        <div className="country-left">
                          <span className="flag">📦</span>
                          <span className="country-name" title={`#${order.id} — ${order.customer_name || "Guest"}`}>
                            #{order.id} — {order.customer_name || "Guest"}
                          </span>
                        </div>
                        <span className="country-sales">{formatCurrency(order.total)}</span>
                      </li>
                    ))}
                    {recentOrders.length === 0 && (
                      <li style={{ color: "#94a3b8", textAlign: "center", padding: 10 }}>No data</li>
                    )}
                  </ul>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* PRODUCTS OVERVIEW — ALL DETAILS */}
      <Card title={t("overview.productsOverview")} className="products-card">
        <div className="table-scroll-wrap">
          <table className="table" style={{ tableLayout: "auto", minWidth: 1400 }}>
            <thead>
              <tr>
                <th style={{ width: 40 }}>#</th>
                <th>Image</th>
                <th>Product Name</th>
                <th>SKU</th>
                <th>Category</th>
                <th>Sub Category</th>
                <th>Base Price</th>
                <th>Sale Price</th>
                <th>Stock</th>
                <th>Sold</th>
                <th>VAT</th>
                <th>W × H</th>
                <th>Weight</th>
                <th>Ship Cost</th>
                <th>Status</th>
                <th>Tags</th>
              </tr>
            </thead>
            <tbody>
              {topSellingProducts.length === 0 ? (
                <tr>
                  <td colSpan={16} style={{ textAlign: "center", color: "#94a3b8", padding: "20px 0" }}>No products yet</td>
                </tr>
              ) : (
                topSellingProducts.map((p, index) => (
                  <tr key={p.id}>
                    <td>{index + 1}</td>
                    <td>
                      {p.main_image ? (
                        <img
                          src={`${API}/${p.main_image.replace(/\\/g, "/")}`}
                          alt=""
                          style={{ width: 44, height: 44, borderRadius: 6, objectFit: "cover" }}
                        />
                      ) : (
                        <span style={{ color: "#94a3b8" }}>—</span>
                      )}
                    </td>
                    <td title={p.product_name}>
                      <div className="product-cell">
                        <span>{p.product_name}</span>
                      </div>
                    </td>
                    <td>{p.sku || "—"}</td>
                    <td>{p.category_name || "—"}</td>
                    <td>{p.subcategory_name || "—"}</td>
                    <td>{formatCurrency(p.base_price)}</td>
                    <td>{p.sale_price ? formatCurrency(p.sale_price) : "—"}</td>
                    <td>{p.stock ?? p.quantity ?? 0}</td>
                    <td>{p.totalSold}</td>
                    <td>{p.vat ? `${p.vat}%` : "—"}</td>
                    <td>{p.width && p.height ? `${p.width}×${p.height}` : "—"}</td>
                    <td>{p.weight ? `${p.weight}kg` : "—"}</td>
                    <td>{p.shipping_cost ? formatCurrency(p.shipping_cost) : "—"}</td>
                    <td>
                      <span className={`status-badge ${p.status === "Active" ? "status-delivered" : "status-cancelled"}`}>
                        {p.status || "Active"}
                      </span>
                    </td>
                    <td title={p.tags}>
                      {(() => {
                        if (!p.tags) return "—";
                        try {
                          const arr = typeof p.tags === "string" ? JSON.parse(p.tags) : p.tags;
                          if (Array.isArray(arr)) return arr.slice(0, 2).join(", ") + (arr.length > 2 ? ` +${arr.length - 2}` : "");
                          return String(p.tags).slice(0, 30);
                        } catch {
                          return String(p.tags).slice(0, 30);
                        }
                      })()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default Overview;
