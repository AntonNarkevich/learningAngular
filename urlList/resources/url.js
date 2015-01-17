angular.module('rpResources', []).factory('Url', function($resource) {
	// Define CreditCard class
	return $resource('http://localhost:3000/', {}, {
		checkValidity: {method:'POST', params: {url: '@url'}}
	});
});