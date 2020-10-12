const inquirer = require('inquirer');
const connection = require('./connection');
const start = require('./prompts');
const cTable = require('console.table');


function viewTotalBudget() {
    connection.query(` SELECT * FROM department;`, (err, res) => {
        const departmentsListed = res.map(name => name.name);

        inquirer.prompt([{
            name: 'departmentList',
            type: 'list',
            message: 'Which department would you like to see the budget for?',
            choices: departmentsListed
        }]).then(({ departmentList }) => {
            let selectedDepartmentId = res.filter(name => name.name === departmentList);
            selectedDepartmentId = selectedDepartmentId[0].id;

            connection.query(`SELECT department.name AS Department, SUM(role.salary) AS Dept_Budget FROM employee
            LEFT JOIN role on employee.role_id = role.id
            LEFT JOIN department ON role.department_id = department.id
            WHERE department.id = ?`, selectedDepartmentId, (err, response) => {
                if (err) throw err;
                const table = cTable.getTable(response);
                console.log(table);
                start.start();
            });
        });
    });
};

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

                start.start();
            });
        });
    });
};

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
                start.start();
            });
        });
    });
};

module.exports = {
    delDep: deleteDepartment,
    addDep: addDepartment,
    viewBud: viewTotalBudget
};