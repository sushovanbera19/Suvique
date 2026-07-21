import { useEffect, useRef } from "react";

const API = "http://localhost:5000/api/payments";
const FRONTEND = "http://localhost:5173";

function getToken() {
  return localStorage.getItem("token");
}

// ─── Load external scripts ────────────────────────────

function loadScript(src) {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) return resolve();
    const s = document.createElement("script");
    s.src = src;
    s.onload = resolve;
    s.onerror = reject;
    document.head.appendChild(s);
  });
}

// ─── Stripe ───────────────────────────────────────────

export async function payWithStripe({ orderId, amount, currency, items, onSuccess, onError }) {
  try {
    const res = await fetch(`${API}/stripe/create-session`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
      body: JSON.stringify({
        order_id: orderId,
        amount,
        currency,
        items,
        success_url: `${FRONTEND}/payment/success`,
        cancel_url: `${FRONTEND}/payment/fail`,
      }),
    });
    const data = await res.json();
    if (data.success && data.url) {
      window.location.href = data.url;
    } else {
      onError?.(data.message || "Failed to create Stripe session");
    }
  } catch (err) {
    onError?.(err.message);
  }
}

export async function verifyStripe({ sessionId, orderId }) {
  const res = await fetch(`${API}/stripe/verify?session_id=${sessionId}&order_id=${orderId}`);
  return res.json();
}

// ─── Razorpay ─────────────────────────────────────────

export async function payWithRazorpay({ orderId, amount, currency, customerName, customerEmail, customerPhone, onSuccess, onError }) {
  try {
    await loadScript("https://checkout.razorpay.com/v1/checkout.js");

    const res = await fetch(`${API}/razorpay/create-order`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
      body: JSON.stringify({ order_id: orderId, amount, currency }),
    });
    const data = await res.json();
    if (!data.success) return onError?.(data.message);

    const options = {
      key: data.key,
      amount: data.amount,
      currency: data.currency,
      name: "Suvique",
      description: `Order #${orderId}`,
      order_id: data.orderId,
      handler: async function (response) {
        try {
          const verifyRes = await fetch(`${API}/razorpay/verify`, {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              order_id: orderId,
            }),
          });
          const verifyData = await verifyRes.json();
          if (verifyData.success) {
            onSuccess?.();
          } else {
            onError?.("Payment verification failed");
          }
        } catch (err) {
          onError?.(err.message);
        }
      },
      prefill: {
        name: customerName || "",
        email: customerEmail || "",
        contact: customerPhone || "",
      },
      theme: { color: "#111" },
      modal: {
        ondismiss: function () {
          onError?.("Payment cancelled");
        },
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.on("payment.failed", function (response) {
      onError?.(response.error?.description || "Payment failed");
    });
    rzp.open();
  } catch (err) {
    onError?.(err.message);
  }
}

// ─── PayPal ───────────────────────────────────────────

export async function payWithPayPal({ orderId, amount, currency, onSuccess, onError }) {
  try {
    const res = await fetch(`${API}/paypal/create-order`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
      body: JSON.stringify({ order_id: orderId, amount, currency }),
    });
    const data = await res.json();
    if (data.success && data.approvalUrl) {
      window.location.href = data.approvalUrl;
    } else {
      onError?.(data.message || "Failed to create PayPal order");
    }
  } catch (err) {
    onError?.(err.message);
  }
}

export async function capturePayPal({ paypalOrderId, orderId }) {
  const res = await fetch(`${API}/paypal/capture`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
    body: JSON.stringify({ paypalOrderId, order_id: orderId }),
  });
  return res.json();
}

// ─── Map payment method to gateway ────────────────────

const METHOD_GATEWAY_MAP = {
  card: "stripe",
  apple_pay: "stripe",
  google_pay: "stripe",
  upi: "razorpay",
  net_banking: "razorpay",
  razorpay: "razorpay",
  paypal: "paypal",
};

export function getGatewayForMethod(methodId) {
  return METHOD_GATEWAY_MAP[methodId] || null;
}

// ─── React hook to load Razorpay script ──────────────

export function useRazorpayScript() {
  useEffect(() => {
    loadScript("https://checkout.razorpay.com/v1/checkout.js").catch(() => {});
  }, []);
}
