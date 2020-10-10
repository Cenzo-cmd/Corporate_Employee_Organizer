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
            'Add A Job Role',
            'Add Department',
            'Delete An Employee',
            'Delete An Emoloyee Role',
            'Delete A Department',
            'Update Employee Role',
            'Update Employee Manager',
            'Exit'
        ]
    };

    inquirer.prompt(promptData).then(handleRespose);
}

function handleRespose(answers) {
    switch (answers.mainMenu) {
        case 'View Employees':
            viewEmployees();
            break;

        case 'View Employees By Department':
            viewEmpByDept();
            break;

        case 'View Employees By Manager':
            console.log('view emp by manger');
            break;

        case 'Add Employee':
            addEmployee();
            break;

        case 'Add A Job Role':
            addRole();
            break;

        case 'Add Department':
            addDepartment();
            break;

        case 'Delete An Employee':
            deleteEmployee();
            break;

        case 'Delete An Emoloyee Role':
            deleteRole();
            break;

        case 'Delete A Department':
            deleteDepartment();
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

function viewEmpByDept() {

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

            let newEmpId = response1.filter(value => employeeRole === value.title);
            newEmpId = (newEmpId[0].role_id);

            let newEmpManagerId = response1.filter(name => manager === name.full_name);
            newEmpManagerId = (newEmpManagerId[0].employee_id);

            const newEmployee = {
                first_name: firstName,
                last_name: lastName,
                role_id: newEmpId,
                manager_id: newEmpManagerId
            };

            connection.query('INSERT INTO employee SET ?', newEmployee, err => {
                if (err) throw err;

                console.log(`\n✨ Your new employee ${firstName} ${lastName} was created! ✨\n`);

                start();
            });
        });
    });

}

function addRole() {
    connection.query(`SELECT * FROM corporate_db.department;`, (err, res) => {
        if (err) throw err;
        let departments = res.map(name => name.name);
        let response3 = res;
        console.log(response3);

        inquirer.prompt([{
            name: 'roleTitle',
            type: 'input',
            message: `What is the rolels title?`
        }, {
            name: 'roleSalary',
            type: 'number',
            message: 'What is the salary for this role?'
        }, {
            name: 'roleDepartment',
            type: 'list',
            message: 'Which department is the role in?',
            choices: departments
        }]).then(({ roleTitle, roleSalary, roleDepartment }) => {

            let departmentId = response3.filter(dept => roleDepartment === dept.name);
            departmentId = departmentId[0].id;
            console.log(departmentId);
            let newRole = {
                title: roleTitle,
                salary: roleSalary,
                department_id: departmentId
            };

            connection.query('INSERT INTO role set ?', newRole, (err, res) => {
                if (err) throw err;

                console.log(`\n✨ Your new role ${roleTitle} was created! ✨\n`);

                start();
            })
        })


    })
}

function addDepartment() {
    connection.query('SELECT * FROM corporate_db.department', (err, res) => {
        if (err) throw err;

        inquirer.prompt([{
            name: 'addDepartment',
            type: 'input',
            message: 'What department would you like to add?'
        }]).then(({ addDepartment }) => {
            let newDepartment = { name: addDepartment };
            connection.query('INSERT INTO department SET ?', newDepartment, (err, res) => {
                if (err) throw err;

                console.log(`\n✨ Your department ${addDepartment} was created! ✨\n`);

                start();
            })
        })
    })
}

function deleteEmployee() {
    connection.query(`SELECT employee.id, concat(employee.first_name,' ',employee.last_name) AS whole_name, employee.role_id, employee.manager_id FROM corporate_db.employee;`, (err, res) => {
        if (err) throw err;

        let employeeToDelete = res.map(name => name.whole_name);
        let deleteResponse = res;

        inquirer.prompt([{
            name: 'empName',
            type: 'list',
            message: 'Select an Employee to delete',
            choices: employeeToDelete
        }]).then(({ empName }) => {
            console.log('this is the employee name', empName);
            const employeeToBeDeleted = deleteResponse.filter(name => name.whole_name === empName);
            const employeeIdToDelete = employeeToBeDeleted[0].id;

            connection.query('DELETE FROM employee WHERE id=?', employeeIdToDelete, err => {
                if (err) throw err;

                console.log(`\n✨ Your employee ${empName} was deleted! ✨\n`);

                start();
            })
        })
    })
}

function deleteRole() {
    connection.query('SELECT * FROM corporate_db.role', (err, res) => {
        if (err) throw err;

        let positionTitle = res.map(title => title.title);


        inquirer.prompt([{
            name: 'jobTitle',
            type: 'list',
            message: 'Which employee role would you like to delete?',
            choices: positionTitle
        }]).then(({ jobTitle }) => {
            // console.log(jobTitle);
            // console.log(res);
            let filteredTitles = res.filter(title => jobTitle === title.title);
            let titleIdToDelte = filteredTitles[0].id;

            connection.query('DELETE FROM role WHERE id=?', titleIdToDelte, err => {
                if (err) throw err;
                console.log(`\n✨ The employee role ${jobTitle} was deleted! ✨\n`);
                start();
            })

        })
    })
}

function deleteDepartment() {
    connection.query('SELECT * FROM corporate_db.department', (err, res) => {
        if (err) throw err;
        let departmentChoices = res.map(dept => dept.name);

        inquirer.prompt([{
            name: 'departmentName',
            type: 'list',
            message: 'Which department would you like to delete?',
            choices: departmentChoices
        }]).then(({ departmentName }) => {
            const filteredDept = res.filter(dept => departmentName === dept.name);
            const departmentId = filteredDept[0].id;

            connection.query('DELETE FROM department WHERE id=?', departmentId, err => {
                if (err) throw err;
                console.log(`\n✨ The department ${departmentName} was deleted! ✨\n`);
                start();
            })
        })

    })
}