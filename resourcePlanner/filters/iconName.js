/*global jQuery, angular, _*/
(function iconName() {
	'use strict';

	var ticketStatuses = {
		0: 'Todo',
		1: 'Done'
	};

	var ticketStatuses = [
		{key: 0, value: 'Todo'},
		{key: 0, value: 'Todo'}
	]

	_.indexBy(ticketStatuses, 'key');

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
