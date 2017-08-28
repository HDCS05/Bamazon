Create Database BamazonDB;

USE BamazonDB;

CREATE TABLE products(
  item_id INT NOT NULL UNIQUE AUTO_INCREMENT,
  product_name VARCHAR(70) NOT NULL,
  department_name VARCHAR(70) NOT NULL,
  price decimal(10,2) default 0,
  stock_quantity INT default 0,
  PRIMARY KEY (item_id)
);

Select * from products;
 