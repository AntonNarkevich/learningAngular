/*global jQuery, angular, _*/
(function collapsible() {
	angular.module('rpDirectives')
		.directive('collapsible', function() {
			return {
				restrict: 'AE',
				transclude: true,
				templateUrl: '/directives/collapsible.html',
				link: function (scope, elem, attrs) {
					var button = elem.find('.collapse-button');
					var content = elem.find('.content');

					scope.isContentVisible = true;

					scope.toggleContent = function() {
						content.toggle();
						scope.isContentVisible = !scope.isContentVisible;
					};
				}
			};
		});
}());