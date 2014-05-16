//public/js/angular/controllers/modal_edit_trip.js

var modalEditTripControllers = angular.module('modalEditTripControllers', []);

modalEditTripControllers.controller('modalEditTripCtrl', function ($scope, $http, createTripFactory, $modal, $q, $window) {
	
	var places_temp    = createTripFactory.getChosenTrip().places || new Array();

	$scope.days 	   = splitPlacesArray(places_temp);
	$scope.title       = createTripFactory.getChosenTrip().title || '';
	$scope.description = createTripFactory.getChosenTrip().description || '';
	$scope.publishShow = true;
	$scope.removeIcon = [];
	$scope.isopen = true;

	if(createTripFactory.getChosenTrip().status === 20){
		$scope.publishShow = false;		
	}

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
				$scope.days = splitPlacesArray(newValue);
			}
		}
	);

	function splitPlacesArray(places){

		var places_split = [];

		for(var i = 0 ; i < createTripFactory.getTotalDays() ; i++ ) {
			places_split.push([]);
		}

		for(var i = 0 ; i < places.length ; i ++) {
			places_split[places[i].day-1].push(places[i]);
		}
		
		return places_split;
	}

	$scope.addDay = function (){
		var temp = createTripFactory.getTotalDays() + 1;
		createTripFactory.setTotalDays(temp);
		$scope.days.push([]);
	}
	
	var dayToBeDeleted = [];

	// $scope.deleteDay = function (day){

	// 	$scope.removeIcon = true;
	// 	dayToBeDeleted.push($scope.days.indexOf(day)+1);

	// 	// $scope.days.splice($scope.days.indexOf(day),1);
	// 	var temp = createTripFactory.getTotalDays() - 1;
	// 	createTripFactory.setTotalDays(temp);
	// }


	$scope.deleteDay = function (index){

		console.log(index);
		if(typeof($scope.removeIcon[index])==='undefined') {
			$scope.removeIcon[index] = true;
			if(dayToBeDeleted.indexOf(index+1) === -1) {
				dayToBeDeleted.push(index+1);
				// var temp = createTripFactory.getTotalDays() - 1;
				// createTripFactory.setTotalDays(temp);
			}
		}
		else {
			if($scope.removeIcon[index] === false) {
				$scope.removeIcon[index] = true;

				if(dayToBeDeleted.indexOf(index+1) === -1) {
					dayToBeDeleted.push(index+1);
					// var temp = createTripFactory.getTotalDays() - 1;
					// createTripFactory.setTotalDays(temp);
				}
			}
			else {
				$scope.removeIcon[index] = false;
				dayToBeDeleted.splice(dayToBeDeleted.indexOf(index+1),1);
				// var temp = createTripFactory.getTotalDays() + 1;
				// createTripFactory.setTotalDays(temp);
			}
		}

		console.log(dayToBeDeleted);
		
	}
	
	$scope.open = function (day, place) {
		
		// console.log(day);

		if(typeof(place) === 'undefined') {
			//add new place
			createTripFactory.setChosenDay(day+1);
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

		if(validate()){		
		
			$scope.isDisabled = true;

			// Execute
			deleteUnwantedDays();

			function deleteUnwantedDays() {

				var deferred = $q.defer();

				var params = '';

				for(var i = 0 ; i < dayToBeDeleted.length ; i++) {
					
					params = params + dayToBeDeleted[i];
					
					if(i < dayToBeDeleted.length-1) {
						params = params + ',';
					}
				}

				console.log(createTripFactory.getChosenTrip());

				$http({
					method: 'DELETE', 
					url: createTripFactory.getOriginPath() + "places/days/delete?trip_id=" + createTripFactory.getChosenTrip()._id + '&days=' + params
				})
				.success(function(data, status, headers, config) {
					deferred.resolve(data);
				})
				.error(function(data, status, headers, config) {
					deferred.reject(data);

					if(status === 401){
						$window.location.reload();
					}
				});

				return deferred.promise.then(function(result) { updateDayEachPlace(); }, function(err) { alert('Error'); });
			}

			function updateDayEachPlace() {

				var dayUpdateFromTo = [];

				for(var i = 0 ; i < $scope.days.length ; i++) {
					
					var curDay = i+1;

					if(dayToBeDeleted.indexOf(curDay) === -1) {

						var countLessThan = 0;

						for(var j = 0 ; j < dayToBeDeleted.length ; j++) {

							if(dayToBeDeleted[j] < curDay) {
								countLessThan+=1;
							}
						}

						var fromTo = [];
						fromTo.push(curDay);
						fromTo.push(curDay - countLessThan);

						dayUpdateFromTo.push(fromTo);
					}

				}
				
				var promises = dayUpdateFromTo.map(function(fromTo) {
					var deferred = $q.defer();

					$http({
						method: 'PUT', 
						url: createTripFactory.getOriginPath() + "places/day/update?trip_id=" + createTripFactory.getChosenTrip()._id + "&from="+ fromTo[0] +"&to=" + fromTo[1],
						headers: {'Content-Type': 'application/x-www-form-urlencoded',
						'Content-Type': 'application/json'}
					})
					.success(function(data, status, headers, config) {
						deferred.resolve(data);
					})
					.error(function(data, status, headers, config) {
						deferred.reject(data);

						if(status === 401){
							$window.location.reload();
						}
					}); 

					return deferred.promise;

				});

				return $q.all(promises).then(function(result){
					saveTrip();
				},function(err){
					
					alert("Update Incomplete");
				});
			}


			function saveTrip() {

				var tripStatus;

				if(createTripFactory.getChosenTrip().status === createTripFactory.PUBLIC_TRIP) {
					tripStatus = createTripFactory.PUBLIC_TRIP;
				}
				else {
					tripStatus = createTripFactory.PRIVATE_TRIP;
				}

				if(createTripFactory.getDeleteRequest().figures.length > 0){
					promiseDeleteFigure(createTripFactory.getDeleteRequest().figures, tripStatus);
				}
				else{
					if(createTripFactory.getDeleteRequest().places.length > 0){
						promiseDeletePlace(createTripFactory.getDeleteRequest().places, tripStatus);
					}
					else{
						promiseUpdateTrip(tripStatus);
					}
				}

			}
		}	
		
	}

	$scope.publish = function (){
		
		if(validate() && validatePlace()){
			$scope.isDisabled = true;

			// Execute
			deleteUnwantedDays();

			function deleteUnwantedDays() {

				var deferred = $q.defer();

				var params = '';

				for(var i = 0 ; i < dayToBeDeleted.length ; i++) {
					
					params = params + dayToBeDeleted[i];
					
					if(i < dayToBeDeleted.length-1) {
						params = params + ',';
					}
				}

				console.log(createTripFactory.getChosenTrip());

				$http({
					method: 'DELETE', 
					url: createTripFactory.getOriginPath() + "places/days/delete?trip_id=" + createTripFactory.getChosenTrip()._id + '&days=' + params
				})
				.success(function(data, status, headers, config) {
					deferred.resolve(data);
				})
				.error(function(data, status, headers, config) {
					deferred.reject(data);

					if(status === 401){
						$window.location.reload();
					}
				});

				return deferred.promise.then(function(result) { updateDayEachPlace(); }, function(err) { alert('Error'); });
			}

			function updateDayEachPlace() {

				var dayUpdateFromTo = [];

				for(var i = 0 ; i < $scope.days.length ; i++) {
					
					var curDay = i+1;

					if(dayToBeDeleted.indexOf(curDay) === -1) {

						var countLessThan = 0;

						for(var j = 0 ; j < dayToBeDeleted.length ; j++) {

							if(dayToBeDeleted[j] < curDay) {
								countLessThan+=1;
							}
						}

						var fromTo = [];
						fromTo.push(curDay);
						fromTo.push(curDay - countLessThan);

						dayUpdateFromTo.push(fromTo);
					}

				}
				
				var promises = dayUpdateFromTo.map(function(fromTo) {
					var deferred = $q.defer();

					$http({
						method: 'PUT', 
						url: createTripFactory.getOriginPath() + "places/day/update?trip_id=" + createTripFactory.getChosenTrip()._id + "&from="+ fromTo[0] +"&to=" + fromTo[1],
						headers: {'Content-Type': 'application/x-www-form-urlencoded',
						'Content-Type': 'application/json'}
					})
					.success(function(data, status, headers, config) {
						deferred.resolve(data);
					})
					.error(function(data, status, headers, config) {
						deferred.reject(data);

						if(status === 401){
							$window.location.reload();
						}
					}); 

					return deferred.promise;

				});

				return $q.all(promises).then(function(result){
					publishTrip();
				},function(err){
					
					alert("Update Incomplete");
				});
			}

			function publishTrip() {

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
		}
		
	}

	$scope.deleteTrip = function (){

		if(confirm("Are you sure to delete this trip?") === true){
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
				alert("Delete Failed, Please Try Again.");
				$scope.isDisabled = false;

				if(status === 401){
					$window.location.reload();
				}
			});
		}
		
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

				if(status === 401){
					$window.location.reload();
				}
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

				if(status === 401){
					$window.location.reload();
				}
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
	 		"status": 10,
	 		"days": createTripFactory.getTotalDays() - dayToBeDeleted.length
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
					createTripFactory.clearAddedFigureArr();
					createTripFactory.setTotalDays(1);
					alert("Publish Success, Now this trip is visible to other people.");
					$scope.done();
				}).
				error(function(data, status, headers, config) {
					alert("Save Success, but unable to publish. Please Try Again.");
					$scope.isDisabled = false;

					if(status === 401){
						$window.location.reload();
					}
				});  
			}
			else{
				createTripFactory.updateTrips();
				createTripFactory.setIsEditingTrip(false);
				createTripFactory.setChosenTrip({});
				createTripFactory.clearDeleteRequest();
				createTripFactory.clearAddedFigureArr();
				createTripFactory.setTotalDays(1);
				$scope.done();					
			}
			

		}).
		error(function(data, status, headers, config) {
			alert("Save Failed, Please Try Again.");
			$scope.isDisabled = false;

			if(status === 401){
				$window.location.reload();
			}
		});  
	}

	function validate(){
		
		if($scope.title === ''){
			alert("Trip name is not defined, Please enter trip name.");
			return false;
		}
		else if($scope.description === ''){
			alert("Trip description is not defined, Please enter trip description.");
			return false;
		}
		// else if(createTripFactory.getDateBegin() > createTripFactory.getDateEnd()){
		// 	alert("Please make sure Begin date come before End date.");
		// 	return false;
		// }
		else if(createTripFactory.getChosenTrip().status === createTripFactory.PUBLIC_TRIP){
			return validatePlace();
		}
		return true;
	}

	function validatePlace(){
		if(createTripFactory.getTotalDays() - dayToBeDeleted.length === 0){
			alert("In order to publish, at least 1 place must be defined")
			return false
		}
		for( var i = 0; i < $scope.days.length; i++){

			if(dayToBeDeleted.indexOf(i+1) === -1){
				if($scope.days[i].length === 0){
					alert("In order to publish, all days must have place(s)")
					return false;
				}
			}
		}
		
		return true;
	}

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
