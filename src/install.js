var fs = require('fs');
var readline = require('readline');

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
