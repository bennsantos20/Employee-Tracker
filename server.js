// App requirements
const inquirer = require("inquirer");
const mysql = require("mysql");
// const sequelize = require('./config/connection');
const empArray = [];
const mgrArray = [];
const roleArray = [];
const deptArray = [];

const connection = mysql.createConnection({
  host: 'localhost',

  // Your port, if not 3306
  port: 3306,

  // Your username
  user: 'root',

  // Be sure to update with your own MySQL password!
  password: 'Emiliosnts96',
  database: 'employee_trackerDB',
});

connection.connect((err) => {
  if (err) throw err;
  console.log(`connected as id ${connection.threadId}`);
  connection.end();
});


// Function to initialize the app
function initApp() {
  inquirer
    .prompt({
      type: "list",
      message: "Please make a selection.",
      name: "action",
      choices: [
        "View all employees",
        "View all employees by department",
        "View all employees by manager",
        "View all roles",
        "View all departments",
        "Add an employee",
        "Add a department",
        "Edit a department",
        "Add an employee role",
        "Update an employee role",
        "Quit",
      ],
    })
    .then((res) => {
      if (res.action === "View all employees") {
        viewAllEmp();
      } else if (res.action === "View all employees by department") {
        empByDept();
      } else if (res.action === "View all employees by manager") {
        empByMgr();
      } else if (res.action === "View all roles") {
        viewAllRoles();
      } else if (res.action === "View all departments") {
        viewAllDept();
      } else if (res.action === "Add an employee") {
        addEmp();
      } else if (res.action === "Add a department") {
        addDept();
      } else if (res.action === "Edit a department") {
        editDept();
      } else if (res.action === "Add an employee role") {
        addEmpRole();
      } else if (res.action === "Update an employee role") {
        updateEmpRole();
      } else if (res.action === "Quit") { 
        connection.end();
      }
    })
    .catch((err) => console.log(err));
}

// Function to display all employees
function viewAllEmp() {
  console.log("View all employees");
  connection.query(
    `SELECT employee.id, employee.first_name, employee.last_name, roles.title, roles.salary, department.dept_name, concat(manager.first_name," ", manager.last_name) AS "manager"
    FROM employee 
    LEFT JOIN employee AS manager ON employee.manager_id = manager.id
    LEFT JOIN roles ON employee.role_id = roles.id 
    LEFT JOIN department ON roles.department_id = department.id`,
    function (err, res) {
      if (err) throw err;
      console.log("\nEmployee listing\n--------------------------------------");
      console.table(res);
      initApp();
    }
  );
}

// Function to display all employees by department
function empByDept() {
  console.log("View all employees by department");
  connection.query(
    `SELECT employee.id, employee.first_name, employee.last_name, roles.title, roles.salary, department.dept_name, concat(manager.first_name," ", manager.last_name) AS "manager"
    FROM employee
    LEFT JOIN employee AS manager ON employee.manager_id = manager.id
    LEFT JOIN roles ON employee.role_id = roles.id 
    LEFT JOIN department ON roles.department_id = department.id
    ORDER BY department.dept_name`,
    function (err, res) {
      if (err) throw err;
      console.log(
        "\nEmployees by department\n--------------------------------------"
      );
      console.table(res);
      initApp();
    }
  );
}

// Function to display all employees by manager
function empByMgr() {
  console.log("View all employees by manager");
  connection.query(
    `SELECT employee.id, employee.first_name, employee.last_name, roles.title, roles.salary, department.dept_name, concat(manager.first_name," ", manager.last_name) AS "manager"
    FROM employee 
    LEFT JOIN employee AS manager ON employee.manager_id = manager.id 
    LEFT JOIN roles ON employee.role_id = roles.id 
    LEFT JOIN department ON roles.department_id = department.id
    ORDER BY manager`,
    function (err, res) {
      if (err) throw err;
      console.log(
        "\nEmployees by manager\n--------------------------------------"
      );
      console.table(res);
      initApp();
    }
  );
}

