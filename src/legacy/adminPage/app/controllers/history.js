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

	$scope.config = [
		{
			icon: 'fa-repeat fa-flip-horizontal',
			click: function(data) {
				$scope.ctabs[0].data.id = data.id;
				$('#collapserevert').collapse('show');
			}
		}
	];

	$scope.ctabs = [
		{
			name: 'revert',
			icon: 'fa-repeat fa-flip-horizontal',
			displayname: 'Revert',
			data: {},
			fields: [
				{
					name: 'id',
					displayname: 'ID:',
					placeholder: '',
					disabled: false,
				}
			],
			submit: function(data) {
				$scope.apiDelete("./orders/" + encodeURI(data.id));
			}
		}
	];

	$scope.search = {};
	$scope.collumnSet = [
		{
			name: "id",
			displayname: "ID:",
			display: function(data) {
				return data.toString().substring(0, data.toString().indexOf("-"));
			}
		},
		{
			name: "user",
			displayname: "User:",
			display: function(data) {
				return data;
			}
		},
		{
			name: "reason",
			displayname: "Reason:",
			display: function(data) {
				return data;
			}
		},
		{
			name: "amount",
			displayname: "Amount:",
			display: function(money) {
				absolut = Math.abs(money);
				return (money < 0 ? '-' : '') + Math.floor(absolut/100) + ',' + ((absolut%100 < 10) ? '0' : '') + (absolut%100) + '€';
			}
		},
		{
			name: "timestamp",
			displayname: "Timestamp:",
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
	};

	$scope.apiGet('./orders', function(response) {
		$scope.dataSet = response.data;
	});
});
