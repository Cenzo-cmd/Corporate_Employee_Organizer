INSERT INTO department (name)
VALUES 
('Marketing'),
('Sales'),
('Legal'),
('Technology'),
('Board of Directors');

INSERT INTO `role` (title, salary, department_id)
VALUES  
('Marketing Director', 125000, 100),
('Marketing Analyst', 100000, 100),
('Sales Director', 100000, 101),
('Sales Person', 65000, 101),
('Lawyer', 200000, 102),
('Web Developer', 100000, 103),
('Programmer', 100000, 103),
('CEO', 1000000, 104),
('CFO', 750000, 104);





INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
('Vincent', 'Doria', 8, NULL),
('Eric', 'Torres', 9, NULL),
('Jerry', 'Williams', 1, 1001),
('Enrique', 'Maxwell', 2, 1002),
('Janie', 'Caldwell', 3, 1001),
('Hazel', 'Baldwin', 4, 1004),
('Ben', 'Cannon', 5, 1000),
('Bob', 'Spencer', 6, 1001),
('Rachel', 'Hogan', 7, 1007);


