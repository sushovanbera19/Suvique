import db from "../config/db.js";

// Get Cart Items
export const getCartItems = (userId) => {
  return new Promise((resolve, reject) => {

    const sql = `
      SELECT
        c.product_id,
        c.quantity,
        p.base_price
      FROM cart c
      JOIN products p
      ON c.product_id = p.id
      WHERE c.user_id = ?
    `;

    db.query(sql, [userId], (err, result) => {
      if (err) return reject(err);

      resolve(result);
    });

  });
};

// Create Order
export const createOrder = (userId, addressId, total, paymentMethod, country = "India", currency = "INR") => {
  return new Promise((resolve, reject) => {
    const sql = `INSERT INTO orders (user_id, address_id, total, payment_method, payment_status, order_status, country, currency) VALUES (?, ?, ?, ?, 'Pending', 'Pending', ?, ?)`;

    db.query(sql, [userId, addressId, total, paymentMethod, country, currency],
      (err, result) => {

        if (err) return reject(err);

        resolve(result.insertId);

      }
    );

  });

};

// Insert Order Items
export const createOrderItems = (
  orderId,
  cartItems
) => {

  return new Promise((resolve, reject) => {

    const values = cartItems.map(item => [

      orderId,
      item.product_id,
      item.quantity,
      item.base_price

    ]);

    const sql = `
      INSERT INTO order_items
      (
        order_id,
        product_id,
        quantity,
        price
      )
      VALUES ?
    `;

    db.query(sql, [values], (err) => {

      if (err) return reject(err);

      resolve();

    });

  });

};

// Clear Cart
export const clearCart = (userId) => {

  return new Promise((resolve, reject) => {

    db.query(
      "DELETE FROM cart WHERE user_id=?",
      [userId],
      (err) => {

        if (err) return reject(err);

        resolve();

      }
    );

  });

};


// All Orders
export const getAllOrders = (callback) => {

    const sql = `
        SELECT
            o.id,
            o.created_at,
            o.total,
            o.payment_method,
            o.payment_status,
            o.order_status,
            o.country,
            o.currency,

            u.name AS customer_name,
            u.email,

            ua.phone,
            ua.city,
            ua.country,
            ua.street,
            ua.zip_code,

            COUNT(oi.id) AS total_items

        FROM orders o

        LEFT JOIN users u
            ON o.user_id = u.id

        LEFT JOIN user_addresses ua
            ON o.address_id = ua.id

        LEFT JOIN order_items oi
            ON o.id = oi.order_id

        GROUP BY o.id

        ORDER BY o.created_at DESC
    `;

    db.query(sql, callback);

};

export const getOrderDetails = (orderId, callback) => {

    const sql = `
        SELECT

            oi.quantity,
            oi.price,

            p.product_name,
            p.main_image,
            p.sku

        FROM order_items oi

        JOIN products p
            ON oi.product_id = p.id

        WHERE oi.order_id=?
    `;

    db.query(sql,[orderId],callback);

};

// Delete order items
export const deleteOrderItems = (orderId) => {
  return new Promise((resolve, reject) => {
    db.query("DELETE FROM order_items WHERE order_id = ?", [orderId], (err) => {
      if (err) return reject(err);
      resolve();
    });
  });
};

// Delete order
export const deleteOrderById = (orderId) => {
  return new Promise((resolve, reject) => {
    db.query("DELETE FROM orders WHERE id = ?", [orderId], (err) => {
      if (err) return reject(err);
      resolve();
    });
  });
};

// Update order
export const updateOrder = (orderId, payment_status, order_status, payment_method) => {
  return new Promise((resolve, reject) => {
    const sql = "UPDATE orders SET payment_status = ?, order_status = ?, payment_method = ? WHERE id = ?";
    db.query(sql, [payment_status, order_status, payment_method, orderId], (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

// Get single order by id (with status)
export const getOrderWithStatus = (orderId) => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT id, user_id, total, payment_method, payment_status, order_status, country, currency, created_at FROM orders WHERE id = ?";
    db.query(sql, [orderId], (err, result) => {
      if (err) return reject(err);
      resolve(result[0]);
    });
  });
};

// Get orders by user id (numeric)
export const getOrdersByUserId = (userId) => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT
        o.id,
        o.created_at,
        o.total,
        o.payment_method,
        o.payment_status,
        o.order_status,
        o.country,
        o.currency,
        COUNT(oi.id) AS total_items
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      WHERE o.user_id = ?
      GROUP BY o.id
      ORDER BY o.created_at DESC
    `;
    db.query(sql, [userId], (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

// Cancel order (only if Pending)
export const cancelOrderById = (orderId, userId) => {
  return new Promise((resolve, reject) => {
    const sql = "UPDATE orders SET order_status = 'Cancelled', payment_status = 'Cancelled' WHERE id = ? AND user_id = ? AND order_status = 'Pending'";
    db.query(sql, [orderId, userId], (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};