import db from "../config/db.js";

// store contact message
export const insertContact = (name, email, message, callback) => {
  const sql = "INSERT INTO contacts (name, email, message) VALUES (?, ?, ?)";
  db.query(sql, [name, email, message], callback);
};