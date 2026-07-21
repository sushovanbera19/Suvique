import db from "../config/db.js";

// Add to cart
export const addCart = (userId, productId, variationId, callback) => {

  const checkSql = `
    SELECT * FROM cart
    WHERE user_id = ? AND product_id = ? AND variation_id <=> ?
  `;

  db.query(checkSql, [userId, productId, variationId || null], (err, rows) => {
    if (err) return callback(err);

    if (rows.length > 0) {

      const updateSql = `
        UPDATE cart
        SET quantity = quantity + 1
        WHERE user_id = ? AND product_id = ? AND variation_id <=> ?
      `;

      return db.query(updateSql, [userId, productId, variationId || null], callback);
    }

    const insertSql = `
      INSERT INTO cart (user_id, product_id, variation_id, quantity)
      VALUES (?, ?, ?, 1)
    `;

    db.query(insertSql, [userId, productId, variationId || null], callback);
  });

};

// Get cart
export const getCart = (userId, callback) => {
  const sql = `
    SELECT
      c.id,
      c.quantity,
      c.variation_id,
      p.id AS product_id,
      p.product_name,
      p.base_price,
      p.main_image,
      pv.color_code,
      pv.size,
      pvm.price AS variant_price
    FROM cart c
    JOIN products p ON c.product_id = p.id
    LEFT JOIN product_variation_map pvm ON c.variation_id = pvm.variation_id AND c.product_id = pvm.product_id
    LEFT JOIN product_variation pv ON c.variation_id = pv.variation_id
    WHERE c.user_id = ?
  `;

  db.query(sql, [userId], callback);
};

// Remove from cart
export const removeCart = (userId, productId, variationId, callback) => {
  const sql = `
    DELETE FROM cart
    WHERE user_id = ? AND product_id = ? AND variation_id <=> ?
  `;

  db.query(sql, [userId, productId, variationId || null], callback);
};

// Update cart quantity
export const updateCartQuantity = (userId, cartId, quantity, callback) => {
  const sql = `
    UPDATE cart SET quantity = ? WHERE id = ? AND user_id = ?
  `;
  db.query(sql, [quantity, cartId, userId], callback);
};