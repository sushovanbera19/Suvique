import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AccountHeader from "../Common/AccountHeader";
import { useTranslation } from "../context/LanguageContext";
import "../assets/style/AccountPages.css";

const API = "http://localhost:5000";

const STATUS_STEPS = ["Pending", "Processing", "Shipped", "Delivered"];

export default function UserOrders() {
  const { t, lang } = useTranslation();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [orderItems, setOrderItems] = useState({});
  const [filter, setFilter] = useState("all");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    if (!token) { navigate("/login"); return; }
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/orders/user/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) setOrders(data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchItems = async (orderId) => {
    if (expandedOrder === orderId) { setExpandedOrder(null); return; }
    if (orderItems[orderId]) { setExpandedOrder(orderId); return; }
    try {
      const res = await fetch(`${API}/api/orders/${orderId}/status`);
      const data = await res.json();
      if (data.success) {
        setOrderItems((prev) => ({ ...prev, [orderId]: data.data.items || [] }));
        setExpandedOrder(orderId);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCancel = async (orderId) => {
    if (!window.confirm(t("orders.confirmCancel"))) return;
    try {
      const res = await fetch(`${API}/api/orders/${orderId}/cancel`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setMsg(t("orders.cancelled"));
        fetchOrders();
      } else {
        setMsg(data.message);
      }
    } catch {
      setMsg("Error cancelling order");
    }
  };

  const getStepIndex = (status) => {
    if (status === "Cancelled") return -1;
    const idx = STATUS_STEPS.indexOf(status);
    return idx >= 0 ? idx : 0;
  };

  const formatDate = (d) => {
    const localeMap = { en:"en-US", hi:"hi-IN", fr:"fr-FR", de:"de-DE", es:"es-ES", ar:"ar-SA", zh:"zh-CN", ja:"ja-JP", bn:"bn-BD", th:"th-TH", id:"id-ID", ms:"ms-MY", sv:"sv-SE", pl:"pl-PL", cs:"cs-CZ", ro:"ro-RO", el:"el-GR" };
    return new Date(d).toLocaleDateString(localeMap[lang] || "en-US", { year: "numeric", month: "short", day: "numeric" });
  };

  const formatDateTime = (d) => {
    const localeMap = { en:"en-US", hi:"hi-IN", fr:"fr-FR", de:"de-DE", es:"es-ES", ar:"ar-SA", zh:"zh-CN", ja:"ja-JP", bn:"bn-BD", th:"th-TH", id:"id-ID", ms:"ms-MY", sv:"sv-SE", pl:"pl-PL", cs:"cs-CZ", ro:"ro-RO", el:"el-GR" };
    return new Date(d).toLocaleString(localeMap[lang] || "en-US", { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
  };

  const filteredOrders = filter === "all" ? orders : orders.filter((o) => o.order_status.toLowerCase() === filter);

  const filterTabs = [
    { key: "all", label: t("orders.filterAll") || "All" },
    { key: "pending", label: t("orders.pending") },
    { key: "processing", label: t("orders.processing") },
    { key: "shipped", label: t("orders.shipped") },
    { key: "delivered", label: t("orders.delivered") },
    { key: "cancelled", label: t("orders.cancelledStatus") },
  ];

  return (
    <>
      <AccountHeader title={t("orders.title")} breadcrumb={`${t("breadcrumb.home")} → ${t("breadcrumb.myOrders")}`} />
      <div className="account-page">
        <div className="account-page-container">
          <div className="account-card orders-card">
            <div className="orders-header">
              <h2>{t("orders.title")}</h2>
              <span className="orders-count">{orders.length} {t("orders.totalOrders") || "orders"}</span>
            </div>

            {msg && <p className={`account-msg ${msg.includes("Error") ? "account-msg-error" : ""}`}>{msg}</p>}

            <div className="orders-filter-tabs">
              {filterTabs.map((tab) => (
                <button
                  key={tab.key}
                  className={`orders-filter-tab ${filter === tab.key ? "active" : ""}`}
                  onClick={() => setFilter(tab.key)}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {loading ? (
              <div className="account-loading">
                <div className="orders-spinner" />
                <p>{t("common.loading")}</p>
              </div>
            ) : filteredOrders.length === 0 ? (
              <div className="orders-empty-state">
                <div className="orders-empty-icon">&#128722;</div>
                <h3>{t("orders.noOrders")}</h3>
                <p>{t("orders.browseProducts") || "Browse our products and place your first order!"}</p>
                <button className="orders-shop-btn" onClick={() => navigate("/Shop-1")}>{t("common.shop") || "Shop Now"}</button>
              </div>
            ) : (
              <div className="orders-list">
                {filteredOrders.map((order) => {
                  const stepIdx = getStepIndex(order.order_status);
                  const isCancelled = order.order_status === "Cancelled";
                  const items = orderItems[order.id] || [];
                  const firstItem = expandedOrder === order.id && items.length > 0 ? items[0] : null;

                  return (
                    <div key={order.id} className={`order-card ${expandedOrder === order.id ? "expanded" : ""}`}>
                      {/* Order Top Bar */}
                      <div className="order-card-top">
                        <div className="order-card-left">
                          <div className="order-card-thumb">
                            {firstItem ? (
                              <img src={`${API}/${firstItem.main_image.replace(/\\/g, "/")}`} alt="" onError={(e) => { e.target.src = "https://via.placeholder.com/64"; }} />
                            ) : (
                              <div className="order-thumb-placeholder">&#128230;</div>
                            )}
                          </div>
                          <div className="order-card-info">
                            <div className="order-card-id-date">
                              <span className="order-card-id">#{order.id}</span>
                              <span className="order-card-date">{formatDate(order.created_at)}</span>
                            </div>
                            <p className="order-card-items-text">
                              {order.total_items} {t("orders.itemCount") || "items"}
                            </p>
                          </div>
                        </div>
                        <div className="order-card-right">
                          <div className="order-card-price">
                            {order.currency === "INR" ? "₹" : "$"}{Number(order.total).toFixed(2)}
                          </div>
                          <span className={`order-status-badge status-${order.order_status.toLowerCase()}`}>
                            {isCancelled ? "✕" : stepIdx >= 3 ? "✓" : "●"} {t(`orders.${order.order_status.toLowerCase()}`) || order.order_status}
                          </span>
                        </div>
                      </div>

                      {/* Inline Progress Bar */}
                      {!isCancelled && (
                        <div className="order-progress">
                          <div className="order-progress-track">
                            <div className="order-progress-fill" style={{ width: `${(stepIdx / (STATUS_STEPS.length - 1)) * 100}%` }} />
                          </div>
                          <div className="order-progress-steps">
                            {STATUS_STEPS.map((step, idx) => (
                              <div key={step} className={`order-progress-step ${idx <= stepIdx ? "active" : ""}`}>
                                <div className="order-progress-dot" />
                                <span>{t(`orders.${step.toLowerCase()}`) || step}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {isCancelled && (
                        <div className="order-cancelled-bar">
                          <span>✕</span> {t("orders.cancelledStatus") || "Cancelled"}
                        </div>
                      )}

                      {/* Actions */}
                      <div className="order-card-actions">
                        <button className="order-action-btn primary" onClick={() => navigate(`/track-order?id=${order.id}`)}>
                          {t("orders.track") || "Track Order"}
                        </button>
                        <button className="order-action-btn" onClick={() => fetchItems(order.id)}>
                          {expandedOrder === order.id ? (t("orders.hideDetails") || "Hide Details") : (t("orders.viewDetails") || "View Details")}
                        </button>
                        {order.order_status === "Pending" && (
                          <button className="order-action-btn danger" onClick={(e) => { e.stopPropagation(); handleCancel(order.id); }}>
                            {t("orders.cancel")}
                          </button>
                        )}
                      </div>

                      {/* Expanded Items */}
                      {expandedOrder === order.id && items.length > 0 && (
                        <div className="order-items-expanded">
                          {items.map((item, idx) => (
                            <div key={idx} className="order-expanded-item" onClick={() => navigate(`/product-details-1/${item.product_id}`)}>
                              <img
                                src={`${API}/${item.main_image.replace(/\\/g, "/")}`}
                                alt={item.product_name}
                                className="order-expanded-img"
                                onError={(e) => { e.target.src = "https://via.placeholder.com/64"; }}
                              />
                              <div className="order-expanded-info">
                                <p className="order-expanded-name">{item.product_name}</p>
                                {(item.color_code || item.size) && (
                                  <div className="order-expanded-variant">
                                    {item.color_code && (
                                      <span className="order-variant-color">
                                        <span className="order-variant-dot" style={{ backgroundColor: item.color_code }} />
                                        {item.color_code}
                                      </span>
                                    )}
                                    {item.size && (
                                      <span className="order-variant-size">{item.size}</span>
                                    )}
                                  </div>
                                )}
                                <p className="order-expanded-meta">
                                  {t("orders.qty") || "Qty"}: {item.quantity} × {order.currency === "INR" ? "₹" : "$"}{Number(item.price).toFixed(2)}
                                </p>
                              </div>
                              <div className="order-expanded-total">
                                {order.currency === "INR" ? "₹" : "$"}{(item.quantity * item.price).toFixed(2)}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
