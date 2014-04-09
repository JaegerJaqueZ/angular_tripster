
var tripsterApp = angular.module('tripsterApp', [
'ngRoute',
'ui.bootstrap',
'mytripControllers',
'newtrip01Controllers',
'newtrip02Controllers',
'newtrip03Controllers',
'createtripService',
'searchControllers'	
]);

tripsterApp.config(['$routeProvider',
function($routeProvider) {
	$routeProvider.
	when('/home', {
		templateUrl: 'partials/home.html'
	}).
	when('/mytrip', {
		templateUrl: 'partials/mytrip.html',
		controller: 'myTripCtrl'
	}).
	when('/search', {
		templateUrl: 'partials/search.html',
		controller: 'searchCtrl'
	}).
	otherwise({
		redirectTo: '/home'
	});
}]);