/*global jQuery, angular, _*/
(function well() {
	angular.module('rpDirectives')
		.directive('well', function () {
			return {
				restrice: 'AE',
				templateUrl: '/directives/well.html',
				transclude: true
			};
		});
}());