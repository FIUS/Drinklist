app.controller('beverageController', function($scope, $http, $window) {
	if (!$scope.auth.isAdmin) {
		$window.location.href = '#!';
		return;
	}

	$scope.title = "Beverage Overview";
	$scope.icon = "fa-beer";
	
	$scope.searchableGlobal = false;
	$scope.searchableLocal = true;
	$scope.enumerate = true;

	$scope.config = [
		{
			icon: 'fa-cog',
			click: function(entry) {
			}
		},
		{
			icon: 'fa-minus',
			click: function(entry) {
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
					displayname: 'Name:',
					placeholder: 'Dosen Bier',
					disabled: false,
				},
				{
					name: 'price',
					displayname: 'Price:',
					placeholder: '124 [if the beverages costs 1,24€]',
					disabled: false,
				}
			],
			submit: function(data) {
				alert(JSON.stringify(data));
			}
		},
		{
			name: 'mod',
			icon: 'fa-cog',
			displayname: 'Modify',
			data: {},
			fields: [
				{
					name: 'name',
					displayname: 'Name:',
					placeholder: 'Dosen Bier',
					disabled: true,
				},
				{
					name: 'price',
					displayname: 'Price:',
					placeholder: '124 [if the beverages costs 1,24€]',
					disabled: false,
				}
			],
			submit: function(data) {
				alert(JSON.stringify(data));
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
					displayname: 'Name:',
					placeholder: 'Dosen Bier',
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
			name: "name",
			displayname: "Name:",
			display: function(data) {
				return data;
			}
		},
		{
			name: "price",
			displayname: "Price",
			display: function(money) {
				absolut = Math.abs(money);
				return (money < 0 ? '-' : '') + Math.floor(absolut/100) + ',' + ((absolut%100 < 10) ? '0' : '') + (absolut%100) + '€';
			}
		}
	];
	$scope.rowClass = function(entry) {
		if (entry.amount < 0) {
			return 'table-warning';
		}
	};
	$scope.cellClass = function(entry) {};

	$scope.apiGet('/beverages').then(function(response) {
		$scope.dataSet = response.data;
	});
});
