app.controller('historyController', function($scope, $http, $window) {
	if (!$scope.auth.isAdmin) {
		$window.location.href = '#!';
		return;
	}

	$scope.title = "History Overview";
	$scope.icon = "fa-history";
	
	$scope.searchableGlobal = false;
	$scope.searchableLocal = true;
	$scope.enumerate = true;

	$scope.config = {
		button: true,
		icon: 'fa-cog',
		click: function(entry) {
		}
	};

	$scope.ctabs = [
		{
			name: 'add',
			icon: 'fa-plus',
			displayname: 'Add',
			data: {},
			fields: [
				{
					name: 'user',
					displayname: 'User:',
					placeholder: 'mustermx',
					disabled: false,
				},
				{
					name: 'reason',
					displayname: 'Reason:',
					placeholder: 'Bar Einzahlung',
					disabled: false,
				},
				{
					name: 'amount',
					displayname: 'Amount:',
					placeholder: '1000 [to add 10€ to a Account] / -254 [to remove 2,54€ from a account]',
					disabled: false,
				}
			],
			submit: function(data) {
				alert(JSON.stringify(data));
			}
		}
	];

	$scope.search = {};
	$scope.collumnSet = [
		{
			name: "id",
			displayname: "ID",
			display: function(data) {
				return data.toString().substring(1, data.toString().indexOf("-"));
			}
		},
		{
			name: "user",
			displayname: "User",
			display: function(data) {
				return data;
			}
		},
		{
			name: "reason",
			displayname: "Reason",
			display: function(data) {
				return data;
			}
		},
		{
			name: "amount",
			displayname: "Amount",
			display: function(money) {
				absolut = Math.abs(money);
				return (money < 0 ? '-' : '') + Math.floor(absolut/100) + ',' + ((absolut%100 < 10) ? '0' : '') + (absolut%100) + '€';
			}
		},
		{
			name: "timestamp",
			displayname: "Timestamp",
			display: function(data) {
				return data;
			}
		}
	];
	$scope.rowClass = function(entry) {
		if (entry.amount > 0) {
			return 'table-warning';
		}
	};
	$scope.cellClass = function(entry) {
		if (entry < 0) {
			return 'text-danger'
		} else if (entry > 0) {
			return 'text-success'
		}
	}

	$scope.apiGet('/orders').then(function(response) {
		$scope.dataSet = response.data;
	});
});
