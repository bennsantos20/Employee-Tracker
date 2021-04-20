const mysql = require("mysql");
const inquirer = require("inquirer");

const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "",
  database: "employee_tracker_db",
});

connection.connect((err) => {
  if (err) throw err;
  console.log("connected as id " + connection.threadId + "\n");
  console.log("Welcome to your Employee Content Management System");
  init();
});

function init() {
  console.log("=====================================");
  inquirer
    .prompt([
      {
        type: "list",
        name: "whatDoYouWant",
        message: "What would you like to do?",
        choices: [
          "View All Employees",
          "View All Employees By Department",
          "View Roles",
          "View Departments",
          "Add Employee",
          "Add Department",
          "Add Role",
        ],
      },
    ])
    .then(function (response) {
      // console.log(response);
      if (response.whatDoYouWant === "View All Employees") {
        viewAllEmployees();
      } else if (
        response.whatDoYouWant === "View All Employees By Department"
      ) {
        viewEmployeesByDept();
      } else if (response.whatDoYouWant === "Add Employee") {
        addEmployee();
      } else if (response.whatDoYouWant === "View Departments") {
        viewDepartment();
      } else if (response.whatDoYouWant === "Add Department") {
        addDept();
      } else if (response.whatDoYouWant === "View Roles") {
        viewRoles();
      } else if (response.whatDoYouWant === "Add Role") {
        addRole();
      }
    })
    .catch((err) => {
      if (err) throw err;
    });
}