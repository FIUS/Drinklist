/*
* Simple Web Service for drinks
* ------------------------
* Author: Sandro Speth
* Author: Tobias Wältken
*/

const api = require('./api.js');
const userPage = require('./userPage.js');
const adminPage = require('./adminPage/server.js');

var apiServer = api.listen(8080, function () {
	var host = apiServer.address().address;
	var port = apiServer.address().port;
	console.log("API listening at http://%s:%s", host, port);
});

var userPageServer = userPage.listen(8081, function () {
	var host = userPageServer.address().address;
	var port = userPageServer.address().port;
	console.log("Web server for the user page listening at http://%s:%s", host, port);
});

var adminPageServer = adminPage.listen(8082, function () {
	var host = adminPageServer.address().address;
	var port = adminPageServer.address().port;
	console.log("Web server for the admin page listening at http://%s:%s", host, port);
});