// Function to view all roles
function viewAllRoles() {
  connection.query(
    `SELECT roles.id, roles.title, roles.salary, department.dept_name 
    FROM roles
    LEFT JOIN department ON roles.department_id = department.id`,
    (err, data) => {
      if (err) throw err;
      console.log("\nRoles listing\n--------------------------------------");
      console.table(data);
      initApp();
    }
  );
}

// Function to view all departments
function viewAllDept() {
  connection.query("SELECT * FROM department", (err, data) => {
    if (err) throw err;
    console.log("\nDepartment Listing\n--------------------------------------");
    console.table(data);
    initApp();
  });
}

// Function to add an employee
function addEmp() {
  inquirer
    .prompt([
      {
        type: "input",
        message:
          "First name?",
        name: "first_name",
      },
      {
        type: "input",
        message: "Last name?",
        name: "last_name",
      },
      {
        type: "list",
        message: "Employee role?",
        name: "role",
        choices: getRoleArray(),
      },
      {
        type: "list",
        message: "Employee's manager?",
        name: "manager",
        choices: getMgrArray(),
      },
    ])
    .then((res) => {
      const firstName = res.first_name;
      const lastName = res.last_name;
      const roleID = res.role.id;
      const mgrID = res.manager.id;
      connection.query(
        "INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)",
        [firstName, lastName, roleID, mgrID],
        (err, result) => {
          if (err) throw err;
          console.log(
            `${firstName} ${lastName} was successfully added to employee database.`
          );
          initApp();
        }
      );
    })
    .catch((err) => {
      if (err) throw err;
    });
}


// Function to add a department
function addDept() {
  inquirer
    .prompt({
      type: "input",
      message: "What department do you wish to add?",
      name: "newDept",
    })
    .then((res) => {
      connection.query(
        "INSERT INTO department (dept_name) VALUES (?)",
        [res.newDept],
        (err, result) => {
          if (err) throw err;
          console.log(`${res.newDept} was successfully added to the database.`);
          initApp();
        }
      );
    });
}

// Function to update an existing department
function editDept() {
  inquirer
    .prompt([
      {
        type: "list",
        message: "Please confirm that you wish to edit a department.",
        name: "confirm",
        choices: ["Yes", "No"],
      },
      {
        type: "list",
        message: "Which department do you wish to edit?",
        name: "editedDept",
        choices: getDeptArray(),
        when: (answer) => answer.confirm === "Yes",
      },
      {
        type: "input",
        message: "What is the new name of the department?",
        name: "deptName",
        when: (answer) => answer.confirm === "Yes",
      },
    ])
    .then((res) => {
      if (res.confirm === "No") {
        initApp();
      } else {
        connection.query(
          "UPDATE department SET dept_name = ? WHERE id = ?",
          [res.deptName, res.editedDept.id],
          (err, result) => {
            if (err) throw err;
            console.log(
              `${res.editedDept.dept_name} was updated to ${res.deptName}.`
            );
            initApp();
          }
        );
      }
    })
    .catch((err) => {
      if (err) throw err;
    });
}

// Function to add a role
function addEmpRole() {
  inquirer
    .prompt([
      {
        type: "input",
        message: "What role do you wish to add?",
        name: "newRole",
      },
      {
        type: "input",
        message: "Please enter the salary for this role.",
        name: "newRoleSalary",
      },
      {
        type: "list",
        message: "What department is this role under?",
        name: "newRoleDept",
        choices: getDeptArray(),
      },
    ])
    .then((res) => {
      let departmentID = res.newRoleDept.id;
      connection.query(
        "INSERT INTO roles (, salary, department_id) VALUES (?, ?, ?)",
        [res.newRole, res.newRoleSalary, departmentID],
        (err, result) => {
          if (err) throw err;
          console.log(`${res.newRole} was successfully added to the database.`);
          initApp();
        }
      );
    })
    .catch((err) => {
      if (err) throw err;
    });
}

