'use strict';

/**
 * @ngdoc overview
 * @name whetherChromeApp
 * @description
 * # whetherChromeApp
 *
 * Main module of the application.
 */
angular
  .module('whetherChromeApp', [
    'ngAnimate',
    'ngRoute'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
