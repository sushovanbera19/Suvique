import db from "../config/db.js";

// insert user into DB
export const insertUser = (name, email, password,agreeTerms) => {
  return new Promise((resolve, reject) => {
    const sql =
      "INSERT INTO users (name, email, password, agreeTerms) VALUES (?, ?, ?, ?)";

    db.query(sql, [name, email, password, agreeTerms], (err, result) => {
      if (err) {
        return reject(err);
      }

      resolve(result);
    });
  });
};

// find user by email
export const findUserByEmail = (email) => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM users WHERE email = ?";

    db.query(sql, [email], (err, result) => {
      if (err) return reject(err);

      resolve(result[0]); // return single user
    });
  });
};