import Stripe from "stripe";
import Razorpay from "razorpay";
import paypal from "@paypal/checkout-server-sdk";
import crypto from "crypto";
import { updateOrderPaymentStatus } from "../models/orderModel.js";

let _stripe = null;
let _razorpay = null;

function getStripe() {
  if (!_stripe) _stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  return _stripe;
}

function getRazorpay() {
  if (!_razorpay) {
    _razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
  }
  return _razorpay;
}

function paypalClient() {
  const env =
    process.env.PAYPAL_MODE === "live"
      ? new paypal.core.LiveEnvironment(
          process.env.PAYPAL_CLIENT_ID,
          process.env.PAYPAL_CLIENT_SECRET
        )
      : new paypal.core.SandboxEnvironment(
          process.env.PAYPAL_CLIENT_ID,
          process.env.PAYPAL_CLIENT_SECRET
        );
  return new paypal.core.PayPalHttpClient(env);
}

const CURRENCY_MAP = {
  USD: "usd", EUR: "eur", GBP: "gbp", INR: "inr", JPY: "jpy",
  CAD: "cad", AUD: "aud", SEK: "sek", PLN: "pln", BRL: "brl",
  THB: "thb", SGD: "sgd", MYR: "myr", IDR: "idr", BDT: "bdt",
  SAR: "sar", AED: "aed", KRW: "krw", CNY: "cny", MXN: "mxn",
  NZD: "nzd", CHF: "chf", NOK: "nok", DKK: "dkk", CZK: "czk",
  RON: "ron",
};

function getStripeCurrency(code) {
  return CURRENCY_MAP[(code || "USD").toUpperCase()] || "usd";
}

// ─── STRIPE ───────────────────────────────────────────

export const createStripeSession = async (req, res) => {
  try {
    const { order_id, amount, currency, items, success_url, cancel_url } = req.body;

    const line_items = (items || []).map((item) => ({
      price_data: {
        currency: getStripeCurrency(currency),
        product_data: { name: item.name, images: item.image ? [item.image] : [] },
        unit_amount: Math.round(Number(item.price) * 100),
      },
      quantity: item.quantity,
    }));

    const session = await getStripe().checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items,
      metadata: { order_id: String(order_id) },
      success_url: `${success_url}?session_id={CHECKOUT_SESSION_ID}&order_id=${order_id}`,
      cancel_url: `${cancel_url}?order_id=${order_id}`,
    });

    res.json({ success: true, sessionId: session.id, url: session.url });
  } catch (err) {
    console.error("Stripe session error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

export const verifyStripeSession = async (req, res) => {
  try {
    const { session_id, order_id } = req.query;
    const session = await getStripe().checkout.sessions.retrieve(session_id);

    if (session.payment_status === "paid") {
      await updateOrderPaymentStatus(order_id, "Paid", "Confirmed");
      return res.json({ success: true, message: "Payment verified" });
    }

    res.json({ success: false, message: "Payment not completed" });
  } catch (err) {
    console.error("Stripe verify error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── RAZORPAY ─────────────────────────────────────────

export const createRazorpayOrder = async (req, res) => {
  try {
    const { order_id, amount, currency } = req.body;

    const razorpayOrder = await getRazorpay().orders.create({
      amount: Math.round(Number(amount) * 100),
      currency: currency || "INR",
      receipt: `order_${order_id}`,
      notes: { order_id: String(order_id) },
    });

    res.json({
      success: true,
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (err) {
    console.error("Razorpay order error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

export const verifyRazorpayPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, order_id } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSig = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSig === razorpay_signature) {
      await updateOrderPaymentStatus(order_id, "Paid", "Confirmed");
      return res.json({ success: true, message: "Payment verified" });
    }

    res.status(400).json({ success: false, message: "Payment verification failed" });
  } catch (err) {
    console.error("Razorpay verify error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── PAYPAL ───────────────────────────────────────────

export const createPayPalOrder = async (req, res) => {
  try {
    const { order_id, amount, currency } = req.body;

    const request = new paypal.orders.OrdersCreateRequest();
    request.prefer("return=representation");
    request.requestBody({
      intent: "CAPTURE",
      purchase_units: [
        {
          reference_id: String(order_id),
          amount: {
            currency_code: currency || "USD",
            value: Number(amount).toFixed(2),
          },
        },
      ],
      application_context: {
        return_url: `${process.env.FRONTEND_URL}/payment/success?provider=paypal&order_id=${order_id}`,
        cancel_url: `${process.env.FRONTEND_URL}/payment/fail?order_id=${order_id}`,
      },
    });

    const client = paypalClient();
    const response = await client.execute(request);

    const approvalUrl = response.result.links.find((l) => l.rel === "approve")?.href;

    res.json({
      success: true,
      orderId: response.result.id,
      approvalUrl,
    });
  } catch (err) {
    console.error("PayPal create error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

export const capturePayPalOrder = async (req, res) => {
  try {
    const { paypalOrderId, order_id } = req.body;

    const request = new paypal.orders.OrdersCaptureRequest(paypalOrderId);
    const client = paypalClient();
    const response = await client.execute(request);

    if (response.result.status === "COMPLETED") {
      await updateOrderPaymentStatus(order_id, "Paid", "Confirmed");
      return res.json({ success: true, message: "Payment captured" });
    }

    res.json({ success: false, message: "Payment not completed" });
  } catch (err) {
    console.error("PayPal capture error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};
