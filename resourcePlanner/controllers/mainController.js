/*global jQuery, angular, _, console*/
(function mainController() {
	'use strict';

	var module = angular.module('rpControllers', []);

	module.controller('MainController', function ($scope, $timeout) {
		$scope.mainVar = 'What is love?';

		$scope.logIt = function (value) {
			console.log(value);
		};

		$scope.sampleLoading = function (tickCb, completeCb) {
			var getRandTime = function () {
				return Math.round(Math.random() * 1000);
			};

			var intervalCount = 5;
			var timeIntervals = Array.apply(null, {length: intervalCount}).map(getRandTime);
			var totalTime = _(timeIntervals).reduce(function (memo, interval) {
				return memo + interval;
			});

			var elapsedTime = 0;

			(function wait(intervalIndex) {
				if (intervalIndex >= intervalCount) {
                    $timeout(completeCb);

					return;
				}

				var timeToWait = timeIntervals[intervalIndex];

				$timeout(function () {
					elapsedTime += timeToWait;
					tickCb(_.toPercent(elapsedTime / totalTime));

                    //Recursive call with increased counter.
					wait(intervalIndex + 1);
				}, timeToWait);
			}(0));
		};

		$scope.logThatLoaded = function () {
			console.log('The button has been loaded.');
		};

		$scope.isFirstContentVisible = false;

		$scope.incObj = {
			value: 5
		};
	});
}());

