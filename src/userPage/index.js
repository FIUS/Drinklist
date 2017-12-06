// API location
const API = 'http://localhost:8080/';

/*
 * Setup Variables
 */
// contains all frontent text in the current language
var local;
// contains all cached jquery objects
var cache = {};

// load the current translation
if (!localStorage.getItem('language')) {
	// if no language is set choose en [English]
	localStorage.setItem('language', 'en');
}
// setup the language select and load the language
$.getJSON('./locales', function(data) {
	let language = localStorage.getItem('language');
	data.forEach(function(element) {
		_('#langselect').append($('<option></option>', {
			value: element.id,
			selected: element.id == language
		}).text(element.name))
	});
	_('#langselect').change(function(e) {
		localStorage.setItem('language', _('#langselect').val());
		loadLanguage(_('#langselect').val());
	});
	loadLanguage(language);
});

function loadLanguage(language) {
	$.getJSON('./locales/' + language, function(data) {
		local = data;
		Object.keys(local).forEach(function(key) {
			_('#' + key).text(local[key]);
		});
		_("html").attr("lang", language);
	});
}

// update user and beverage list if logged in
if (localStorage.getItem('token')) {
	updateUserList();
	updateBeveageList();
	updateRecent();
	if (localStorage.getItem('user')) {
		updateMoney();
		updateUserHistory();
	}
}

// selest the page
selectPage();

// cached jquery object loader
function _(object) {
	if (!cache[object]) {
		cache[object] = $(object);
	}
	
	return cache[object];
}

function getJSON(url, callback) {
	$.ajax({
		type: 'GET',
		url: API + url,
		data: null,
		headers: { 'X-Auth-Token': localStorage.getItem('token') },
		statusCode: {
			403: logout,
		},
		success: function(data) {
			callback(JSON.parse(data));
		}
	});
}

function getToken(password, callback) {
	$.ajax({
		type: 'POST',
		url: API + './login',
		contentType: "application/x-www-form-urlencoded; charset=UTF-8",
		data: 'password=' + password,
		success: function(data) {
			callback(JSON.parse(data));
		},
		error: function() {
			callback({});
		}
	});
}

function passwordKeyUp(event) {
	if (event.keyCode == 13) {
		getToken(_('#password').val(), function(data) {
			if (data.token !== undefined) {
				localStorage.setItem('token', data.token);
				localStorage.setItem('root', data.root);
				if (localStorage.getItem('root')) {
					_('#btnadmin').show();
					_('#spnavbtn').addClass('btn-group');
				} else {
					_('#btnadmin').hide();
					_('#spnavbtn').removeClass('btn-group');
				}
				updateUserList();
				updateBeveageList();
				deselectUser();
			}
		})
	}
}

function selectUser(newUser) {
	localStorage.setItem('user', newUser);
	_('#header2User').text(newUser + ', ');
	updateMoney();
	updateUserHistory();
	selectPage();
}

function deselectUser() {
	localStorage.removeItem('user');
	updateRecent();
	selectPage();
}

function logout() {
	$.ajax({
		type: 'POST',
		url: API + './logout?token=' + localStorage.getItem('token')
	});
	localStorage.removeItem('token');
	location.reload();
}

function selectPage() {
	if (localStorage.getItem('root') == 'true') {
		_('#btnadmin').show();
		_('#spnavbtn').addClass('btn-group');
	} else {
		_('#btnadmin').hide();
		_('#spnavbtn').removeClass('btn-group');
	}
	if (!localStorage.getItem('token')) {
		_('#spnavbtn').hide();
		_('#header0').show();
		_('#header1').hide();
		_('#header2').hide();
		_('#main0').show();
		_('#main1').hide();
		_('#main2').hide();
		_('#footer1').hide();
		_('#footer2').hide();
	} else if (!localStorage.getItem('user')) {
		_('#spnavbtn').show();
		_('#header0').hide();
		_('#header1').show();
		_('#header2').hide();
		_('#main0').hide();
		_('#main1').show();
		_('#main2').hide();
		_('#footer1').show();
		_('#footer2').hide();
	} else {
		_('#spnavbtn').show();
		_('#header0').hide();
		_('#header1').hide();
		_('#header2').show();
		_('#main0').hide();
		_('#main1').hide();
		_('#main2').show();
		_('#footer1').hide();
		_('#footer2').show();
	}
}

