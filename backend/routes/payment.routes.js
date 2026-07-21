import { Router } from "express";
import {
  createStripeSession,
  verifyStripeSession,
  createRazorpayOrder,
  verifyRazorpayPayment,
  createPayPalOrder,
  capturePayPalOrder,
} from "../controllers/payment.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/stripe/create-session", verifyToken, createStripeSession);
router.get("/stripe/verify", verifyStripeSession);

router.post("/razorpay/create-order", verifyToken, createRazorpayOrder);
router.post("/razorpay/verify", verifyToken, verifyRazorpayPayment);

router.post("/paypal/create-order", verifyToken, createPayPalOrder);
router.post("/paypal/capture", verifyToken, capturePayPalOrder);

export default router;
