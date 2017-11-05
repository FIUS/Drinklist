/*
 * Setup Variables
 */
// contains all frontent text in the current language
var local;

// load the current translation
if (!localStorage.getItem('language')) {
	// if no language is set choose en [English]
	localStorage.setItem('language', 'en');
}
// setup the language select and load the language
$.getJSON('./locales', function(data) {
	let language = localStorage.getItem('language');
	data.forEach(function(element) {
		$('#langselect').append($('<option></option>', {
			value: element.id,
			selected: element.id == language
		}).text(element.name))
	});
	$('#langselect').change(function(e) {
		localStorage.setItem('language', $('#langselect').val());
		loadLanguage($('#langselect').val());
	});
	loadLanguage(language);
});

function loadLanguage(language) {
	$.getJSON('./locales/' + language, function(data) {
		local = data;
		Object.keys(local).forEach(function(key) {
			$('#' + key).text(local[key]);
		});
		$("html").attr("lang", language);
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

function getJSON(url, callback) {
	$.ajax({
		type: 'GET',
		url: url,
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
		url: './login',
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
		getToken($('#password').val(), function(data) {
			if (data.token !== undefined) {
				localStorage.setItem('token', data.token);
				updateUserList();
				updateBeveageList();
				deselectUser();
			}
		})
	}
}

function selectUser(newUser) {
	localStorage.setItem('user', newUser);
	$('#header2User').text(newUser + ', ');
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
	localStorage.removeItem('token');
	// TODO invalidate token
	location.reload();
}

function selectPage() {
	if (!localStorage.getItem('token')) {
		$('#btnlogout').hide();
		$('#header0').show();
		$('#header1').hide();
		$('#header2').hide();
		$('#main0').show();
		$('#main1').hide();
		$('#main2').hide();
		$('#footer1').hide();
		$('#footer2').hide();
	} else if (!localStorage.getItem('user')) {
		$('#btnlogout').show();
		$('#header0').hide();
		$('#header1').show();
		$('#header2').hide();
		$('#main0').hide();
		$('#main1').show();
		$('#main2').hide();
		$('#footer1').show();
		$('#footer2').hide();
	} else {
		$('#btnlogout').show();
		$('#header0').hide();
		$('#header1').hide();
		$('#header2').show();
		$('#main0').hide();
		$('#main1').hide();
		$('#main2').show();
		$('#footer1').hide();
		$('#footer2').show();
	}
}

function moneyFormat(money) {
	absolut = Math.abs(money);
	return (money < 0 ? '-' : '') + Math.floor(absolut/100) + ',' + ((absolut%100 < 10) ? '0' : '') + (absolut%100) + '€';
}

function updateUserList() {
	$('#main1').empty();
	getJSON('./users', function(users) {
		users.forEach(function(element) {
			addUserButton(element);
		}, this);
	});
}

function updateBeveageList() {
	$('#beverages').empty();
	getJSON('./beverages', function(users) {
		users.forEach(function(element) {
			addBeverageButton(element);
		}, this);
	});
}

function updateUserHistory() {
	$('#htablebody').empty();
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
		$('#marquee').text(text);
	});
}

function updateMoney() {
	getJSON('./users/' + localStorage.getItem('user'), function(user) {
		$('#money').text(moneyFormat(user.balance));
		if (user.balance >= 0) {
			$('#mjumbo').removeClass('bg-danger');
			$('#money').addClass('text-success');
			$('#money').removeClass('text-danger');
			$('#money').removeClass('text-white');
		} else if (user.balance > -2000) {
			$('#mjumbo').removeClass('bg-danger');
			$('#money').removeClass('text-success');
			$('#money').addClass('text-danger');
			$('#money').removeClass('text-white');
		} else {
			$('#mjumbo').addClass('bg-danger');
			$('#money').removeClass('text-success');
			$('#money').removeClass('text-danger');
			$('#money').addClass('text-white');
		}
	});
}

function addUserButton(user) {
	$('#main1').append($('<div></div>', {
		class: 'col-sm-6 col-md-4 col-lg-3 col-xl-2'
	}).append($('<button/>', {
		type: 'button',
		class: 'btn btn-primary btn-lg btn-block',
		style: 'margin-top: .5rem'
	}).text(user).click(function() {
		selectUser(user);
	})));
}

function addBeverageButton(beverage) {
	$('#beverages').append($('<button/>', {
		type: 'button',
		class: 'btn btn-lg btn-block',
		style: 'margin-top: .5rem'
	}).text(beverage.name + ' [' + moneyFormat(beverage.price) + ']').click( function() {
		$.ajax({
			type: 'POST',
			url: './orders/?user=' + localStorage.getItem('user') + '&beverage=' + beverage.name,
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
	$('#htablebody')
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
