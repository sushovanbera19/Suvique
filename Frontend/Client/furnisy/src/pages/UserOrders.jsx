import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AccountHeader from "../Common/AccountHeader";
import { useTranslation } from "../context/LanguageContext";
import "../assets/style/AccountPages.css";

const API = "http://localhost:5000";

export default function UserOrders() {
  const { t, lang } = useTranslation();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [orderItems, setOrderItems] = useState({});
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

  const getStatusClass = (status) => {
    const s = (status || "").toLowerCase();
    if (s === "pending") return "status-pending";
    if (s === "processing") return "status-processing";
    if (s === "shipped") return "status-shipped";
    if (s === "delivered") return "status-delivered";
    if (s === "cancelled") return "status-cancelled";
    return "";
  };

  const formatDate = (d) => {
    const localeMap = { en:"en-US", hi:"hi-IN", fr:"fr-FR", de:"de-DE", es:"es-ES", ar:"ar-SA", zh:"zh-CN", ja:"ja-JP", bn:"bn-BD", th:"th-TH", id:"id-ID", ms:"ms-MY", sv:"sv-SE", pl:"pl-PL", cs:"cs-CZ", ro:"ro-RO", el:"el-GR" };
    return new Date(d).toLocaleDateString(localeMap[lang] || "en-US", { year: "numeric", month: "short", day: "numeric" });
  };

  return (
    <>
      <AccountHeader title={t("orders.title")} breadcrumb={`${t("breadcrumb.home")} → ${t("breadcrumb.myOrders")}`} />
      <div className="account-page">
        <div className="account-page-container">
          <div className="account-card">
            <h2>{t("orders.title")}</h2>

            {msg && <p className={`account-msg ${msg.includes("Error") ? "account-msg-error" : ""}`}>{msg}</p>}

            {loading ? (
              <div className="account-loading">{t("common.loading")}</div>
            ) : orders.length === 0 ? (
              <div className="account-empty-state">
                <p>{t("orders.noOrders")}</p>
              </div>
            ) : (
              <div className="orders-list">
                {orders.map((order) => (
                  <div key={order.id} className="order-item">
                    <div className="order-row" onClick={() => fetchItems(order.id)}>
                      <div className="order-col order-id">#{order.id}</div>
                      <div className="order-col order-date">{formatDate(order.created_at)}</div>
                      <div className="order-col order-total">
                        {order.currency === "INR" ? "₹" : "$"}{Number(order.total).toFixed(2)}
                      </div>
                      <div className="order-col order-items-count">{order.total_items} {t("orders.itemCount")}</div>
                      <div className="order-col order-status">
                        <span className={`status-badge ${getStatusClass(order.order_status)}`}>
                          {t(`orders.${order.order_status.toLowerCase()}`) || order.order_status}
                        </span>
                      </div>
                      <div className="order-col order-actions">
                        {order.order_status === "Pending" && (
                          <button
                            className="order-cancel-btn"
                            onClick={(e) => { e.stopPropagation(); handleCancel(order.id); }}
                          >
                            {t("orders.cancel")}
                          </button>
                        )}
                      </div>
                    </div>

                    {expandedOrder === order.id && orderItems[order.id] && (
                      <div className="order-details">
                        {orderItems[order.id].length === 0 ? (
                          <p className="account-empty">{t("common.noData")}</p>
                        ) : (
                          orderItems[order.id].map((item, idx) => (
                            <div key={idx} className="order-detail-row">
                              <img
                                src={`${API}${item.main_image}`}
                                alt={item.product_name}
                                className="order-detail-img"
                                onError={(e) => { e.target.src = "https://via.placeholder.com/56"; }}
                              />
                              <div className="order-detail-info">
                                <p className="order-detail-name">{item.product_name}</p>
                                <p className="order-detail-meta">Qty: {item.quantity} × {order.currency === "INR" ? "₹" : "$"}{Number(item.price).toFixed(2)}</p>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
