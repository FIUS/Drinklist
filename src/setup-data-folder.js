/*
 * Setup script for the Drinklist
 * ------------------------
 * Author: Fabian Bühler
 * Author: Sandro Speth
 * Author: Tobias Wältken
 */

/* jslint esversion: 6 */

// Imports
const fs       = require('fs');
const readline = require('readline');
const dataHelper = require('./dataHelper.js');

// Constants
const dirname      = fs.realpathSync('./');
const databaseFile = dirname + '/data/history.db';
const authFile     = dirname + '/data/auth.json';
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
		if (lineCallback(line)) {
			reader.prompt();
		} else {
			reader.close();
		}
	});
	reader.on('close', callback);
	reader.prompt();
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
		if (input) {
			authData[0].password = input;
		} else {
			return true;
		}
	}, setAuthAdmin);
}

function setAuthAdmin() {
	input('Admin Password> ', (input) => {
		if (input) {
			authData[1].password = input;
		} else {
			return true;
		}
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
	if (fs.existsSync(databaseFile)) {
		input('recreate Database [y/N]> ', (input) => {
			if (input === 'y') {
				console.log('');
				dataHelper.recreateDB();
			}
		}, saveAll);
	} else {
		dataHelper.recreateDB();
		saveAll();
	}
}

function saveAll() {
	console.log('');
	dataHelper.writeFile('auth', authFile, authData);
	dataHelper.writeFile('settings', settingsFile, settingsData);
}

// Start at entry point
authInfo();
