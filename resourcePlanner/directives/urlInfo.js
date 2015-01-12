/*global jQuery, angular, _, console*/
(function urlInfo() {
	'use strict';

	angular.module('rpDirectives')
		.directive('urlInfo', function () {
			return {
				restrict: 'AE',
				templateUrl: '/directives/urlInfo.html',
				replace: true,
				scope: {
					url: "=",
					status: "="
				}
			};
		});
}());