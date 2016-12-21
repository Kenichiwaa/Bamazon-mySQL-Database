
// -- Creates the database --
CREATE DATABASE Bamazon_db;

// -- Makes it so all of the following code will affect Bamazon_db --
USE Bamazon_db;


// -- Create table and assign values 
CREATE TABLE products (
  item_id INT AUTO_INCREMENT NOT NULL,
  product_name VARCHAR(100) NOT NULL,
  department_name VARCHAR(50) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  stock_quantity INTEGER(50) NOT NULL,
  PRIMARY KEY (item_id)
);

// -- Add data to the table
INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("apple", "produce", "0.50", "200" ), ("oranges", "produce", "0.75", "150" ), ("kale", "produce", "0.99", "300"), ("carrots", "produce", "0.25", "1000"), ("socks", "clothing", "1.99", "500"), ("pants", "clothing", "20.00", "400"), ("sandlals", "clothing", "15.99", "200"), ("ipad", "electronics", "499.95", "50"), ("beats by dre", "electronics", "399.95", "98"), ("bluetooth speaker", "electronics", "199.95", "59");


describe products;