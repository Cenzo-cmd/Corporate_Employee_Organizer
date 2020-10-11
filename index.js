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
            // viewEmpByDept();
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
            updateEmployeeRole();
            break;

        case 'Update Employee Manager':
            updateEmpManager();
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
    connection.query(`SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name as Department, role.salary, concat( e2.first_name,' ',e2.last_name) AS Manager
    FROM employee 
    LEFT JOIN role on employee.role_id = role.id
    LEFT JOIN department on role.department_id = department.id
    LEFT JOIN employee AS e2 on e2.id=employee.manager_id ;`, (err, res) => {
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

function updateEmployeeRole() {
    connection.query(`SELECT employee.id, concat(employee.first_name,' ',employee.last_name) AS whole_name, role.title FROM employee JOIN role on employee.role_id = role.id;`, (err, res) => {
        if (err) throw err;
        let employeeName = res.map(name => name.whole_name);
        let response4 = res;

        connection.query('SELECT * FROM corporate_db.role;', (err, response) => {
            if (err) throw err;
            let allJobTitles = response.map(job => job.title);
            let response5 = response;

            inquirer.prompt([{
                name: 'selectEmp',
                type: 'list',
                message: 'Which employee would you like to update?',
                choices: employeeName
            }, {
                name: 'selectRole',
                type: 'list',
                message: 'What is the employees new role?',
                choices: allJobTitles
            }]).then(({ selectEmp, selectRole }) => {
                let employeeObj = response4.filter(name => name.whole_name === selectEmp);
                let employeeId = employeeObj[0].id;

                let empRoleId = response5.filter(id => id.title === selectRole);
                const jobRoleId = empRoleId[0].id;

                connection.query('UPDATE employee SET ? WHERE ?', [
                    { role_id: jobRoleId },
                    { id: employeeId }
                ], err => {
                    if (err) throw err;
                    console.log(`\n✨ Employee named ${selectEmp}'s role was updated to ${selectRole}! ✨\n`);
                    start();

                })
            })
        })
    })

};

function updateEmpManager() {
    connection.query(`SELECT employee.id, concat(employee.first_name,' ',employee.last_name) AS EMP_full_name, role.title, department.name as Department, role.salary, concat( e2.first_name,' ',e2.last_name) AS Manager
    FROM employee 
    LEFT JOIN role on employee.role_id = role.id
    LEFT JOIN department on role.department_id = department.id
    LEFT JOIN employee AS e2 on e2.id=employee.manager_id ;`, (err, res) => {
        if (err) throw err;
        let employeeName = res.map(name => name.EMP_full_name);

        inquirer.prompt([{
            name: 'selectEmp',
            type: 'list',
            message: 'Which employee would you like to update the manager for?',
            choices: employeeName
        }]).then(({ selectEmp }) => {
            inquirer.prompt([{
                name: 'selectManager',
                type: 'list',
                message: 'Who is the employees new boss?',
                choices: employeeName.filter(managers => managers !== selectEmp)
            }]).then(({ selectManager }) => {
                let employeeToUpdateId = res.filter(name => name.EMP_full_name === selectEmp);
                employeeToUpdateId = employeeToUpdateId[0].id;
                let managerSelectedId = res.filter(name => name.EMP_full_name === selectManager);
                managerSelectedId = managerSelectedId[0].id;

                const managerUpdated = [{
                    manager_id: managerSelectedId
                }, {
                    id: employeeToUpdateId
                }];

                connection.query('UPDATE employee SET ? WHERE ?', managerUpdated, (err, response) => {
                    if (err) throw err;
                    console.log(`\n✨ Employee named ${selectEmp}'s manager was updated to ${selectManager}! ✨\n`);
                    start();
                });
            });
        });

    });
};