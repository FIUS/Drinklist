/*
 * Setup script for the Drinklist
 * ------------------------
 * Author: Fabian Bühler
 * Author: Sandro Speth
 * Author: Tobias Wältken
 */

/* jslint esversion: 6 */

// Imports
const fs = require('fs');
const readline = require('readline');
const sqlite3 = require('sqlite3');

// Constants
const dirname = fs.realpathSync('./');
const databaseFile = dirname + '/data/history.db';
const authFile = dirname + '/data/auth.json';
const settingsFile = dirname + '/data/settings.json';

// Data Templates
var authData = [
	{
		"password": "",
		"root": false
	},
	{
		"password": "",
		"root": true
	}
];
var settingsData = {
	"apiPort":   8080,
	"userPort":  8081,
	"adminPort": 8082,
	"apiPath":   "",
	"userPath":  "",
	"adminPath": ""
}

function input(prompt, lineCallback, callback) {
	let reader = readline.createInterface(process.stdin, process.stdout);
	reader.setPrompt(prompt);
	reader.on('line', function(line) {
		lineCallback(line);
		reader.close();
	});
	reader.on('close', callback);
	reader.prompt();
}

function writeFile(name, path, data) {
	fs.writeFile(path, JSON.stringify(data), function(err) {
		if(err) {
			console.log("Error creating the " + name + " file at <<" + path + ">>");
			console.log(err);
		} else {
			console.log("The " + name + " file was created at: " + path);
		}
	});
}

function recreateDB() {
	let db = new sqlite3.Database(databaseFile);
	db.serialize(function() {
		// create DB tables
		db.run('DROP TABLE IF EXISTS History;');
		db.run("CREATE TABLE History (id VARCHAR(255), user VARCHAR(255) NOT NULL, reason VARCHAR(255), amount INTEGER NOT NULL DEFAULT 0, beverage VARCHAR(255) NOT NULL DEFAULT '', beverage_count INTEGER NOT NULL DEFAULT 0, timestamp DATETIME NOT NULL DEFAULT (DATETIME('now', 'localtime')));");
		db.run('DROP TABLE IF EXISTS Users;');
		db.run("CREATE TABLE Users (name VARCHAR(255) PRIMARY KEY, balance INTEGER NOT NULL DEFAULT 0);");
		db.run('DROP TABLE IF EXISTS Beverages;');
		db.run("CREATE TABLE Beverages (name VARCHAR(255) PRIMARY KEY, stock INTEGER NOT NULL DEFAULT 0, price INTEGER NOT NULL DEFAULT 0);");

		// fill with standard dummy data
		db.run("INSERT INTO `Beverages` (`name`, `stock`, `price`) VALUES ('Sample Juice', 10, 100);");
		db.run("INSERT INTO `Beverages` (`name`, `stock`, `price`) VALUES ('Supreme Sample Juice', 5, 150);");
		db.run("INSERT INTO `Users` (`name`) VALUES ('Max Mustermann');");
		db.run("INSERT INTO `Users` (`name`) VALUES ('Maria Mustermann');");
	});
	db.close();

	console.log("The database was created at: " + databaseFile);
}

function authInfo() {
	console.log('');
	console.log(' +--------------------------------+ ');
	console.log(' |                                | ');
	console.log(' |      --- Setup Script ---      | ');
	console.log(' |                                | ');
	console.log(' +--------------------------------+ ');
	console.log('');
	setAuthUser();
}

function setAuthUser() {
	input('User Password> ', (input) => {
		authData[0].password = input;
	}, setAuthAdmin);
}

function setAuthAdmin() {
	input('Admin Password> ', (input) => {
		authData[1].password = input;
	}, pathInfo);
}

function pathInfo() {
	console.log('');
	console.log(' !!! Only change if you know what you are doing !!!');
	console.log('These are the cross reference Links of the pages. NOT the access URLs!');
	console.log('');
	setApiPath();
}

function setApiPath() {
	input('API Path [http://localhost:8080/]> ', (input) => {
		if (input) {
			settingsData.apiPath = input;
		} else {
			settingsData.apiPath = "http://localhost:8080/";
		}
	}, setUserPath);
}

function setUserPath() {
	input('User Path [http://localhost:8081/]> ', (input) => {
		if (input) {
			settingsData.userPath = input;
		} else {
			settingsData.userPath = "http://localhost:8081/";
		}
	}, setAdminPath);
}

function setAdminPath() {
	input('Admin Path [http://localhost:8082/]> ', (input) => {
		if (input) {
			settingsData.adminPath = input;
		} else {
			settingsData.adminPath = "http://localhost:8082/";
		}
	}, dbQuestion);
}

function dbQuestion() {
	console.log('');
	input('create/recreate Database [y/N]> ', (input) => {
		if (input === 'y') {
			console.log('');
			recreateDB();
		}
	}, saveAll);
}

function saveAll() {
	console.log('');
	writeFile('auth', authFile, authData);
	writeFile('settings', settingsFile, settingsData);
}

// Start at entry point
authInfo();