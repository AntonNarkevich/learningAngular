/*global jQuery, angular, _*/
(function mainController() {
	'use strict';

	var module = angular.module('rpControllers', []);

	module.controller('MainController', function ($scope) {
		$scope.mainVar = 'What is love?';

		$scope.logIt = function (value) {
			console.log(value);
		};
	});
}());

