const inquirer = require('inquirer');
const connection = require('./connection');
const start = require('./prompts');

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

                start.start();
            });
        });
    });
};

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
                start.start();
            });
        });
    });
};

module.exports = {
    delRole: deleteRole,
    addRole: addRole
};