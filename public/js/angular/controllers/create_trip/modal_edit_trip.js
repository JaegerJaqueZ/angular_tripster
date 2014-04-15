var modalEditTripControllers = angular.module('modalEditTripControllers', []);

modalEditTripControllers.controller('modalEditTripCtrl', function ($scope, $http, createTripFactory, $modal) {
	
	$scope.places      = createTripFactory.getChosenTrip().places || new Array();
	$scope.title       = createTripFactory.getChosenTrip().title || '';
	$scope.description = createTripFactory.getChosenTrip().description || '';

	$scope.$watchCollection(
		
		function() {

			var temp = createTripFactory.getChosenTrip().places;
			if(typeof(temp) === 'undefined') {
				return new Array();
			}

			return temp;
		},
		function(newValue, oldValue) {
			if(newValue!==oldValue) {
				$scope.places = newValue;
			}
		}
	);

	//add new place
	$scope.open = function (place) {
		
		if(typeof(place) === 'undefined') {
			//add new place
			createTripFactory.setIsEditingPlace(false);
			createTripFactory.setChosenPlace({});

			var modalInstance = $modal.open({
				templateUrl: 'partials/modal_edit_trip_add_place.html',
				controller: editTripAddPlaceModalInstanceCtrl,
				backdrop: false
			});
		}
		else{
			//edit place
			createTripFactory.setIsEditingPlace(true);
			createTripFactory.setChosenPlace(place);

			var modalInstance = $modal.open({
				templateUrl: 'partials/modal_edit_trip_edit_place.html',
				controller: editTripEditPlaceModalInstanceCtrl,
				backdrop: false
			});
		}		
	};

	$scope.save = function (){

		$scope.isDisabled = true;

	 	var myjson = {
	 		"title": $scope.title,
	 		"description": $scope.description,
	 		"date_begin": createTripFactory.getDateBegin(),
	 		"date_end": createTripFactory.getDateEnd(),
	 		"user_id": createTripFactory.getUserId(),
	 		"status": createTripFactory.PRIVATE_TRIP
	 	};
		
		$http({
			method: 'PUT',
			url: createTripFactory.getOriginPath() + "trip/update?trip_id=" + createTripFactory.getChosenTrip()._id,
			data: myjson,
			headers: {'Content-Type': 'application/x-www-form-urlencoded',
			'Content-Type': 'application/json'}
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

	$scope.delete = function (){

		$scope.isDisabled = true;

		$http({
				method: 'DELETE',
				url: createTripFactory.getOriginPath() + "trip/delete?trip_id=" + createTripFactory.getChosenTrip()._id
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

});

//=============================== Modal Controller ===============================

var editTripAddPlaceModalInstanceCtrl = function ($scope, $modalInstance, createTripFactory) {

	$scope.cancel = function () {
		$modalInstance.dismiss('cancel');

	};
};

var editTripEditPlaceModalInstanceCtrl = function ($scope, $modalInstance, createTripFactory) {

	$scope.cancel = function () {
		$modalInstance.dismiss('cancel');

	};
};
