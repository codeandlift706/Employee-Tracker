const mysql = require('mysql2');
const inquirer = require('inquirer');

//connect to db
const db = mysql.createConnection(
    {
        host: '127.0.0.1',
        user: 'root',
        password: 'EliWilliam!121',
        database: 'employeelist_db'
    },
    console.log('Connected to employeelist_db')
);

// TODO: Create an array of questions for initial user input
const questions = [
    {
        type: 'list',
        message: 'What do you want to do?',
        name: 'selections',
        choices: [
            'View all Departments',
            'View all Roles',
            'View all Employees',
            'Add a Department',
            'Add a Role',
            'Add an Employee',
            'Update an Employee Role'
        ]
    },
];

// TODO: initialize app with info from db
const init = (db) => {
    inquirer
        .prompt(questions)
        .then((data) => {

            if (data.selections === 'View all Departments') {
                db.query('SELECT * FROM department;', (err, result) => {
                    console.log("View all Departments")
                    console.table(result);
                });
            }

            if (data.selections === 'View all Roles') {
                db.query('SELECT * FROM employee_role;', (err, result) => {
                    console.log("View all Roles")
                    console.table(result)
                    //CURRENTLY ONLY SHOWING: job title, role id, department_id, and the salary
                    //NEEDS TO SHOW: job title, role id, the department that role belongs to, and the salary
                });
            }

            if (data.selections === 'View all Employees') {
                db.query('SELECT * FROM employee;', (err, result) => {
                    console.log("View all Employees")
                    console.table(result)
                    //CURRENTLY ONLY SHOWING: employee ids, first names, last names, manager_id
                    //NEEDS TO SHOW: job titles, departments, salaries, and managers report to
                });
            }

            if (data.selections === 'Add a Department') {
                console.log("Add a Department")

                const addDepartmentQuestion = [
                    {
                        type: 'input',
                        message: 'What is the name of the department?',
                        name: 'department'
                    },
                ];

                inquirer
                    .prompt(addDepartmentQuestion)
                    .then((data) => {
                        db.query("INSERT INTO department VALUES(?, ?)", [data.id, data.department], (err, result) => {
                            console.log(`Added ${data.department} to the employeelist_db.`)
                        })
                    })
            };

            if (data.selections === 'Add a Role') {
                console.log("Add a Role")

                const addRoleQuestion = [
                    {
                        type: 'input',
                        message: 'What is the name of the role?',
                        name: 'role',
                    },
                    {
                        type: 'input',
                        message: 'What is the salary of the role?',
                        name: 'roleSalary',
                    },
                    {
                        type: 'list',
                        message: 'Which department does the role belong to?',
                        name: 'roleDepartment',
                        choices: () => {
                            db.query('SELECT department_name FROM department;')
                        }
                         //HOW DO I POPULATE THE LIST OF ALL DEPTS?
                    },
                ];

                inquirer
                    .prompt(addRoleQuestion)
                    .then((data) => {
                        db.query("INSERT INTO employee_role VALUES(?, ?, ?)", [data.id, data.role, data.roleSalary], (err, result) => {
                            console.log(`Added ${data.role} to the employeelist_db.`)
                        })
                    })
            };

            if (data.selections === 'Add an Employee') {
                console.log("Add an Employee")

                const addEmployeeQuestion = [
                    {
                        type: 'input',
                        message: 'What is the first name of the employee?',
                        name: 'employeeFirstName',
                    },
                    {
                        type: 'input',
                        message: 'What is the last name of the employee?',
                        name: 'employeeLastName',
                    },
                    {
                        type: 'list',
                        message: 'What is their role?',
                        name: 'employeeRole',
                        choices: [db.query('SELECT title FROM employee_role;')] //HOW DO I POPULATE THE LIST OF ALL ROLES?
                    },
                    {
                        type: 'list',
                        message: 'Who is their manager?',
                        name: 'employeeManager',
                        choices: [db.query('SELECT manager.first_name manager.last_name FROM employee;')] //HOW DO I POPULATE THE LIST OF ALL MANAGER NAMES?
                    },
                ];

                inquirer
                    .prompt(addEmployeeQuestion)
                    .then((data) => {
                        db.query("INSERT INTO employee VALUES(?, ?, ?, ?, ?)", [data.id, data.employeeFirstName, data.employeeLastName, data.employeeRole, data.employeeManager], (err, result) => {
                            console.log(`Added ${data.employeeFirstName} ${data.employeeLastName} to the employeelist_db.`)
                        })
                    })
            };


            if (data.selections === 'Update an Employee Role') {
                console.log("Update an Employee Role")

                const updateEmployeeQuestion = [
                    {
                        type: 'list',
                        message: 'Which employee do you want to update?',
                        name: 'updateEmployee',
                        choices: [db.query('SELECT id FROM employee;')] //HOW DO I POPULATE THE LIST OF ALL EMPLOYEE NAMES?
                    },
                    {
                        type: 'input',
                        message: 'Which role do you want to assign the selected employee?',
                        name: 'updateRole',
                        choices: [db.query('SELECT title FROM employee_role;')] //HOW DO I POPULATE THE LIST OF ALL ROLES?
                    },
                ];


                inquirer
                    .prompt(updateEmployeeQuestion)
                    .then((data) => {
                        db.query("INSERT INTO employee VALUES(?, ?, ?)", [data.id, data.updateRole], (err, result) => {
                            console.log(`Added ${data.employeeFirstName} ${data.employeeLastName} to the employeelist_db.`)
                        })
                    })
            };



        })
};

init(db);
