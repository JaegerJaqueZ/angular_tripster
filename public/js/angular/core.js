//public/js/angular/core.js

var tripsterApp = angular.module('tripsterApp', [
	'ngRoute',
	'ui.bootstrap',
	'createTripService',
	'myTripControllers',
	'modalAddTripControllers'
]);

tripsterApp.config(['$routeProvider',
function($routeProvider) {
	$routeProvider.
	when('/home', {
		templateUrl: 'partials/home.html'
	}).
	when('/mytrip', {
		templateUrl: 'partials/my_trip.html',
		controller: 'myTripCtrl'
	}).
	when('/search', {
		templateUrl: 'partials/search.html'
	}).
	otherwise({
		redirectTo: '/home'
	});
}]);