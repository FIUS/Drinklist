var fs = require('fs');
var readline = require('readline');
var sqlite3 = require('sqlite3');

const HashMap = require('hashmap');
const dirname = fs.realpathSync('./');

var db = new sqlite3.Database(dirname + '/data/history.db');
var authData = [
	{
		"password": "",
		"root": false
	},
	{
		"password": "",
		"root": true
	}
];

db.serialize(function() {
	db.run('DROP TABLE IF EXISTS History;');
	db.run("CREATE TABLE History (id VARCHAR(255), user VARCHAR(255) NOT NULL, reason VARCHAR(255), amount INTEGER NOT NULL DEFAULT 0, beverage VARCHAR(255) NOT NULL DEFAULT '', beverage_count INTEGER NOT NULL DEFAULT 0, timestamp DATETIME NOT NULL DEFAULT (DATETIME('now', 'localtime')));");
	db.run('DROP TABLE IF EXISTS Users;');
	db.run("CREATE TABLE Users (name VARCHAR(255) PRIMARY KEY, balance INTEGER NOT NULL DEFAULT 0);");
	db.run('DROP TABLE IF EXISTS Beverages;');
	db.run("CREATE TABLE Beverages (name VARCHAR(255) PRIMARY KEY, stock INTEGER NOT NULL DEFAULT 0, price INTEGER NOT NULL DEFAULT 0);");


	// init db
	db.run("INSERT INTO `Beverages` (`name`, `stock`, `price`) VALUES ('Sample Juice', 10, 100);");
	db.run("INSERT INTO `Beverages` (`name`, `stock`, `price`) VALUES ('Supreme Sample Juice', 5, 150);");
	db.run("INSERT INTO `Users` (`name`) VALUES ('Max Mustermann');");
	db.run("INSERT INTO `Users` (`name`) VALUES ('Maria Mustermann');");
});
db.close();

writeFile('/data/beverages.json', [
	{
		name: 'Sample Juice',
		price: 100,
		count: 10
	},
	{
		name: 'Supreme Sample Juice',
		price: 150,
		count: 5
	},
]);



let map = new HashMap();
map.set('Max Mustermann', {
	name: "Max Mustermann",
	balance: 0
});
map.set('Maria Mustermann', {
	name: "Maria Mustermann",
	balance: 0
});
writeFile('/data/users.json', map);

let readUser = readline.createInterface(process.stdin, process.stdout);
readUser.setPrompt('User Password> ');
readUser.on('line', function(line) {
	authData[0].password = line
	readUser.close();
}).on('close',function(){
	let readAdmin = readline.createInterface(process.stdin, process.stdout);
	readAdmin.setPrompt('Admin Password> ');
	readAdmin.prompt();
	readAdmin.on('line', function(line) {
		authData[1].password = line
		readAdmin.close();
	}).on('close',function(){
		writeFile('/data/auth.json', authData);
	});
});

readUser.prompt();


function writeFile(path, data) {
	fs.writeFile(dirname + path, JSON.stringify(data), function(err) {
		if(err) {
			return console.log(err);
		}

		console.log("The " + path + " file was created!");
	});
}
