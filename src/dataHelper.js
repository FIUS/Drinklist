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
const Database = require('better-sqlite3');
const os       = require('os');

// Constants
const dirname          = fs.realpathSync('./');
const databaseFile     = dirname + '/data/history.db';
const authFile         = dirname + '/data/auth.json';
const settingsFile     = dirname + '/data/settings.json';
const userSettingsFile = dirname + '/data/user-settings.json';
const legalFile        = dirname + '/data/legal.html';
const imprintFile      = dirname + '/data/imprint.html';

exports.checkAndCreateFiles = checkAndCreateFiles;
exports.writeFile = writeFile;
exports.recreateDB = recreateDB;
exports.createEmptyLegalFile = createEmptyLegalFile;
exports.createEmptyImprintFile = createEmptyImprintFile;

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

	if (!fs.existsSync(userSettingsFile)) {
	  writeDefaultUserSettingsFile()
  }

	if (!fs.existsSync(legalFile)) {
		createEmptyLegalFile()
	}

	if (!fs.existsSync(imprintFile)) {
		createEmptyImprintFile()
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
    "host": "http://localhost:8080",
    "port": 8080,
	};

	writeFile('settings', settingsFile, settingsData);
}

function writeDefaultUserSettingsFile() {
	//Default data
  let userSettingsData = {
    "imprint": true,
    "data-protection": true,
    "recently-purchased": true,
    "title": "daGl / TOBL",
    "currencySymbol": "€"
  };

	writeFile('settings', userSettingsFile, userSettingsData);
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
	let db = new Database(databaseFile);
	db.exec(
		// create DB tables
    "DROP TABLE IF EXISTS History;" +
    "CREATE TABLE History (id VARCHAR(255), user VARCHAR(255) NOT NULL, reason VARCHAR(255), amount INTEGER NOT NULL DEFAULT 0, beverage VARCHAR(255) NOT NULL DEFAULT '', beverage_count INTEGER NOT NULL DEFAULT 0, timestamp DATETIME NOT NULL DEFAULT (DATETIME('now', 'localtime')));" +
    "DROP TABLE IF EXISTS Users;" +
    "CREATE TABLE Users (name VARCHAR(255) PRIMARY KEY, balance INTEGER NOT NULL DEFAULT 0, hidden INTEGER NOT NULL DEFAULT 0);" +
    "DROP TABLE IF EXISTS Beverages;" +
    "CREATE TABLE Beverages (name VARCHAR(255) PRIMARY KEY, stock INTEGER NOT NULL DEFAULT 0, price INTEGER NOT NULL DEFAULT 0);" +

    // fill with standard dummy data
    "INSERT INTO `Beverages` (`name`, `stock`, `price`) VALUES ('Sample Juice', 10, 100);" +
    "INSERT INTO `Beverages` (`name`, `stock`, `price`) VALUES ('Supreme Sample Juice', 5, 150);" +
    "INSERT INTO `Users` (`name`) VALUES ('Max Mustermann');" +
    "INSERT INTO `Users` (`name`) VALUES ('Maria Mustermann');"
	);
	db.close();

	console.log("The database was created at: " + databaseFile);
}

function createEmptyLegalFile() {
	const data = `
<html lang="en">
	<head>
	  <title>Legal</title>
	</head>
	<body>
		Example Legal Text and Dataprotection Statements
	</body>
</html>
`;
	writeFile('legal', legalFile, data, true);
}

function createEmptyImprintFile() {
	const data = `
<html lang="en">
	<head>
	  <title>Imprint</title>
	</head>
	<body>
		Example Imprint
	</body>
</html>
`;
	writeFile('imprint', imprintFile, data, true);
}
