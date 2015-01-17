/*global jQuery, angular, _, console*/
(function urlInfo() {
	'use strict';

	angular.module('rpDirectives')
		.directive('urlInfo', function (Url) {
			return {
				restrict: 'AE',
				templateUrl: '/directives/urlInfo.html',
				replace: true,
				scope: {
					url: "=",
					status: "="
				},
				link: function(scope) {
					var url = new Url({url:scope.url});

					scope.status = 'loading';

					url.$checkValidity(function(url) {
						scope.status = url.status;
					});
				}
			};
		});
}());