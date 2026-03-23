-- Create database
CREATE DATABASE IF NOT EXISTS inventory;
USE inventory;

-- Create products table with category column
CREATE TABLE IF NOT EXISTS products (
  id       INT          AUTO_INCREMENT PRIMARY KEY,
  name     VARCHAR(100) NOT NULL,
  quantity INT          NOT NULL DEFAULT 0,
  price    INT          NOT NULL DEFAULT 0,
  category VARCHAR(100) DEFAULT 'Others'
);

-- Create users table for login
CREATE TABLE IF NOT EXISTS users (
  id       INT         AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  password VARCHAR(100) NOT NULL
);

-- Insert default admin user
INSERT IGNORE INTO users (username, password) VALUES ('admin', 'admin123');

-- If products table already exists, add category column
ALTER TABLE products ADD COLUMN IF NOT EXISTS category VARCHAR(100) DEFAULT 'Others';

-- Fix any existing products with no category
UPDATE products SET category = 'Others' WHERE category IS NULL OR category = '';