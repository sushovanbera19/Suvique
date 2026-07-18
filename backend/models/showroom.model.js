import db from "../config/db.js";

export const getAllShowrooms = () => {
  return new Promise((resolve, reject) => {
    db.query("SELECT * FROM showrooms ORDER BY created_at DESC", (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

export const getActiveShowrooms = () => {
  return new Promise((resolve, reject) => {
    db.query("SELECT * FROM showrooms WHERE status = 'active' ORDER BY created_at DESC", (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

export const getShowroomById = (id) => {
  return new Promise((resolve, reject) => {
    db.query("SELECT * FROM showrooms WHERE id = ?", [id], (err, result) => {
      if (err) return reject(err);
      resolve(result[0]);
    });
  });
};

export const createShowroom = (data) => {
  return new Promise((resolve, reject) => {
    const sql = "INSERT INTO showrooms (name, address, city, phone, image, latitude, longitude, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
    db.query(sql, [data.name, data.address, data.city, data.phone, data.image, data.latitude, data.longitude, data.status || "active"], (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

export const updateShowroom = (id, data) => {
  return new Promise((resolve, reject) => {
    const sql = "UPDATE showrooms SET name = ?, address = ?, city = ?, phone = ?, image = ?, latitude = ?, longitude = ?, status = ? WHERE id = ?";
    db.query(sql, [data.name, data.address, data.city, data.phone, data.image, data.latitude, data.longitude, data.status, id], (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

export const deleteShowroom = (id) => {
  return new Promise((resolve, reject) => {
    db.query("DELETE FROM showrooms WHERE id = ?", [id], (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

export const bulkDeleteShowrooms = (ids) => {
  return new Promise((resolve, reject) => {
    db.query("DELETE FROM showrooms WHERE id IN (?)", [ids], (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};
