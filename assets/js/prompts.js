const inquirer = require('inquirer');
const handle = require('./promises');

function start() {

    inquirer.prompt({
        name: 'mainMenu',
        type: 'rawlist',
        message: 'What would you like to do?',
        choices: [
            'View Employees',
            'View Employees By Department',
            'View Employees By Manager',
            'View Total Budget Of A Department',
            'Add Employee',
            'Add A Job Role',
            'Add Department',
            'Delete An Employee',
            'Delete An Emoloyee Role',
            'Delete A Department',
            'Update Employee Role',
            'Update Employee Manager',
            'Exit'
        ]
    }).then(handle.handle);
};

module.exports.start = start;