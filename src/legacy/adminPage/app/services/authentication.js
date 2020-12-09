app.service('authService', authService);

function authService($window, $http) {

	this.isLoggedIn = false;
	this.isAdmin = false;

	this.token = "";

	this.login = function(api, password) {
		$http({
			method: 'POST',
			url: api + './login',
			data: "password=" + password,
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
			}
		}).then(function(response) {
			this.token = response.data.token;
			this.isAdmin = response.data.root;

			this.isLoggedIn = true;
		}.bind(this));
	};

	this.logout = function(api) {
		$http({
			method: 'POST',
			url: api + './logout?token=' + this.token
		});
		this.isLoggedIn = false;
		$window.location.reload();
	};
}