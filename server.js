const mysql = require('mysql2');
const inquirer = require('inquirer');



// TODO: Create an array of questions for user input
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


    
        // TODO: initialize app
        const init = (db) => {
            inquirer
                .prompt(questions)
                .then((data) => {

                    if (data.selections === 'View all Departments') {
                        db.query('SELECT * FROM department;', (err, result) => {
                        console.error(err);
                        console.log("View all Departments")
                        console.table(result);
                        });
                    }

                    if (data.selections === 'View all Roles') {
                        db.query('SELECT * FROM employee_role;', (err, result) => {
                            console.error(err);
                            console.log("View all Roles")
                            console.table(result)
                    });
                    }

                    if (data.selections === 'View all Employees') {
                        db.query('SELECT * FROM employee;', (err, result) => {
                        console.error(err);
                        console.log("View all Employees")
                        console.table(result)
                    });
                    }


                    if (data.selections === 'Add a Department') {
                        console.log("Add a Department")
                        //

                    }


                    if (data.selections === 'Add a Role') {
                        console.log("Add a Role")

                    }



                    if (data.selections === 'Add an Employee') {
                        console.log("Add an Employee")

                    }


                    if (data.selections === 'Update an Employee Role') {
                        console.log("Update an Employee Role")

                    }
                })}
init(db);






//we're telling the command we want to send to the mysql server, and we log the result when the server returns that data back
// app.get('/api/employeeList', async (req, res) => {
//     try {
//         const [rows] = await db.query('SELECT department_name, department_id FROM department JOIN employee_role ON instructors.id = employee_role.department_id;')
//         console.table(rows);
//         return res.json(rows);

//     } catch (err) {
//         console.error(err);
//         return res.status(500).json(err);
//     }
// });
//     });



// app.listen(PORT, () => {
//     console.log(`Server running on port ${PORT}`);
// });

