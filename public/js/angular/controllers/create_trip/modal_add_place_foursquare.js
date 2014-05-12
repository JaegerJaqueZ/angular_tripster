//public/js/angular/controllers/modal_add_place_foursquare.js

var modalAddPlaceFoursquareControllers = angular.module('modalAddPlaceFoursquareControllers', []);

modalAddPlaceFoursquareControllers.controller('modalAddPlaceFoursquareCtrl', function ($scope, $http, createTripFactory) {

	//initialze search (can delete if want)
	$scope.input = {province:"กรุงเทพมหานคร"};
	var lat="",
		lng="";	
	//initialize loading spinner	
	$scope.loading = false;

	$scope.findPlace = function (){

		$scope.loading = true;

		$http({method: 'GET', url: 'https://api.foursquare.com/v2/venues/explore?client_id=FSEL5ZQNNTPR4RHCVJMQ53541XJPZM4LIHBCNJVBVHRJTE4O&client_secret=KBIQX2U1X4LZ5GWRSAELWH2CFSTPBBNK4NBQZCGB2KQE1ENQ&v=20130619&query=' + $scope.input.name + '&near=' + $scope.input.province}).
		success(function(data, status, headers, config) {
			$scope.loading = false;
			$scope.foursqplaces = data.response.groups[0].items;
			
		}).
		error(function(data, status, headers, config) {
			$scope.loading = false;
			alert("error");

		});
	}	

	// search nearby place
	$scope.findNearbyPlace = function (){
		$scope.loading = true;
		navigator.geolocation.getCurrentPosition(geoSuccess, geoFail);
	}		

	function geoSuccess(location) {
	    lat = location.coords.latitude;
	    lng = location.coords.longitude;
		
	    $http({method: 'GET', url: 'https://api.foursquare.com/v2/venues/explore?client_id=FSEL5ZQNNTPR4RHCVJMQ53541XJPZM4LIHBCNJVBVHRJTE4O&client_secret=KBIQX2U1X4LZ5GWRSAELWH2CFSTPBBNK4NBQZCGB2KQE1ENQ&v=20130619&ll=' +lat+','+lng+''}).
		//$http({method: 'GET', url: 'https://api.foursquare.com/v2/venues/explore?client_id=FSEL5ZQNNTPR4RHCVJMQ53541XJPZM4LIHBCNJVBVHRJTE4O&client_secret=KBIQX2U1X4LZ5GWRSAELWH2CFSTPBBNK4NBQZCGB2KQE1ENQ&v=20130619&query=' + $scope.input.name + '&near=' + $scope.input.province}).
		success(function(data, status, headers, config) {
			$scope.loading = false;
			console.log( data.response.groups);
			$scope.foursqplaces = data.response.groups[0].items;
			
		}).
		error(function(data, status, headers, config) {
			$scope.loading = false;
			// console.log(data);
			alert('Something went wrong. Please try again.');
		});

	}

	function geoFail() {
		$scope.loading = false;
		alert('Cannot get your current location. Please try again.');
	}



	$scope.selectPlace = function (chosenplace){		
		
		createTripFactory.setChosenPlace(createTripFactory.adjustPlaceObject(jQuery.extend({},chosenplace)));	
		$scope.cancel();
	}



});