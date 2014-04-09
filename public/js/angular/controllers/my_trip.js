//public/js/angular/controllers/my_trip.js

var myTripControllers = angular.module('myTripControllers', []);

myTripControllers.controller('myTripCtrl', function ($scope, $http, createTripFactory, $modal) {

	$http({
		method:'GET', 
		url: createTripFactory.getOriginPath() + "trips/deep?user_id=" + createTripFactory.getUserId()
	})
	.success(function(data, status, headers, config) {
		createTripFactory.setTrips(data);
		$scope.trips = createTripFactory.getTrips();	
	})
	.error(function(data, status, headers, config) {
		alert("Cannot load your trip(s), please Refresh");
	});

	$scope.$watchCollection(

		function() {
			return createTripFactory.getTrips();
		},
		
		function(newValue, oldValue) {
			if(newValue!==oldValue) {
				$scope.trips = newValue;
			}
		}
	);

	$scope.open = function (trip) {
		
		if(typeof(trip) === 'undefined') {
			//add new trip
			createTripFactory.setIsEditingTrip(false);
			createTripFactory.setChosenTrip({});

			var modalInstance = $modal.open({
				templateUrl: 'partials/modal_add_trip.html',
				controller: addTripModalInstanceCtrl,
				backdrop: false
			});
		}
		else{
			//edit trip
			createTripFactory.setIsEditingTrip(true);
			createTripFactory.setChosenTrip(trip);

			var modalInstance = $modal.open({
				templateUrl: 'partials/modal_edit_trip.html',
				controller: editTripModalInstanceCtrl,
				backdrop: false
			});
		}		
	};

});

//=============================== Modal Controller ===============================

var addTripModalInstanceCtrl = function ($scope, $modalInstance, createTripFactory) {

	$scope.cancel = function () {
		if(createTripFactory.setIsEditingTrip()){
			$http({
				method: 'DELETE',
				url: createTripFactory.getOriginPath() + "trip/delete/deep?trip_id=" + createTripFactory.getChosenTrip()._id
			}).
			success(function(data, status, headers, config) {
				createTripFactory.setIsEditingTrip(false);
				createTripFactory.setChosenTrip({});
				$scope.cancel();
			}).
			error(function(data, status, headers, config) {
				alert("Save Failed, Please Try Again.");
				$scope.isDisabled = false;
			});
		}
		else {
			$modalInstance.dismiss('cancel');	
		}
		
	};
};

var editTripModalInstanceCtrl = function ($scope, $modalInstance, createTripFactory) {

	$scope.cancel = function () {
		$modalInstance.dismiss('cancel');
	};
};