import db from "../config/db.js";

// Create newsletter_subscribers table if not exists
const createTableSql = `
  CREATE TABLE IF NOT EXISTS newsletter_subscribers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    status ENUM('active', 'unsubscribed') DEFAULT 'active',
    subscribed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
`;
db.query(createTableSql, (err) => {
  if (err) {
    console.error("Newsletter table creation failed:", err.message);
  } else {
    console.log("Newsletter subscribers table ready");
  }
});

// Subscribe new email
export const subscribeEmail = (email, callback) => {
  const sql = `INSERT INTO newsletter_subscribers (email) VALUES (?)`;
  db.query(sql, [email], callback);
};

// Check if email already exists
export const findSubscriber = (email, callback) => {
  const sql = `SELECT * FROM newsletter_subscribers WHERE email = ?`;
  db.query(sql, [email], callback);
};

// Reactivate unsubscribed email
export const reactivateSubscriber = (email, callback) => {
  const sql = `UPDATE newsletter_subscribers SET status = 'active', subscribed_at = NOW() WHERE email = ?`;
  db.query(sql, [email], callback);
};

// Get all subscribers (admin)
export const getAllSubscribers = (callback) => {
  const sql = `SELECT * FROM newsletter_subscribers ORDER BY subscribed_at DESC`;
  db.query(sql, callback);
};

// Unsubscribe
export const unsubscribeEmail = (email, callback) => {
  const sql = `UPDATE newsletter_subscribers SET status = 'unsubscribed' WHERE email = ?`;
  db.query(sql, [email], callback);
};
