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