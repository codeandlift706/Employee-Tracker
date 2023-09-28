-- View all Employees should show: job titles, departments, salaries, and managers report to
-- select all the values you want displayed from all tables
-- FROM main table
-- left join: you want to show all employees on left side even if they don't have manager for ex
-- on table.pk = another table.fk
-- we're treating manager like it is its own separate table, so employee manager is the table name
SELECT employee.id, employee.first_name, employee.last_name, employee.manager_id, employee_role.title, department.department_name, employee_role.salary, manager.first_name, manager.last_name 
FROM employee 
left join employee_role 
on employee.employee_role_id = employee_role.id 
left join department 
on employee_role.department_id = department.id 
left join employee manager 
on employee.manager_id = manager.id;