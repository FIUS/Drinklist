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
		$http({
			method: 'POST',
			url: $scope.api + path,
			params: data,
			headers: {
				'X-Auth-Token': $scope.auth.token
			}
		}).then(function(response) {
			if (callback) {
				callback(response);
			}
			// TODO DEBUG CODE remove this line
			alert(JSON.stringify(response));
			$route.reload();
		}, function(response) {
			auth.logout($scope.api);
		});
	};
	$scope.apiPatch = function(path, data, callback) {
		$http({
			method: 'PATCH',
			url: $scope.api + path,
			params: data,
			headers: {
				'X-Auth-Token': $scope.auth.token
			}
		}).then(function(response) {
			if (callback) {
				callback(response);
			}
			// TODO DEBUG CODE remove this line
			alert(JSON.stringify(response));
			$route.reload();
		}, function(response) {
			auth.logout($scope.api);
		});
	};
	$scope.apiDelete = function(path, callback, data) {
		$http({
			method: 'DELETE',
			url: $scope.api + path,
			params: data,
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
	};
});