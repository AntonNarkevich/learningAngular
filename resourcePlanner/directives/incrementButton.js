/*global jQuery, angular, _*/
(function incrementButton() {
	'use strict';

	var module = angular.module('rpDirectives', []);

	module.directive('incrementButton', function () {
		return {
			scope: {
				startValue: '@startValue',
				output: '&'
			},
			templateUrl: '/directives/incrementButton.html',
			restrict: 'AE',
			link: function (scope, elem, attrs) {
				scope.startValue = +scope.startValue || 0;
				scope.value = scope.startValue;

				scope.increaseValue = function () {
					scope.value += 1;
				};

				scope.outputValue = function () {
					scope.output({value: scope.value});
				};

				var setAttribute = function () {
					attrs.$set('data-value', scope.value);
				};

				setAttribute();
				scope.$watch('value', setAttribute);

				var button = elem.find('button:first-child');
			}
		};
	});
}());