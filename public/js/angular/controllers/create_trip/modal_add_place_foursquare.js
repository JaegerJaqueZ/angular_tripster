//public/js/angular/controllers/modal_add_place_foursquare.js

var modalAddPlaceFoursquareControllers = angular.module('modalAddPlaceFoursquareControllers', []);

modalAddPlaceFoursquareControllers.controller('modalAddPlaceFoursquareCtrl', function ($scope, $http, createTripFactory) {

	//initialize loading spinner	
	$scope.loading = true;
	createTripFactory.getNearByPlaces();

	//initialze search (can delete if want)
	$scope.input = {province:"กรุงเทพมหานคร"};
	var lat="",
		lng="";	

	$scope.$watch(
		function() {
			return createTripFactory.getFoursqplaces();
		},
		function(newValue, oldValue) {
			if(newValue!==oldValue){
				$scope.loading = false;
				$scope.foursqplaces = newValue;
			}
		}
	);


	$scope.findPlace = function (){
		$scope.loading = true;

		console.log($scope.input.name, $scope.input.province);
		$http({	
			method: 'GET', 
			url: createTripFactory.getOriginPath() + "fsq/find?query=" + $scope.input.name + '&near=' + $scope.input.province
		}).
		success(function(data, status, headers, config) {

			console.log(data);
			createTripFactory.setFoursqplaces(data);

		}).
		error(function(data, status, headers, config) {

			alert('Please try again.');
		});
	}	

	// search nearby place
	$scope.findNearbyPlace = function (){
		$scope.loading = true;

		createTripFactory.getNearByPlaces($scope.input.name);
	}		

	$scope.selectPlace = function (chosenplace){		
		
		createTripFactory.setChosenPlace(createTripFactory.adjustPlaceObject(jQuery.extend({},chosenplace)));	
		$scope.cancel();
	}



});