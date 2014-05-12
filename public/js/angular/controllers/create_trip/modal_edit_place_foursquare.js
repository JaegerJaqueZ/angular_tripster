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


<<<<<<< HEAD
		$scope.loading = true;

		$http({method: 'GET', url: 'https://api.foursquare.com/v2/venues/explore?client_id=FSEL5ZQNNTPR4RHCVJMQ53541XJPZM4LIHBCNJVBVHRJTE4O&client_secret=KBIQX2U1X4LZ5GWRSAELWH2CFSTPBBNK4NBQZCGB2KQE1ENQ&v=20130619&query=' + $scope.input.name + '&near=' + $scope.input.province}).
		success(function(data, status, headers, config) {
			$scope.loading = false;
			$scope.foursqplaces = data.response.groups[0].items;

		}).
		error(function(data, status, headers, config) {
			$scope.loading = false;
			alert("error");
=======
	$scope.findPlace = function (){
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
>>>>>>> FETCH_HEAD

		});
	}	

	// search nearby place
	$scope.findNearbyPlace = function (){
<<<<<<< HEAD
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
			// console.log( data.response.groups);
			$scope.foursqplaces = data.response.groups[0].items;

		}).
		error(function(data, status, headers, config) {
			$scope.loading = false;
			// console.log(data);
			alert('Something went wrong. Please try again.');
		});

	}

	function geoFail() {
		alert('Cannot get your current location. Please try again.');
=======
		createTripFactory.getNearByPlaces($scope.input.name);
>>>>>>> FETCH_HEAD
	}	
		
	$scope.selectPlace = function (chosenplace){	

		var temp = createTripFactory.getChosenPlace();
		temp.foursquare = jQuery.extend(true, {}, createTripFactory.adjustPlaceObject(chosenplace).foursquare);	
		
		$scope.cancel();
	}



});