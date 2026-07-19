import db from "../config/db.js";

export const findCouponByCode = (code, callback) => {
  db.query("SELECT * FROM coupons WHERE code = ? AND status = 'active'", [code], callback);
};
