//public/js/angular/controllers/modal_edit_trip_add_place.js

var modalEditTripAddPlaceControllers = angular.module('modalEditTripAddPlaceControllers', []);

modalEditTripAddPlaceControllers.controller('modalEditTripAddPlaceCtrl', function ($scope, $http, $modal, createTripFactory, $q) {

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
			alert("Failed to add place, please try again"); 
			$scope.isDisabled = false;
		});

	}

	function updateTripsInService() {

		var deferred = $q.defer();

		$http({
			method:'GET', 
			url: createTripFactory.getOriginPath() + "user/trips?user_id=" + createTripFactory.getUserId()
		})
		.success(function(data, status, headers, config) {
			deferred.resolve(data);
		})
		.error(function(data, status, headers, config) {
			deferred.reject(data);
		});

		return deferred.promise.then(function(result) {
			
			createTripFactory.setTrips(result);

			var   tripsTemp = createTripFactory.getTrips()
				, chosenTripTemp = createTripFactory.getChosenTrip();

			for(var i = 0; i < tripsTemp.length; i++) {

				if(tripsTemp[i]._id === chosenTripTemp._id) {
					createTripFactory.setChosenTrip(tripsTemp[i]);
					break;
				}
			}			

			var   chosenTripTemp2 = createTripFactory.getChosenTrip()
				, deleteRequest = createTripFactory.getDeleteRequest();

			//remove deleteRequest from chosenTrip
			for(var i = 0; i < deleteRequest.places.length; i++) {
				for(var j = 0; j < chosenTripTemp2.places.length; j++) {
					if(chosenTripTemp2.places[j]._id === deleteRequest.places[i]){
						chosenTripTemp2.places.splice(j,1);
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
		//Execute
		createPlace(createTripFactory.getChosenTrip());
		
	};

});

var foursquareModalInstanceCtrl = function ($scope, $modalInstance) {

	$scope.cancel = function () {
		$modalInstance.dismiss('cancel');

	};
};