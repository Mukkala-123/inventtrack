const mysql = require("mysql");

const db = mysql.createConnection({
  host     : process.env.DB_HOST     || "localhost",
  port     : process.env.DB_PORT     || 3306,
  user     : process.env.DB_USER     || "root",
  password : process.env.DB_PASSWORD || "Manisha@2006",
  database : process.env.DB_NAME     || "inventory"
});

db.connect((err) => {
  if (err) { console.log("Database connection failed:", err); return; }
  console.log("MySQL Connected");

  // Create users table if not exists
  db.query(`
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(50) NOT NULL UNIQUE,
      password VARCHAR(100) NOT NULL
    )
  `, (err) => {
    if (err) { console.log("Users table error:", err.message); return; }
    console.log("Users table ready");

    // Insert default admin user if not exists
    db.query(
      "INSERT IGNORE INTO users (username, password) VALUES (?, ?)",
      ["admin", "admin123"],
      (err) => {
        if (err) console.log("Insert user error:", err.message);
        else console.log("Default user ready → admin / admin123");
      }
    );
  });

  // Create products table if not exists
  db.query(`
    CREATE TABLE IF NOT EXISTS products (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      quantity INT NOT NULL DEFAULT 0,
      price INT NOT NULL DEFAULT 0,
      category VARCHAR(100) DEFAULT 'Others'
    )
  `, (err) => {
    if (err) console.log("Products table error:", err.message);
    else {
      console.log("Products table ready");
      db.query("UPDATE products SET category='Others' WHERE category IS NULL OR category=''");
    }
  });
});

module.exports = db;