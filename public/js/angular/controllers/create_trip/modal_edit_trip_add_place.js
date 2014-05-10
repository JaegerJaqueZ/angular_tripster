//public/js/angular/controllers/modal_edit_trip_add_place.js

var modalEditTripAddPlaceControllers = angular.module('modalEditTripAddPlaceControllers', []);

modalEditTripAddPlaceControllers.controller('modalEditTripAddPlaceCtrl', function ($scope, $http, $modal, createTripFactory, $q, $fileUploader) {

	$scope.name = '';
	$scope.description = '';

	$scope.$watch(
		function() {
			var foursquare = createTripFactory.getChosenPlace().foursquare;
			var foursquare_name;
			if(!foursquare) {
				foursquare_name = '';
			}
			else {
				foursquare_name = foursquare.name;
			}
			
			return foursquare_name;
		},
		function(newValue, oldValue) {
			if(newValue!==oldValue){
				$scope.name = newValue;
			}
		}
	);



//= Figure Uploader =====================================================================================

	var uploader = $scope.uploader = $fileUploader.create({
        scope: $scope,
        queueLimit: createTripFactory.FIGURES_LIMIT
    });


    // ADDING FILTERS

    // Images only
    uploader.filters.push(function(item /*{File|HTMLInputElement}*/) {
        var type = uploader.isHTML5 ? item.type : '/' + item.value.slice(item.value.lastIndexOf('.') + 1);
        type = '|' + type.toLowerCase().slice(type.lastIndexOf('/') + 1) + '|';
        return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
    });


    // REGISTER HANDLERS

    uploader.bind('afteraddingfile', function (event, item) {
        // console.info('After adding a file', item);
    });

    uploader.bind('whenaddingfilefailed', function (event, item) {
        // console.info('When adding a file failed', item);
    });

    uploader.bind('afteraddingall', function (event, items) {
        // console.info('After adding all files', items);
    });


//=========================================================================================================

	

	$scope.open = function () {
		
		var modalInstance = $modal.open({
			templateUrl: 'partials/modal_add_place_foursquare.html',
			controller: foursquareModalInstanceCtrl,
			backdrop: true
		});
	};

	function createPlace(trip){

		var myjson = {
			"foursquare":createTripFactory.getChosenPlace().foursquare,
			"description":$scope.description,
			"time_arrive":createTripFactory.getTimeBegin(),
			"time_leave":createTripFactory.getTimeEnd(),
			"trip_id": trip._id
		}

		if(trip.places) {
			myjson.index = createTripFactory.getChosenTrip().places.length;
		}
		else {
			myjson.index = 0;
		}

		var deferred = $q.defer();

		$http({
			method: 'POST', 
			url: createTripFactory.getOriginPath() + "place/create",
			data: myjson,
			headers: {'Content-Type': 'application/x-www-form-urlencoded',
			'Content-Type': 'application/json'}
		})
		.success(function(data, status, headers, config) {
			deferred.resolve(data);
		})
		.error(function(data, status, headers, config) {
			deferred.reject(myjson);
		}); 

		return deferred.promise.then(function(place) { 
			uploadFigures(place);
			
		}, function(myjson) { 
			alert("Failed to add place, please try again"); 
			$scope.isDisabled = false;
		});

	}

	function uploadFigures(place){

		var deferred = $q.defer();


		uploader.bind('beforeupload', function (event, item) {
        	// console.info('Before upload', item);
	    });

	    uploader.bind('progress', function (event, item, progress) {
	        // console.info('Progress: ' + progress, item);
	    });

	    uploader.bind('success', function (event, xhr, item, response) {
	        // console.info('Success', xhr, item, response);
	    });

	    uploader.bind('cancel', function (event, xhr, item) {
	        // console.info('Cancel', xhr, item);
	    });

	    uploader.bind('error', function (event, xhr, item, response) {
	        // console.info('Error', xhr, item, response);
	        deferred.reject(response);
	    });

	    uploader.bind('complete', function (event, xhr, item, response) {
	        // console.info('Complete', xhr, item, response);
	    });

	    uploader.bind('progressall', function (event, progress) {
	        // console.info('Total progress: ' + progress);
	    });

	    uploader.bind('completeall', function (event, items) {
	    	deferred.resolve(items);
	        // console.info('Complete all', items);
	    });

	    if(uploader.getQueueSize() === 0) {
	    	deferred.resolve({});
	    }

		uploader.fixItemUrl(createTripFactory.getOriginPath() + 'figure/upload?place_id=' + place._id);

        //Execute
        uploader.uploadAll();

        return deferred.promise.then(function(result) { 
			updateTripsInService();
			
		}, function(myjson) { 
			alert("Failed to upload figures, please try again"); 
			updateTripsInService();
			$scope.isDisabled = false;
		});
	}

	function updateTripsInService() {

		var deferred = $q.defer();

		$http({
			method:'GET', 
			url: createTripFactory.getOriginPath() + "user/trips"
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

			var   chosenTripTemp2 = createTripFactory.getChosenTrip()
				, deleteRequest = createTripFactory.getDeleteRequest();

			//remove deleteRequest from chosenTrip
			for(var i = 0; i < deleteRequest.places.length; i++) {
				for(var j = 0; j < chosenTripTemp2.places.length; j++) {
					if(chosenTripTemp2.places[j]._id === deleteRequest.places[i]){
						chosenTripTemp2.places.splice(j,1);
						break;
					}
				}				
			}

			$scope.cancel();

		}, function(err) {
			$scope.cancel();
		});
	}


	$scope.confirmPlace = function () {

		if(validate()){
			$scope.isDisabled = true;
			//Execute
			createPlace(createTripFactory.getChosenTrip());
		}
		
	};

	function validate(){
		if($scope.name === ''){
			alert("Place is not defined, Please select place.");
			return false;
		}
		else if($scope.description === ''){
			alert("Trip description is not defined, Please enter trip description.");
			return false;
		}
		else if(uploader.queue.length === 0){
			alert("In order to save place, at least 1 figure must be added.");
			return false;
		}
		return true;
	}

});

var foursquareModalInstanceCtrl = function ($scope, $modalInstance) {

	$scope.cancel = function () {
		$modalInstance.dismiss('cancel');

	};
};