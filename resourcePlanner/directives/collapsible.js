/*global jQuery, angular, _*/
(function collapsible() {
	angular.module('rpDirectives')
		.directive('collapsible', function () {
			return {
				restrict: 'AE',
				transclude: true,
				templateUrl: '/directives/collapsible.html',

				link: function (scope, element, attrs) {
					scope.toggleContent = function () {
						scope.isContentVisible = !scope.isContentVisible;
					};
				}
			};
		});
}());