import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { verifyStripe, capturePayPal } from "../utils/paymentGateway";
import { toastSuccess, toastError } from "../utils/toast";
import AccountHeader from "../components/AccountHeader";
import "../assets/style/CheckoutForm.css";

export default function PaymentResult() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("processing");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const provider = searchParams.get("provider") || searchParams.get("session_id") ? "stripe" : null;
    const orderId = searchParams.get("order_id");

    async function handlePayment() {
      try {
        if (provider === "paypal" || searchParams.get("provider") === "paypal") {
          const paypalOrderId = searchParams.get("token");
          if (paypalOrderId && orderId) {
            const res = await capturePayPal({ paypalOrderId, orderId: orderId });
            if (res.success) {
              setStatus("success");
              setMessage("Payment successful! Your order has been confirmed.");
              toastSuccess("Payment successful!");
              setTimeout(() => { window.location.href = `/thank-you?order_id=${orderId}`; }, 1500);
            } else {
              setStatus("failed");
              setMessage(res.message || "Payment capture failed.");
              toastError("Payment failed");
            }
          }
        } else if (searchParams.get("session_id")) {
          const sessionId = searchParams.get("session_id");
          if (sessionId && orderId) {
            const res = await verifyStripe({ sessionId, orderId });
            if (res.success) {
              setStatus("success");
              setMessage("Payment successful! Your order has been confirmed.");
              toastSuccess("Payment successful!");
              setTimeout(() => { window.location.href = `/thank-you?order_id=${orderId}`; }, 1500);
            } else {
              setStatus("failed");
              setMessage(res.message || "Payment verification failed.");
              toastError("Payment failed");
            }
          }
        } else {
          setStatus("failed");
          setMessage("Invalid payment response.");
        }
      } catch (err) {
        setStatus("failed");
        setMessage(err.message || "Payment processing error.");
        toastError("Payment error");
      }
    }

    handlePayment();
  }, [searchParams]);

  return (
    <>
      <AccountHeader title="Payment Result" breadcrumb="Home → Payment" />
      <div style={{ maxWidth: 600, margin: "80px auto", textAlign: "center", padding: "0 20px" }}>
        {status === "processing" && (
          <div>
            <div style={{ fontSize: 48, marginBottom: 16 }}>⏳</div>
            <h2>Processing payment...</h2>
            <p style={{ color: "#666" }}>Please wait while we verify your payment.</p>
          </div>
        )}
        {status === "success" && (
          <div>
            <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
            <h2 style={{ color: "#2e7d32" }}>Payment Successful!</h2>
            <p style={{ color: "#666", marginBottom: 24 }}>{message}</p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
              <button onClick={() => navigate("/my-orders")} style={{ padding: "12px 28px", background: "#111", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontSize: 14 }}>
                View My Orders
              </button>
              <button onClick={() => navigate("/")} style={{ padding: "12px 28px", background: "#f5f5f5", color: "#111", border: "1px solid #ddd", borderRadius: 8, cursor: "pointer", fontSize: 14 }}>
                Continue Shopping
              </button>
            </div>
          </div>
        )}
        {status === "failed" && (
          <div>
            <div style={{ fontSize: 48, marginBottom: 16 }}>❌</div>
            <h2 style={{ color: "#d32f2f" }}>Payment Failed</h2>
            <p style={{ color: "#666", marginBottom: 24 }}>{message}</p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
              <button onClick={() => navigate("/checkout")} style={{ padding: "12px 28px", background: "#111", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontSize: 14 }}>
                Try Again
              </button>
              <button onClick={() => navigate("/")} style={{ padding: "12px 28px", background: "#f5f5f5", color: "#111", border: "1px solid #ddd", borderRadius: 8, cursor: "pointer", fontSize: 14 }}>
                Back to Home
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
