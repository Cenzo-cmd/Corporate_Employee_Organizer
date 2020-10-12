const inquirer = require('inquirer');
const connection = require('./connection');
const start = require('./prompts');
const cTable = require('console.table');

function viewEmployees() {
    console.log('Viewing employees');
    connection.query(`SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name as Department, role.salary, concat( e2.first_name,' ',e2.last_name) AS Manager
    FROM employee 
    LEFT JOIN role on employee.role_id = role.id
    LEFT JOIN department on role.department_id = department.id
    LEFT JOIN employee AS e2 on e2.id=employee.manager_id ;`, (err, res) => {
        if (err) throw err;
        const table = cTable.getTable(res);
        console.log(table);
        start.start();
    });
}

function viewEmpByDept() {
    connection.query('SELECT * FROM corporate_db.department', (err, res) => {
        if (err) throw err;
        const departmentsToChoose = res.map(dept => dept.name);

        inquirer.prompt([{
            name: 'selectDept',
            type: 'list',
            message: 'Which department would you like to view employees for?',
            choices: departmentsToChoose
        }]).then(({ selectDept }) => {
            let departmentChosenId = res.filter(dept => dept.name === selectDept);
            departmentChosenId = departmentChosenId[0].id;

            connection.query(`SELECT first_name, last_name, title, salary FROM employee
            RIGHT JOIN role ON employee.role_id = role.id WHERE department_id = ?;`, departmentChosenId, (err, response) => {
                if (err) throw err;

                if (response.length === 0) {
                    console.log(`\n✨ There are no employees for department: ${selectDept} currently! ✨\n`);
                    start();
                    return;
                };
                const table = cTable.getTable(response);
                console.log(table);
                console.log(`\n✨ Employee's for department: ${selectDept} are displayed! ✨\n`);
                start.start();
            });
        });
    });
}

function viewEmployeesByManager() {
    connection.query(`SELECT CONCAT(e2.first_name, " ", e2.last_name) AS Manager, e1.id AS EMPID, e1.first_name AS First_Name, e1.last_name AS Last_Name, role.title AS Title, department.name AS Department, role.salary AS Salary FROM employee AS e1
    LEFT JOIN role on e1.role_id = role.id
    LEFT JOIN department ON role.department_id = department.id
    INNER JOIN employee AS e2 on e2.id=e1.manager_id
    ORDER BY manager ASC;`, (err, res) => {
        if (err) throw err;
        const table = cTable.getTable(res);
        console.log(table);
        console.log(`\n✨ Employee's by manager are displayed! ✨\n`);
        start.start();
    });

};

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

                start.start();
            });
        });
    });

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

                start.start();
            });
        });
    });
};

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
                    start.start();

                });
            });
        });
    });

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
                    start.start();
                });
            });
        });
    });
};

module.exports = {
    updateEmpMan: updateEmpManager,
    updateEmpRole: updateEmployeeRole,
    delete: deleteEmployee,
    create: addEmployee,
    read: viewEmployeesByManager,
    viewEmpDept: viewEmpByDept,
    viewEmp: viewEmployees
};