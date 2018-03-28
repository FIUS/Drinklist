/*
 * Simple Web Service for drinks
 * ------------------------
 * Author: Fabian Bühler
 * Author: Sandro Speth
 * Author: Tobias Wältken
 * Author: Tim Neumann
 */

/* jslint esversion: 6 */

// Imports
const fs = require('fs');

//Check if all data files exist. If not create them. (This is required for docker.)
require('./dataHelper.js').checkAndCreateFiles();

// Import all software components
const api       = require('./api.js');
const userPage  = require('./userPage/server.js');
const adminPage = require('./adminPage/server.js');

// Settings file
var settings = JSON.parse(fs.readFileSync(fs.realpathSync('./') + '/data/settings.json', 'utf8'));

// Setup and start the api server
api.locals.apiPath   = settings.apiPath;
api.locals.userPath  = settings.userPath;
api.locals.adminPath = settings.adminPath;
var apiServer = api.listen(settings.apiPort, function () {
	let host = apiServer.address().address;
	let port = apiServer.address().port;
	console.log("[API] [Start] Listening at http://%s:%s", host, port);
});

// Setup and start the user page
userPage.locals.apiPath   = settings.apiPath;
userPage.locals.userPath  = settings.userPath;
userPage.locals.adminPath = settings.adminPath;
var userPageServer = userPage.listen(settings.userPort, function () {
	let host = userPageServer.address().address;
	let port = userPageServer.address().port;
	console.log("[userPage] [Start] Listening at http://%s:%s", host, port);
});

// Setup and start the admin page
adminPage.locals.apiPath   = settings.apiPath;
adminPage.locals.userPath  = settings.userPath;
adminPage.locals.adminPath = settings.adminPath;
var adminPageServer = adminPage.listen(settings.adminPort, function () {
	let host = adminPageServer.address().address;
	let port = adminPageServer.address().port;
	console.log("[adminPage] [Start] Listening at http://%s:%s", host, port);
});
