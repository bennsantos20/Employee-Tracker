DROP DATABASE IF EXISTS employee_trackerDB;
CREATE DATABASE employee_trackerDB;

USE employee_trackerDB;

CREATE TABLE department
(
    id INT NOT NULL AUTO_INCREMENT,
    dept_name VARCHAR (30) NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE roles
(
    id INT NOT NULL AUTO_INCREMENT,
    title VARCHAR (30) NOT NULL,
    salary DECIMAL NOT NULL,
    department_id INT NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE employee
(
    id INT NOT NULL AUTO_INCREMENT,
    first_name VARCHAR (30) NOT NULL,
    last_name VARCHAR (30) NOT NULL,
    role_id INT,
    manager_id INT NULL,
    PRIMARY KEY (id)
);

INSERT INTO department (dept_name) VALUES ("Enginering");
INSERT INTO department (dept_name) VALUES ("Marketing");
INSERT INTO department (dept_name) VALUES ("Management");
INSERT INTO department (dept_name) VALUES ("Human Resources");
INSERT INTO department (dept_name) VALUES ("CEO");
INSERT INTO department (dept_name) VALUES ("Founder");

INSERT INTO roles (title, salary, department_id) VALUES ("Software Engineer", 65000, 1);
INSERT INTO roles (title, salary, department_id) VALUES ("Marketing Specialist", 80000, 2);
INSERT INTO roles (title, salary, department_id) VALUES ("Management", 75000, 3);
INSERT INTO roles (title, salary, department_id) VALUES ("HR Personnel", 50000, 4);
INSERT INTO roles (title, salary, department_id) VALUES ("CEO", 150000, 5);
INSERT INTO roles (title, salary, department_id) VALUES ("Founder", 250000, 6);

INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("Roman", "Guerrero", 6, NULL);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("Victor", "Azuara", 5, 1);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("Eduardo", "Rivas", 3, 2);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("Miguel", "Gallaga", 2, 2);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("Daniel", "Figeroa", 4, 4);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("Deebs", "Andrade", 1, 3);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("Jose", "Perez", 1, 3);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("Oscar", "Munoz", 1, 3);