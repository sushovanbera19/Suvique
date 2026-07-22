import db from "../config/db.js";

export const getAdminProfile = (email) => {
  return new Promise((resolve, reject) => {
    db.query(
      "SELECT id, name, email, avatar, cover_photo, phone, bio, role, created_at FROM admin WHERE email = ?",
      [email],
      (err, rows) => {
        if (err) return reject(err);
        resolve(rows[0] || null);
      }
    );
  });
};

export const updateAdminProfile = (email, { name, phone, bio, role }) => {
  return new Promise((resolve, reject) => {
    const fields = [];
    const values = [];
    if (name !== undefined) { fields.push("name = ?"); values.push(name); }
    if (phone !== undefined) { fields.push("phone = ?"); values.push(phone); }
    if (bio !== undefined) { fields.push("bio = ?"); values.push(bio); }
    if (role !== undefined) { fields.push("role = ?"); values.push(role); }
    if (fields.length === 0) return resolve({ affectedRows: 0 });
    values.push(email);
    db.query(`UPDATE admin SET ${fields.join(", ")} WHERE email = ?`, values, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

export const updateAdminAvatar = (email, avatar) => {
  return new Promise((resolve, reject) => {
    db.query("UPDATE admin SET avatar = ? WHERE email = ?", [avatar, email], (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

export const updateAdminCoverPhoto = (email, coverPhoto) => {
  return new Promise((resolve, reject) => {
    db.query("UPDATE admin SET cover_photo = ? WHERE email = ?", [coverPhoto, email], (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

export const updateAdminPassword = (email, newPassword) => {
  return new Promise((resolve, reject) => {
    db.query("UPDATE admin SET password = ?, confirm_password = ? WHERE email = ?", [newPassword, newPassword, email], (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};
