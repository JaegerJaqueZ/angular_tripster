//public/js/angular/controllers/modal_edit_trip.js

var modalEditTripControllers = angular.module('modalEditTripControllers', []);

modalEditTripControllers.controller('modalEditTripCtrl', function ($scope, $http, createTripFactory, $modal, $q) {
	
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

		if(createTripFactory.getDeleteRequest().figures.length > 0){
			promiseDeleteFigure(createTripFactory.getDeleteRequest().figures, createTripFactory.PRIVATE_TRIP);
		}
		else{
			if(createTripFactory.getDeleteRequest().places.length > 0){
				promiseDeletePlace(createTripFactory.getDeleteRequest().places, createTripFactory.PRIVATE_TRIP);
			}
			else{
				promiseUpdateTrip(createTripFactory.PRIVATE_TRIP);
			}
		}	 	
		
	}

	$scope.publish = function (){
		//TODO VALIDATE DATA FIRST
		$scope.isDisabled = true;

		if(createTripFactory.getDeleteRequest().figures.length > 0){
			promiseDeleteFigure(createTripFactory.getDeleteRequest().figures, createTripFactory.PUBLIC_TRIP);
		}
		else{
			if(createTripFactory.getDeleteRequest().places.length > 0){
				promiseDeletePlace(createTripFactory.getDeleteRequest().places, createTripFactory.PUBLIC_TRIP);
			}
			else{
				promiseUpdateTrip(createTripFactory.PUBLIC_TRIP);
			}
		}	
		
	}

	$scope.deleteTrip = function (){

		$scope.isDisabled = true;

		$http({
				method: 'DELETE',
				url: createTripFactory.getOriginPath() + "trip/delete?trip_id=" + createTripFactory.getChosenTrip()._id
		}).
		success(function(data, status, headers, config) {
			createTripFactory.updateTrips();
			createTripFactory.setIsEditingTrip(false);
			createTripFactory.setChosenTrip({});
			$scope.done();
		}).
		error(function(data, status, headers, config) {
			alert("Save Failed, Please Try Again.");
			$scope.isDisabled = false;
		});
	}

//=============================== save and publish method ==========================================

	function promiseDeleteFigure(figures, trip_status){

		var promises = figures.map(function(figure_id){
			var deferred = $q.defer();	

			$http({
				method: 'DELETE', 
				url: createTripFactory.getOriginPath() + "figure/delete?figure_id=" + figure_id,
				headers: {'Content-Type': 'application/x-www-form-urlencoded'}
			})
			.success(function(data, status, headers, config) {
				deferred.resolve(data);
			})
			.error(function(data, status, headers, config) {
				deferred.reject(data);
			});

			return deferred.promise;

		});	

		return $q.all(promises).then(function(result){
			if(createTripFactory.getDeleteRequest().places.length > 0){
				promiseDeletePlace(createTripFactory.getDeleteRequest().places, trip_status);
			}
			else{
				promiseUpdateTrip(trip_status);	
			}

		},function(err){
			$scope.isDisabled = false;
			alert("Update Incomplete");
		});

	}

	function promiseDeletePlace(places, trip_status){

		var promises = places.map(function(place_id){
			var deferred = $q.defer();	

			$http({
				method: 'DELETE', 
				url: createTripFactory.getOriginPath() + "place/delete?place_id=" + place_id,
				headers: {'Content-Type': 'application/x-www-form-urlencoded'}
			})
			.success(function(data, status, headers, config) {
				deferred.resolve(data);
			})
			.error(function(data, status, headers, config) {
				deferred.reject(data);
			});

			return deferred.promise;

		});	

		return $q.all(promises).then(function(result){
			promiseUpdateTrip(trip_status);
		},function(err){
			$scope.isDisabled = false;
			alert("Update Incomplete");
		});
	}

	function promiseUpdateTrip(trip_status){

		var myjson = {
	 		"title": $scope.title,
	 		"description": $scope.description,
	 		"date_begin": createTripFactory.getDateBegin(),
	 		"date_end": createTripFactory.getDateEnd(),
	 		"status": 10
	 	};
		
		$http({
			method: 'PUT',
			url: createTripFactory.getOriginPath() + "trip/update?trip_id=" + createTripFactory.getChosenTrip()._id,
			data: myjson,
			headers: {'Content-Type': 'application/x-www-form-urlencoded',
			'Content-Type': 'application/json'}
		}).
		success(function(data, status, headers, config) {
			
			if(trip_status === 20){
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
					createTripFactory.clearDeleteRequest();
					$scope.done();
				}).
				error(function(data, status, headers, config) {
					alert("Save Success, but unable to publish. Please Try Again.");
					$scope.isDisabled = false;
				});  
			}
			else{
				createTripFactory.updateTrips();
				createTripFactory.setIsEditingTrip(false);
				createTripFactory.setChosenTrip({});
				createTripFactory.clearDeleteRequest();
				$scope.done();					
			}
			

		}).
		error(function(data, status, headers, config) {
			alert("Save Failed, Please Try Again.");
			$scope.isDisabled = false;
		});  
	}
//==================================================================================================

});



//=============================== Modal Controller =================================================

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
