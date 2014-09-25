/*global jQuery, angular, _, console*/
(function urlList($, angular, _) {
	'use strict';

	angular.module('rpDirectives')
		.directive('urlList', function ($http, $q, $timeout) {
			return {
				restrict: 'AE',
				scope: {

				},
				controller: function ($scope) {
					var ctrl = this;

					ctrl.addUrl = function (newUrlInfo) {
						if (!_($scope.urls).some(function (urlInfo) {
							return urlInfo.url === newUrlInfo.url;
						})) {
							$scope.urls.push(newUrlInfo);
						}
					};

					ctrl.removeUrl = function (url) {
						$scope.urls = _($scope.urls).reject(function (urlInfo) {
							return urlInfo.url === url;
						});
					};
				},
				templateUrl: '/directives/urlList.html',
				link: function (scope, elem, attrs, ctrl) {
					scope.urls = [
						{url: 'http://google.com', isAccessible: true}
					];

					scope.loadUrl = function (tickCb, completeCb) {
						var urlInfo = {
							url: scope.newUrl
						};

						ctrl.addUrl(urlInfo);

						var abort = $q.defer();

						var abortRequest = function () {
							abort.resolve();
						};

						var timeoutTimer;

						$http({method: 'GET',
							url: scope.newUrl,
							timeout: abort.promise
						})
							.success(function () {
								urlInfo.isAccessible = true;
							})
							.error(function () {
								urlInfo.isAccessible = false;
								clearTimeout(timeoutTimer);
								tickCb(100);
							})
							.finally(function () {
								completeCb();
							});

						var timeout = 1000;
						var tickCount = 10;
						(function wait(i) {
							if (i > tickCount) {
								abortRequest();
								completeCb();
								return;
							}

							timeoutTimer = setTimeout(function () {
								tickCb(_.toPercent(i / 5));
								wait(i + 1);
							}, timeout / tickCount);
						}(0));
					};
				}
			};
		});
}(jQuery, angular, _));