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
			icon: 'fa-trash',
			click: function(data) {
				$scope.ctabs[1].data = data;
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
				$scope.apiPost('/users/' + encodeURI(data.name));
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
				$scope.apiDelete('/users/' + encodeURI(data.name));
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
		}
	];
	$scope.rowClass = function(entry) {
		if (entry.balance < 0) {
			return 'table-warning';
		}
	};
	$scope.cellClass = function(entry) {
		if (entry < 0) {
			return 'text-danger'
		} else if (entry > 0) {
			return 'text-success'
		}
	};

	$scope.apiGet('/users').then(function(response) {
		$scope.dataSet = response.data;
	});
});