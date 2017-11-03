/*
* Simple Web Service for drinks
* ------------------------
* Author: Sandro Speth
* Author: Tobias Wältken
*/

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const fs = require('fs');
app.use(bodyParser.urlencoded({ extended: true }));
const HashMap = require('hashmap');
const dirname = fs.realpathSync('./');
const uuidv4 = require('uuid/v4');

// Arrays
var beverages = JSON.parse(fs.readFileSync(__dirname + '/data/beverages.json', 'utf8'));
var histories = JSON.parse(fs.readFileSync(__dirname + '/data/histories.json', 'utf8'));
var localesArray = JSON.parse(fs.readFileSync(__dirname + '/data/localesArray.json', 'utf8'));
var auth = JSON.parse(fs.readFileSync(__dirname + '/data/auth.json', 'utf8'));
// NodeJS HashMap
var users = new HashMap(JSON.parse(fs.readFileSync(__dirname + '/data/users.json', 'utf8')));

function contains(array, item) {
	let bool = false;
	array.forEach(function (element) {
		if (typeof element === 'object') {
			if (element.name === item) {
				bool = true;
			}
		} else if (element === item) {
			bool = true;
		}
	}, this);
	return bool;
}

app.get('/', function (req, res) {
	console.log('[load] index.html');
	res.status(200).sendFile(__dirname + '/index.html');
});

app.get('/bootstrap/css', function (req, res) {
	console.log('[load] [lib] bootstrap/css');
	res.status(200).sendFile(dirname + '/node_modules/bootstrap-beta/dist/css/bootstrap.min.css');
});

app.get('/bootstrap/js', function (req, res) {
	console.log('[load] [lib] bootstrap/js');
	res.status(200).sendFile(dirname + '/node_modules/bootstrap-beta/dist/js/bootstrap.min.js');
});

fs.readdirSync(dirname + '/node_modules/font-awesome/fonts').forEach(file => {
	app.get('/font-awesome/fonts/' + file, function (req, res) {
		console.log('[load] [lib] font-awesome/fonts/' + file);
		res.status(200).sendFile(dirname + '/node_modules/font-awesome/fonts/' + file);
	})
});

app.get('/font-awesome/css/css', function (req, res) {
	console.log('[load] [lib] font-awesome/css');
	res.status(200).sendFile(dirname + '/node_modules/font-awesome/css/font-awesome.min.css');
});

app.get('/index.js', function (req, res) {
	console.log('[load] index.js');
	res.status(200).sendFile(__dirname + '/index.js');
});

app.get('/jquery', function (req, res) {
	console.log('[load] [lib] jquery');
	res.status(200).sendFile(dirname + '/node_modules/jquery/dist/jquery.min.js');
});

app.get('/locales', function (req, res) {
	console.log('[load] [locales] index');
	res.status(200).end(JSON.stringify(localesArray));
});

app.get('/locales/:localeId', function (req, res) {
	let localeId = req.params.localeId;
	if (localeId === undefined || localeId === '') {
		console.log('[FAIL] [locales] ' + localeId);
		res.status(404).end('Language pack not found');
	} else {
		console.log('[load] [locales] ' + localeId);
		res.status(200).sendFile(__dirname + '/locales/' + localeId + '.json');
	}
});

app.post('/login', function (req, res) {
	let passwd = req.body.password;
	if (passwd == undefined || passwd === '') {
		console.log('[FAIL] [login] no password');
		res.sendStatus(400);
	} else {
		let isAuthorized = false;
		let root = false;
		auth.forEach(function (element) {
			if (passwd === element.password) {
				isAuthorized = true;
				root = element.root;
			}
		});
		if (isAuthorized) {
			let token = {
				token: uuidv4(),
				root: root
			};
			console.log('[ OK ] [login] login with token ' + token.token);
			res.status(200).end(JSON.stringify(token));
		} else {
			console.log('[FAIL] [login] no correct password');
			res.sendStatus(403);
		}
	}
});

app.post('/orders/', function (req, res) {
	let user = req.query.user;
	let beverage = req.query.beverage;
	if (user == undefined || beverage == undefined ||
		user === '' || beverage === '' || !contains(users.keys(), user) || !contains(beverages, beverage)) {
		res.status(400).end('Fail to order the beverage for the user');
	} else {
		let cost = 0;
		for (i = 0; i < beverages.length; i++) {
			if (beverages[i].name === beverage) {
				cost = beverages[i].price;
				break;
			}
		}
		let history = {
			id: uuidv4(),
			user: user,
			reason: beverage,
			amount: -cost,
			timestamp: new Date().toUTCString()
		};
		users.get(user).balance -= cost;
		histories.push(history);
		res.sendStatus(200);
	}
});


app.get('/orders', function (req, res) {
	let limit = req.query.limit;
	let header = req.header('X-Auth-Token');
	//console.log(header);
	if (limit === undefined) {
		limit = 1000;
	}
	let maxLength = Math.min(limit, histories.length);
	res.status(200).end(JSON.stringify(histories.slice().reverse().slice(0, maxLength)));
});

app.get('/orders/:userId', function (req, res) {
	let userId = req.params.userId;
	let limit = req.query.limit;
	if (userId === undefined || userId === '' || !users.has(userId)) {
		res.status(404).end('User not found');
	} else {
		if (limit === undefined) {
			limit = 1000;
		}
		let userHistories = [];
		histories.forEach(function (history) {
			if (history.user === userId) {
				userHistories.push(history);
			}
		});
		let maxLength = Math.min(limit, userHistories.length);
		res.status(200).end(JSON.stringify(userHistories.reverse().slice(0, maxLength)));
	}
});

app.get('/beverages', function (req, res) {
	res.status(200).end(JSON.stringify(beverages));
});

app.get('/users', function (req, res) {
	res.status(200).end(JSON.stringify(users.keys()));
});

app.get('/users/:userId', function (req, res) {
	let userId = req.params.userId;
	if (userId === undefined || userId === '' || !users.has(userId)) {
		res.status(404).end('User not found');
	} else {
		res.status(200).end(JSON.stringify(users.get(userId)));
	}
});

var server = app.listen(8081, function () {
	var host = server.address().address;
	var port = server.address().port;
	console.log("REST server listening at http://%s:%s", host, port);
});