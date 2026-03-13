const mysql = require("mysql");

const db = mysql.createConnection({
  host     : process.env.DB_HOST     || "localhost",
  port     : process.env.DB_PORT     || 3306,
  user     : process.env.DB_USER     || "root",
  password : process.env.DB_PASSWORD || "Manisha@2006",
  database : process.env.DB_NAME     || "inventory"
});

db.connect((err) => {
  if (err) {
    console.log("Database connection failed:", err);
    return;
  }

  console.log("MySQL Connected");

  db.query("DESCRIBE products", (err, fields) => {
    if (err) {
      db.query(`
        CREATE TABLE IF NOT EXISTS products (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(100) NOT NULL,
          quantity INT NOT NULL DEFAULT 0,
          price INT NOT NULL DEFAULT 0,
          category VARCHAR(100) DEFAULT 'Others'
        )
      `, (err2) => {
        if (err2) console.log("Table creation error:", err2.message);
        else console.log("Products table created");
      });
      return;
    }

    const hasCategory = fields.some(f => f.Field === "category");
    if (!hasCategory) {
      db.query(
        "ALTER TABLE products ADD COLUMN category VARCHAR(100) DEFAULT 'Others'",
        (err2) => {
          if (err2) console.log("Failed to add category column:", err2.message);
          else {
            console.log("Category column added");
            db.query("UPDATE products SET category='Others' WHERE category IS NULL OR category=''");
          }
        }
      );
    } else {
      console.log("Category column ready");
      db.query("UPDATE products SET category='Others' WHERE category IS NULL OR category=''");
    }
  });
});

module.exports = db;
   
