import db from "../config/db.js";

export const getAllInspiredSections = () => {
  return new Promise((resolve, reject) => {
    db.query("SELECT * FROM inspired_sections ORDER BY sort_order ASC, created_at DESC", (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

export const getActiveInspiredSections = () => {
  return new Promise((resolve, reject) => {
    db.query("SELECT * FROM inspired_sections WHERE is_active = 1 ORDER BY sort_order ASC", (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

export const getInspiredSectionById = (id) => {
  return new Promise((resolve, reject) => {
    db.query("SELECT * FROM inspired_sections WHERE id = ?", [id], (err, result) => {
      if (err) return reject(err);
      resolve(result[0] || null);
    });
  });
};

export const createInspiredSection = (data) => {
  return new Promise((resolve, reject) => {
    const { heading, description, point1, point2, point3, button_text, button_link, image, sort_order, is_active } = data;
    db.query(
      "INSERT INTO inspired_sections (heading, description, point1, point2, point3, button_text, button_link, image, sort_order, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [heading, description, point1, point2, point3, button_text, button_link, image, sort_order || 0, is_active !== undefined ? is_active : 1],
      (err, result) => {
        if (err) return reject(err);
        resolve(result);
      }
    );
  });
};

export const updateInspiredSection = (id, data) => {
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
    db.query(`UPDATE inspired_sections SET ${fields.join(", ")} WHERE id = ?`, values, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

export const deleteInspiredSection = (id) => {
  return new Promise((resolve, reject) => {
    db.query("DELETE FROM inspired_sections WHERE id = ?", [id], (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

export const toggleInspiredSection = (id, isActive) => {
  return new Promise((resolve, reject) => {
    db.query("UPDATE inspired_sections SET is_active = ? WHERE id = ?", [isActive, id], (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};
