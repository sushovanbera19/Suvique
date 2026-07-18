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