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

						$http({method: 'HEAD',
							url: scope.newUrl,
							timeout: abort.promise
						})
							.success(function () {
                                $timeout(function() {
                                    tickCb(100);
                                });
                                urlInfo.isAccessible = true;

                            })
							.error(function () {
                                urlInfo.isAccessible = false;

                            })
							.finally(function () {
                                $timeout(function() {
//                                    tickCb(100);
                                    clearTimeout(timeoutTimer);
                                    completeCb();
                                    console.log('complete cb has been called');
                                });
                            });

						var timeout = 1000;
						var tickCount = 10;
						(function wait(i) {
							if (i > tickCount - 1) {
								abortRequest();
								return;
							}

							timeoutTimer = setTimeout(function () {
                                console.log('Tick callback has been called.');
								tickCb(_.toPercent(i / 5));
								wait(i + 1);
							}, timeout / tickCount);
						}(0));
					};
				}
			};
		});
}(jQuery, angular, _));