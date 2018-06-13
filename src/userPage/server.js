/*
* The user page for the Drinklist
* ------------------------
* Author: Sandro Speth
* Author: Tobias Wältken
*/

/* jslint esversion: 6 */

// Imports
const fs = require('fs');
const express = require('express');

// Constants
const app = module.exports = express();
const dirname = fs.realpathSync('./');

var localesArray = JSON.parse(fs.readFileSync(__dirname + '/locales.json', 'utf8'));

app.get('/', function (req, res) {
	console.log('[userPage] [load] index.html');
	res.status(200).sendFile(__dirname + '/index.html');
});

app.get('/favicon.ico', function (req, res) {
	console.log('[userPage] [load] favicon.ico');
	res.status(200).sendFile(dirname + '/assets/box.ico');
});

app.get('/bootstrap/css', function (req, res) {
	console.log('[userPage] [load] [lib] bootstrap/css');
	res.status(200).sendFile(dirname + '/node_modules/bootstrap-beta/dist/css/bootstrap.min.css');
});

app.get('/bootstrap/js', function (req, res) {
	console.log('[userPage] [load] [lib] bootstrap/js');
	res.status(200).sendFile(dirname + '/node_modules/bootstrap-beta/dist/js/bootstrap.min.js');
});

fs.readdirSync(dirname + '/node_modules/font-awesome/fonts').forEach(file => {
	app.get('/font-awesome/fonts/' + file, function (req, res) {
		console.log('[userPage] [load] [lib] font-awesome/fonts/' + file);
		res.status(200).sendFile(dirname + '/node_modules/font-awesome/fonts/' + file);
	})
});

app.get('/font-awesome/css/css', function (req, res) {
	console.log('[userPage] [load] [lib] font-awesome/css');
	res.status(200).sendFile(dirname + '/node_modules/font-awesome/css/font-awesome.min.css');
});

app.get('/index.js', function (req, res) {
	console.log('[userPage] [load] index.js');
	res.status(200).write('const API = "' + app.locals.apiPath + '";\n')
	fs.readFile(__dirname + '/index.js', 'utf8', function(err, data) {
		res.write(data);
		res.end();
	});
});

app.get('/jquery', function (req, res) {
	console.log('[userPage] [load] [lib] jquery');
	res.status(200).sendFile(dirname + '/node_modules/jquery/dist/jquery.min.js');
});

app.get('/locales', function (req, res) {
	console.log('[userPage] [load] [locales] index');
	res.status(200).end(JSON.stringify(localesArray));
});

app.get('/locales/:localeId', function (req, res) {
	let localeId = req.params.localeId;
	if (localeId === undefined || localeId === '') {
		console.log('[userPage] [FAIL] [locales] ' + localeId);
		res.status(404).end('Language pack not found');
	} else {
		console.log('[userPage] [load] [locales] ' + localeId);
		res.status(200).sendFile(__dirname + '/locales/' + localeId + '.json');
	}
});

app.get('/legal', function (req, res) {
	console.log('[userPage] [load] legal.html');
	res.status(200).sendFile(dirname + '/data/legal.html');
});

app.get('/imprint', function (req, res) {
	console.log('[userPage] [load] legal.html');
	res.status(200).sendFile(dirname + '/data/imprint.html');
});