// Function to edit an existing role
function updateEmpRole() {
  inquirer
    .prompt([
      {
        type: "list",
        message: "Please confirm that you wish to edit a role.",
        name: "confirm",
        choices: ["Yes", "No"],
      },
      {
        type: "list",
        message: "Which role do you wish to edit?",
        name: "roleToEdit",
        choices: getRoleArray(),
        when: (answer) => answer.confirm === "Yes",
      },
      {
        type: "checkbox",
        message: "Select the item you wish to edit for this role.",
        name: "itemsToEdit",
        choices: ["Title", "Salary", "Department"],
        when: (answer) => answer.confirm === "Yes",
      },
      {
        type: "input",
        message: "What is the new title?",
        name: "title",
        when: (answer) =>
          answer.confirm === "Yes" && answer.itemsToEdit.includes("Title"),
      },
      {
        type: "input",
        message: "What is the new salary?",
        name: "salary",
        when: (answer) =>
          answer.confirm === "Yes" && answer.itemsToEdit.includes("Salary"),
      },
      {
        type: "list",
        message: "What is the new department?",
        name: "department",
        choices: getDeptArray(),
        when: (answer) =>
          answer.confirm === "Yes" && answer.itemsToEdit.includes("Department"),
      },
    ])
    .then((res) => {
      if (res.confirm === "No") {
        initApp();
      } else {
        for (let i = 0; i < res.itemsToEdit.length; i++) {
          if (res.itemsToEdit[i] === "Title") {
            connection.query(
              "UPDATE roles SET title = ? WHERE id = ?",
              [res.title, res.roleToEdit.id],
              (err, result) => {
                console.log("Title successfully updated.");
              }
            );
          } else if (res.itemsToEdit[i] === "Salary") {
            connection.query(
              "UPDATE roles SET salary = ? WHERE id = ?",
              [res.salary, res.roleToEdit.id],
              (err, result) => {
                console.log("Salary successfully updated.");
              }
            );
          } else if (res.itemsToEdit[i] === "Department") {
            connection.query(
              "UPDATE roles SET department_id = ? WHERE id = ?",
              [res.department.id, res.roleToEdit.id],
              (err, result) => {
                console.log("Department successfully updated.");
              }
            );
          } else {
            console.log("Error");
          }
        }
        initApp();
      }
    });
}

// Function to render emp array from the employeesDB
function getEmpArray() {
  connection.query(
    "SELECT id, first_name, last_name FROM employee",
    (err, data) => {
      if (err) throw err;
      for (let i = 0; i < data.length; i++) {
        let thisEmployee = {
          name: `${data[i].first_name} ${data[i].last_name}`,
          value: data[i],
        };
        empArray.push(thisEmployee);
      }
    }
  );
  return empArray;
}

// Function to render mgr array from the employeesDB; if no mgr, add a "null" value
function getMgrArray() {
  connection.query(
    "SELECT id, first_name, last_name FROM employee",
    (err, data) => {
      if (err) throw err;
      for (let i = 0; i < data.length; i++) {
        let manager = {
          name: `${data[i].first_name} ${data[i].last_name}`,
          value: data[i],
        };
        mgrArray.push(manager);
      }
      mgrArray.push({ name: "No Manager", value: { id: null } });
    }
  );
  return mgrArray;
}

// Function to render roles array from the employeesDB
function getRoleArray() {
  connection.query("SELECT id, title FROM roles", (err, data) => {
    if (err) throw err;
    for (let i = 0; i < data.length; i++) {
      let role = { name: data[i].title, value: data[i] };
      roleArray.push(role);
    }
  });
  return roleArray;
}

// Function to render dept array from the employeesDB
function getDeptArray() {
  connection.query("SELECT * FROM department", (err, data) => {
    if (err) throw err;
    for (let i = 0; i < data.length; i++) {
      let department = { name: data[i].dept_name, value: data[i] };
      deptArray.push(department);
    }
  });

  return deptArray;
}

initApp();