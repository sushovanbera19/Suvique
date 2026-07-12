import db from "../config/db.js";

// Add to wishlist
export const addWishlist = (userId, productId, callback) => {
  const checkSql = `
    SELECT * FROM wishlist
    WHERE user_id = ? AND product_id = ?
  `;

  db.query(checkSql, [userId, productId], (err, rows) => {
    if (err) return callback(err);

    if (rows.length > 0) {
      return callback(null, {
        alreadyExists: true,
      });
    }

    const insertSql = `
      INSERT INTO wishlist (user_id, product_id)
      VALUES (?, ?)
    `;

    db.query(insertSql, [userId, productId], callback);
  });
};

// Get user's wishlist
export const getWishlist = (userId, callback) => {
  const sql = `
    SELECT
      w.id,
      p.id AS product_id,
      p.product_name,
      p.base_price,
      p.quantity,
      p.main_image
    FROM wishlist w
    JOIN products p
      ON w.product_id = p.id
    WHERE w.user_id = ?
    ORDER BY w.created_at DESC
  `;

  db.query(sql, [userId], callback);
};

// Remove from wishlist
export const removeWishlist = (userId, productId, callback) => {
  const sql = `
    DELETE FROM wishlist
    WHERE user_id = ? AND product_id = ?
  `;

  db.query(sql, [userId, productId], callback);
};