var mysql = require("mysql");
var inquirer = require("inquirer");
const chalk = require("chalk");

var connection = mysql.createConnection({
	host: "localhost",
	port: 3306,

	// Your username
	user: "root",

	// Your password
	password: "",
	database: "Bamazon"
});

connection.connect(function(err) {
	if (err) throw err;
	fMainMenu();
});

function fMainMenu() {
	console.clear();
	console.log(chalk.magenta.bold("Welcome to Bamazon Manager View\n"));
	inquirer
		.prompt({
			name: "action",
			type: "list",
			message: chalk.bgCyan("What would you like to do?"),
			choices: [
				new inquirer.Separator(" "),
				"View Products for Sale",
				"View Low Inventory",
				"Add to Inventory",
				"Add New Product"
			]
		})
		.then(function(answer) {
			switch (answer.action) {
				case "View Products for Sale":
					fviewPro();
					break;

				case "View Low Inventory":
					flowInv();
					break;

				case "Add to Inventory":
					faddInv();
					break;

				case "Add New Product":
					faddPro();
					break;
			}
		});
}

function fviewPro() {
	console.log("\n");
	connection.query("SELECT * FROM Products", function(err, result) {
		if (err) throw err;
		for (var i = 0; i < result.length; i++) {
			console.log(
				chalk.bgYellow("ID") + " " + chalk.yellow.bold(pad2(result[i].item_id)) + " | " +
				chalk.bgBlue("Name") + " " + chalk.blue.bold(result[i].product_name) + " | " +
				chalk.bgGreen("Available") + " " + chalk.green.bold(result[i].stock_quantity) + " | " +
				chalk.bgCyan("Price") + " " + chalk.cyan.bold((result[i].price).toFixed(2))
			);
		}
		console.log("\n");
		fcont();
	});
};

function flowInv() {
	console.log("\n");
	connection.query("SELECT * FROM Products WHERE stock_quantity < 5", function(err, result) {
		if (err) throw err;
		for (var i = 0; i < result.length; i++) {
			console.log(
				chalk.bgYellow("ID") + " " + chalk.yellow.bold(pad2(result[i].item_id)) + " | " +
				chalk.bgBlue("Name") + " " + chalk.blue.bold(result[i].product_name) + " | " +
				chalk.bgGreen("Available") + " " + chalk.green.bold(result[i].stock_quantity) + " | " +
				chalk.bgCyan("Price") + " " + chalk.cyan.bold((result[i].price).toFixed(2))
			);
		}
		console.log("\n");
		fcont();
	});
};

function faddInv() {
	console.log("\n");
	connection.query("SELECT * FROM Products", function(err, result) {
		if (err) throw err;
		for (var i = 0; i < result.length; i++) {
			console.log(
				chalk.bgYellow("ID") + " " + chalk.yellow.bold(pad2(result[i].item_id)) + " | " +
				chalk.bgBlue("Name") + " " + chalk.blue.bold(result[i].product_name) + " | " +
				chalk.bgGreen("Available") + " " + chalk.green.bold(result[i].stock_quantity) + " | " +
				chalk.bgCyan("Price") + " " + chalk.cyan.bold((result[i].price).toFixed(2))
			);
		}
		console.log("\n");
		inquirer
			.prompt([
				{
					name: "productID",
					type: "input",
					message: chalk.cyan.bold("What product would you like to Add to? (enter ID number) "),
					validate: function(value) {
						if (isNaN(value) === false) {
							return true;
						}
							return false;
					}
				},
				{
					name: "adding",
					type: "input",
					message: chalk.cyan.bold("How many units would you like to Add? "),
					validate: function(value) {
						if (isNaN(value) === false) {
							return true;
						}
							return false;
					}
				}
			])
			.then(function(answer) {
				connection.query("SELECT * FROM Products WHERE ?", { item_id: answer.productID }, function(err, result) {
				 	if (err) throw err;
				 	var vstock = result[0].stock_quantity;
				 	var vadd = answer.adding;
				 	var vname = result[0].product_name;
				 	var vnumadd = parseInt(vstock) + parseInt(vadd); 
					connection.query(
						"UPDATE Products SET ? WHERE ?",
						[
							{ stock_quantity: vnumadd },
							{ item_id: answer.productID }
						],
						function(error) {
							if (error) throw err;
							console.log("\n" + chalk.bgGreen("You successfully Added") + " " + chalk.green.bold(vadd) +
							" " + chalk.bgGreen("Units to") + " " + chalk.green.bold(vname) + "\n"  );
							fcont();
						}
					);
				}); 
			});
	});
};

function faddPro() {
	console.log("\n");
	inquirer
  	.prompt([
      {
        name: "pname",
        type: "input",
        message: chalk.cyan.bold("Product Name? "),
      },
      {
        name: "pdepto",
        type: "input",
        message: chalk.cyan.bold("Department Name? "),
      },
      {
        name: "pprice",
        type: "input",
        message: chalk.cyan.bold("Price of Product? "),
        validate: function(value) {
          if (isNaN(value) === false) {
            return true;
          }
          return false;
        }
      },
      {
        name: "pstock",
        type: "input",
        message: chalk.cyan.bold("Initial Stock Quantity? "),
        validate: function(value) {
          if (isNaN(value) === false) {
            return true;
          }
          return false;
        }
      }
    ])
    .then(function(answer) {
		connection.query(
			"INSERT INTO Products SET ?",
			{
				product_name: answer.pname,
				department_name: answer.pdepto,
				price: answer.pprice,
				stock_quantity: answer.pstock
			},
			function(error) {
				if (error) throw err;
				console.log("\n" + chalk.bgGreen("You successfully Added product") + " " + chalk.green.bold(answer.pname) +
				" " + chalk.bgGreen("to the database") + "\n" );
				fcont();
			}
		);
    });
};

function fcont() {
	inquirer
		.prompt([
			{
				name: "repeat",
				type: "confirm",
				message: chalk.cyan.bold("Go back to Main Menu? "),
				default: true,
			},
		])
		.then(function(answer) {
      	if (answer.repeat) {
      		fMainMenu();
      	}	else {
      			process.exit();
      		}
		}); 
};

function pad2(number) {
   
	return (number < 10 ? ' ' : '') + number
   
};
