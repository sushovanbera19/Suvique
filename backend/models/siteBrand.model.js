import db from "../config/db.js";

export const getActiveBrand = () => {
  return new Promise((resolve, reject) => {
    db.query("SELECT * FROM site_brand WHERE is_active = 1 LIMIT 1", (err, result) => {
      if (err) return reject(err);
      resolve(result[0] || null);
    });
  });
};

export const getAllBrands = () => {
  return new Promise((resolve, reject) => {
    db.query("SELECT * FROM site_brand ORDER BY is_active DESC, created_at DESC", (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

export const createBrand = (logoPath, brandName) => {
  return new Promise((resolve, reject) => {
    db.query("INSERT INTO site_brand (logo_path, brand_name) VALUES (?, ?)", [logoPath, brandName], (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

export const activateBrand = (id) => {
  return new Promise((resolve, reject) => {
    db.query("UPDATE site_brand SET is_active = 0", (err) => {
      if (err) return reject(err);
      db.query("UPDATE site_brand SET is_active = 1 WHERE id = ?", [id], (err2, result) => {
        if (err2) return reject(err2);
        resolve(result);
      });
    });
  });
};

export const deleteBrand = (id) => {
  return new Promise((resolve, reject) => {
    db.query("DELETE FROM site_brand WHERE id = ? AND is_active = 0", [id], (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};
