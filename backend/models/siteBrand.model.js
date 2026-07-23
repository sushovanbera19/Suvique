import db from "../config/db.js";

export const getSiteBrand = () => {
  return new Promise((resolve, reject) => {
    db.query("SELECT * FROM site_brand WHERE id = 1", (err, result) => {
      if (err) return reject(err);
      resolve(result[0] || null);
    });
  });
};

export const updateSiteBrand = (logoPath, brandName) => {
  return new Promise((resolve, reject) => {
    const fields = [];
    const values = [];
    if (logoPath !== undefined) { fields.push("logo_path = ?"); values.push(logoPath); }
    if (brandName !== undefined) { fields.push("brand_name = ?"); values.push(brandName); }
    if (fields.length === 0) return resolve({ affectedRows: 0 });
    values.push(1);
    db.query(`UPDATE site_brand SET ${fields.join(", ")} WHERE id = ?`, values, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};
