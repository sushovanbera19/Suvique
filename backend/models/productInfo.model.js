import db from "../config/db.js";

export const getProductInfo = (productId) => {
  return new Promise((resolve, reject) => {
    db.query("SELECT * FROM product_additional_info WHERE product_id = ? ORDER BY sort_order ASC, id ASC", [productId], (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

export const getProductInfoById = (id) => {
  return new Promise((resolve, reject) => {
    db.query("SELECT * FROM product_additional_info WHERE id = ?", [id], (err, result) => {
      if (err) return reject(err);
      resolve(result[0]);
    });
  });
};

export const createProductInfo = (data) => {
  return new Promise((resolve, reject) => {
    const sql = "INSERT INTO product_additional_info (product_id, heading, content, info_type, sort_order) VALUES (?, ?, ?, ?, ?)";
    db.query(sql, [data.product_id, data.heading, data.content, data.info_type || "text", data.sort_order || 0], (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

export const updateProductInfo = (id, data) => {
  return new Promise((resolve, reject) => {
    const sql = "UPDATE product_additional_info SET heading = ?, content = ?, info_type = ?, sort_order = ? WHERE id = ?";
    db.query(sql, [data.heading, data.content, data.info_type, data.sort_order, id], (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

export const deleteProductInfo = (id) => {
  return new Promise((resolve, reject) => {
    db.query("DELETE FROM product_additional_info WHERE id = ?", [id], (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

export const deleteAllProductInfo = (productId) => {
  return new Promise((resolve, reject) => {
    db.query("DELETE FROM product_additional_info WHERE product_id = ?", [productId], (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};
