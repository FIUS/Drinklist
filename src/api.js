/*
* The api for the Drinklist
* ------------------------
* Author: Sandro Speth
* Author: Tobias Wältken
*/
// Imports
const sqlite3 = require('sqlite3');
const express = require('express');
const api = module.exports = express();
const bodyParser = require('body-parser');
const fs = require('fs');
const HashMap = require('hashmap');
const uuidv4 = require('uuid/v4');
const dirname = fs.realpathSync('./');

// Database
var db = new sqlite3.Database(dirname + '/data/history.db');
// Arrays
var beverages = JSON.parse(fs.readFileSync(dirname + '/data/beverages.json', 'utf8'));
var auth = JSON.parse(fs.readFileSync(dirname + '/data/auth.json', 'utf8'));
// NodeJS HashMap
var users = new HashMap(JSON.parse(fs.readFileSync(dirname + '/data/users.json', 'utf8')));
var tokens = new HashMap();

/**
 * Helper method to check if an array contains a specific value.
 *
 * @param {[]} array
 * @param {any} item
 */
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

// Actual wrong method
function isTimePassed(date) {
	return !(+(new Date(new Date(date).getTime() + 30000)) > +(new Date()));
}

/**
 * This function wraps a given middleware function with a check for the user
 * tokens in the request to reduce code clutter.
 *
 * @param {(req, res, next)} middleware
 * @returns (req, res, next)
 */
function userAccess(middleware) {
	return function(req, res, next) {
		let token = req.header('X-Auth-Token');
		if (!tokens.has(token)) {
			console.log('[API] [WARN] Wrong token ' + token);
			res.status(403).end('Forbidden');
			return next();
		}

		return middleware(req, res, next);
	};
}

/**
 * This function wraps a given middleware function with a check for the admin
 * tokens in the request to reduce code clutter.
 *
 * @param {(req, res, next)} middleware
 * @returns (req, res, next)
 */
function adminAccess(middleware) {
	return function(req, res, next) {
		let token = req.header('X-Auth-Token');
		if (!tokens.has(token)) {
			console.log('[API] [WARN] Wrong token ' + token);
			res.status(403).end('Forbidden');
			return next();
		}
		if (!tokens.get(token).root) {
			console.log('[API] [WARN] Unauthorized Access by ' + token);
			res.status(401).end('Unauthorized');
			return next();
		}

		return middleware(req, res, next);
	};
}

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
				root: root,
				useragent: req.header('user-agent'),
				referrer: req.header('referrer'),
				userip: req.header('x-forwarded-for') || req.connection.remoteAddress // Get IP - allow for proxy
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

api.get('/token', adminAccess(function (req, res) {
	res.status(200).end(JSON.stringify(tokens.values()));
}));

api.post('/orders', userAccess(function (req, res) {
	let user = req.query.user;
	let beverage = req.query.beverage;

	if (user == undefined || beverage == undefined ||
		user === '' || beverage === '' || !contains(users.keys(), user) || !contains(beverages, beverage)) {
		res.status(400).end('Fail to order the beverage for the user');
		return;
	} else {
		let cost = 0;
		for (let i = 0; i < beverages.length; i++) {
			if (beverages[i].name === beverage) {
				cost = beverages[i].price;
				beverages[i].count--;
				fs.writeFile(dirname + '/data/beverages.json', JSON.stringify(beverages), 'utf8', function(error) {
					console.log('[API] [FAIL] can\'t write /data/beverages.json');
				});
				break;
			}
		}

		users.get(user).balance -= cost;
		fs.writeFile(dirname + '/data/users.json', JSON.stringify(users), 'utf8');

		var stmt = db.prepare("INSERT INTO History(id, user, reason, amount) VALUES (?, ?, ?, ?);");
		stmt.run(uuidv4(), user, beverage, -cost);
		stmt.finalize();

		res.sendStatus(200);
	}
}));


api.get('/orders', userAccess(function (req, res) {
	let limit = req.query.limit;
	if (limit === undefined) {
		limit = 1000;
	}

	let histories = [];
	var stmt = db.prepare("SELECT id, user, reason, amount, timestamp FROM History ORDER BY timestamp DESC LIMIT ?;");
	console.log(stmt);
	stmt.each(limit, function(err, row) {
		histories.push(row);
	}, function() {
		res.status(200).end(JSON.stringify(histories));
	});
}));

api.get('/orders/:userId', userAccess(function (req, res) {
	let userId = req.params.userId;
	let limit = req.query.limit;
	if (userId === undefined || userId === '' || !users.has(userId)) {
		res.status(404).end('User not found');
		return;
	} else {
		if (limit === undefined) {
			limit = 1000;
		}
		let userHistories = [];
		var stmt = db.prepare("SELECT id, user, reason, amount, timestamp FROM History WHERE user = ? ORDER BY timestamp DESC LIMIT ?;");
		stmt.each(userId, limit, function(err, row) {
			userHistories.push(row);
		}, function() {
			res.status(200).end(JSON.stringify(userHistories));
		});
	}
}));

