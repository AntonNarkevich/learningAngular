angular.module('mobileDemoApp', [
	'ngAnimate',
	'ngTouch',
	'ngRoute',
	'angular-gestures'
])
	.config(function ($routeProvider) {
		$routeProvider
			.when('/', {
				templateUrl: 'templates/main.html',
				controller: 'MainController'
			})
			.otherwise({
				redirectTo: '/'
			});
	})
	.controller('MainController', function ($scope) {
		var msg = "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."

		$scope.emails = [
			{from: "Ari", to: "Q", body: msg},
			{from: 'Sean', to: 'Anand', body: msg},
			{from: 'Q', to: 'Sean', body: msg}
		];

		$scope.tapped = function ($event) {
			var ele = angular.element($event.target);
			var x = Math.floor(Math.random() * 200) + 1,
				y = Math.floor(Math.random() * 100) + 1,
				z = Math.floor(Math.random() * 6) + 1,
				rot = Math.floor(Math.random() * 360) + 1;


			ele.css('transform', "rotate(" + rot + "deg)");
		};
	});
