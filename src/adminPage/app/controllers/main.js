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
	$scope.apiPost = function(path, data) {
		$http.post($scope.api + path, data, {
			headers: {
				'X-Auth-Token': $scope.auth.token
			}
		}).then(function(response) {
			if (response.data.error) {
				alert('Error Occured');
			}
			//alert(JSON.stringify(response.data));
			$route.reload();
		});
	};
});