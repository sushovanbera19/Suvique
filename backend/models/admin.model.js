import db from "../config/db.js";

// Create Admin (already correct)
export const createAdmin = (name, email, password, confirmPassword, agreeTerms) => {
  const sql = ` INSERT INTO admin (name, email, password, confirm_password, agree_terms)  VALUES (?, ?, ?, ?, ?)`;
  return db.promise().query(sql, [name, email, password, confirmPassword, agreeTerms,]);
};

export const findAdminByEmail = (email) => {
  const sql = "SELECT * FROM admin WHERE email = ?";
  return db.promise().query(sql, [email]);
};
