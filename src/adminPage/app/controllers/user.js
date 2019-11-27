app.controller('userController', function($scope, $http, $window) {
	if (!$scope.auth.isAdmin) {
		$window.location.href = '#!';
		return;
	}

	$scope.title = "User Overview";
	$scope.icon = "fa-users";

	$scope.searchableGlobal = false;
	$scope.searchableLocal = true;
	$scope.enumerate = true;

	$scope.config = [
		{
			icon: 'fa-money',
			click: function(data) {
				$scope.ctabs[1].data.name = data.name;
				$('#collapseaddMoney').collapse('show');
			}
		},
		{
			icon: 'fa-low-vision',
			click: function(data) {
				if (data.hidden == 0) {
					$scope.apiPost('./users/' + encodeURI(data.name) + '/hide');
				} else {
					$scope.apiPost('./users/' + encodeURI(data.name) + '/show');
				}
			}
		},
		{
			icon: 'fa-trash',
			click: function(data) {
				$scope.ctabs[2].data.name = data.name;
				$('#collapseremove').collapse('show');
			}
		}
	];

	$scope.ctabs = [
		{
			name: 'add',
			icon: 'fa-plus',
			displayname: 'Add',
			data: {},
			fields: [
				{
					name: 'name',
					displayname: 'User:',
					placeholder: 'mustermx',
					disabled: false,
				}
			],
			submit: function(data) {
				$scope.apiPost('./users/' + encodeURI(data.name));
			}
		},
		{
			name: 'addMoney',
			icon: 'fa-money',
			displayname: 'Add Money',
			data: {},
			fields: [
				{
					name: 'name',
					displayname: 'User:',
					placeholder: 'mustermx',
					disabled: true,
				},
				{
					name: 'reason',
					displayname: 'Reason:',
					placeholder: 'Bargeld Einzahlung',
					disabled: false,
				},
				{
					name: 'amount',
					displayname: 'Amount:',
					placeholder: '1000 [to add 10€]',
					disabled: false,
				}
			],
			submit: function(data) {
				if (data.amount !== undefined && data.amount !== null) {
					$scope.apiPatch('./users/' + encodeURI(data.name), {
						amount: data.amount,
						reason: !(!data.reason) ? data.reason : 'Bargeld Einzahlung',
					});
				}
			}
		},
		{
			name: 'remove',
			icon: 'fa-minus',
			displayname: 'Remove',
			data: {},
			fields: [
				{
					name: 'name',
					displayname: 'User:',
					placeholder: 'mustermx',
					disabled: false,
				}
			],
			submit: function(data) {
				$scope.apiDelete('./users/' + encodeURI(data.name));
			}
		}
	];

	$scope.search = {};
	$scope.collumnSet = [
		{
			name: "name",
			displayname: "User:",
			display: function(data) {
				return data;
			}
		},
		{
			name: "balance",
			displayname: "Balance:",
			display: function(money) {
				absolut = Math.abs(money);
				return (money < 0 ? '-' : '') + Math.floor(absolut/100) + ',' + ((absolut%100 < 10) ? '0' : '') + (absolut%100) + '€';
			}
		},
		{
			name: "hidden",
			displayname: "Hidden:",
			display: function(data) {
				if (data == 1) {
					return "Yes"
				}
				if (data == 0) {
					return "No"
				}
				return data
			}
		}
	];
	$scope.rowClass = function(entry) {
		if (entry.hidden != 0) {
			return 'table-info';
		}
		if (entry.balance < 0) {
			return 'table-warning';
		}
	};
	$scope.cellClass = function(entry) {
		if (entry < 0) {
			return 'text-danger';
		} else if (entry == 1) {
		} else if (entry > 0) {
			return 'text-success';
		}
	};

	$scope.apiGet('./users', function(response) {
		$scope.dataSet = response.data;
	});
});
