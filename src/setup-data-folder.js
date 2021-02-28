/*
 * Setup script for the Drinklist
 * ------------------------
 * Author: Fabian Bühler
 * Author: Sandro Speth
 * Author: Tobias Wältken
 */

/* jslint esversion: 6 */

// Imports
const fs         = require('fs');
const readline   = require('readline');
const dataHelper = require('./dataHelper.js');

// Constants
const dirname          = fs.realpathSync('./');
const databaseFile     = dirname + '/data/history.db';
const authFile         = dirname + '/data/auth.json';
const settingsFile     = dirname + '/data/settings.json';
const userSettingsFile = dirname + '/data/user-settings.json';
const legalFile        = dirname + '/data/legal.html';
const imprintFile      = dirname + '/data/imprint.html';

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
  "host": "http://localhost:8080",
	"port": 8080,
};
var userSettingsData = {
	"imprint": true,
	"data-protection": true,
	"recently-purchased": true,
	"history": true,
	"money": true,
  "title": "daGl / TOBL",
  "currencySymbol": "€"
};

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
	}, dbQuestion());
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
	dataHelper.writeFile('user-settings', userSettingsFile, userSettingsData);

	if (!fs.existsSync(legalFile)) {
		dataHelper.createEmptyLegalFile()
	}

	if (!fs.existsSync(imprintFile)) {
		dataHelper.createEmptyImprintFile()
	}
}

// Start at entry point
authInfo();
