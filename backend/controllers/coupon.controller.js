import { findCouponByCode } from "../models/coupon.model.js";

export const validateCoupon = (req, res) => {
  const { code, subtotal } = req.body;
  if (!code) return res.status(400).json({ success: false, message: "Coupon code required" });

  findCouponByCode(code.trim().toUpperCase(), (err, results) => {
    if (err) return res.status(500).json({ success: false, message: err.message });
    if (!results || results.length === 0) {
      return res.status(404).json({ success: false, message: "Invalid coupon code" });
    }

    const coupon = results[0];
    const now = new Date();

    if (coupon.expires_at && new Date(coupon.expires_at) < now) {
      return res.status(400).json({ success: false, message: "Coupon has expired" });
    }
    if (coupon.max_uses && coupon.used_count >= coupon.max_uses) {
      return res.status(400).json({ success: false, message: "Coupon usage limit reached" });
    }
    if (coupon.min_order > 0 && Number(subtotal || 0) < coupon.min_order) {
      return res.status(400).json({
        success: false,
        message: `Minimum order of ${coupon.min_order} required`,
      });
    }

    let discount = 0;
    if (coupon.discount_type === "percentage") {
      discount = (Number(subtotal) * coupon.discount_value) / 100;
    } else {
      discount = coupon.discount_value;
    }

    return res.json({
      success: true,
      data: {
        code: coupon.code,
        discount_type: coupon.discount_type,
        discount_value: coupon.discount_value,
        discount: Number(discount.toFixed(2)),
      },
    });
  });
};
