'use strict';

/**
 * @ngdoc function
 * @name whetherChromeApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the whetherChromeApp
 */
angular.module('whetherChromeApp')
  .controller('AboutCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
