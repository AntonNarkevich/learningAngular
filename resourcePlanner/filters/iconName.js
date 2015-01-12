/*global jQuery, angular, _*/
(function iconName() {
	'use strict';

	angular.module('rpDirectives')
		.filter('iconName', function () {
			return function (linkStatus) {
				switch (linkStatus) {
					case 'loading':
						return 'glyphicon-refresh';
					case 'ok':
						return 'glyphicon-ok';
					default:
						return 'glyphicon-remove';
				}
			};
		});
}());
