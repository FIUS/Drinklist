/*
* The api for the Drinklist
* ------------------------
* Author: Sandro Speth
* Author: Tobias Wältken
*/

const express = require('express');
const api = module.exports = express();
const bodyParser = require('body-parser');
const fs = require('fs');
api.use(bodyParser.urlencoded({ extended: true }));
api.use(function (req, res, next) {
	
	// Website you wish to allow to connect
	res.setHeader('Access-Control-Allow-Origin', '*');

	// Request methods you wish to allow
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

	// Request headers you wish to allow
	res.setHeader('Access-Control-Allow-Headers', 'X-Auth-Token,content-type');

	// Set to true if you need the website to include cookies in the requests sent
	// to the API (e.g. in case you use sessions)
	res.setHeader('Access-Control-Allow-Credentials', false);

	// Pass to next layer of middleware
	next();
});
const HashMap = require('hashmap');
const uuidv4 = require('uuid/v4');
const dirname = fs.realpathSync('./');

// Arrays
var beverages = JSON.parse(fs.readFileSync(__dirname + '/data/beverages.json', 'utf8'));
var histories = JSON.parse(fs.readFileSync(__dirname + '/data/histories.json', 'utf8'));
var auth = JSON.parse(fs.readFileSync(__dirname + '/data/auth.json', 'utf8'));
// NodeJS HashMap
var users = new HashMap(JSON.parse(fs.readFileSync(__dirname + '/data/users.json', 'utf8')));
var tokens = new HashMap();

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

api.post('/login', function (req, res) {
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
			console.log('[API] [ OK ] [login] login with token ' + token.token);
			tokens.set(token.token, token);
			res.status(200).end(JSON.stringify(token));
		} else {
			console.log('[FAIL] [login] no correct password');
			res.sendStatus(403);
		}
	}
});

api.post('/orders/', function (req, res) {
	let user = req.query.user;
	let beverage = req.query.beverage;
	let token = req.header('X-Auth-Token');
	if (!tokens.has(token)) {
		console.log('[API] [WARN] Wrong token' + token);
		res.status(403).end('Forbidden');
	}
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


api.get('/orders', function (req, res) {
	let limit = req.query.limit;
	let token = req.header('X-Auth-Token');
	if (!tokens.has(token)) {
		console.log('[API] [WARN] Wrong token' + token);
		res.status(403).end('Forbidden');
	}
	if (limit === undefined) {
		limit = 1000;
	}
	let maxLength = Math.min(limit, histories.length);
	res.status(200).end(JSON.stringify(histories.slice().reverse().slice(0, maxLength)));
});

api.get('/orders/:userId', function (req, res) {
	let userId = req.params.userId;
	let limit = req.query.limit;
	let token = req.header('X-Auth-Token');
	if (!tokens.has(token)) {
		console.log('[API] [WARN] Wrong token' + token);
		res.status(403).end('Forbidden');
	}
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

api.get('/beverages', function (req, res) {
	let token = req.header('X-Auth-Token');
	if (!tokens.has(token)) {
		console.log('[API] [WARN] Wrong token' + token);
		res.status(403).end('Forbidden');
	}
	res.status(200).end(JSON.stringify(beverages));
});

api.get('/users', function (req, res) {
	let token = req.header('X-Auth-Token');
	if (!tokens.has(token)) {
		console.log('[API] [WARN] Wrong token' + token);
		res.status(403).end('Forbidden');
	}
	res.status(200).end(JSON.stringify(users.keys()));
});

api.get('/users/:userId', function (req, res) {
	let userId = req.params.userId;
	let token = req.header('X-Auth-Token');
	if (!tokens.has(token)) {
		console.log('[API] [WARN] Wrong token' + token);
		res.status(403).end('Forbidden');
	}
	if (userId === undefined || userId === '' || !users.has(userId)) {
		res.status(404).end('User not found');
	} else {
		res.status(200).end(JSON.stringify(users.get(userId)));
	}
});

api.post('/logout', function (req, res) {
	let token = req.params.token;
	if (token != undefined) {
		tokens.remove(token);
	}
	res.sendStatus(200);
});