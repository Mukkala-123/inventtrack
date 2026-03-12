CREATE DATABASE inventory;

USE inventory;

CREATE TABLE products (
 id INT AUTO_INCREMENT PRIMARY KEY,
 name VARCHAR(100),
 quantity INT,
 price INT
);