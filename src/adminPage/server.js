/*
* The admin page for the Drinklist
* ------------------------
* Author: Sandro Speth
* Author: Tobias Wältken
*/

const express = require('express');
const app = module.exports = express();
const fs = require('fs');

const dirname = fs.realpathSync('./');
//var localesArray = JSON.parse(fs.readFileSync(__dirname + '/data/localesArray.json', 'utf8'));


app.get('/', function (req, res) {
	console.log('[adminPage] [load] index.html');
	res.status(200).sendFile(__dirname + '/index.html');
});

app.get('/api', function (req, res) {
	console.log('[adminPage] [get] api url');
	res.status(200).send(app.locals.apiPath);
});

app.get('/user', function (req, res) {
	console.log('[adminPage] [get] user page url');
	res.status(200).send(app.locals.userPath);
});

app.get('/css', function (req, res) {
	console.log('[adminPage] [load] index.css');
	res.status(200).sendFile(__dirname + '/index.css');
});

app.get('/favicon.ico', function (req, res) {
	console.log('[adminPage] [load] favicon.ico');
	res.status(200).sendFile(dirname + '/assets/box.ico');
});

app.get('/assets/logo.svg', function (req, res) {
	console.log('[adminPage] [load] [asset] logo.svg');
	res.status(200).sendFile(dirname + '/assets/logo.svg');
});

app.get('/jquery', function (req, res) {
	console.log('[adminPage] [load] [lib] jquery');
	res.status(200).sendFile(dirname + '/node_modules/jquery/dist/jquery.min.js');
});

app.get('/bootstrap/css', function (req, res) {
	console.log('[adminPage] [load] [lib] bootstrap/css');
	res.status(200).sendFile(dirname + '/node_modules/bootstrap-beta/dist/css/bootstrap.min.css');
});

app.get('/bootstrap/js', function (req, res) {
	console.log('[adminPage] [load] [lib] bootstrap/js');
	res.status(200).sendFile(dirname + '/node_modules/bootstrap/dist/js/bootstrap.min.js');
});

app.get('/font-awesome/css/css', function (req, res) {
	console.log('[adminPage] [load] [lib] font-awesome/css');
	res.status(200).sendFile(dirname + '/node_modules/font-awesome/css/font-awesome.min.css');
});

fs.readdirSync(dirname + '/node_modules/font-awesome/fonts').forEach(file => {
	app.get('/font-awesome/fonts/' + file, function (req, res) {
		console.log('[adminPage] [load] [lib] font-awesome/fonts/' + file);
		res.status(200).sendFile(dirname + '/node_modules/font-awesome/fonts/' + file);
	})
});

app.get('/angular/main', function (req, res) {
	console.log('[adminPage] [load] [lib] angular/main');
	res.status(200).sendFile(dirname + '/node_modules/angular/angular.min.js');
});

app.get('/angular/route', function (req, res) {
	console.log('[adminPage] [load] [lib] angular/route');
	res.status(200).sendFile(dirname + '/node_modules/angular-route/angular-route.min.js');
});

app.get('/angular/filesaver', function (req, res) {
	console.log('[adminPage] [load] [lib] angular/filesaver');
	res.status(200).sendFile(dirname + '/node_modules/angular-file-saver/dist/angular-file-saver.bundle.min.js');
});

app.get('/app/main', function (req, res) {
	console.log('[adminPage] [load] [app] main');
	res.status(200).sendFile(__dirname + '/app/app.js');
});

fs.readdirSync(__dirname + '/app/controllers').forEach(file => {
	app.get('/app/controllers/' + file, function (req, res) {
		console.log('[adminPage] [load] [app] controllers/' + file);
		res.status(200).sendFile(__dirname + '/app/controllers/' + file);
	})
});

fs.readdirSync(__dirname + '/app/partials').forEach(file => {
	app.get('/app/partials/' + file, function (req, res) {
		console.log('[adminPage] [load] [app] partials/' + file);
		res.status(200).sendFile(__dirname + '/app/partials/' + file);
	})
});

fs.readdirSync(__dirname + '/app/services').forEach(file => {
	app.get('/app/services/' + file, function (req, res) {
		console.log('[adminPage] [load] [app] services/' + file);
		res.status(200).sendFile(__dirname + '/app/services/' + file);
	})
});

//app.get('/locales', function (req, res) {
//	console.log('[userPage] [load] [locales] index');
//	res.status(200).end(JSON.stringify(localesArray));
//});
//
//app.get('/locales/:localeId', function (req, res) {
//	let localeId = req.params.localeId;
//	if (localeId === undefined || localeId === '') {
//		console.log('[userPage] [FAIL] [locales] ' + localeId);
//		res.status(404).end('Language pack not found');
//	} else {
//		console.log('[userPage] [load] [locales] ' + localeId);
//		res.status(200).sendFile(__dirname + '/locales/' + localeId + '.json');
//	}
//});