function moneyFormat(money) {
	absolut = Math.abs(money);
	return (money < 0 ? '-' : '') + Math.floor(absolut/100) + ',' + ((absolut%100 < 10) ? '0' : '') + (absolut%100) + '€';
}

function updateUserList() {
	_('#main1').empty();
	getJSON('./users', function(users) {
		users.forEach(function(element) {
			if (typeof element === 'object') {
				addUserButton(element.name);
			} else {
				addUserButton(element);
			}
		}, this);
	});
}

function updateBeveageList() {
	_('#beverages').empty();
	getJSON('./beverages', function(users) {
		users.forEach(function(element) {
			addBeverageButton(element);
		}, this);
	});
}

function updateUserHistory() {
	_('#htablebody').empty();
	getJSON('./orders/' + localStorage.getItem('user'), function(entrys) {
		entrys.forEach(function(element) {
			addHistoryEntry(element);
		}, this);
	});
}

function updateRecent() {
	getJSON('./orders?limit=5', function(orders) {
		let text = '';
		orders.forEach(function(order) {
			text += order.user + ': ' + order.reason + '@' + order.timestamp + ', ';
		});
		_('#marquee').text(text);
	});
}

function updateMoney() {
	getJSON('./users/' + localStorage.getItem('user'), function(user) {
		_('#money').text(moneyFormat(user.balance));
		if (user.balance >= 0) {
			_('#mjumbo').removeClass('bg-danger');
			_('#money').addClass('text-success');
			_('#money').removeClass('text-danger');
			_('#money').removeClass('text-white');
		} else if (user.balance > -2000) {
			_('#mjumbo').removeClass('bg-danger');
			_('#money').removeClass('text-success');
			_('#money').addClass('text-danger');
			_('#money').removeClass('text-white');
		} else {
			_('#mjumbo').addClass('bg-danger');
			_('#money').removeClass('text-success');
			_('#money').removeClass('text-danger');
			_('#money').addClass('text-white');
		}
	});
}

function addUserButton(user) {
	_('#main1').append($('<div></div>', {
		class: 'col-sm-6 col-md-4 col-lg-3 col-xl-2'
	}).append($('<button/>', {
		type: 'button',
		class: 'btn btn-warning btn-lg btn-block',
		style: 'margin-top: .5rem'
	}).text(user).click(function() {
		selectUser(user);
	})));
}

function addBeverageButton(beverage) {
	_('#beverages').append($('<button/>', {
		type: 'button',
		class: 'btn btn-lg btn-block',
		style: 'margin-top: .5rem'
	}).text(beverage.name + ' [' + moneyFormat(beverage.price) + ']').click( function() {
		$.ajax({
			type: 'POST',
			url: API + './orders/?user=' + localStorage.getItem('user') + '&beverage=' + beverage.name,
			data: 'null',
			headers: { 'X-Auth-Token': localStorage.getItem('token') },
			success: function(data) {
				// TODO react to fail
				updateMoney();
				updateUserHistory();
			}
		});
	}));
}

function addHistoryEntry(entry) {
	_('#htablebody')
		.append($('<tr></tr>', {
			id: 'entry_' + entry.id
		}).click(function(){
			//TODO delete entry.id
			updateMoney();
			updateUserHistory();
		}).append($('<td></td>')
		.text(entry.reason))
		.append($('<td></td>')
		.text(moneyFormat(entry.amount)))
		.append($('<td></td>')
		.text(entry.timestamp))
		.append($('<td></td>', {
			style: 'text-align: right;'
		}).append($('<i></i>', {
			class: isTimePassed(entry.timestamp) ? 'fa fa-trash-o' : ''
		}))));
}

function isTimePassed(date) {
	return +(new Date(new Date(date).getTime() + 30000)) > +(new Date())
}
