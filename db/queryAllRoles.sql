-- View all Roles should show: job title, role id, the department that role belongs to, and the salary

SELECT title, salary, employee_role.id, department_name FROM department JOIN employee_role ON department.id = employee_role.department_id;




