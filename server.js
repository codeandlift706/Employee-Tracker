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

function viewAllEmployees() { //NEED TO FIX: WHY DOESN'T MANAGER SHOW AND ALL EMPLOYEES SHOW?
    db.query('SELECT employee.id, employee.first_name, employee.last_name, employee.manager_id, employee_role.title, department.department_name, employee_role.salary, manager.first_name, manager.last_name FROM employee left join employee_role on employee.employee_role_id = employee_role.id left join department on employee_role.department_id = department.id left join employee manager on employee.manager_id = manager.id;', (err, result) => {
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

function addEmployee() { //NEED TO FIX, DOES NOT WORK
    db.query('SELECT title FROM employee_role; SELECT manager_id, manager.first_name, manager.last_name FROM employee manager;', (err, result) => { 
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
                choices: result.map((er) => {
                    return {
                        name: er.title
                    }
                })
            },
            {
                type: 'list',
                message: 'Who is their manager?',
                name: 'employeeManager',
                choices: result.map((managerName) => {
                    return {
                        name: managerName.first_name + managerName.last_name
                    }
                })
            },
        ];

        inquirer
            .prompt(addEmployeeQuestion)
            .then((data) => {
                db.query("INSERT INTO employee (first_name, last_name, manager_id) VALUES (?, ?, ?)", [data.employeeFirstName, data.employeeLastName, data.employeeManager], (err, result) => {
                    console.log(`Added ${data.employeeFirstName} ${data.employeeLastName} to the employeelist_db.`)
                })

                db.query("INSERT INTO employee_role (employee_role.id) VALUE(?)", [data.employeeRole], (err, result) => {
                    console.log(`Added ${data.employeeRole} for ${data.employeeFirstName} ${data.employeeLastName} to the employeelist_db.`)
                    init();
                })
            })

    })
}



function updateEmployee () { //NEED TO FIX, DOES NOT WORK
    db.query('SELECT first_name, last_name FROM employee; SELECT title FROM employee_role;', (err, result) => {
    const updateEmployeeQuestion = [
        {
            type: 'list',
            message: 'Which employee do you want to update?',
            name: 'updateEmployee',
            choices: result.map((em) => {
                return {
                    name: em.first_name + em.last_name
                }
            })
        },
        {
            type: 'input',
            message: 'Which role do you want to assign the selected employee?',
            name: 'updateRole',
            choices: result.map((rl) => {
                return {
                    name: rl.title
                }
            })
        },
    ];

    inquirer
        .prompt(updateEmployeeQuestion)
        .then((data) => {
            db.query("UPDATE employee SET (employee_role_id) VALUE(?), WHERE employee.employee_role_id = employee_role.id", [data.updateRole], (err, result) => {
                console.log(`Updated role for the selected employee in the employeelist_db.`);
                init();
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
