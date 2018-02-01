var app = angular.module('mainModule', ['ngRoute', 'ngFileSaver']);

app.config(function ($routeProvider) {
	$routeProvider
		.when('/', {
			controller: 'overviewController',
			templateUrl: './app/partials/overview.html',
			activetab: 'overview'
		}).when('/beverage', {
			controller: 'beverageController',
			templateUrl: './app/partials/listPartial.html',
			activetab: 'beverage'
		}).when('/history', {
			controller: 'historyController',
			templateUrl: './app/partials/listPartial.html',
			activetab: 'history'
		}).when('/user', {
			controller: 'userController',
			templateUrl: './app/partials/listPartial.html',
			activetab: 'user'
		}).when('/token', {
			controller: 'tokenController',
			templateUrl: './app/partials/listPartial.html',
			activetab: 'token'
		}).otherwise({ redirectTo: '/'});
});