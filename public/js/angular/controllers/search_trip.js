//public/js/angular/controllers/search_trip.js

var searchTripControllers = angular.module('searchTripControllers', []);

searchTripControllers.controller('searchTripCtrl', function ($scope, $http, searchTripFactory, $modal) {

  $scope.range = 9;
  $scope.from = 0;
  $scope.to = $scope.from + $scope.range;

  //accordian
  $scope.oneAtATime = true;

  $scope.$watchCollection(

    function() {
      return searchTripFactory.getResultList();
    },
    
    function(newValue, oldValue) {
      if(newValue!==oldValue) {
        $scope.trips = newValue;
      }
    }
  );
	
  $scope.search = function () {

       $scope.trips = searchTripFactory.getResultList();

    // //reset
    // $scope.from = 0;
    // $scope.to = $scope.from + $scope.range;

    // $http({
    //   method:'GET', 
    //   url: searchTripFactory.getOriginPath() + "trips/search?key=" + $scope.key + "&from=" + $scope.from + "&to=" + $scope.to
    // })
    // .success(function(data, status, headers, config) {
    //     searchTripFactory.clearResultList();
    //     searchTripFactory.setResultList(data);
    // })
    // .error(function(data, status, headers, config) {
    //     alert("Failed to search trip(s), Please Try Again");
    // }); 

  };

  $scope.load = function () {

    $scope.from += $scope.range;
    $scope.to = $scope.from + $scope.range;

    $http({
      method:'GET', 
      url: searchTripFactory.getOriginPath() + "trips/search?key=" + $scope.key + "&from=" + $scope.from + "&to=" + $scope.to
    })
    .success(function(data, status, headers, config) {
      //TODO check whether data == {} or not; so, the load more button will be hidden
        searchTripFactory.setResultList(data);  
    })
    .error(function(data, status, headers, config) {
        alert("Failed to load trip(s), Please Try Again");
    }); 

  };

  $scope.readmore = function (trip) {

    // $http({
    //   method:'GET', 
    //   url: searchTripFactory.getOriginPath() + "trips/deep?trip_id=" + trip.trip_id,
    //   data: searchTripFactory.getUserId(), trip.author_id
    // })
    // .success(function(data, status, headers, config) {
        
    //     createTripFactory.setChosenTrip(data);

        var modalInstance = $modal.open({
          templateUrl: 'partials/modal_search_trip.html',
          controller: searchTripModalInstanceCtrl,
          backdrop: true
        });
  //   })
  //   .error(function(data, status, headers, config) {
  //       alert("Failed to open the trip, Please Try Again");
  //   }); 

  };  

});

var searchTripModalInstanceCtrl = function ($scope, $modalInstance) {

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
};

