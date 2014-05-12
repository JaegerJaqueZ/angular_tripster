//public/js/angular/controllers/create_trip/modal_add_trip.js

var modalAddTripControllers = angular.module('modalAddTripControllers', []);

modalAddTripControllers.controller('modalAddTripCtrl', function ($scope, $http, createTripFactory, $modal) {
 
	var places_temp    = createTripFactory.getChosenTrip().places || new Array();

	$scope.days 	   = splitPlacesArray(places_temp);
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
				$scope.days = splitPlacesArray(newValue);
			}
		}
	);

	function splitPlacesArray(places){

		var i;
		var places_split = [];

		for( i = 0 ; i < createTripFactory.getTotalDays() ; i++ ) {

			places_split.push([]);
		}

		for( i = 0 ; i < places.length ; i ++) {
			
			places_split[places[i].day-1].push(places[i]);
		}
		
		return places_split;
	}

	$scope.addDay = function (){
		var temp = createTripFactory.getTotalDays() + 1;
		createTripFactory.setTotalDays(temp);
		$scope.days.push([]);
	}

	$scope.deleteDay = function (day){
		$scope.days.splice(day-1,1);
	}

	//add new place
	$scope.open = function (day, place) {

		if(typeof(place) === 'undefined') {
			//add new place
			createTripFactory.setChosenDay($scope.days.indexOf(day)+1);
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
					alert("Save Success.");
					alert("In order to make this trip visible to other people, you have to publish this trip in 'Draft' first");
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
					alert("Save Success.");
					alert("In order to make this trip visible to other people, you have to publish this trip in 'Draft' first");
					$scope.cancel();	
				}).
				error(function(data, status, headers, config) {
					alert("Save Failed, Please Try Again.");
					$scope.isDisabled = false;
				});
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
		else if(createTripFactory.getDateBegin() > createTripFactory.getDateEnd()){
			alert("Please make sure Begin date come before End date.");
			return false;
		}
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

