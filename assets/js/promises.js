const emp = require('./employee');
const role = require('./role');
const department = require('./department');
const connection = require('./connection');

function handleResponse(answers) {
    console.log('this is the answer', answers);
    switch (answers.mainMenu) {
        case 'View Employees':
            console.log('This is the view employees');
            emp.viewEmp();
            break;

        case 'View Employees By Department':
            emp.viewEmpDept();
            break;

        case 'View Employees By Manager':
            emp.read();
            break;

        case 'View Total Budget Of A Department':
            department.viewBud();
            break;

        case 'Add Employee':
            emp.create();
            break;

        case 'Add A Job Role':
            role.addRole();
            break;

        case 'Add Department':
            department.addDep();
            break;

        case 'Delete An Employee':
            emp.delete();
            break;

        case 'Delete An Emoloyee Role':
            role.delRole();
            break;

        case 'Delete A Department':
            department.delDep();
            break;

        case 'Update Employee Role':
            emp.updateEmpRole();
            break;

        case 'Update Employee Manager':
            emp.updateEmpMan();
            break;

        case 'Exit':
            console.log('Goodbye!');
            connection.end();
            break;

    };
};

module.exports.handle = handleResponse;