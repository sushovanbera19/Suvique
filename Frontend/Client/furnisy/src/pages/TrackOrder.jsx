import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import AccountHeader from "../Common/AccountHeader";
import { useTranslation } from "../context/LanguageContext";
import "../assets/style/AccountPages.css";

const API = "http://localhost:5000";

const STATUS_STEPS = ["Pending", "Processing", "Shipped", "Delivered"];

const STEP_ICONS = {
  Pending: "📋",
  Processing: "⚙️",
  Shipped: "🚚",
  Delivered: "✓",
};

export default function TrackOrder() {
  const { t, lang } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = localStorage.getItem("token");

  const [orderId, setOrderId] = useState(searchParams.get("id") || "");
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const idFromUrl = searchParams.get("id");
    if (idFromUrl) {
      setOrderId(idFromUrl);
      trackOrder(idFromUrl);
    }
  }, [searchParams.get("id")]);

  const trackOrder = async (id) => {
    if (!id.trim()) return;
    setLoading(true);
    setError("");
    setOrder(null);
    try {
      const res = await fetch(`${API}/api/orders/${id.trim()}/status`);
      const data = await res.json();
      if (data.success) {
        setOrder(data.data);
      } else {
        setError(t("track.notFound"));
      }
    } catch {
      setError(t("track.notFound"));
    } finally {
      setLoading(false);
    }
  };

  const handleTrack = (e) => {
    e.preventDefault();
    trackOrder(orderId);
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

  return (
    <>
      <AccountHeader title={t("track.title")} breadcrumb={`${t("breadcrumb.home")} → ${t("breadcrumb.trackOrder")}`} />
      <div className="account-page">
        <div className="account-page-container">
          <div className="account-card track-card">
            <div className="track-header">
              <h2>{t("track.title")}</h2>
              <p className="track-subtitle">{t("track.hint")}</p>
            </div>

            <form onSubmit={handleTrack} className="track-form">
              <div className="track-input-wrap">
                <span className="track-input-icon">🔍</span>
                <input
                  type="text"
                  placeholder={t("track.placeholder")}
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  className="track-input"
                />
              </div>
              <button type="submit" className="track-submit-btn" disabled={loading || !orderId.trim()}>
                {loading ? <span className="track-btn-spinner" /> : t("track.track")}
              </button>
            </form>

            {error && (
              <div className="track-error">
                <span className="track-error-icon">⚠</span>
                {error}
              </div>
            )}

            {order && (
              <div className="track-result">
                {/* Order Summary Card */}
                <div className="track-summary">
                  <div className="track-summary-row">
                    <div className="track-summary-item">
                      <span className="track-summary-label">{t("orders.orderId") || "Order ID"}</span>
                      <span className="track-summary-value">#{order.id}</span>
                    </div>
                    <div className="track-summary-item">
                      <span className="track-summary-label">{t("orders.date") || "Placed on"}</span>
                      <span className="track-summary-value">{formatDate(order.created_at)}</span>
                    </div>
                    <div className="track-summary-item">
                      <span className="track-summary-label">{t("orders.total") || "Total"}</span>
                      <span className="track-summary-value track-summary-price">
                        {order.currency === "INR" ? "₹" : "$"}{Number(order.total).toFixed(2)}
                      </span>
                    </div>
                    <div className="track-summary-item">
                      <span className="track-summary-label">{t("orders.status") || "Status"}</span>
                      <span className={`order-status-badge status-${(order.order_status || "").toLowerCase()}`}>
                        {t(`orders.${order.order_status.toLowerCase()}`) || order.order_status}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Vertical Timeline — Flipkart/Amazon Style */}
                {order.order_status === "Cancelled" ? (
                  <div className="track-cancelled-card">
                    <div className="track-cancelled-icon">✕</div>
                    <div className="track-cancelled-text">
                      <h3>{t("orders.cancelledStatus")}</h3>
                      <p>{t("track.cancelledMessage") || "This order has been cancelled."}</p>
                    </div>
                  </div>
                ) : (
                  <div className="track-vertical-timeline">
                    {STATUS_STEPS.map((step, idx) => {
                      const active = idx <= getStepIndex(order.order_status);
                      const isCurrent = idx === getStepIndex(order.order_status);
                      return (
                        <div key={step} className={`track-v-step ${active ? "active" : ""} ${isCurrent ? "current" : ""}`}>
                          <div className="track-v-step-left">
                            <div className="track-v-step-icon">
                              {active ? STEP_ICONS[step] : ""}
                            </div>
                            {idx < STATUS_STEPS.length - 1 && <div className="track-v-step-line" />}
                          </div>
                          <div className="track-v-step-right">
                            <div className="track-v-step-label">{t(`orders.${step.toLowerCase()}`) || step}</div>
                            {isCurrent && (
                              <div className="track-v-step-current">{t("track.currentStatus") || "Current Status"}</div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Order Items */}
                {order.items && order.items.length > 0 && (
                  <div className="track-items-section">
                    <h3 className="track-items-heading">{t("track.orderItems") || "Items in this order"}</h3>
                    {order.items.map((item, idx) => (
                      <div key={idx} className="track-item-card" onClick={() => navigate(`/product-details-1/${item.product_id}`)}>
                        <img
                          src={`${API}${item.main_image}`}
                          alt={item.product_name}
                          className="track-item-img"
                          onError={(e) => { e.target.src = "https://via.placeholder.com/64"; }}
                        />
                        <div className="track-item-info">
                          <p className="track-item-name">{item.product_name}</p>
                          <p className="track-item-meta">
                            {t("orders.qty") || "Qty"}: {item.quantity}
                          </p>
                        </div>
                        <div className="track-item-price">
                          {order.currency === "INR" ? "₹" : "$"}{Number(item.price).toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
