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
	database: "BamazonDB"
});

connection.connect(function(err) {
	if (err) throw err;
	fListItems();
});

function fListItems() {
	console.clear();
	console.log(chalk.magenta.bold("Welcome to The Bamazon Store\n"));
	connection.query("SELECT * FROM Products", function(err, result) {
		if (err) throw err;
		for (var i = 0; i < result.length; i++) {
			console.log(
				chalk.bgYellow("ID") + " " + chalk.yellow.bold(pad2(result[i].item_id)) + " | " +
				chalk.bgBlue("Name") + " " + chalk.blue.bold(result[i].product_name) + " | " +
				chalk.bgCyan("Price") + " " + chalk.cyan.bold((result[i].price).toFixed(2))
			);
		}
		console.log("\n");
		fSell();
	});
};

function fSell() {
  // prompt for info about the item being put up for auction
  inquirer
    .prompt([
      {
        name: "productID",
        type: "input",
        message: chalk.cyan.bold("What product would you like to buy? (enter ID number) "),
        validate: function(value) {
          if (isNaN(value) === false) {
            return true;
          }
          return false;
        }
      },
      {
        name: "buying",
        type: "input",
        message: chalk.cyan.bold("How many units would you like to buy? "),
        validate: function(value) {
          if (isNaN(value) === false) {
            return true;
          }
          return false;
        }
      }
    ])
    .then(function(answer) {
      // when finished prompting, create query to check quantity available
		connection.query("SELECT * FROM Products WHERE ?", { item_id: answer.productID }, function(err, result) {
			if (err) throw err;
			var vstock = result[0].stock_quantity;
			var vbuy = answer.buying;
			var vprice = result[0].price;
			if (result[0].stock_quantity < answer.buying) {
				console.log("\n" + chalk.bgRed("Insufficient quantity!"));
				//console.log(chalk.bgRed("We apologize, we don't have enough supplies to fullfill your order"));
				console.log(chalk.bgRed("Maximum allowed to order") +
					" " + chalk.red.bold(result[0].stock_quantity) + "\n");
				fcont();
			} 	else {
					connection.query(
						"UPDATE Products SET ? WHERE ?",
						[
							{
								stock_quantity: (vstock - vbuy)
							},
							{
								item_id: answer.productID
							}
						],
						function(error) {
							if (error) throw err;
							console.log("\n" + chalk.bgGreen("Your purchase was successfully placed!"));
							console.log(chalk.bgGreen("Your total invoice is $") +
								" " + chalk.green.bold((vbuy*vprice).toFixed(2)) + "\n");
							fcont();
						}
					);
				}
		}); 
    });
}

function fcont() {
	inquirer
		.prompt([
			{
				name: "repeatbuy",
				type: "confirm",
				message: chalk.cyan.bold("Start again? "),
				default: true,
			},
		])
		.then(function(answer) {
      	if (answer.repeatbuy) {
      		fListItems();
      	}	else {
      			process.exit();
      		}
		}); 
};

function pad2(number) {
   
	return (number < 10 ? ' ' : '') + number
   
};
