import db from "../config/db.js";

// Create
export const createVariation = (colorCode, size, status) => {
  const sql = ` INSERT INTO product_variation  (color_code, size, status) VALUES (?, ?, ?)`;
  return db.promise().query(sql, [colorCode, size, status,]);
};

// Get All
export const getAllVariations = () => {
  const sql = ` SELECT * FROM product_variation ORDER BY variation_id DESC`;
  return db.promise().query(sql);
};

// Get By ID
export const getVariationById = (id) => {
  const sql = ` SELECT * FROM product_variation WHERE variation_id = ? `;
  return db.promise().query(sql, [id]);
};

// Update
export const updateVariation = (id, colorCode, size, status) => {
  const sql = ` UPDATE product_variation SET color_code = ?, size = ?,  status = ? WHERE variation_id = ? `;
  return db.promise().query(sql, [colorCode, size, status, id,]);
};

// Delete
export const deleteVariation = (id) => {
  const sql = ` DELETE FROM product_variation WHERE variation_id = ?`;
  return db.promise().query(sql, [id]);
};

// Bulk create (skip duplicates)
export const bulkCreateVariations = (rows) => {
  if (!rows.length) return Promise.resolve({ inserted: 0, skipped: 0 });
  const sql = `INSERT IGNORE INTO product_variation (color_code, size, status) VALUES ?`;
  return db.promise().query(sql, [rows]).then(([result]) => ({
    inserted: result.affectedRows,
    skipped: rows.length - result.affectedRows,
  }));
};