const mysql = require("mysql");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Manisha@2006",
  database: "inventory"
});

db.connect((err) => {
  if (err) {
    console.log("Database connection failed:", err);
    return;
  }

  console.log("MySQL Connected");

  // Check if category column exists first, then add if missing
  db.query("DESCRIBE products", (err, fields) => {
    if (err) {
      console.log("Could not describe table:", err.message);
      return;
    }

    const hasCategory = fields.some(f => f.Field === "category");

    if (!hasCategory) {
      // Column doesn't exist — add it now
      db.query(
        "ALTER TABLE products ADD COLUMN category VARCHAR(100) DEFAULT 'Others'",
        (err2) => {
          if (err2) {
            console.log("Failed to add category column:", err2.message);
          } else {
            console.log("Category column added successfully");
            db.query("UPDATE products SET category='Others' WHERE category IS NULL OR category=''");
          }
        }
      );
    } else {
      console.log("Category column ready");
      // Fix any NULL categories in existing rows
      db.query("UPDATE products SET category='Others' WHERE category IS NULL OR category=''");
    }
  });
});

module.exports = db;