api.delete('/orders/:orderId', function (req, res) {
	// FIXME think about using userAccess, adminAcces or keep it locally when
	//       solving Issue#5 (https://github.com/spethso/Drinklist/issues/5)
	let orderId = req.params.orderId;
	let token = req.header('X-Auth-Token');
	if (!tokens.has(token)) {
		console.log('[API] [WARN] Wrong token ' + token);
		res.status(403).end('Forbidden');
		return;
	}
	//if (!tokens.get(token).root) {
	//	res.status(401).end('Unauthorized');
	//	return;
	//}
	if (orderId != undefined && orderId != '') {
		let deleted = true; //TODO check for  error in sql

		var stmt = db.prepare("DELETE FROM History WHERE id = ?;");
		stmt.run(orderId);
		stmt.finalize();

		if (deleted) {
			res.sendStatus(200);
		} else {
			res.sendStatus(400);
		}
	} else {
		res.sendStatus(400);
	}
});

api.get('/beverages', userAccess(function (req, res) {
	let beverages = [];
	var stmt = db.prepare("SELECT name, stock, price FROM Beverages ORDER BY name;");
	stmt.each(function(err, row) {
		beverages.push(row);
	}, function() {
		res.status(200).end(JSON.stringify(beverages));
	});
}));

api.post('/beverages', adminAccess(function (req, res) {
	let bev = req.query.beverage;
	let price = req.query.price;
	if (bev != undefined && price != undefined && bev != '') {
		let stmt = db.prepare("INSERT INTO Beverages (name, price) VALUES (?, ?)");
		stmt.run(bev, price);
		res.sendStatus(200);
	} else {
		throw new Error('Test Error');
	}
}));

api.patch('/beverages/:beverage', adminAccess(function (req, res) {
	let bev = req.params.beverage;
	let price = req.query.price;
	let count = req.query.count;
	if (bev != undefined && bev != '') {
		if (price != undefined) {
			let stmt = db.prepere("UPDATE Beverages SET price = ?  WHERE name = ?;");
			stmt.run(parseInt(price), bev);
		}
		if (count != undefined) {
			let stmt = db.prepere("UPDATE Beverages SET stock = stock + ?  WHERE name = ?;");
			stmt.run(parseInt(count), bev);
		}
		res.sendStatus(200);
	} else {
		res.sendStatus(400);
	}
}));

api.delete('/beverages/:beverage', adminAccess(function (req, res) {
	let bev = req.params.beverage;
	if (bev != undefined && bev != '') {
		let stmt = db.prepare("DELETE FROM Beverages WHERE name = ?;");
		stmt.run(bev);
		res.sendStatus(200);
	} else {
		res.sendStatus(400);
	}
}));

api.get('/users', userAccess(function (req, res) {
	let token = req.header('X-Auth-Token');
	if (!tokens.get(token).root) {
		res.status(200).end(JSON.stringify(users.keys()));
	} else {
		res.status(200).end(JSON.stringify(users.values()));
	}
}));

api.get('/users/:userId', userAccess(function (req, res) {
	let userId = req.params.userId;
	if (userId === undefined || userId === '' || !users.has(userId)) {
		res.status(404).end('User not found');
	} else {
		res.status(200).end(JSON.stringify(users.get(userId)));
	}
}));

api.post('/users/:userId', adminAccess(function (req, res) {
	let userId = req.params.userId;
	if (userId != undefined && userId != '') {
		let user = {
			name: userId,
			balance: 0
		};
		users.set(userId, user);
		fs.writeFile(dirname + '/data/users.json', JSON.stringify(users), 'utf8');
		res.sendStatus(200);
	} else {
		res.sendStatus(400);
	}
}));

api.delete('/users/:userId', adminAccess(function (req, res) {
	let userId = req.params.userId;
	if (userId != undefined && userId != '' && users.has(userId)) {
		let user = users.get(userId);
		users.remove(userId);
		fs.writeFile(dirname + '/data/users.json', JSON.stringify(users), 'utf8');
		res.status(200).send(JSON.stringify(user));
	} else {
		res.sendStatus(400);
	}
}));

api.patch('/users/:userId', adminAccess(function (req, res) {
	let userId = req.params.userId;
	let amount = req.query.amount;
	let reason = req.query.reason;
	if (userId != undefined && amount != undefined && reason != undefined
		&& userId != '' && reason != '' && amount != '' && users.has(userId)) {
		amount = new Number(amount);

		var stmt = db.prepare("INSERT INTO History(id, user, reason, amount, timestamp) VALUES (?, ?, ?, ?, ?);");
		stmt.run(uuidv4(), userId, reason, amount, new Date().toUTCString());
		stmt.finalize();

		users.get(userId).balance += amount;
		fs.writeFile(dirname + '/data/users.json', JSON.stringify(users), 'utf8');
		res.sendStatus(200);
	} else {
		res.sendStatus(400);
	}
}));

api.post('/logout', function (req, res) {
	let token = req.query.token;
	if (token != undefined) {
		tokens.remove(token);
	}
	res.sendStatus(200);
});

// Error Handler
api.use(function (err, req, res, next) {
	console.error(err.stack);
	res.status(500).send('We messed up, sry!');
});
