import db from "../config/db.js";

// Add to cart
export const addCart = (userId, productId, callback) => {

  const checkSql = `
    SELECT * FROM cart
    WHERE user_id = ? AND product_id = ?
  `;

  db.query(checkSql, [userId, productId], (err, rows) => {
    if (err) return callback(err);

    if (rows.length > 0) {

      const updateSql = `
        UPDATE cart
        SET quantity = quantity + 1
        WHERE user_id = ? AND product_id = ?
      `;

      return db.query(updateSql, [userId, productId], callback);
    }

    const insertSql = `
      INSERT INTO cart (user_id, product_id, quantity)
      VALUES (?, ?, 1)
    `;

    db.query(insertSql, [userId, productId], callback);
  });

};

// Get cart
export const getCart = (userId, callback) => {
  const sql = `
    SELECT
      c.id,
      c.quantity,
      p.id AS product_id,
      p.product_name,
      p.base_price,
      p.main_image
    FROM cart c
    JOIN products p ON c.product_id = p.id
    WHERE c.user_id = ?
  `;

  db.query(sql, [userId], callback);
};

// Remove from cart
export const removeCart = (userId, productId, callback) => {
  const sql = `
    DELETE FROM cart
    WHERE user_id = ? AND product_id = ?
  `;

  db.query(sql, [userId, productId], callback);
};