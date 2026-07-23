import db from "../config/db.js";

// --- Section settings ---
export const getSection = () => {
  return new Promise((resolve, reject) => {
    db.query("SELECT * FROM instagram_sections LIMIT 1", (err, result) => {
      if (err) return reject(err);
      resolve(result[0] || null);
    });
  });
};

export const updateSection = (data) => {
  return new Promise((resolve, reject) => {
    const fields = [];
    const values = [];
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined) {
        fields.push(`${key} = ?`);
        values.push(value);
      }
    });
    if (fields.length === 0) return resolve({ affectedRows: 0 });
    db.query(`UPDATE instagram_sections SET ${fields.join(", ")} WHERE id = 1`, values, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

// --- Gallery Items ---
export const getAllItems = () => {
  return new Promise((resolve, reject) => {
    db.query("SELECT * FROM instagram_items ORDER BY sort_order ASC, created_at DESC", (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

export const getActiveItems = () => {
  return new Promise((resolve, reject) => {
    db.query("SELECT * FROM instagram_items WHERE is_active = 1 ORDER BY sort_order ASC", (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

export const getItemById = (id) => {
  return new Promise((resolve, reject) => {
    db.query("SELECT * FROM instagram_items WHERE id = ?", [id], (err, result) => {
      if (err) return reject(err);
      resolve(result[0] || null);
    });
  });
};

export const createItem = (data) => {
  return new Promise((resolve, reject) => {
    const { image_url, alt_text, link, sort_order, is_active } = data;
    db.query(
      "INSERT INTO instagram_items (image_url, alt_text, link, sort_order, is_active) VALUES (?, ?, ?, ?, ?)",
      [image_url, alt_text || "", link || "", sort_order || 0, is_active !== undefined ? is_active : 1],
      (err, result) => {
        if (err) return reject(err);
        resolve(result);
      }
    );
  });
};

export const updateItem = (id, data) => {
  return new Promise((resolve, reject) => {
    const fields = [];
    const values = [];
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined) {
        fields.push(`${key} = ?`);
        values.push(value);
      }
    });
    if (fields.length === 0) return resolve({ affectedRows: 0 });
    values.push(id);
    db.query(`UPDATE instagram_items SET ${fields.join(", ")} WHERE id = ?`, values, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

export const deleteItem = (id) => {
  return new Promise((resolve, reject) => {
    db.query("DELETE FROM instagram_items WHERE id = ?", [id], (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};
