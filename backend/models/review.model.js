import db from "../config/db.js";

export const getAllReviews = () => db.promise().query(
  "SELECT r.*, p.product_name FROM reviews r LEFT JOIN products p ON r.product_id = p.id ORDER BY r.sort_order ASC, r.id ASC"
);
export const getActiveReviews = () => db.promise().query(
  "SELECT r.*, p.product_name FROM reviews r LEFT JOIN products p ON r.product_id = p.id WHERE r.status = 'active' ORDER BY r.sort_order ASC, r.id ASC"
);
export const getReviewsByProduct = (productId) => db.promise().query(
  "SELECT r.*, p.product_name FROM reviews r LEFT JOIN products p ON r.product_id = p.id WHERE r.product_id = ? AND r.status = 'active' ORDER BY r.sort_order ASC, r.id ASC",
  [productId]
);
export const getReviewById = (id) => db.promise().query(
  "SELECT r.*, p.product_name FROM reviews r LEFT JOIN products p ON r.product_id = p.id WHERE r.id = ?", [id]
);

export const createReview = (d) => {
  return db.promise().query(
    "INSERT INTO reviews (name, role, text, rating, avatar, sort_order, status, product_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
    [d.name, d.role, d.text, d.rating || 5, d.avatar || '/images/user-1.webp', d.sort_order || 0, d.status || 'active', d.product_id || null]
  );
};

export const updateReview = (id, d) => {
  return db.promise().query(
    "UPDATE reviews SET name=?, role=?, text=?, rating=?, avatar=?, sort_order=?, status=?, product_id=? WHERE id=?",
    [d.name, d.role, d.text, d.rating, d.avatar, d.sort_order, d.status, d.product_id || null, id]
  );
};

export const deleteReview = (id) => db.promise().query("DELETE FROM reviews WHERE id = ?", [id]);
