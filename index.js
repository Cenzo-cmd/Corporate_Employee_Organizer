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
            console.log('add emp');
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