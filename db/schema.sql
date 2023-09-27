DROP DATABASE IF EXISTS employeelist_db;
CREATE DATABASE employeelist_db;

USE employeelist_db;

CREATE TABLE department (
id INT NOT NULL AUTO_INCREMENT,
department_name VARCHAR(30) NOT NULL,
PRIMARY KEY (id)
);

CREATE TABLE employee_role (
id INT NOT NULL AUTO_INCREMENT,
title VARCHAR(30) NOT NULL,
salary DECIMAL NOT NULL,
department_id INT,
FOREIGN KEY (department_id)
REFERENCES department(id)
ON DELETE SET NULL,
PRIMARY KEY (id)
);

CREATE TABLE employee (
id INT NOT NULL AUTO_INCREMENT,
first_name VARCHAR(30) NOT NULL,
last_name VARCHAR(30) NOT NULL,
employee_role_id INT,
manager_id INT,
FOREIGN KEY (employee_role_id)
REFERENCES employee_role(id)
ON DELETE SET NULL,
PRIMARY KEY (id)
);