import mysql from "mysql2";

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "ecommerce_furniture",
});

db.connect((err) => {
  if (err) {
    console.log("❌ DB NOT connected:", err.message);
  } else {
    console.log("✅ DB connected successfully");
  }
});

export default db;