/*global jQuery, angular, _*/
'use strict';

var myApp = angular.module('rpApp', ['rpControllers', 'rpDirectives']);

myApp.config(['$httpProvider', function($httpProvider) {
    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
}
]);