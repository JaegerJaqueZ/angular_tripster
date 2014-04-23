//public/js/angular/controllers/modal_add_trip_edit_place.js

var modalAddTripEditPlaceControllers = angular.module('modalAddTripEditPlaceControllers', []);

modalAddTripEditPlaceControllers.controller('modalAddTripEditPlaceCtrl', function ($scope, $http, $modal, createTripFactory, $q, $fileUploader) {

	var chosenPlaceTemp = createTripFactory.getChosenPlace();
	$scope.name = chosenPlaceTemp.foursquare.name;
	$scope.description = chosenPlaceTemp.description;

	$scope.$watch(
		function() {
			return chosenPlaceTemp.foursquare.name;
		},
		function(newValue, oldValue) {
			if(newValue!==oldValue){
				$scope.name = newValue;
			}
		}
	);

//= Figure Uploader =====================================================================================
	

	//queue
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
        console.info('After adding a file', item);
    });

    uploader.bind('whenaddingfilefailed', function (event, item) {
        console.info('When adding a file failed', item);
    });

    uploader.bind('afteraddingall', function (event, items) {
        console.info('After adding all files', items);
    });


//= Figure(s) on Server ================================================================================
	
	$scope.figuresArr = chosenPlaceTemp.figures;

	uploader.setQueueLimit(createTripFactory.FIGURES_LIMIT - $scope.figuresArr.length);
	
	$scope.deleteFigure = function (figure) {
		
		for( var i = 0 ; i < $scope.figuresArr.length ; i++ ){
			if($scope.figuresArr[i]._id === figure._id){
				$scope.figuresArr.splice(i,1);
				break;
			}
		}

		createTripFactory.pushDeletedRequestFigure(figure._id);
		uploader.setQueueLimit(++uploader.queueLimit);
		
	};
		


//=========================================================================================================

	$scope.open = function () {
		
		var modalInstance = $modal.open({
			templateUrl: 'partials/modal_edit_place_foursquare.html',
			controller: foursquareModalInstanceCtrl,
			backdrop: true
		});
	};

	$scope.deletePlace = function () {

		$scope.isDisabled = true;
		
		$http({
			method: 'DELETE', 
			url: createTripFactory.getOriginPath() + "place/delete?place_id=" + chosenPlaceTemp._id,
			headers: {'Content-Type': 'application/x-www-form-urlencoded'}
		})
		.success(function(data, status, headers, config) {
			updateTripsInService();
		})
		.error(function(data, status, headers, config) {
			
			$scope.isDisabled = false;
			alert("Failed to delete place, please try again"); 

		});

	};

	$scope.confirmPlace = function () {

		$scope.isDisabled = true;

		//Execute
		updatePlace();		
		
	};

	function updatePlace(){

		var myjson = {
			"foursquare":chosenPlaceTemp.foursquare,
			"description":$scope.description,
			"time_arrive":createTripFactory.getTimeBegin(),
			"time_leave":createTripFactory.getTimeEnd()
		}

		var deferred = $q.defer();

		$http({
			method: 'PUT', 
			url: createTripFactory.getOriginPath() + "place/update?place_id=" + chosenPlaceTemp._id,
			data: myjson,
			headers: {'Content-Type': 'application/x-www-form-urlencoded',
			'Content-Type': 'application/json'}
		})
		.success(function(data, status, headers, config) {
			deferred.resolve(data);
		})
		.error(function(data, status, headers, config) {
			deferred.reject(data);
		}); 

		return deferred.promise.then(function(place) { 
			uploadFigures(place);
			
		}, function(data) { 
			alert("Failed to update place, please try again"); 
			$scope.isDisabled = false;
		});

	}

	function uploadFigures(place){

		var deferred = $q.defer();


		uploader.bind('beforeupload', function (event, item) {
        console.info('Before upload', item);
	    });

	    uploader.bind('progress', function (event, item, progress) {
	        console.info('Progress: ' + progress, item);
	    });

	    uploader.bind('success', function (event, xhr, item, response) {
	        console.info('Success', xhr, item, response);
	    });

	    uploader.bind('cancel', function (event, xhr, item) {
	        console.info('Cancel', xhr, item);
	    });

	    uploader.bind('error', function (event, xhr, item, response) {
	        console.info('Error', xhr, item, response);
	        deferred.reject(response);
	    });

	    uploader.bind('complete', function (event, xhr, item, response) {
	        console.info('Complete', xhr, item, response);
	    });

	    uploader.bind('progressall', function (event, progress) {
	        console.info('Total progress: ' + progress);
	    });

	    uploader.bind('completeall', function (event, items) {
	    	deferred.resolve(items);
	        console.info('Complete all', items);
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


			//remove deleteRequest from chosenTrip (Figure)
			for(var i = 0; i < chosenTripTemp2.places.length; i++) {

				if(chosenTripTemp2.places[i]._id === chosenPlaceTemp._id){

					for(var j = 0; j < deleteRequest.figures.length; j++) {
						for(var k = 0; k < chosenTripTemp2.places[i].figures.length; k++)

						if(chosenTripTemp2.places[i].figures[k]._id === deleteRequest.figures[j]){
							chosenTripTemp2.places[i].figures.splice(k,1);
							break;
						}
					}

					break;
				}	
			}
			
			$scope.cancel();

		}, function(err) {
			$scope.cancel();
		});
	}

});

var foursquareModalInstanceCtrl = function ($scope, $modalInstance) {

	$scope.cancel = function () {
		$modalInstance.dismiss('cancel');

	};
};