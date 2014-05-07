//public/js/angular/controllers/create_trip/modal_add_trip.js

var modalAddTripControllers = angular.module('modalAddTripControllers', []);

modalAddTripControllers.controller('modalAddTripCtrl', function ($scope, $http, createTripFactory, $modal) {
 
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
				templateUrl: 'partials/modal_add_trip_add_place.html',
				controller: addTripAddPlaceModalInstanceCtrl,
				backdrop: false
			});
		}
		else{
			//edit place
			createTripFactory.setIsEditingPlace(true);
			createTripFactory.setChosenPlace(place);

			var modalInstance = $modal.open({
				templateUrl: 'partials/modal_add_trip_edit_place.html',
				controller: addTripEditPlaceModalInstanceCtrl,
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
	 		"status": createTripFactory.PRIVATE_TRIP
	 	};

		if(createTripFactory.getIsEditingTrip()) {
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
		else{

			$http({
				method: 'POST',
				url: createTripFactory.getOriginPath() + "trip/create",
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
	}

	$scope.publish = function (){
		//TODO VALIDATE DATA FIRST
		$scope.isDisabled = true;

	 	var myjson = {
	 		"title": $scope.title,
	 		"description": $scope.description,
	 		"date_begin": createTripFactory.getDateBegin(),
	 		"date_end": createTripFactory.getDateEnd(),
	 		"status": 10
	 	};


		if(createTripFactory.getIsEditingTrip()) {
			$http({
				method: 'PUT',
				url: createTripFactory.getOriginPath() + "trip/update?trip_id=" + createTripFactory.getChosenTrip()._id,
				data: myjson,
				headers: {'Content-Type': 'application/x-www-form-urlencoded',
				'Content-Type': 'application/json'}
			}).
			success(function(data, status, headers, config) {
				$http({
					method: 'PUT',
					url: createTripFactory.getOriginPath() + "trip/publish?trip_id=" + createTripFactory.getChosenTrip()._id,
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
					alert("Save Success, but unable to publish. Please Try Again.");
					$scope.isDisabled = false;
				});  
				


			}).
			error(function(data, status, headers, config) {
				alert("Save Failed, Please Try Again.");
				$scope.isDisabled = false;
			});  
		}
		else{

			$http({
				method: 'POST',
				url: createTripFactory.getOriginPath() + "trip/create",
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
	}
});

//=============================== Modal Controller ===============================

var addTripAddPlaceModalInstanceCtrl = function ($scope, $modalInstance, createTripFactory) {

	$scope.cancel = function () {

		createTripFactory.setIsEditingPlace(false);
		createTripFactory.setChosenPlace({});
		$modalInstance.dismiss('cancel');

	};
};

var addTripEditPlaceModalInstanceCtrl = function ($scope, $modalInstance, createTripFactory) {

	$scope.cancel = function () {
		createTripFactory.setIsEditingPlace(false);
		createTripFactory.setChosenPlace({});
		$modalInstance.dismiss('cancel');

	};
};

