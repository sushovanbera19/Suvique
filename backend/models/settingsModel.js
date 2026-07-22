import db from "../config/db.js";

// Get all settings grouped by setting_group
export const getAllSettings = () => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM admin_settings ORDER BY setting_group, setting_key";
    db.query(sql, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

// Get settings by group
export const getSettingsByGroup = (group) => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM admin_settings WHERE setting_group = ?";
    db.query(sql, [group], (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

// Upsert a single setting
export const upsertSetting = (key, value, group) => {
  return new Promise((resolve, reject) => {
    const sql = `INSERT INTO admin_settings (setting_key, setting_value, setting_group)
      VALUES (?, ?, ?)
      ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value), setting_group = VALUES(setting_group)`;
    db.query(sql, [key, value, group], (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

// Upsert many settings at once
export const upsertManySettings = (settings) => {
  return new Promise((resolve, reject) => {
    if (settings.length === 0) return resolve();

    const sql = `INSERT INTO admin_settings (setting_key, setting_value, setting_group)
      VALUES ?
      ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value), setting_group = VALUES(setting_group)`;

    const values = settings.map((s) => [s.key, s.value, s.group]);

    db.query(sql, [values], (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

// Delete a setting
export const deleteSetting = (key) => {
  return new Promise((resolve, reject) => {
    db.query("DELETE FROM admin_settings WHERE setting_key = ?", [key], (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};
