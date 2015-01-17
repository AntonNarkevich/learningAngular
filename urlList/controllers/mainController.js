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
					setTimeout(completeCb);

					return;
				}

				var timeToWait = timeIntervals[intervalIndex];

				$timeout(function () {
					elapsedTime += timeToWait;
					tickCb(_.toPercent(elapsedTime / totalTime));
					wait(intervalIndex + 1);
				}, timeToWait);
			}(0));
		};

		$scope.logThatLoaded = function () {
			console.log('The button has been loaded.');
		};

		$scope.singleUrlInfo = {
			url: 'http://oz.by/',
			status: 'ok'
		};

		$scope.urlInfoArray = [
			{
				url: 'http://oz.by/'
			},
			{
				url: 'http://google.com/'
			},
			{
				url: 'http://amazon.com/'
			},
			{
				url: 'http:whatislove'
			}
		];

		$scope.incObj = {
			value: 3
		};

		$scope.isFirstContentVisible = true;
	});
}());

