import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useTranslation } from "../context/LanguageContext";
import AccountHeader from "../components/AccountHeader";
import "../assets/style/CheckoutForm.css";
import "../assets/style/ThankYou.css";

const API = "http://localhost:5000";

export default function ThankYou() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const orderId = searchParams.get("order_id");
  const [order, setOrder] = useState(null);
  const [items, setItems] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!orderId) return;
    const fetchOrder = async () => {
      try {
        const res = await fetch(`${API}/api/orders/${orderId}/status`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.success) {
          setOrder(data.data);
          setItems(data.data.items || []);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchOrder();
  }, [orderId]);

  return (
    <>
      <AccountHeader title={t("thankyou.title") || "Thank You"} breadcrumb={`${t("breadcrumb.home")} → ${t("thankyou.title") || "Thank You"}`} />

      <div className="thankyou-page">
        <div className="thankyou-card">
          <div className="thankyou-checkmark">
            <svg viewBox="0 0 80 80" className="thankyou-circle">
              <circle cx="40" cy="40" r="36" fill="none" stroke="#4caf50" strokeWidth="4" className="thankyou-circle-bg" />
              <path d="M24 40 L35 51 L56 30" fill="none" stroke="#4caf50" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className="thankyou-check" />
            </svg>
          </div>

          <h1 className="thankyou-title">{t("thankyou.heading") || "Thank You For Your Order!"}</h1>
          <p className="thankyou-subtitle">
            {t("thankyou.subtitle") || "Your order has been placed successfully."}
          </p>

          {orderId && (
            <div className="thankyou-order-id">
              {t("thankyou.orderNumber") || "Order Number"}: <strong>#{orderId}</strong>
            </div>
          )}

          {order && (
            <div className="thankyou-summary">
              <div className="thankyou-row">
                <span>{t("thankyou.paymentStatus") || "Payment Status"}</span>
                <span className={`thankyou-badge ${order.payment_status === "Paid" ? "paid" : "pending"}`}>
                  {order.payment_status}
                </span>
              </div>
              <div className="thankyou-row">
                <span>{t("thankyou.orderStatus") || "Order Status"}</span>
                <span>{order.order_status}</span>
              </div>
              <div className="thankyou-row">
                <span>{t("thankyou.total") || "Total"}</span>
                <span className="thankyou-total">
                  {order.currency === "INR" ? "₹" : "$"}{Number(order.total).toFixed(2)}
                </span>
              </div>
            </div>
          )}

          {items.length > 0 && (
            <div className="thankyou-items">
              <h3>{t("thankyou.itemsOrdered") || "Items Ordered"}</h3>
              {items.map((item, idx) => (
                <div key={idx} className="thankyou-item">
                  <img
                    src={`${API}/${(item.main_image || "").replace(/\\/g, "/")}`}
                    alt={item.product_name}
                    className="thankyou-item-img"
                    onError={(e) => { e.target.src = "https://via.placeholder.com/60"; }}
                  />
                  <div className="thankyou-item-info">
                    <p className="thankyou-item-name">{item.product_name}</p>
                    {(item.color_code || item.size) && (
                      <div className="thankyou-item-variant">
                        {item.color_code && (
                          <span className="thankyou-variant-color">
                            <span className="thankyou-variant-dot" style={{ backgroundColor: item.color_code }} />
                            {item.color_code}
                          </span>
                        )}
                        {item.size && (
                          <span className="thankyou-variant-size">{item.size}</span>
                        )}
                      </div>
                    )}
                    <p className="thankyou-item-qty">
                      {t("orders.qty") || "Qty"}: {item.quantity} × {order?.currency === "INR" ? "₹" : "$"}{Number(item.price).toFixed(2)}
                    </p>
                  </div>
                  <div className="thankyou-item-price">
                    {order?.currency === "INR" ? "₹" : "$"}{(item.quantity * item.price).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="thankyou-message">
            <p>{t("thankyou.emailNotice") || "A confirmation email will be sent to your registered email address."}</p>
          </div>

          <div className="thankyou-actions">
            <button className="thankyou-btn primary" onClick={() => navigate("/my-orders")}>
              {t("thankyou.viewOrders") || "View My Orders"}
            </button>
            <button className="thankyou-btn secondary" onClick={() => navigate("/Shop-1")}>
              {t("thankyou.continueShopping") || "Continue Shopping"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
