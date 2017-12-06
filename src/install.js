var fs = require('fs');
var readline = require('readline');
var sqlite3 = require('sqlite3');

var db = new sqlite3.Database(__dirname + '/data/history.db');
var data = [
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
	db.run('CREATE TABLE History (id varchar, user varchar, reason varchar, amount integer, timestamp varchar);');
});
db.close();

let readUser = readline.createInterface(process.stdin, process.stdout);
readUser.setPrompt('User Password> ');
readUser.prompt();
readUser.on('line', function(line) {
	data[0].password = line
	readUser.close();
}).on('close',function(){
	let readAdmin = readline.createInterface(process.stdin, process.stdout);
	readAdmin.setPrompt('Admin Password> ');
	readAdmin.prompt();
	readAdmin.on('line', function(line) {
		data[1].password = line
		readAdmin.close();
	}).on('close',function(){
		writeFile();
	});
});

function writeFile() {
	fs.writeFile(__dirname + '/data/auth.json', JSON.stringify(data), function(err) {
		if(err) {
			return console.log(err);
		}
	
		console.log("The ./data/auth.json file was created!");
	});
}
