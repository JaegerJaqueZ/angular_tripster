//public/js/angular/core.js

var tripsterApp = angular.module('tripsterApp', [
	'ngRoute',
	'ngCookies',
	'ui.bootstrap',
	'angularFileUpload',

	'authService',
	'createTripService',
	'searchTripService',
	'bookmarkService',
	'timelineService',
	'profileService',

	'loginControllers',
	'myTripControllers',
	'modalAddTripControllers',
	'modalEditTripControllers',
	'modalAddTripAddPlaceControllers',
	'modalAddTripEditPlaceControllers',
	'modalEditTripAddPlaceControllers',
	'modalEditTripEditPlaceControllers',
	'modalAddPlaceFoursquareControllers',
	'modalEditPlaceFoursquareControllers',	
	'searchTripControllers',
	'modalSearchTripControllers',
	'bookmarkControllers',
	'modalBookmarkControllers',
	'timelineControllers',
	'modalTimelineControllers',
	'profileControllers',	
]);

tripsterApp.config(['$routeProvider', '$locationProvider', '$httpProvider',
function($routeProvider, $locationProvider, $httpProvider) {
	$routeProvider.
	when('/timeline', {
		templateUrl: 'partials/timeline.html',
		controller: 'timelineCtrl'
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
	when('/login', {
			templateUrl: 'partials/login.html',
			controller: 'loginCtrl'
	}).
	when('/profile', {
			templateUrl: 'partials/profile.html',
			controller: 'profileCtrl'
	}).	
	otherwise({
		redirectTo: '/timeline'
	});

	// $locationProvider.html5Mode(true);

    $httpProvider.interceptors.push(function($q, $location) {
        return {
            'responseError': function(response) {
                if(response.status === 401) {
                    $location.path('/login');
                }
                return $q.reject(response);
            }
        };
    });

}]);


tripsterApp.config(['$httpProvider', function($httpProvider) {
        $httpProvider.defaults.useXDomain = true;
		delete $httpProvider.defaults.headers.common['X-Requested-With'];
    }
]);


tripsterApp.run(function ($rootScope, $location, authFactory) {

	// extension
	FastClick.attach(document.body);
	
    //watching the value of the currentUser variable.
    $rootScope.$watch('currentUser', function(currentUser) {
      // if no currentUser and on a page that requires authorization then try to update it
      // will trigger 401s if user does not have a valid session
      if (!currentUser && (['/', '/login', '/logout'].indexOf($location.path()) == -1 )) {
      	authFactory.getCurrentUser();
      }
  });

});