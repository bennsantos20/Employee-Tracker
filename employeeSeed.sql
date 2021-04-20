DROP DATABASE IF EXISTS employee_tracker_db;

CREATE DATABASE employee_tracker_db;

USE employee_tracker_db;

CREATE TABLE department (
id INT AUTO_INCREMENT NOT NULL,
name VARCHAR(30),
PRIMARY KEY (id)
);


CREATE TABLE comp_role (
id INT AUTO_INCREMENT NOT NULL,
title VARCHAR(30),
salary DECIMAL(65),
department_id INT,
PRIMARY KEY (id),
FOREIGN KEY (department_id) REFERENCES department (id)
);


CREATE TABLE employee (
id INT AUTO_INCREMENT NOT NULL,
first_name VARCHAR(30),
last_name VARCHAR(30),
role_id INT,
manager_id INT NULL,
PRIMARY KEY (id),
FOREIGN KEY (role_id) REFERENCES comp_role (id)
);

INSERT INTO department(name)
VALUES( "Engineering"), ( "Sales"), ( "Human Resources"), ( "Accounting"),( "Legal"), ( "Finance");

INSERT INTO comp_role (title, salary, department_id)
VALUES("Software Engineer", 60000, 1), ("Sales", 50000, 2), ("Accountant", 70000, 4), ("Junior Software Developer", 50000, 1);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES( "Brandy", "Bob", 1, 5), ( "Dillon", "Francis", 2, 5), ( "Gerrit", "Boerma", 3, 5), ( "Parker", "Smith", 4, 5), ( "John", "Deere", 5, 5), ( "Agent", "Smith", 6, 5);

SELECT employee.first_name, employee.last_name, comp_role.title, department.name, comp_role.salary FROM comp_role
INNER JOIN employee ON employee.role_id = role_id
INNER JOIN department ON comp_role.department_id = department.id