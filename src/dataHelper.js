/*
 * Setup script for the Drinklist
 * ------------------------
 * Author: Fabian Bühler
 * Author: Sandro Speth
 * Author: Tobias Wältken
 * Author: Tim Neumann
 */

/* jslint esversion: 6 */

// Imports
const fs       = require('fs');
const sqlite3  = require('sqlite3');
const os       = require('os');

// Constants
const dirname      = fs.realpathSync('./');
const databaseFile = dirname + '/data/history.db';
const authFile     = dirname + '/data/auth.json';
const settingsFile = dirname + '/data/settings.json';
const legalFile    = dirname + '/data/legal.html';
const imprintFile    = dirname + '/data/imprint.html';

exports.checkAndCreateFiles = checkAndCreateFiles;
exports.writeFile = writeFile;
exports.recreateDB = recreateDB;

function checkAndCreateFiles() {
	if(!fs.existsSync(databaseFile)) {
		recreateDB();
	}

	if(!fs.existsSync(authFile)) {
		writeDefaultAuthFile();
	}

	if(!fs.existsSync(settingsFile)) {
		writeDefaultSettingsFile();
	}
}

function writeDefaultAuthFile() {
	//Default data
	let authData = [
		{
			"password": "secret",
			"root": false
		},
		{
			"password": "superSecret",
			"root": true
		}
	];

	writeFile('auth', authFile, authData);
}

function writeDefaultSettingsFile() {
	//Default data
	let settingsData = {
		"apiPort":   8080,
		"userPort":  8081,
		"adminPort": 8082,
		"apiPath":   "http://localhost:8080/",
		"userPath":  "http://localhost:8081/",
		"adminPath": "http://localhost:8082/"
	}

	writeFile('settings', settingsFile, settingsData);
}

function writeFile(name, path, data, raw=false) {
	try {
		if (raw) {
			fs.writeFileSync(path, data);
		} else {
			fs.writeFileSync(path, JSON.stringify(data));
		}
	} catch(e) {
		console.log("Error creating the " + name + " file at: " + path);
		console.log(err);
	}

	console.log("The " + name + " file was created at: " + path);
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

function createEmptyLegalFile() {
	const data = ```
<html>
	<head>
	</head>
	<body>
		Example Legal Text and Dataprotection Statements
	</body>
</html>
```
	writeFile('legal', legalFile, data);
}

function createEmptyImprintFile() {
	const data = ```
<html>
	<head>
	</head>
	<body>
		Example Imprint
	</body>
</html>
```
	writeFile('imprint', imprintFile, data);
}
