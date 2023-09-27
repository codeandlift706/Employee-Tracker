-- View all Employees should show: job titles, departments, salaries, and managers report to

SELECT title, department_name, salary, manager_id
FROM department
JOIN employee_role
ON department.id = employee_role.department_id
JOIN employee
ON department.id = employee.employee_role_id;