import db from "../config/db.js";

export const getAllUISettings = () => {
  return new Promise((resolve, reject) => {
    db.query("SELECT * FROM admin_ui_settings ORDER BY component_type, component_name, setting_key", (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

export const getUISettingsByType = (type) => {
  return new Promise((resolve, reject) => {
    db.query("SELECT * FROM admin_ui_settings WHERE component_type = ? ORDER BY component_name, setting_key", [type], (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

export const upsertManyUISettings = (rows) => {
  return new Promise((resolve, reject) => {
    if (!rows.length) return resolve();
    const sql = `INSERT INTO admin_ui_settings (component_type, component_name, setting_key, setting_value)
      VALUES ?
      ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)`;
    const values = rows.map((r) => [r.component_type, r.component_name, r.setting_key, r.setting_value]);
    db.query(sql, [values], (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

export const resetUISettingsByType = (type) => {
  return new Promise((resolve, reject) => {
    db.query("DELETE FROM admin_ui_settings WHERE component_type = ?", [type], (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};
