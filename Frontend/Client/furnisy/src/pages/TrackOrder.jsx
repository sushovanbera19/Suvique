import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AccountHeader from "../Common/AccountHeader";
import { useTranslation } from "../context/LanguageContext";
import "../assets/style/AccountPages.css";

const API = "http://localhost:5000";

export default function TrackOrder() {
  const { t, lang } = useTranslation();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [orderId, setOrderId] = useState("");
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const steps = ["Pending", "Processing", "Shipped", "Delivered"];

  const handleTrack = async (e) => {
    e.preventDefault();
    if (!orderId.trim()) return;
    setLoading(true);
    setError("");
    setOrder(null);

    try {
      const res = await fetch(`${API}/api/orders/${orderId.trim()}/status`);
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

  const getActiveStep = (status) => {
    if (status === "Cancelled") return -1;
    const idx = steps.indexOf(status);
    return idx >= 0 ? idx : 0;
  };

  const formatDate = (d) => {
    const localeMap = { en:"en-US", hi:"hi-IN", fr:"fr-FR", de:"de-DE", es:"es-ES", ar:"ar-SA", zh:"zh-CN", ja:"ja-JP", bn:"bn-BD", th:"th-TH", id:"id-ID", ms:"ms-MY", sv:"sv-SE", pl:"pl-PL", cs:"cs-CZ", ro:"ro-RO", el:"el-GR" };
    return new Date(d).toLocaleDateString(localeMap[lang] || "en-US", { year: "numeric", month: "short", day: "numeric" });
  };

  return (
    <>
      <AccountHeader title={t("track.title")} breadcrumb={`${t("breadcrumb.home")} → ${t("breadcrumb.trackOrder")}`} />
      <div className="account-page">
        <div className="account-page-container">
          <div className="account-card track-card">
            <h2>{t("track.title")}</h2>

            <form onSubmit={handleTrack} className="track-form">
              <input
                type="text"
                placeholder={t("track.placeholder")}
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                className="track-input"
              />
              <button type="submit" className="account-btn" disabled={loading}>
                {loading ? "..." : t("track.track")}
              </button>
            </form>

            {error && <p className="account-msg account-msg-error">{error}</p>}

            {order && (
              <div className="track-result">
                <h3>{t("track.orderStatus")} #{order.id}</h3>

                <div className="track-meta">
                  <span>{formatDate(order.created_at)}</span>
                  <span>{order.currency === "INR" ? "₹" : "$"}{Number(order.total).toFixed(2)}</span>
                  <span className={`status-badge status-${(order.order_status || "").toLowerCase()}`}>
                    {t(`orders.${order.order_status.toLowerCase()}`) || order.order_status}
                  </span>
                </div>

                {order.order_status === "Cancelled" ? (
                  <div className="track-cancelled-msg">{t("orders.cancelledStatus")}</div>
                ) : (
                  <div className="track-timeline">
                    {steps.map((step, idx) => (
                      <div key={step} className={`track-step ${idx <= getActiveStep(order.order_status) ? "active" : ""}`}>
                        <div className="track-step-dot" />
                        <span>{t(`orders.${step.toLowerCase()}`) || step}</span>
                      </div>
                    ))}
                  </div>
                )}

                {order.items && order.items.length > 0 && (
                  <div className="track-items">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="track-item">
                        <img
                          src={`${API}${item.main_image}`}
                          alt={item.product_name}
                          className="track-item-img"
                          onError={(e) => { e.target.src = "https://via.placeholder.com/64"; }}
                        />
                        <div className="track-item-info">
                          <p className="track-item-name">{item.product_name}</p>
                          <p className="track-item-meta">Qty: {item.quantity} x {order.currency === "INR" ? "₹" : "$"}{Number(item.price).toFixed(2)}</p>
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
