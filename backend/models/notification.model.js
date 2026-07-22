import db from "../config/db.js";

export const createNotificationsTable = () => {
  return new Promise((resolve, reject) => {
    const sql = `
      CREATE TABLE IF NOT EXISTS notifications (
        id INT AUTO_INCREMENT PRIMARY KEY,
        type ENUM('order','promo','account','system','review','stock') DEFAULT 'system',
        title VARCHAR(500) NOT NULL,
        description TEXT DEFAULT NULL,
        link VARCHAR(500) DEFAULT NULL,
        is_read TINYINT(1) DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    db.query(sql, (err) => {
      if (err) return reject(err);
      resolve();
    });
  });
};

export const getAllNotifications = () => {
  return new Promise((resolve, reject) => {
    db.query("SELECT * FROM notifications ORDER BY created_at DESC LIMIT 50", (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
};

export const getUnreadCount = () => {
  return new Promise((resolve, reject) => {
    db.query("SELECT COUNT(*) as count FROM notifications WHERE is_read = 0", (err, rows) => {
      if (err) return reject(err);
      resolve(rows[0].count);
    });
  });
};

export const markAsRead = (id) => {
  return new Promise((resolve, reject) => {
    db.query("UPDATE notifications SET is_read = 1 WHERE id = ?", [id], (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

export const markAllAsRead = () => {
  return new Promise((resolve, reject) => {
    db.query("UPDATE notifications SET is_read = 1 WHERE is_read = 0", (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

export const deleteNotification = (id) => {
  return new Promise((resolve, reject) => {
    db.query("DELETE FROM notifications WHERE id = ?", [id], (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

export const createNotification = ({ type, title, description, link }) => {
  return new Promise((resolve, reject) => {
    const sql = "INSERT INTO notifications (type, title, description, link) VALUES (?, ?, ?, ?)";
    db.query(sql, [type || "system", title, description || null, link || null], (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};
