import db from "../config/db.js";

// insert user into DB
export const insertUser = (userId, name, email, password, agreeTerms) => {
  return new Promise((resolve, reject) => {
    const sql ="INSERT INTO users (user_id, name, email, password, agreeTerms) VALUES (?, ?, ?, ? ,?)";

    db.query(sql, [userId, name, email, password, agreeTerms], (err, result) => {
      if (err) {
        return reject(err);
      }
      resolve(result);
    });
  });
};

// find user by email (exclude password and binary blobs)
export const findUserByEmail = (email) => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT id, user_id, name, email, password, agreeTerms, status, created_at, profileImageType FROM users WHERE email = ?";

    db.query(sql, [email], (err, result) => {
      if (err) return reject(err);

      resolve(result[0]);
    });
  });
};
//getallusers
export const getAllUsers = () => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM users";

    db.query(sql, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};
// update a single user
export const updateUser = (userId, name, email) => {
  return new Promise((resolve, reject) => {
    const sql = "UPDATE users SET name = ?, email = ? WHERE user_id = ?";

    db.query(sql, [name, email, userId], (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

// delete a single item
export const deleteUser = (userId) => {
  return new Promise((resolve, reject) => {
    const sql = "DELETE FROM users WHERE user_id = ?";

    db.query(sql, [userId], (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

// find user by numeric id
export const findUserById = (id) => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT id, user_id, name, email, profileImageType, coverPhotoType, created_at FROM users WHERE id = ?";
    db.query(sql, [id], (err, result) => {
      if (err) return reject(err);
      resolve(result[0]);
    });
  });
};

// get user profile image blob
export const getUserImage = (id) => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT profileImage, profileImageType FROM users WHERE id = ?";
    db.query(sql, [id], (err, result) => {
      if (err) return reject(err);
      resolve(result[0]);
    });
  });
};

// update user profile (name, email)
export const updateUserProfile = (id, name, email) => {
  return new Promise((resolve, reject) => {
    const sql = "UPDATE users SET name = ?, email = ? WHERE id = ?";
    db.query(sql, [name, email, id], (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

// update user profile image (buffer + mimetype)
export const updateUserImage = (id, buffer, mimeType) => {
  return new Promise((resolve, reject) => {
    const sql = "UPDATE users SET profileImage = ?, profileImageType = ? WHERE id = ?";
    db.query(sql, [buffer, mimeType, id], (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

// get user cover photo blob
export const getUserCoverImage = (id) => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT coverPhoto, coverPhotoType FROM users WHERE id = ?";
    db.query(sql, [id], (err, result) => {
      if (err) return reject(err);
      resolve(result[0]);
    });
  });
};

// get single user detail (safe fields, no password/blob)
export const getUserDetail = (user_id) => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT id, user_id, name, email, agreeTerms, status, created_at FROM users WHERE user_id = ?";
    db.query(sql, [user_id], (err, result) => {
      if (err) return reject(err);
      resolve(result[0] || null);
    });
  });
};

// get user orders
export const getUserOrders = (numericId) => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC";
    db.query(sql, [numericId], (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

// get user order items
export const getUserOrderItems = (orderIds) => {
  return new Promise((resolve, reject) => {
    if (!orderIds.length) return resolve([]);
    const sql = `SELECT oi.*, p.product_name, p.main_image
      FROM order_items oi
      LEFT JOIN products p ON oi.product_id = p.id
      WHERE oi.order_id IN (${orderIds.map(() => "?").join(",")})
      ORDER BY oi.id DESC`;
    db.query(sql, orderIds, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

// get user addresses
export const getUserAddresses = (numericId) => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM user_addresses WHERE user_id = ? ORDER BY is_default DESC, id DESC";
    db.query(sql, [numericId], (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

// get user cart items
export const getUserCartItems = (numericId) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT c.*, p.product_name, p.main_image, p.sale_price, p.base_price
      FROM cart c
      LEFT JOIN products p ON c.product_id = p.id
      WHERE c.user_id = ?`;
    db.query(sql, [numericId], (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

// update user cover photo (buffer + mimetype)
export const updateUserCoverImage = (id, buffer, mimeType) => {
  return new Promise((resolve, reject) => {
    const sql = "UPDATE users SET coverPhoto = ?, coverPhotoType = ? WHERE id = ?";
    db.query(sql, [buffer, mimeType, id], (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};