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
// setup the language select
$.getJSON('./locales', function(data) {
	data.forEach(function(element) {
		$('#langselect').append($('<option></option>', {
			value: element.id,
			selected: element.id == localStorage.getItem('language')
		}).text(element.name))
	});
	$('#langselect').change(function(e) {
		localStorage.setItem('language', $('#langselect').val());
		loadLanguage();
	});
});
// load the local json
loadLanguage();

// setup logout button
$('#btnlogout').click(function(e) {
	localStorage.removeItem('token');
	location.reload();
});

// setup the page
setupMain();
setupFooter();

function loadLanguage() {
	$.getJSON('./locales/' + localStorage.getItem('language'), function(data) {
		local = data;
		$("html").attr("lang", localStorage.getItem('language'));
		setupStaticText();
	});
}

function moneyFormat(money) {
	absolut = Math.abs(money);
	return (money < 0 ? '-' : '') + Math.floor(absolut/100) + ',' + ((absolut%100 < 10) ? '0' : '') + (absolut%100) + '€';
}

function redraw() {
	setupMain();
	setupFooter();
	setupStaticText();
	update();
}

function selectUser(newUser) {
	localStorage.setItem('user', newUser);
	redraw();
}

function deselectUser() {
	localStorage.removeItem('user');
	redraw();
}

function setupLoginPage() {
	$('#main').append($('<div></div>', {
		class: 'col-12',
		style: 'height: 10vh'
	})).append($('<div></div>', {
		class: 'col-12'
	}).append($('<div></div>', {
		class: 'container form-group'
	}).append($('<label></label>', {
		id: 'plabel',
		for: 'password'
	})).append($('<input></input>', {
		id: 'password',
		type: 'password',
		class: 'form-control',
		placeholder: '******'
	}).on('keyup', function(e) {
		if (e.keyCode == 13) {
			// FIXME do actual login
			localStorage.setItem('token', $('#password').val());
			deselectUser();
		}
	}))));
}

function setupAccountPage() {
	$('#main').append($('<div></div>', {
		class: 'col-lg-6'
	}).append($('<h1></h1>', {
		id: 'blabel'
	})).append($('<div></div>', {
		id: 'beverages'
	}))).append($('<div></div>', {
		class: 'col-lg-6',
		style: 'padding-bottom: 64px'
	}).append($('<div></div>', {
		class: 'jumbotron',
		style: 'margin-top: .5rem'
	}).append($('<h1></h1>', {
		id: 'mlabel'
	})).append($('<h1></h1>', {
		id: 'money',
		class: 'display-1 text-right'
	}))).append($('<h1></h1>', {
		id: 'hlabel'
	})).append($('<table></table>', {
		class: 'table table-hover table-responsive table-striped'
	}).append($('<thead></thead>').append($('<tr></tr>').append($('<th></th>', {
		id: 'hcol0'
	})).append($('<th></th>', {
		id: 'hcol1'
	})).append($('<th></th>', {
		id: 'hcol2'
	})).append($('<th></th>', {
		id: 'hcol3'
	})))).append($('<tbody></tbody>', {
		id: 'htablebody'
	}))));
}

function setupMain() {
	$('#main').empty();
	if (!localStorage.getItem('token')) {
		setupLoginPage();
	} else if (!localStorage.getItem('user')) {
		$.getJSON('./users', function(users) {
			users.forEach(function(element) {
				addUserButton(element);
			}, this);
		});
	} else {
		setupAccountPage();
		$.getJSON('./beverages', function(users) {
			users.forEach(function(element) {
				addBeverageButton(element);
			}, this);
		});
		$.getJSON('./orders/' + localStorage.getItem('user'), function(entrys) {
			entrys.forEach(function(element) {
				addHistoryEntry(element);
			}, this);
		});
	}
}

function setupFooter() {
	$('#footer').empty();
	if (!localStorage.getItem('token')) {
	} else if (!localStorage.getItem('user')) {
		$('#footer').append($('<h5></h5>', {
			style: 'margin-top: .5rem'
		}).append($('<table></table>').append($('<tr></tr>').append($('<td></td>', {
			style: 'white-space: nowrap; padding-right: .5rem'
		}).append($('<strong></strong>', {
			id: 'rlabel'
		}))).append($('<td></td>', {
			style: 'width:100%'
		}).append($('<marquee></marquee>', {
			id: 'marquee'
		}))))));
	} else {
		$('#footer').append($('<button></button>', {
			id: 'btnfinish',
			type: 'button',
			class: 'btn btn-primary btn-lg btn-block',
			style: 'margin-top: .5rem; margin-bottom: .5rem'
		}).click(function() {
			deselectUser();
		}));
	}
}

function setupStaticText() {
	if (!localStorage.getItem('token')) {
		$('#header')
		.removeClass('display-4')
		.addClass('display-1')
		.text(local.header01)
		.append($('<small></small>', {
			class: 'text-muted'
		})
		.text(local.header02));
	} else if (!localStorage.getItem('user')) {
		$('#header')
			.removeClass('display-4')
			.addClass('display-1')
			.text(local.header1);
	} else {
		$('#header')
			.removeClass('display-1')
			.addClass('display-4')
			.text(local.header21 + ' ' + localStorage.getItem('user') + ', ')
			.append($('<small></small>', {
				class: 'text-muted'
			})
			.text(local.header22));
	}
	Object.keys(local).forEach(function(key) {
		$('#' + key).text(local[key]);
	});
}

function addUserButton(user) {
	$('#main').append($('<div></div>', {
		class: 'col-sm-6 col-md-4 col-lg-3 col-xl-2'
	}).append($('<button/>', {
		type: 'button',
		class: 'btn btn-primary btn-lg btn-block',
		style: 'margin-top: .5rem'
	}).text(user).click( function() {
		selectUser(user);
	})));
}

function addBeverageButton(beverage) {
	$('#beverages').append($('<button/>', {
		type: 'button',
		class: 'btn btn-lg btn-block',
		style: 'margin-top: .5rem'
	}).text(beverage.name + ' [' + moneyFormat(beverage.price) + ']').click( function() {
		$.post('./orders/?user=' + localStorage.getItem('user') + '&beverage=' + beverage.name, function(data) {
			console.log(data);
			updateMoney();
		});
	}));
}

function addHistoryEntry(entry) {
	$('#htablebody')
		.append($('<tr></tr>', {
			id: 'entry_' + entry.id
		})
		.append($('<th></th>', {
			scope: 'row'
		})
		.text(entry.id))
		.append($('<td></td>')
		.text(entry.reason))
		.append($('<td></td>')
		.text(moneyFormat(entry.amount)))
		.append($('<td></td>')
		.text(entry.timestamp)));
}

function update() {
	if (!localStorage.getItem('token')) {
		$('#btnlogout').hide();
	} else if (!localStorage.getItem('user')) {
		$('#btnlogout').show();
		updateRecent();
	} else {
		$('#btnlogout').show();
		updateMoney();
	}
}

function updateRecent() {
	$.getJSON('./orders?length=5', function(orders) {
		let text = '';
		orders.forEach(function(order) {
			text += order.user + ': ' + order.reason + '@' + order.timestamp + ', ';
		});
		$('#marquee').text(text);
	});
}

function updateMoney() {
	$.getJSON('./users/' + localStorage.getItem('user'), function(user) {
		$('#money').text(moneyFormat(user.balance));
		if (user.balance < 0) {
			$('#money').addClass('text-danger');
			$('#money').removeClass('text-success');
		} else {
			$('#money').addClass('text-success');
			$('#money').removeClass('text-danger');
		}
	});
}

$(document).ready(function() {
	update();
});