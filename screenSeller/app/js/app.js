/*global angular, gapi*/
'use strict';

// Declare app level module which depends on filters, and services
angular.module('myApp', [
	'ngRoute',
	'myApp.filters',
	'myApp.services',
	'myApp.directives',
	'myApp.controllers'
]).config(['$httpProvider', '$routeProvider', 'AWSServiceProvider', 'StripeServiceProvider', function ($httpProvider, $routeProvider, AWSServiceProvider, StripeServiceProvider) {
	$routeProvider
		.when('/', {
			controller: 'MainController',
			templateUrl: 'partials/main.html'
		})
		.otherwise({
			redirectTo: '/'
		});

	AWSServiceProvider.setArn('arn:aws:iam::696620835223:role/googleWebRole');
	StripeServiceProvider.setPublishableKey('pk_test_58HKvINxZbKrRpFQzIV1CakP');
}]);

window.onLoadCallback = function () {
	angular.element(document).ready(function () {
		gapi.client.load('oauth2', 'v2', function () {
			angular.bootstrap(document, ['myApp']);
		});
	});
};
