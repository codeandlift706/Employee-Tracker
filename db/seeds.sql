INSERT INTO department (department_name)
VALUES ("HR"),
("Finance"),
("Accounting"),
("IT");

INSERT INTO employee_role (title, salary, department_id)
Values('HR Generalist', 70000, 1),
('Senior Financial Analyst', 90000, 2),
('Controller', 150000, 3),
('Director of IT', 175000, 4);

INSERT INTO employee (first_name, last_name, employee_role_id, manager_id)
Values('Sabrina', 'Nguyen', 1, 2),
('Quinton', 'Nguyen', 2, 3),
('Hannah', 'Vu', 3, 4),
('Emily', 'Tran', 4, NULL);

