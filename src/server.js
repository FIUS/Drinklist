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
const api       = require('./api/api.js');
const frontend  = require('./frontend-server/server.js')

// Settings file
var settings = JSON.parse(fs.readFileSync(fs.realpathSync('./') + '/data/settings.json', 'utf8'));

// Setup and start the api server
api.locals.apiPath   = settings.apiPath;
api.locals.userPath  = settings.userPath;
var apiServer = api.listen(settings.apiPort, function () {
	let host = apiServer.address().address;
	let port = apiServer.address().port;
	console.log("[API] [Start] Listening at http://%s:%s", host, port);
});

// Setup and start the frontend page
frontend.locals.apiPath   = settings.apiPath;
frontend.locals.userPath  = settings.userPath;
var frontendServer = frontend.listen(settings.userPort, function () {
	let host = frontendServer.address().address;
	let port = frontendServer.address().port;
	console.log("[frontend] [Start] Listening at http://%s:%s", host, port);
});
