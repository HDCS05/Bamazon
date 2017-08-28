var mysql = require("mysql");
var inquirer = require("inquirer");
const chalk = require("chalk");

var connection = mysql.createConnection({
	host: "localhost",
	port: 3306,

	// Your username
	user: "root",

	// Your password
	password: "Ingresando13",
	database: "BamazonDB"
});

connection.connect(function(err) {
	if (err) throw err;
	fListItems();
});
