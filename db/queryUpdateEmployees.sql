
-- UPDATE employee SET (employee_role_id) VALUE(?), WHERE employee.employee_role_id = employee_role.id
UPDATE employee SET (emoployee_role_id) VALUES(?, ?, ?)


UPDATE Station AS st1, StationOld AS st2
   SET st1.already_used = 1
 WHERE st1.code = st2.code