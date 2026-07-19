import db from "./config/db.js";

const sql = `
  CREATE TABLE IF NOT EXISTS coupons (
    id INT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    discount_type ENUM('percentage','fixed') NOT NULL DEFAULT 'percentage',
    discount_value DECIMAL(10,2) NOT NULL,
    min_order DECIMAL(10,2) DEFAULT 0,
    max_uses INT DEFAULT NULL,
    used_count INT DEFAULT 0,
    status ENUM('active','inactive') DEFAULT 'active',
    expires_at DATETIME DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
`;

db.query(sql, (err) => {
  if (err) { console.error("Create table error:", err.message); process.exit(1); }
  console.log("coupons table created");

  const seed = `INSERT IGNORE INTO coupons (code, discount_type, discount_value, min_order, status) VALUES ('WELCOME10','percentage',10,0,'active'),('FLAT50','fixed',50,500,'active'),('SAVE20','percentage',20,1000,'active')`;
  db.query(seed, (err2) => {
    if (err2) { console.error("Seed error:", err2.message); }
    else { console.log("Coupons seeded"); }
    process.exit(0);
  });
});
