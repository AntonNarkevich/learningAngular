/*global jQuery, angular, _, console*/
(function urlList($, angular, _) {
	'use strict';

	angular.module('rpDirectives')
		.directive('urlList', function ($http, $q, $timeout, Url) {
			return {
				restrict: 'AE',
				scope: {
					urlList: '='
				},
				templateUrl: '/directives/urlList.html',
				link: function (scope, elem, attrs, ctrl) {
					Url.checkValidity({url: 'http://google.com'}, function () {
						console.log(arguments);
						debugger;
					});

					scope.addUrl = function (newUrlInfo) {
						var doesAlreadyExist = _(scope.urlList).some(function (urlInfo) {
							return urlInfo.url === newUrlInfo.url;
						});

						if (!doesAlreadyExist) {
							scope.urlList.push(newUrlInfo);
						}
					};

					scope.removeUrl = function (url) {
						scope.urlList = _(scope.urls).reject(function (urlInfo) {
							return urlInfo.url === url;
						});
					};

					scope.loadUrl = function (tickCb, completeCb) {
						var urlInfo = {
							url: scope.newUrl,
							status: 'loading'
						};

						var timeout = 1000;
						var tickCount = 10;

						(function wait(i) {
							if (i > tickCount - 1) {
								completeCb();
								//Is it ok to call it like this?
								scope.addUrl(urlInfo);

								return;
							}

							$timeout(function () {
								tickCb(_.toPercent(i / 5));
								wait(i + 1);
							}, timeout / tickCount);
						}(0));
					};

					scope.clearNewUrl = function () {
						scope.newUrl = undefined;
					};
				}
			};
		});
}(jQuery, angular, _));