//public/js/angular/controllers/modal_add_trip_add_place.js

var modalAddTripAddPlaceControllers = angular.module('modalAddTripAddPlaceControllers', []);

modalAddTripAddPlaceControllers.controller('modalAddTripAddPlaceCtrl', function ($scope, $http, $modal, createTripFactory, $q) {

	$scope.name = '';
	$scope.description = '';

	$scope.$watch(
		function() {
			var foursquare = createTripFactory.getChosenPlace().foursquare;
			var foursquare_name;
			if(!foursquare) {
				foursquare_name = '';
			}
			else {
				foursquare_name = foursquare.name;
			}
			
			return foursquare_name;
		},
		function(newValue, oldValue) {
			if(newValue!==oldValue){
				$scope.name = newValue;
			}
		}
	);

	$scope.open = function () {
		
		var modalInstance = $modal.open({
			templateUrl: 'partials/modal_add_place_foursquare.html',
			controller: foursquareModalInstanceCtrl,
			backdrop: true
		});
	};

	function createDefaultTrip(){

		var deferred = $q.defer();

		$http({
			method: 'POST', 
			url: createTripFactory.getOriginPath() + "trip/default/create",
			data: {},
			headers: {'Content-Type': 'application/x-www-form-urlencoded',
			'Content-Type': 'application/json'}
		})
		.success(function(data, status, headers, config) {
			deferred.resolve(data);
		})
		.error(function(data, status, headers, config) {
			deferred.reject(data);

		}); 

		return deferred.promise;
	}

	function createPlace(trip){

		var myjson = {
			"foursquare":createTripFactory.getChosenPlace().foursquare,
			"description":$scope.description,
			"time_arrive":createTripFactory.getTimeBegin(),
			"time_leave":createTripFactory.getTimeEnd(),
			"trip_id": trip._id
		}

		if(trip.places) {
			myjson.index = createTripFactory.getChosenTrip().places.length;
		}
		else {
			myjson.index = 0;
		}

		var deferred = $q.defer();

		$http({
			method: 'POST', 
			url: createTripFactory.getOriginPath() + "place/create",
			data: myjson,
			headers: {'Content-Type': 'application/x-www-form-urlencoded',
			'Content-Type': 'application/json'}
		})
		.success(function(data, status, headers, config) {
			deferred.resolve(data);
		})
		.error(function(data, status, headers, config) {
			deferred.reject(myjson);
		}); 

		return deferred.promise.then(function(result) { 
			updateTripsInService();
			
		}, function(myjson) { 
			if(!createTripFactory.getIsEditingTrip()) {
				deleteTrip(myjson);
			}
			else {
				$scope.isDisabled = false;
			}
		});

	}

	function deleteTrip(place) {
		var deferred = $q.defer();

		$http({
			method: 'DELETE', 
			url: createTripFactory.getOriginPath() + "trip/delete?trip_id=" + place.trip_id,
			headers: {'Content-Type': 'application/x-www-form-urlencoded'}
		})
		.success(function(data, status, headers, config) {
			alert("Place Registrtion Failed, Please Try Again.")
			console.log("Delete Success");
			deferred.resolve(data);
		})
		.error(function(data, status, headers, config) {
			deferred.reject(data);
		});

		return deferred.promise.then(function(data) {
		 	alert("Place Registrtion Failed, Please Try Again."); 
		 	$scope.cancel();
		}, function(err) {
			$scope.isDisabled = false;
		});
	}

	function updateTripsInService() {

		var deferred = $q.defer();

		$http({
			method:'GET', 
			url: createTripFactory.getOriginPath() + "user/trips"
		})
		.success(function(data, status, headers, config) {
			deferred.resolve(data);
			// trips = new Array();
			// setTrips(data);
		})
		.error(function(data, status, headers, config) {
			deferred.reject(data);
		});

		return deferred.promise.then(function(result) {
			
			createTripFactory.setTrips(result);

			var tripsTemp = createTripFactory.getTrips();

			if(!createTripFactory.getIsEditingTrip()) {

				createTripFactory.setChosenTrip(tripsTemp[tripsTemp.length-1]);
				createTripFactory.setIsEditingTrip(true);

			} else {
				
				var chosenTripTemp = createTripFactory.getChosenTrip();

				for(var i = 0; i < tripsTemp.length; i++) {

					if(tripsTemp[i]._id === chosenTripTemp._id) {
						createTripFactory.setChosenTrip(tripsTemp[i]);
						break;
					}
				}

			}
			
			$scope.cancel();

		}, function(err) {
			$scope.cancel();
		});
	}


	$scope.confirmPlace = function () {

		$scope.isDisabled = true;
		
		if(createTripFactory.getIsEditingTrip()) {
			createPlace(createTripFactory.getChosenTrip());
		}
		else {
			var promise = createDefaultTrip();
			promise.then(function(trip){
			 createPlace(trip); 

			}, function(err){ 
				alert("Place registration failed, please try again"); 
				$scope.isDisabled = false;
			});	
		}
		
	};



});

var foursquareModalInstanceCtrl = function ($scope, $modalInstance) {

	$scope.cancel = function () {
		$modalInstance.dismiss('cancel');

	};
};