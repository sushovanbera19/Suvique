import db from "../config/db.js";

// Find admin by email
export const findAdminByEmail = (email, callback) => {

    const sql = "SELECT * FROM admin WHERE email = ?";

    db.query(sql, [email], callback);
};