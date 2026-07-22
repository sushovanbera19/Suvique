import db from "../config/db.js";

// Create vendors table
export const createVendorsTable = () => {
  return new Promise((resolve, reject) => {
    const sql = `
      CREATE TABLE IF NOT EXISTS vendors (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        logo VARCHAR(500) DEFAULT NULL,
        website VARCHAR(500) DEFAULT NULL,
        description TEXT DEFAULT NULL,
        status ENUM('active','inactive') DEFAULT 'active',
        sort_order INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `;
    db.query(sql, (err) => {
      if (err) return reject(err);
      resolve();
    });
  });
};

// Get all vendors
export const getAllVendors = () => {
  return new Promise((resolve, reject) => {
    db.query("SELECT * FROM vendors ORDER BY sort_order ASC, id ASC", (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
};

// Get active vendors (for client)
export const getActiveVendors = () => {
  return new Promise((resolve, reject) => {
    db.query("SELECT * FROM vendors WHERE status = 'active' ORDER BY sort_order ASC, id ASC", (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
};

// Get vendor by ID
export const getVendorById = (id) => {
  return new Promise((resolve, reject) => {
    db.query("SELECT * FROM vendors WHERE id = ?", [id], (err, rows) => {
      if (err) return reject(err);
      resolve(rows[0]);
    });
  });
};

// Create vendor
export const createVendor = ({ name, logo, website, description, status, sort_order }) => {
  return new Promise((resolve, reject) => {
    const sql = "INSERT INTO vendors (name, logo, website, description, status, sort_order) VALUES (?, ?, ?, ?, ?, ?)";
    db.query(sql, [name, logo || null, website || null, description || null, status || "active", sort_order || 0], (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

// Update vendor
export const updateVendor = (id, { name, logo, website, description, status, sort_order }) => {
  return new Promise((resolve, reject) => {
    const fields = [];
    const values = [];
    if (name !== undefined) { fields.push("name = ?"); values.push(name); }
    if (logo !== undefined) { fields.push("logo = ?"); values.push(logo); }
    if (website !== undefined) { fields.push("website = ?"); values.push(website); }
    if (description !== undefined) { fields.push("description = ?"); values.push(description); }
    if (status !== undefined) { fields.push("status = ?"); values.push(status); }
    if (sort_order !== undefined) { fields.push("sort_order = ?"); values.push(sort_order); }
    if (fields.length === 0) return resolve({ affectedRows: 0 });
    values.push(id);
    db.query(`UPDATE vendors SET ${fields.join(", ")} WHERE id = ?`, values, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

// Toggle status
export const toggleVendorStatus = (id) => {
  return new Promise((resolve, reject) => {
    db.query("UPDATE vendors SET status = IF(status='active','inactive','active') WHERE id = ?", [id], (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

// Delete vendor
export const deleteVendor = (id) => {
  return new Promise((resolve, reject) => {
    db.query("DELETE FROM vendors WHERE id = ?", [id], (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

// Bulk delete
export const bulkDeleteVendors = (ids) => {
  return new Promise((resolve, reject) => {
    if (!ids || !ids.length) return resolve({ affectedRows: 0 });
    db.query("DELETE FROM vendors WHERE id IN (?)", [ids], (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

// Seed vendors
export const seedVendors = () => {
  return new Promise((resolve, reject) => {
    db.query("SELECT COUNT(*) as count FROM vendors", (err, result) => {
      if (err) return reject(err);
      if (result[0].count > 0) return resolve("Already seeded");

      const vendors = [
        ["Brand One", "/uploads/vendors/brand1.webp", "", "Premium furniture brand", "active", 1],
        ["Brand Two", "/uploads/vendors/brand2.webp", "", "Modern home decor", "active", 2],
        ["Brand Three", "/uploads/vendors/brand3.webp", "", "Classic designs", "active", 3],
        ["Brand Four", "/uploads/vendors/brand4.webp", "", "Contemporary furniture", "active", 4],
        ["Brand Five", "/uploads/vendors/brand5.webp", "", "Luxury home brand", "active", 5],
      ];

      const sql = "INSERT INTO vendors (name, logo, website, description, status, sort_order) VALUES ?";
      db.query(sql, [vendors], (err) => {
        if (err) return reject(err);
        resolve("Seeded 5 vendors");
      });
    });
  });
};
