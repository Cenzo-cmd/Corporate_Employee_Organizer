const mysql = require('mysql');
const inquirer = require('inquirer');
const cTable = require('console.table');

const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '',
    database: 'corporate_db'
});

connection.connect(err => {
    if (err) throw err;

    // console.log(`
    // +--------------------------+
    // | Welcome to Corporate_db! |
    // +--------------------------+
    // `);

    start();
});

function start() {
    const promptData = {
        name: 'mainMenu',
        type: 'list',
        message: 'What would you like to do?',
        choices: [
            'View Employees',
            'View Employees By Department',
            'View Employees By Manager',
            'Add Employee',
            'Remove Employee',
            'Update Employee Role',
            'Update Employee Manager',
            'Exit'
        ]
    }

    inquirer.prompt(promptData).then(handleRespose);
}

function handleRespose(answers) {
    switch (answers.mainMenu) {
        case 'View Employees':
            viewEmployees();
            break;

        case 'View Employees By Department':
            console.log('view emp by dept')
            break;

        case 'View Employees By Manager':
            console.log('view emp by manger');
            break;

        case 'Add Employee':
            addEmployee();
            break;

        case 'Remove Employee':
            console.log('remove emp');
            break;

        case 'Update Employee Role':
            console.log('update emp role');
            break;

        case 'Update Employee Manager':
            console.log('update emp manager');
            break;

        case 'Exit':
            console.log('Goodbye!');
            connection.end();
            break;

        default:
            console.log('Connection ending');
            connection.end();
    }
}

function viewEmployees() {
    connection.query('SELECT * FROM employee', (err, res) => {
        if (err) throw err;
        const table = cTable.getTable(res);
        console.log(table);
        start();
    });
}

function addEmployee() {
    connection.query(`SELECT employee.id as employee_id, concat(employee.first_name,' ',employee.last_name) as full_name,role.id as role_id, role.title FROM employee LEFT JOIN role on employee.role_id = role.id;`, (err, res) => {
        if (err) throw err;

        let empChoices = res.map(title => title.title);
        let managerChoices = res.map(name => name.full_name);
        const response1 = res;

        inquirer.prompt([{
            name: 'firstName',
            type: 'input',
            message: 'What is the employees first name?'
        }, {
            name: 'lastName',
            type: 'input',
            message: 'What is the employees last name?'
        }, {
            name: 'employeeRole',
            type: 'list',
            message: 'What is the employees role?',
            choices: empChoices
        }, {
            name: 'manager',
            type: 'list',
            message: 'Who is the manager for the new employee?',
            choices: managerChoices

        }]).then(({ firstName, lastName, employeeRole, manager }) => {
            // console.log(response1);

            let newEmpId = response1.filter(value => employeeRole === value.title);
            newEmpId = (newEmpId[0].role_id);

            let newEmpManagerId = response1.filter(name => manager === name.full_name);
            newEmpManagerId = (newEmpManagerId[0].employee_id);
            // console.log(newEmpManagerId)
            // console.log(newEmpId);

            const newEmployee = {
                first_name: firstName,
                last_name: lastName,
                role_id: newEmpId,
                manager_id: newEmpManagerId
            };

            connection.query('INSERT INTO employee SET ?', newEmployee, err => {
                if (err) throw err;

                console.log(`\n✨ Your new employee ${firstName} ${lastName} was created! ✨`);

                start();
            })


        })
    })

}