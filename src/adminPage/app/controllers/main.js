app.controller('mainController', function($scope, $route, $http, authService) {
	$scope.auth = authService;

	$scope.isActive = function(tab) {
		if (!$route.current) {
			return false;
		}
		return $route.current.activetab == tab;
	};
	
	$scope.api = "http://localhost:8080";
	$scope.apiGet = function(path) {
		return $http.get($scope.api + path, {
			headers: {
				'X-Auth-Token': $scope.auth.token
			}
		});
	};
	$scope.apiPost = function(path, data, callback) {
		$http.post($scope.api + path, data, {
			headers: {
				'X-Auth-Token': $scope.auth.token
			}
		}).then(function(response) {
			if (callback) {
				callback(response);
			}
			$route.reload();
		}, function(response) {
			auth.logout($scope.api);
		});
	};
	$scope.apiDelete = function(path, callback) {
		$http({
			method: 'DELETE',
			url: $scope.api + path,
			headers: {
				'X-Auth-Token': $scope.auth.token
			}
		}).then( function(response) {
			if (callback) {
				callback(response);
			}
			$route.reload();
		}, function(response) {
			auth.logout($scope.api);
		});
	}
});