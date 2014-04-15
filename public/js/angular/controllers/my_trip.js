//public/js/angular/controllers/my_trip.js

var myTripControllers = angular.module('myTripControllers', []);

myTripControllers.controller('myTripCtrl', function ($scope, $http, createTripFactory, $modal) {

	$http({
		method:'GET', 
		url: createTripFactory.getOriginPath() + "user/trips?user_id=" + createTripFactory.getUserId()
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

var addTripModalInstanceCtrl = function ($scope, $modalInstance, createTripFactory, $http) {

	$scope.cancel = function () {
		//isEditingTrip == true when place was added and default trip is created 
		//so we have to delete in server when user click cancel
		if(createTripFactory.getIsEditingTrip()){
			$http({
				method: 'DELETE',
				url: createTripFactory.getOriginPath() + "trip/delete?trip_id=" + createTripFactory.getChosenTrip()._id
			}).
			success(function(data, status, headers, config) {
				createTripFactory.updateTrips();
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
		createTripFactory.setIsEditingTrip(false);
		createTripFactory.setChosenTrip({});
	};
};