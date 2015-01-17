/*global jQuery, angular, _, console*/
(function loadingButton($, angular, _) {
	'use strict';

	angular.module('rpDirectives')
		.directive('loadingButton', function ($timeout) {
			return {
				restrict: 'AE',
				scope: {
					onComplete: '&',
					progressFunction: '&',
					resetDelay: '@'
				},
				templateUrl: '/directives/loadingButton.html',
				link: function (scope, element, attrs) {
					var setPercent = function (percent) {
						scope.loadingPercent = Math.round(percent);
					};

					var reset = function () {
						setPercent(0);
					};

					var disable = function () {
						scope.isDisabled = false;
					};

					var enable = function () {
						scope.isDisabled = true;
					};

					var adjustDimmerWidth = function () {
						var dimmer = element.find('.loading-button-dimmer');
						var cssRight = (100 - scope.loadingPercent) + '%';
						dimmer.css('right', cssRight);
					};

					scope.$watch('loadingPercent', adjustDimmerWidth);


					var startLoading = function () {
						scope.progressFunction({
							tickFn: setPercent,
							completeCb: loadingCompleteHandler
						});
					};

					var button = element.find('.loading-button-clickable');
					button.one('click', startLoading);


					var loadingCompleteHandler = function () {
						scope.onComplete();

						$timeout(function () {
							reset();
							button.one('click', startLoading);
						}, +scope.resetDelay);
					};
				}
			};
		});
}(jQuery, angular, _));