//public/js/angular/controllers/my_trip.js

var myTripControllers = angular.module('myTripControllers', []);

myTripControllers.controller('myTripCtrl', function ($scope, $http, createTripFactory, $modal) {

	snapper.close();

	$http({
		method:'GET', 
		url: createTripFactory.getOriginPath() + "user/trips"
	})
	.success(function(data, status, headers, config) {
		console.log(data);
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

			createTripFactory.setBackUpTrip(trip);

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
				$modalInstance.dismiss('cancel');
			}).
			error(function(data, status, headers, config) {
				alert("Save Failed, Please Try Again.");
				$scope.isDisabled = false;
			});
		}
		else {
			createTripFactory.setIsEditingTrip(false);
			createTripFactory.setChosenTrip({});
			$modalInstance.dismiss('cancel');	
		}
		
	};
};

var editTripModalInstanceCtrl = function ($scope, $modalInstance, createTripFactory, $q, $http) {

	$scope.done = function () {
		$modalInstance.dismiss('done');
	}

	$scope.cancel = function () {
		
		function revertTripFromBackUp(back_up_trip, updated_trip) {
			
			var promises = back_up_trip.places.map(function(place){

				// console.log(place.foursquare);

				var deferred = $q.defer();

				var myjson = {
					"foursquare":place.foursquare,
					"description":place.description,
					"time_arrive":place.time_arrive,
					"time_leave":place.time_leave,
					"figures":place.figures,
					"cover_figure":place.cover_figure,
					"modified":place.modified
				}

				$http({
					method: 'PUT',
					url: createTripFactory.getOriginPath() + "place/update?place_id=" + place._id,
					data: myjson,
					headers: {'Content-Type': 'application/x-www-form-urlencoded',
					'Content-Type': 'application/json'}
				}).
				success(function(data, status, headers, config) {
					// remove places that are the same between back up and update 
					// in order to get unwanted place for deleting on server
					for(var i = 0 ; i < updated_trip.places.length ; i++) {
						if(updated_trip.places[i]._id === place._id) {
							updated_trip.places.splice(i,1);	
							// console.log(updated_trip.places);
							break;
						}						
					}

					deferred.resolve(data);

				}).
				error(function(data, status, headers, config) {
					deferred.reject(data);
				});  

				return deferred.promise;
			});
			
			return $q.all(promises).then(function(result){
				deleteUnwantedFigure();				
			},function(err){
				alert("Problem Occurred, Please Try Again.");
				$scope.isDisabled = false;
			});

		}

		function deleteUnwantedFigure(){
			var promises = createTripFactory.getAddedFigureArr().map(function(figure_id){

				var deferred = $q.defer();

				$http({
					method: 'DELETE',
					url: createTripFactory.getOriginPath() + "figure/delete?figure_id=" + figure_id,
					headers: {'Content-Type': 'application/x-www-form-urlencoded',
					'Content-Type': 'application/json'}
				}).
				success(function(data, status, headers, config) {
					deferred.resolve(data);
				}).
				error(function(data, status, headers, config) {
					deferred.reject(data);
				});  

				return deferred.promise;
			});
			
			return $q.all(promises).then(function(results){
				deleteUnwantedPlace(createTripFactory.getChosenTrip());
			},function(err){
				alert("Problem Occurred, Please Try Again.");
				$scope.isDisabled = false;
			});

		}

		function deleteUnwantedPlace(updated_trip){
			var promises = updated_trip.places.map(function(place){

				var deferred = $q.defer();

				$http({
					method: 'DELETE',
					url: createTripFactory.getOriginPath() + "place/delete?place_id=" + place._id,
					headers: {'Content-Type': 'application/x-www-form-urlencoded',
					'Content-Type': 'application/json'}
				}).
				success(function(data, status, headers, config) {
					deferred.resolve(data);
				}).
				error(function(data, status, headers, config) {
					deferred.reject(data);
				});  

				return deferred.promise;
			});
			
			return $q.all(promises).then(function(results){				
				createTripFactory.updateTrips();
				createTripFactory.setIsEditingTrip(false);
				createTripFactory.setChosenTrip({});
				createTripFactory.clearDeleteRequest();
				createTripFactory.clearAddedFigureArr();
				$modalInstance.dismiss('cancel');
			},function(err){
				alert("Problem Occurred, Please Try Again.");
				$scope.isDisabled = false;
			});

		}



		//Execute
		revertTripFromBackUp(createTripFactory.getBackUpTrip(), createTripFactory.getChosenTrip());
		
	};
};