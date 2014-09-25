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
				require: 'loadingButton',
				controller: function ($scope) {
					var ctrl = this;

					ctrl.setPercent = function (percent) {
						if (percent < 1) {
							percent *= 100;
						}

						$scope.$apply(function () {
							$scope.loadingPercent = Math.round(percent);
						});
					};

					ctrl.disable = function () {
						$scope.isDisabled = false;
					};

					ctrl.enable = function () {
						$scope.isDisabled = true;
					};

					ctrl.reset = function () {
						ctrl.setPercent(0);
					};
				},
				link: function (scope, elem, attrs, ctrl) {
					var dimmer = elem.find('.loading-button-dimmer');
					var button = elem.find('.loading-button-clickable');

					var placeDimmer = function () {
						var cssRight = (100 - scope.loadingPercent) + '%';
						dimmer.css('right', cssRight);
					};

					scope.$watch('loadingPercent', placeDimmer);

					var startLoading = function () {
						var completeHandler = function () {
							var onComplete = scope.onComplete();

							if (_.isFunction(onComplete)) {
								onComplete();
							}

							$timeout(function () {
								ctrl.reset();
								button.one('click', startLoading);
							}, +scope.resetDelay);
						};

						var progressFn = scope.progressFunction();

						if (_.isFunction(progressFn)) {
							progressFn(ctrl.setPercent.bind(ctrl), completeHandler);
						}
					};

					button.one('click', startLoading);
				}
			};
		});
}(jQuery, angular, _));