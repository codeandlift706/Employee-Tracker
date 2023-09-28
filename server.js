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

// TODO: Create an array of questions for initial client selection for what they want to do
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


function addARole() {
    //we have to retrieve all data from the department table first so we can work with it
    db.query('SELECT * FROM department;', (err, result) => {
        console.log(result)

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
                choices: result.map((dp) => { //the result returns to us an array of objects. We are creating a new array and retitling the properties that are compatible with inquirer, for the list of depts to show for the client to select from
                    return {
                        value: dp.id, // column title: value
                        name: dp.department_name //column title: name
                    }
                })
            },
        ];

        inquirer
            .prompt(addRoleQuestion)
            .then((data) => {
                db.query("INSERT INTO employee_role (title, salary, department_id) VALUES(?, ?, ?)", [data.role, data.roleSalary, data.roleDepartment], (err, result) => {
                    console.log(`Added ${data.role} to the employeelist_db.`)
                    init(); //run init again so that the user can continue with the original set of questions if they want to do something else
                })
            })

    })
}



// TODO: initialize app with info from db
const init = () => {
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
                db.query('SELECT title, salary, employee_role.id, department_name FROM department JOIN employee_role ON department.id = employee_role.department_id;', (err, result) => {
                    console.log("View all Roles")
                    console.table(result)
                });
            }

            if (data.selections === 'View all Employees') {
                db.query('SELECT employee.id, employee.first_name, employee.last_name, employee.manager_id, employee_role.title, department.department_name, employee_role.salary, manager.first_name, manager.last_name FROM employee left join employee_role on employee.employee_role_id = employee_role.id left join department on employee_role.department_id = department.id left join employee manager on employee.manager_id = manager.id;', (err, result) => {
                    console.log("View all Employees")
                    console.table(result)
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
                        db.query("INSERT INTO department VALUES(?)", [data.department], (err, result) => {
                            console.log(`Added ${data.department} to the employeelist_db.`)
                        })
                    })
            };

            if (data.selections === 'Add a Role') {
                addARole();
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

init();
