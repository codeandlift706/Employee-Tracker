//Import mysql and inquirer
const mysql = require('mysql2');
const inquirer = require('inquirer');

//Connect to mysql db
const db = mysql.createConnection(
    {
        host: '127.0.0.1',
        user: 'root',
        password: 'EliWilliam!121',
        database: 'employeelist_db'
    },
    console.log('Connected to employeelist_db')
);


//Create an array of questions for initial client selection for what they want to do
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

function viewAllDepartments() {
    db.query('SELECT * FROM department;', (err, result) => {
        console.table(result);
        init();
    });
}

function viewAllRoles() {
    db.query('SELECT title, salary, employee_role.id, department_name FROM department JOIN employee_role ON department.id = employee_role.department_id;', (err, result) => {
        console.table(result)
        init();
    });
}

function viewAllEmployees() { //employee.first_name and employee_last.name shows up if we provide aliases for manager.first_name and manager.last_name to differentiate the first.name and last.name
    db.query('SELECT employee.id, employee.first_name, employee.last_name, employee.manager_id, employee_role.title, department.department_name, employee_role.salary, manager.first_name as manager_first_name, manager.last_name as manager_last_name FROM employee left join employee_role on employee.employee_role_id = employee_role.id left join department on employee_role.department_id = department.id left join employee manager on employee.manager_id = manager.id;', (err, result) => {
        console.table(result);
        init();
    });
}

function addADepartment() {
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
            db.query("INSERT INTO department (department_name) VALUES(?)", [data.department], (err, result) => {
                console.log(`Added ${data.department} to the employeelist_db.`);
                init();
            })
        })
}


function addARole() {
    //we have to retrieve all data from the department table first so we can work with it
    db.query('SELECT * FROM department;', (err, result) => {

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
                    console.log(`Added ${data.role} to the employeelist_db.`);
                    init();
                })
            })

    })
}

function addEmployee() { //separate queries for each table you pull data from
    db.query('SELECT title, id FROM employee_role;', (err, role) => { //we need the role title for the user to select from, but we are updating their employeeroleid
        db.query('SELECT id, first_name, last_name FROM employee;', (err, manager) => { //we need the employee name from user input, but we are updating their employeeid
            console.log(role, manager)

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
                    choices: role.map((role) => {
                        return {
                            name: role.title,
                            value: role.id
                        }
                    })
                },
                {
                    type: 'list',
                    message: 'Who is their manager?',
                    name: 'employeeManager',
                    choices: manager.map((manager) => {
                        return {
                            name: manager.first_name + " " + manager.last_name,
                            value: manager.id
                        }
                    })
                },
            ];
            inquirer
                .prompt(addEmployeeQuestion)
                .then((data) => {
                    db.query("INSERT INTO employee (first_name, last_name, manager_id, employee_role_id) VALUES (?, ?, ?, ?)", [data.employeeFirstName, data.employeeLastName, data.employeeManager, data.employeeRole], (err, result) => {
                        console.log(`Added ${data.employeeFirstName} ${data.employeeLastName} to the employeelist_db.`)
                        init();
                    })
                })
        })

    })
}

function updateEmployee() { //separate queries for each table you pull data from
    db.query('SELECT first_name, last_name, id FROM employee;', (err, employeeNameData) => { //we need the employee names for the user to select from, but we are updating their employeeid
        db.query('SELECT title, id FROM employee_role;', (err, employeeRoleData) => { //we need the titles for the user to select from, but we are updating their employeeroleid

            const updateEmployeeQuestion = [
                {
                    type: 'list',
                    message: 'Which employee do you want to update?',
                    name: 'updateEmployee',
                    choices: employeeNameData.map((em) => {
                        return {
                            name: em.first_name + " " + em.last_name,
                            value: em.id
                        }
                    })
                },
                {
                    type: 'list',
                    message: 'Which role do you want to assign the selected employee?',
                    name: 'updateRole',
                    choices: employeeRoleData.map((rl) => {
                        return {
                            name: rl.title,
                            value: rl.id
                        }
                    })
                },
            ];

            inquirer
                .prompt(updateEmployeeQuestion)
                .then((data) => {
                    db.query("UPDATE employee SET employee_role_id = ? WHERE id = ?", [data.updateRole, data.updateEmployee], (err, result) => { //update employee table = update the employeeroleid for the selected role at the employeeid we give
                        console.log(`Updated role for the selected employee in the employeelist_db.`);
                        init();
                    })
                })
        })
    })
}





// This is to iitialize app with "node server" in the terminal, will then have to call this function
const init = () => {
    inquirer
        .prompt(questions)
        .then((data) => {

            if (data.selections === 'View all Departments') {
                viewAllDepartments();
            };

            if (data.selections === 'View all Roles') {
                viewAllRoles();
            };

            if (data.selections === 'View all Employees') {
                viewAllEmployees();
            };

            if (data.selections === 'Add a Department') {
                addADepartment();
            };

            if (data.selections === 'Add a Role') {
                addARole();
            };

            if (data.selections === 'Add an Employee') {
                addEmployee();
            };

            if (data.selections === 'Update an Employee Role') {
                updateEmployee();
            };
        })
};

init();
