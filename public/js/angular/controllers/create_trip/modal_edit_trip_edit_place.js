//public/js/angular/controllers/modal_edit_trip_edit_place.js

var modalEditTripEditPlaceControllers = angular.module('modalEditTripEditPlaceControllers', []);

modalEditTripEditPlaceControllers.controller('modalEditTripEditPlaceCtrl', function ($scope, $http, $modal, createTripFactory, $q) {

	var chosenPlaceTemp = createTripFactory.getChosenPlace();
	$scope.name = chosenPlaceTemp.foursquare.name;
	$scope.description = chosenPlaceTemp.description;

	$scope.$watch(
		function() {
			return chosenPlaceTemp.foursquare.name;
		},
		function(newValue, oldValue) {
			if(newValue!==oldValue){
				$scope.name = newValue;
			}
		}
	);

	$scope.open = function () {
		
		var modalInstance = $modal.open({
			templateUrl: 'partials/modal_edit_place_foursquare.html',
			controller: foursquareModalInstanceCtrl,
			backdrop: true
		});
	};

	$scope.deletePlace = function () {

		$scope.isDisabled = true;
		
		$http({
			method: 'DELETE', 
			url: createTripFactory.getOriginPath() + "place/delete?place_id=" + chosenPlaceTemp._id,
			headers: {'Content-Type': 'application/x-www-form-urlencoded'}
		})
		.success(function(data, status, headers, config) {
			updateTripsInService();
		})
		.error(function(data, status, headers, config) {
			
			$scope.isDisabled = false;
			alert("Failed to delete place, please try again"); 

		});

	};

	$scope.confirmPlace = function () {

		$scope.isDisabled = true;

		//Execute
		updatePlace();		
		
	};

	function updatePlace(){

		var myjson = {
			"foursquare":chosenPlaceTemp.foursquare,
			"description":$scope.description,
			"time_arrive":createTripFactory.getTimeBegin(),
			"time_leave":createTripFactory.getTimeEnd()
		}

		var deferred = $q.defer();

		$http({
			method: 'PUT', 
			url: createTripFactory.getOriginPath() + "place/update?place_id=" + chosenPlaceTemp._id,
			data: myjson,
			headers: {'Content-Type': 'application/x-www-form-urlencoded',
			'Content-Type': 'application/json'}
		})
		.success(function(data, status, headers, config) {
			deferred.resolve(data);
		})
		.error(function(data, status, headers, config) {
			deferred.reject(data);
		}); 

		return deferred.promise.then(function(result) { 
			updateTripsInService();
			
		}, function(data) { 
			alert("Failed to update place, please try again"); 
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
			
			$scope.cancel();

		}, function(err) {
			$scope.cancel();
		});
	}

});

var foursquareModalInstanceCtrl = function ($scope, $modalInstance) {

	$scope.cancel = function () {
		$modalInstance.dismiss('cancel');

	};
};