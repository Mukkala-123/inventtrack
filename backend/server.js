const express = require("express");
const cors = require("cors");
const db = require("./db");

const app = express();

// Allow requests from Netlify frontend
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type"]
}));

app.use(express.json());

/* ── GET ALL PRODUCTS ── */
app.get("/products", (req, res) => {
  db.query("SELECT * FROM products ORDER BY id ASC", (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result);
  });
});

/* ── GET SINGLE PRODUCT BY ID ── */
app.get("/products/:id", (req, res) => {
  db.query(
    "SELECT * FROM products WHERE id = ?",
    [req.params.id],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      if (result.length === 0) return res.status(404).json({ error: "Product not found" });
      res.json(result[0]);
    }
  );
});

/* ── ADD PRODUCT ── */
app.post("/addproduct", (req, res) => {
  const { name, quantity, price, category } = req.body;
  if (!name || !quantity || !price) {
    return res.status(400).json({ error: "name, quantity and price are required" });
  }
  const sql = "INSERT INTO products (name, quantity, price, category) VALUES (?, ?, ?, ?)";
  db.query(sql, [name, quantity, price, category || "Others"], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Product Added Successfully", id: result.insertId });
  });
});

/* ── UPDATE PRODUCT ── */
app.put("/updateproduct/:id", (req, res) => {
  const { name, quantity, price, category } = req.body;
  if (!name || !quantity || !price) {
    return res.status(400).json({ error: "name, quantity and price are required" });
  }
  const sql = "UPDATE products SET name=?, quantity=?, price=?, category=? WHERE id=?";
  db.query(sql, [name, quantity, price, category || "Others", req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ error: "Product not found" });
    res.json({ message: "Product Updated Successfully" });
  });
});

/* ── DELETE PRODUCT ── */
app.delete("/deleteproduct/:id", (req, res) => {
  db.query("DELETE FROM products WHERE id=?", [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ error: "Product not found" });
    res.json({ message: "Product Deleted Successfully" });
  });
});

// Use Railway's PORT or default 5000
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});