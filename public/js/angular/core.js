//public/js/angular/core.js

var tripsterApp = angular.module('tripsterApp', [
	'ngRoute',
	'ui.bootstrap',
	'createTripService',
	'searchTripService',
	'bookmarkService',
	'myTripControllers',
	'modalAddTripControllers',
	'modalEditTripControllers',
	'modalAddTripAddPlaceControllers',
	'modalAddPlaceFoursquareControllers',
	'modalEditPlaceFoursquareControllers',
	'modalAddTripEditPlaceControllers',
	'searchTripControllers',
	'modalSearchTripControllers',
	'bookmarkControllers'
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
		templateUrl: 'partials/search_trip.html',
		controller: 'searchTripCtrl'
	}).
	when('/bookmark', {
		templateUrl: 'partials/bookmark.html',
		controller: 'bookmarkCtrl'
	}).
	otherwise({
		redirectTo: '/home'
	});
}]);