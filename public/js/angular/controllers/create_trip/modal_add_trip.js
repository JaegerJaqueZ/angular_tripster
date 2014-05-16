//public/js/angular/controllers/create_trip/modal_add_trip.js

var modalAddTripControllers = angular.module('modalAddTripControllers', []);

modalAddTripControllers.controller('modalAddTripCtrl', function ($scope, $http, createTripFactory, $modal, $q, $window) {
 
	var places_temp    = createTripFactory.getChosenTrip().places || new Array();

	$scope.days 	   = splitPlacesArray(places_temp);
	$scope.title       = createTripFactory.getChosenTrip().title || '';
	$scope.description = createTripFactory.getChosenTrip().description || '';
	$scope.removeIcon = [];
	$scope.isopen = true;


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
		console.log(places);

		var places_split = [];

		for( var i = 0 ; i < createTripFactory.getTotalDays() ; i++ ) {

			places_split.push([]);
		}
		console.log(places_split);

		for( var i = 0 ; i < places.length ; i ++) {
			
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


	//add new place
	$scope.open = function (day, place) {

		if(typeof(place) === 'undefined') {

			console.log('setChosenDay',day+1);

			//add new place
			createTripFactory.setChosenDay(day+1);
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

		if(validate()){

			$scope.isDisabled = true;

			// Execute
			if(createTripFactory.getIsEditingTrip()) {
				deleteUnwantedDays();
			}
			else {
				saveTrip();
			}
			

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

				var myjson = {
			 		"title": $scope.title,
			 		"description": $scope.description,
			 		"date_begin": createTripFactory.getDateBegin(),
			 		"status": createTripFactory.PRIVATE_TRIP,
			 		"days": createTripFactory.getTotalDays() - dayToBeDeleted.length
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
						alert("Save Success.");
						alert("In order to make this trip visible to other people, you have to publish this trip in 'Draft' first");
						createTripFactory.setTotalDays(1);
						$scope.cancel();
					}).
					error(function(data, status, headers, config) {
						alert("Save Failed, Please Try Again.");
						$scope.isDisabled = false;

						if(status === 401){
							$window.location.reload();
						}
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
						alert("Save Success.");
						alert("In order to make this trip visible to other people, you have to publish this trip in 'Draft' first");
						createTripFactory.setTotalDays(1);
						$scope.cancel();	
					}).
					error(function(data, status, headers, config) {
						alert("Save Failed, Please Try Again.");
						$scope.isDisabled = false;

						if(status === 401){
							$window.location.reload();
						}
					});
				}

			}
		 	
		}
	}

	// $scope.publish = function (){
	// 	//TODO VALIDATE DATA FIRST
	// 	$scope.isDisabled = true;

	//  	var myjson = {
	//  		"title": $scope.title,
	//  		"description": $scope.description,
	//  		"date_begin": createTripFactory.getDateBegin(),
	//  		"date_end": createTripFactory.getDateEnd(),
	//  		"status": 10
	//  	};


	// 	if(createTripFactory.getIsEditingTrip()) {
	// 		$http({
	// 			method: 'PUT',
	// 			url: createTripFactory.getOriginPath() + "trip/update?trip_id=" + createTripFactory.getChosenTrip()._id,
	// 			data: myjson,
	// 			headers: {'Content-Type': 'application/x-www-form-urlencoded',
	// 			'Content-Type': 'application/json'}
	// 		}).
	// 		success(function(data, status, headers, config) {
	// 			$http({
	// 				method: 'PUT',
	// 				url: createTripFactory.getOriginPath() + "trip/publish?trip_id=" + createTripFactory.getChosenTrip()._id,
	// 				headers: {'Content-Type': 'application/x-www-form-urlencoded',
	// 				'Content-Type': 'application/json'}
	// 			}).
	// 			success(function(data, status, headers, config) {
	// 				createTripFactory.updateTrips();
	// 				createTripFactory.setIsEditingTrip(false);
	// 				createTripFactory.setChosenTrip({});
	// 				$scope.cancel();
	// 			}).
	// 			error(function(data, status, headers, config) {
	// 				alert("Save Success, but unable to publish. Please Try Again.");
	// 				$scope.isDisabled = false;
	// 			});  
				


	// 		}).
	// 		error(function(data, status, headers, config) {
	// 			alert("Save Failed, Please Try Again.");
	// 			$scope.isDisabled = false;
	// 		});  
	// 	}
	// 	else{

	// 		$http({
	// 			method: 'POST',
	// 			url: createTripFactory.getOriginPath() + "trip/create",
	// 			data: myjson,
	// 			headers: {'Content-Type': 'application/x-www-form-urlencoded',
	// 			'Content-Type': 'application/json'}
	// 		}).
	// 		success(function(data, status, headers, config) {
	// 			createTripFactory.updateTrips();
	// 			createTripFactory.setIsEditingTrip(false);
	// 			createTripFactory.setChosenTrip({});
	// 			$scope.cancel();	
	// 		}).
	// 		error(function(data, status, headers, config) {
	// 			alert("Save Failed, Please Try Again.");
	// 			$scope.isDisabled = false;
	// 		});

	// 	}
	// }

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
		return true;
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

