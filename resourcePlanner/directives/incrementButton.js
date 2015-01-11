/*global jQuery, angular, _*/
(function incrementButton() {
	'use strict';

	var module = angular.module('rpDirectives', []);

	module.directive('incrementButton', function () {
		return {
			scope: {
				value: '='
			},
			templateUrl: '/directives/incrementButton.html',
			restrict: 'AE',
			link: function (scope, element, attrs) {
				scope.increaseValue = function () {
					scope.value += 1;
				};

				scope.outputValue = function () {
					window.alert(scope.value);
				};
			}
		};
	});
}());