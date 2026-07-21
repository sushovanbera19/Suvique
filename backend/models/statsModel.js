import db from "../config/db.js";

// Total counts
export const getCounts = () => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT
        (SELECT COUNT(*) FROM users) AS totalUsers,
        (SELECT COUNT(*) FROM orders) AS totalOrders,
        (SELECT COUNT(*) FROM products) AS totalProducts,
        (SELECT COALESCE(SUM(total), 0) FROM orders WHERE payment_status = 'Paid') AS totalRevenue,
        (SELECT COALESCE(SUM(total), 0) FROM orders WHERE payment_status = 'Paid' AND MONTH(created_at) = MONTH(CURRENT_DATE()) AND YEAR(created_at) = YEAR(CURRENT_DATE())) AS monthRevenue,
        (SELECT COUNT(*) FROM orders WHERE order_status = 'Pending') AS pendingOrders,
        (SELECT COUNT(*) FROM orders WHERE order_status = 'Confirmed' AND MONTH(created_at) = MONTH(CURRENT_DATE()) AND YEAR(created_at) = YEAR(CURRENT_DATE()) ) AS monthOrders,
        (SELECT COUNT(*) FROM reviews) AS totalReviews
    `;
    db.query(sql, (err, result) => {
      if (err) return reject(err);
      resolve(result[0]);
    });
  });
};

// Monthly revenue for chart (last 12 months)
export const getMonthlyRevenue = () => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT
        DATE_FORMAT(created_at, '%b') AS month,
        MONTH(created_at) AS monthNum,
        COALESCE(SUM(total), 0) AS value
      FROM orders
      WHERE payment_status = 'Paid'
        AND created_at >= DATE_SUB(CURRENT_DATE(), INTERVAL 12 MONTH)
      GROUP BY YEAR(created_at), MONTH(created_at)
      ORDER BY YEAR(created_at), MONTH(created_at)
    `;
    db.query(sql, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

// Recent orders (last 5)
export const getRecentOrders = () => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT
        o.id,
        o.total,
        o.order_status,
        o.payment_status,
        o.payment_method,
        o.created_at,
        u.name AS customer_name
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.id
      ORDER BY o.created_at DESC
      LIMIT 5
    `;
    db.query(sql, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

// All products with full details
export const getTopSellingProducts = () => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT
        p.id,
        p.product_name,
        p.description,
        p.main_image,
        p.gallery_images,
        p.sku,
        p.base_price,
        p.sale_price,
        p.quantity AS stock,
        p.vat,
        p.width,
        p.height,
        p.weight,
        p.shipping_cost,
        p.tags,
        p.status,
        c.category_name,
        sc.subcategory_name,
        COALESCE(SUM(oi.quantity), 0) AS totalSold
      FROM products p
      LEFT JOIN order_items oi ON p.id = oi.product_id
      LEFT JOIN product_category c ON p.category_id = c.category_id
      LEFT JOIN product_subcategory sc ON p.sub_category_id = sc.subcategory_id
      GROUP BY p.id
      ORDER BY totalSold DESC
    `;
    db.query(sql, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

// Top customers by order count
export const getTopCustomers = () => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT
        u.id,
        u.name,
        u.email,
        COUNT(o.id) AS orderCount,
        COALESCE(SUM(o.total), 0) AS totalSpent
      FROM users u
      LEFT JOIN orders o ON u.id = o.user_id
      GROUP BY u.id
      ORDER BY orderCount DESC
      LIMIT 5
    `;
    db.query(sql, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

// Orders by status breakdown
export const getOrdersByStatus = () => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT
        order_status,
        COUNT(*) AS count
      FROM orders
      GROUP BY order_status
    `;
    db.query(sql, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};
