var app = angular.module('mainModule', ['ngRoute']);

app.config(function ($routeProvider) {
	$routeProvider
		.when('/', {
			controller: 'overviewController',
			templateUrl: './app/partials/overview.html',
			activetab: 'overview'
		}).when('/history', {
			controller: 'historyController',
			templateUrl: './app/partials/listPartial.html',
			activetab: 'history'
		}).otherwise({ redirectTo: '/'});
});