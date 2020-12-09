app.controller('tokenController', function($scope, $route, $http, $window) {
	if (!$scope.auth.isAdmin) {
		$window.location.href = '#!';
		return;
	}

	$scope.title = "Active Tokens";
	$scope.icon = "fa-key";
	
	$scope.searchableGlobal = false;
	$scope.searchableLocal = true;
	$scope.enumerate = true;

	$scope.config = [
		{
			icon: 'fa-trash',
			click: function(data) {
				$scope.ctabs[0].data = data;
				$('#collapseremove').collapse('show');
			}
		}
	];

	$scope.ctabs = [
		{
			name: 'remove',
			icon: 'fa-minus',
			displayname: 'Remove',
			data: {},
			fields: [
				{
					name: 'token',
					displayname: 'Token:',
					placeholder: '2a95b591-0031-42fc-8df4-dc687b6827ea',
					disabled: false,
				}
			],
			submit: function(data) {
				$http({
					method: 'POST',
					url: $scope.api + './logout?token=' + data.token
				}).then(function(response) {
					alert('Invalidated Token: ' + data.token);
					$route.reload();
				}.bind(this));
			}
		}
	];

	$scope.search = {};
	$scope.collumnSet = [
		{
			name: "token",
			displayname: "Token:",
			display: function(data) {
				return data;
			}
		},
		{
			name: "root",
			displayname: "Root:",
			display: function(data) {
				return data;
			}
		},
		{
			name: "useragent",
			displayname: "User Agent:",
			display: function(data) {
				return data;
			}
		},
		{
			name: "referrer",
			displayname: "Referrer:",
			display: function(data) {
				return data;
			}
		},
		{
			name: "userip",
			displayname: "User IP:",
			display: function(data) {
				return data;
			}
		}
	];
	$scope.rowClass = function(entry) {};
	$scope.cellClass = function(entry) {};

	$scope.apiGet('./token', function(response) {
		$scope.dataSet = response.data;
	});
});