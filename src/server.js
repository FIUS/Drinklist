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

// Arrays
var beverages = JSON.parse(fs.readFileSync(__dirname + '/data/beverages.json', 'utf8'));
var histories = JSON.parse(fs.readFileSync(__dirname + '/data/histories.json', 'utf8'));
var localesArray = JSON.parse(fs.readFileSync(__dirname + '/data/localesArray.json', 'utf8'));
// NodeJS HashMap
var users = new HashMap(JSON.parse(fs.readFileSync(__dirname + '/data/users.json', 'utf8')));

function contains(array, item) {
    let bool = false;
    array.forEach(function(element) {
        if (element === item) {
            bool = true;
        }
    }, this);
    return bool;
 } 

app.get('/locales', function (req, res) {
    res.status(200).end(JSON.stringify(localesArray));
});

app.get('/locales/:localeId', function (req, res) {
    let localeId = req.params.localeId;
    if (localeId === undefined || localeId === '') {
        res.status(404).end('Language pack not found');
    } else {
        res.status(200).end(JSON.parse(fs.readFileSync(__dirname + '/locales/' + localeId + '.json', 'utf8')));
    }
});

app.post('/orders/', function (req, res) {
    let user = req.query.user;
    let beverage = req.query.beverage;
    if (user == undefined || beverage == undefined ||
        user === '' || beverage === '' || !contains(users.keys(), user) || !contains(beverages, beverage)) {
        res.status(400).end('Fail to order the beverage for the user');
    } else {
        let history = {
            id: uuidv4(),
            user: user,
            beverage: beverage,
            timestamp: new Date().toUTCString()
        };
        histories.push(history);
        let cost = 0;
        for (i = 0; i < beverages.length; i++) {
            if (beverages[i].name === beverage) {
                cost = beverages[i].price;
            }
        }
        users.get(user).balance += cost;
        res.sendStatus(200);
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

app.get('/histories', function (req, res) {
    res.status(200).end(JSON.stringify(histories));
});

var server = app.listen(8081, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log("REST server listening at http://%s:%s", host, port);
});