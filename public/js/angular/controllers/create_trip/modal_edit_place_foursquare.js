//public/js/angular/controllers/modal_edit_place_foursquare.js

var modalEditPlaceFoursquareControllers = angular.module('modalEditPlaceFoursquareControllers', []);

modalEditPlaceFoursquareControllers.controller('modalEditPlaceFoursquareCtrl', function ($scope, $http, createTripFactory) {

	createTripFactory.getNearByPlaces();
	
	//initialze search (can delete if want)
	$scope.input = {province:"กรุงเทพมหานคร"};
	var lat="",
		lng="";		
	//initialize loading spinner	
	$scope.loading = false;

	$scope.$watch(
		function() {
			return createTripFactory.getFoursqplaces();
		},
		function(newValue, oldValue) {
			if(newValue!==oldValue){
				$scope.foursqplaces = newValue;
			}
		}
	);

	$scope.findPlace = function (){
		$scope.loading = true;

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

		var temp = createTripFactory.getChosenPlace();
		temp.foursquare = jQuery.extend(true, {}, createTripFactory.adjustPlaceObject(chosenplace).foursquare);	
		
		$scope.cancel();
	}



});