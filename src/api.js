/*
 * The api for the Drinklist
 * ------------------------
 * Author: Fabian Bühler
 * Author: Sandro Speth
 * Author: Tobias Wältken
 */

/* jslint esversion: 6 */

// Imports
const sqlite3 = require('sqlite3');
const express = require('express');
const compression = require('compression');
const bodyParser = require('body-parser');
const fs = require('fs');
const HashMap = require('hashmap');
const uuidv4 = require('uuid/v4');
const exec = require('child_process').exec;

// Constants
const dirname = fs.realpathSync('./');
const api = module.exports = express();

// Main Database
var db = new sqlite3.Database(dirname + '/data/history.db', err => { if(err) { throw err; }});
// authentication Arrays
var auth = JSON.parse(fs.readFileSync(dirname + '/data/auth.json', 'utf8'));
// NodeJS HashMap to store login tokens
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

// Setup Global Middlewares
api.use(compression());
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

api.post('/login', function (req, res, next) {
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

api.get('/token', adminAccess(function (req, res, next) {
	res.status(200).end(JSON.stringify(tokens.values()));
}));

api.post('/orders', userAccess(function (req, res, next) {
	let user = req.query.user;
	let beverage = req.query.beverage;

	if (user == undefined || beverage == undefined ||
		user === '' || beverage === '') {
		res.status(400).end('Fail to order the beverage for the user');
		return;
	} else {
		let stmt = db.prepare("SELECT price, stock FROM Beverages WHERE name = ?;", (err, res) => { if (err) {return next(err);} });
		stmt.get(beverage, function(err, result) {
			if (err) {
				return next(err);
			}
			if (result == undefined) {
				console.log('[API] [FAIL] can\'t find beverage '+beverage);
				return;
			}
			let cost = result.price;

			let stmt1 = db.prepare("UPDATE Beverages SET stock = stock-1 WHERE name = ?;", (err, res) => { if (err) {return next(err);} });
			stmt1.run(beverage, (res, err) => { if (err) {return next(err);} });

			let stmt2 = db.prepare("UPDATE Users SET balance = balance - ? WHERE name = ?;", (err, res) => { if (err) {return next(err);} });
			stmt2.run(cost, user, (res, err) => { if (err) {return next(err);} });

			var stmt3 = db.prepare("INSERT INTO History(id, user, reason, amount, beverage, beverage_count) VALUES (?, ?, ?, ?, ?, ?);", (err, res) => { if (err) {return next(err);} });
			stmt3.run(uuidv4(), user, beverage, -cost, beverage, 1, (res, err) => { if (err) {return next(err);} });
		});


		res.sendStatus(200);
	}
}));

api.get('/lastorders', userAccess(function (req, res, next) {
	let histories = [];
	var stmt = db.prepare("SELECT id, user, reason, amount, beverage, beverage_count, timestamp FROM History ORDER BY timestamp DESC LIMIT 100;", (err, res) => { if (err) {return next(err);} });
	stmt.each(function(err, row) {
		if (err) {
			return next(err);
		}
		let reverted = false
		for (let index in histories) {
			let prev = histories[index]
			if (prev['reason'] == row['id']) {
				histories.splice(index, 1);
				reverted = true;
			}
		}
		if (! reverted) {
			if (true || row.user != undefined && row.user != null && row.user !== '' &&
				row.beverage != undefined && row.beverage != null && row.beverage !== '') {
				histories.push(row);
			}
		}
	}, function() {
		res.status(200).end(JSON.stringify(histories));
	});
}));

api.get('/orders', userAccess(function (req, res, next) {
	let limit = req.query.limit;
	if (limit === undefined) {
		limit = 1000;
	}

	let histories = [];
	var stmt = db.prepare("SELECT id, user, reason, amount, beverage, beverage_count, timestamp FROM History ORDER BY timestamp DESC LIMIT ?;", (err, res) => { if (err) {return next(err);} });
	stmt.each(limit, function(err, row) {
		if (err) {
			return next(err);
		}
		histories.push(row);
	}, function() {
		res.status(200).end(JSON.stringify(histories));
	});
}));

api.get('/orders/:userId', userAccess(function (req, res, next) {
	let userId = req.params.userId;
	let limit = req.query.limit;
	if (userId === undefined || userId === '') {
		res.status(404).end('User not found');
		return;
	} else {
		if (limit === undefined) {
			limit = 1000;
		}
		let userHistories = [];
		var stmt = db.prepare("SELECT id, user, reason, amount, beverage, beverage_count, timestamp FROM History WHERE user = ? ORDER BY timestamp DESC LIMIT ?;", (err, res) => { if (err) {return next(err);} });
		stmt.each(userId, limit, function(err, row) {
			if (err) {
				return next(err);
			}
			let reverted = false
			for (let index in userHistories) {
				let prev = userHistories[index]
				if (prev['reason'] === row['id']) {
					userHistories.splice(index, 1);
					reverted = true;
				}
			}
			if (! reverted) {
				userHistories.push(row);
			}
		}, function() {
			res.status(200).end(JSON.stringify(userHistories));
		});
	}
}));

api.delete('/orders/:orderId', function (req, res, next) {
	let orderId = req.params.orderId;
	let token = req.header('X-Auth-Token');
	if (!tokens.has(token)) {
		console.log('[API] [WARN] Wrong token ' + token);
		res.status(403).end('Forbidden');
		return;
	}
	if (orderId != undefined && orderId != '') {

		let stmt = db.prepare("SELECT timestamp > (DATETIME('now', '-30 seconds', 'localtime')) as fresh, id, user, amount, beverage, beverage_count, timestamp FROM History WHERE id = ? LIMIT 1;", (err, res) => { if (err) {return next(err);} });
		stmt.get(orderId, function(err, result) {
			if (err) {
				return next(err);
			}
			if (result == undefined) {
				// no order to delete!
				return;
			}

			if (result.fresh == false && !tokens.get(token).root) {
				// too late to delete
				res.sendStatus(400);
				return;
			}

			function updateUserAndBeverage(result) {
				if (result.amount !== 0 && result.user !== '') {
					let stmt = db.prepare("UPDATE Users SET balance = balance - ? WHERE name = ?;", (err, res) => { if (err) {return next(err);} });
					stmt.run(result.amount, result.user, (res, err) => { if (err) {return next(err);} });
				}

				if (result.beverage !== '') {
					let stmt = db.prepare("UPDATE Beverages SET stock = stock + ? WHERE name = ?", (err, res) => { if (err) {return next(err);} });
					stmt.run(result.beverage_count, result.beverage, (res, err) => { if (err) {return next(err);} });
				}
			}

			if (result.fresh) {
				updateUserAndBeverage(result);
				var stmt = db.prepare("DELETE FROM History WHERE id = ?;", (err, res) => { if (err) {return next(err);} });
				stmt.run(orderId, (res, err) => { if (err) {return next(err);} });
				stmt.finalize();
				res.sendStatus(200);
			} else {
				let stmt = db.prepare("SELECT * FROM History WHERE reason = ? LIMIT 1;", (err, res) => { if (err) {return next(err);} });
				stmt.get(result.id, function(err, existing) {
					if (err) {
						return next(err);
					}
					if (existing == undefined) { // prevent double undo
						updateUserAndBeverage(result);
						let stmt = db.prepare("INSERT INTO History(id, user, reason, amount, beverage, beverage_count) VALUES (?, ?, ?, ?, ?, ?);", (err, res) => { if (err) {return next(err);} });
						stmt.run(uuidv4(), result.user, result.id, -result.amount, result.beverage, -result.beverage_count, (res, err) => { if (err) {return next(err);} });
						res.sendStatus(200);
					} else {
						// double undo error code here...
						res.sendStatus(500);
					}
				});
			}
		});
	} else {
		res.sendStatus(400);
	}
});

api.get('/beverages', userAccess(function (req, res, next) {
	let beverages = [];
	var stmt = db.prepare("SELECT name, stock, price FROM Beverages ORDER BY name;", (err, res) => { if (err) {return next(err);} });
	stmt.each(function(err, row) {
		if (err) {
			return next(err);
		}
		beverages.push(row);
	}, function() {
		res.status(200).end(JSON.stringify(beverages));
	});
}));

api.post('/beverages', adminAccess(function (req, res, next) {
	let bev = req.query.beverage;
	let price = req.query.price;
	if (bev != undefined && price != undefined && bev != '') {
		let stmt = db.prepare("INSERT INTO Beverages (name, price) VALUES (?, ?)", (err, res) => { if (err) {return next(err);} });
		stmt.run(bev, price, (res, err) => { if (err) {return next(err);} });
		res.sendStatus(200);
	} else {
		throw {
			name: 'Generic Error',
			message: 'Generic Error Message'
		};
	}
}));

api.patch('/beverages/:beverage', adminAccess(function (req, res, next) {
	let bev = req.params.beverage;
	let price = req.query.price;
	let count = req.query.count;
	if (bev != undefined && bev != '') {
		if (price != undefined) {
			let stmt = db.prepare("UPDATE Beverages SET price = ?  WHERE name = ?;", (err, res) => { if (err) {return next(err);} });
			stmt.run(parseInt(price), bev, (res, err) => { if (err) {return next(err);} });
		}
		if (count != undefined) {
			let stmt = db.prepare("UPDATE Beverages SET stock = stock + ?  WHERE name = ?;", (err, res) => { if (err) {return next(err);} });
			stmt.run(parseInt(count), bev, (res, err) => { if (err) {return next(err);} });
		}
		res.sendStatus(200);
	} else {
		res.sendStatus(400);
	}
}));

api.delete('/beverages/:beverage', adminAccess(function (req, res, next) {
	let bev = req.params.beverage;
	if (bev != undefined && bev != '') {
		let stmt = db.prepare("DELETE FROM Beverages WHERE name = ?;", (err, res) => { if (err) {return next(err);} });
		stmt.run(bev, (res, err) => { if (err) {return next(err);} });
		res.sendStatus(200);
	} else {
		res.sendStatus(400);
	}
}));

api.get('/users', userAccess(function (req, res, next) {
	let token = req.header('X-Auth-Token');

	let users = [];
	var stmt = db.prepare("SELECT name FROM Users ORDER BY name;", (err, res) => { if (err) {return next(err);} });
	var stmtAdmin = db.prepare("SELECT name, balance FROM Users ORDER BY name;", (err, res) => { if (err) {return next(err);} });
	if (!tokens.get(token).root) {
		stmt.each(function(err, row) {
			if (err) {
				return next(err);
			}
			users.push(row.name);
		}, function() {
			res.status(200).end(JSON.stringify(users));
		});
	} else {
		stmtAdmin.each(function(err, row) {
			if (err) {
				return next(err);
			}
			users.push(row);
		}, function() {
			res.status(200).end(JSON.stringify(users));
		});
	}
}));

api.get('/users/:userId', userAccess(function (req, res, next) {
	let userId = req.params.userId;
	var stmt = db.prepare("SELECT name, balance FROM Users WHERE name = ?;", (err, res) => { if (err) {return next(err);} });
	if (userId === undefined || userId === '') {
		res.status(404).end('User not found');
	} else {
		stmt.get(userId, function(err, result) {
			if (err) {
				return next(err);
			}
			if (result == undefined) {
				res.status(404).end('User not found');
				return;
			}
			res.status(200).end(JSON.stringify(result));
		});
	}
}));

api.post('/users/:userId', adminAccess(function (req, res, next) {
	let userId = req.params.userId;
	if (userId != undefined && userId != '') {
		let stmt = db.prepare("INSERT INTO Users (name) VALUES (?);", (err, res) => { if (err) {return next(err);} });
		stmt.run(userId, (res, err) => { if (err) {return next(err);} });
		res.sendStatus(200);
	} else {
		res.sendStatus(400);
	}
}));

api.delete('/users/:userId', adminAccess(function (req, res, next) {
	let userId = req.params.userId;
	if (userId != undefined && userId != '') {
		let stmt = db.prepare("DELETE FROM Users WHERE name = ?;", (err, res) => { if (err) {return next(err);} });
		stmt.run(userId, (res, err) => { if (err) {return next(err);} });
		res.sendStatus(200);
	} else {
		res.sendStatus(400);
	}
}));

api.patch('/users/:userId', adminAccess(function (req, res, next) {
	let userId = req.params.userId;
	let amount = req.query.amount;
	let reason = req.query.reason;
	if (userId != undefined && amount != undefined && reason != undefined
		&& userId != '' && reason != '' && amount != '') {
		amount = parseInt(amount);

		var stmt = db.prepare("INSERT INTO History(id, user, reason, amount) VALUES (?, ?, ?, ?);", (err, res) => { if (err) {return next(err);} });
		stmt.run(uuidv4(), userId, reason, amount, (res, err) => { if (err) {return next(err);} });

		let stmt2 = db.prepare("UPDATE Users SET balance = balance + ? WHERE name = ?;", (err, res) => { if (err) {return next(err);} });
		stmt2.run(amount, userId, (res, err) => { if (err) {return next(err);} });
		res.sendStatus(200);
	} else {
		res.sendStatus(400);
	}
}));

api.get('/backup', adminAccess(function (req, res, next) {
	let result = "";
	let dump = exec('sqlite3 data/history.db ".dump"', (res, err) => { if (err) {return next(err);} });
	dump.stdout.on('data', data => {
		result += data.toString();
	});
	dump.on('close', code => {
		res.status(200).send(result);
	});
}));

api.post('/logout', function (req, res, next) {
	let token = req.query.token;
	if (token != undefined) {
		tokens.remove(token);
	}
	res.sendStatus(200);
});

// Error Handling Middleware
api.use(function (err, req, res, next) {
	console.error(err.stack);
	res.status(500).send('We messed up, sry!');
});
