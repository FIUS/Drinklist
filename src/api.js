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

api.post('/beverages', function (req, res) {
	let bev = req.query.beverage;
	let price = req.query.price;
	let token = req.header('X-Auth-Token');
	if (!tokens.has(token)) {
		console.log('[API] [WARN] Wrong token' + token);
		res.status(403).end('Forbidden');
	}
	if (!tokens.get(token).root) {
		res.status(401).end('Unauthorized');
	}
	if (bev!= undefined && price != undefined && bev != '') {
		let beverage = {
			name: bev,
			price: price
		};
		beverages.push(beverage);
		res.sendStatus(200);
	}
});

api.patch('/beverages', function (req, res) {
	let bev = req.query.beverage;
	let price = req.query.price;
	let token = req.header('X-Auth-Token');
	if (!tokens.has(token)) {
		console.log('[API] [WARN] Wrong token' + token);
		res.status(403).end('Forbidden');
	}
	console.log(tokens.get(token));
	if (!tokens.get(token).root) {
		res.status(401).end('Unauthorized');
	}
	if (bev!= undefined && price != undefined && bev != '') {
		for(let i = 0; i < beverages.length; i++) {
			let beverage = beverages[i];
			console.log(beverage);
			if (beverage.name == bev) {
				beverage.price = price;
				break;
			}
		}
		res.sendStatus(200);
	} else {
		res.sendStatus(400);
	}
});

api.delete('/beverages', function (req, res) {
	let bev = req.query.beverage;
	let token = req.header('X-Auth-Token');
	if (!tokens.has(token)) {
		console.log('[API] [WARN] Wrong token' + token);
		res.status(403).end('Forbidden');
	}
	if (!tokens.get(token).root) {
		res.status(401).end('Unauthorized');
	}
	if (bev!= undefined && bev != '') {
		let index = 0;
		for(let i = 0; i < beverages.length; i++) {
			let beverage = beverages[i];
			if (beverage.name == bev) {
				index = i;
				break;
			}
		}
		beverages.splice(index, 1);
		res.sendStatus(200);
	} else {
		res.sendStatus(400);
	}
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

api.post('/users/:userId', function (req, res) {
	let userId = req.params.userId;
	let token = req.header('X-Auth-Token');
	if (!tokens.has(token)) {
		console.log('[API] [WARN] Wrong token' + token);
		res.status(403).end('Forbidden');
	}
	if (!tokens.get(token).root) {
		res.status(401).end('Unauthorized');
	}
	if (userId != undefined && userId != '') {
		let user = {
			name: userId,
			balance: 0
		};
		users.set(userId, user);
		res.sendStatus(200);
	} else {
		res.sendStatus(400);
	}
});

api.delete('/users/:userId', function (req, res) {
	let userId = req.params.userId;
	let token = req.header('X-Auth-Token');
	if (!tokens.has(token)) {
		console.log('[API] [WARN] Wrong token' + token);
		res.status(403).end('Forbidden');
	}
	if (!tokens.get(token).root) {
		res.status(401).end('Unauthorized');
	}
	if (userId != undefined && userId != '' && users.has(userId)) {
		let user = users.get(userId);
		users.remove(userId);
		res.status(200).send(JSON.stringify(user));
	} else {
		res.sendStatus(400);
	}
});

api.patch('/users/:userId', function (req, res) {
	let userId = req.params.userId;
	let balance = req.query.balance;
	let token = req.header('X-Auth-Token');
	if (!tokens.has(token)) {
		console.log('[API] [WARN] Wrong token' + token);
		res.status(403).end('Forbidden');
	}
	if (!tokens.get(token).root) {
		res.status(401).end('Unauthorized');
	}
	if (userId != undefined && balance != undefined && userId != '' && users.has(userId)) {
		users.get(userId).balance += new Number(balance);
		res.sendStatus(200);
	} else {
		res.sendStatus(400);
	}
});

api.post('/logout', function (req, res) {
	let token = req.params.token;
	if (token != undefined) {
		tokens.remove(token);
	}
	res.sendStatus(200);
});