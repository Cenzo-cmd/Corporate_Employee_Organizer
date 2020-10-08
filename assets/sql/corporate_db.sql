DROP DATABASE IF EXISTS corporate_db;

CREATE DATABASE corporate_db;

USE corporate_db;

CREATE TABLE department (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(30) NOT NULL,

    PRIMARY KEY(id)
);
-- Starts department at id #100
ALTER TABLE department AUTO_INCREMENT=100;


CREATE TABLE `role` (
    id INT NOT NULL AUTO_INCREMENT, 
    title VARCHAR(30) NOT NULL,
    salary DECIMAL(15,2) NOT NULL,
    department_id INT NOT NULL, 

    PRIMARY KEY(id),
    FOREIGN KEY (department_id) REFERENCES department(id)
);

CREATE TABLE employee (
    id INT NOT NULL AUTO_INCREMENT,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INT NOT NULL,
    manager_id INT NULL,

    PRIMARY KEY(id),
    
    FOREIGN KEY(role_id) REFERENCES role(id)
);

-- starts employees id numbers at 1000
ALTER TABLE employee AUTO_INCREMENT=1000;