const mysql = require("mysql2");

let db;

function connect() {
  db = mysql.createConnection({
    host     : process.env.DB_HOST     || "localhost",
    port     : process.env.DB_PORT     || 3306,
    user     : process.env.DB_USER     || "root",
    password : process.env.DB_PASSWORD || "Manisha@2006",
    database : process.env.DB_NAME     || "inventory"
  });

  db.connect((err) => {
    if (err) {
      console.log("DB connection failed:", err.message);
      console.log("Retrying in 5 seconds...");
      setTimeout(connect, 5000);
      return;
    }
    console.log("✅ MySQL Connected to:", process.env.DB_HOST || "localhost");

    // Auto-create table if not exists
    db.query(`
      CREATE TABLE IF NOT EXISTS products (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        quantity INT NOT NULL DEFAULT 0,
        price INT NOT NULL DEFAULT 0,
        category VARCHAR(100) DEFAULT 'Others'
      )
    `, (err) => {
      if (err) console.log("Table error:", err.message);
      else {
        console.log("✅ Products table ready");
        db.query("UPDATE products SET category='Others' WHERE category IS NULL OR category=''");
      }
    });
  });

  db.on("error", (err) => {
    console.log("DB error:", err.message);
    if (err.fatal) {
      console.log("Fatal error — reconnecting...");
      setTimeout(connect, 5000);
    }
  });
}

connect();

module.exports = {
  query: (...args) => db.query(...args)
};