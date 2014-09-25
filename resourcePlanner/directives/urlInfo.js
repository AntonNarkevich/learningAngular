/*global jQuery, angular, _, console*/
(function urlInfo() {
	'use strict';

	angular.module('rpDirectives')
		.directive('urlInfo', function () {
			return {
				restrict: 'AE',
				templateUrl: '/directives/urlInfo.html',
				replace: true,
				link: function (scope, elem, attrs) {
					var setIconName = function () {
						var getIconName = function (isAccessible) {
							if (_.isUndefined(isAccessible)) {
								return 'refresh';
							}

							return isAccessible ? 'ok' : 'remove';
						};

						var isAccessible = scope.urlInfo.isAccessible;
						scope.iconName = getIconName(isAccessible);
					};

					setIconName();

					scope.$watch('urlInfo.isAccessible', function () {
						setIconName();
					});
				}
			};
		});
}());