import db from "../config/db.js";

// Get all addresses of logged-in user
export const getAddresses = (userId, callback) => {
  const sql = `
    SELECT *
    FROM user_addresses
    WHERE user_id = ?
    ORDER BY is_default DESC, id DESC
  `;

  db.query(sql, [userId], callback);
};

// Add new address
export const addAddress = (data, callback) => {
  const sql = `
    INSERT INTO user_addresses
    (
      user_id,
      first_name,
      last_name,
      email,
      phone,
      country,
      city,
      street,
      zip_code,
      additional_info
    )
    VALUES (?,?,?,?,?,?,?,?,?,?)
  `;

  db.query(sql, data, (err, result) => {
    callback(err, result);
  });
};