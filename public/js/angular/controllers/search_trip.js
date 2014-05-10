//public/js/angular/controllers/search_trip.js

var searchTripControllers = angular.module('searchTripControllers', []);

searchTripControllers.controller('searchTripCtrl', function ($scope, $http, searchTripFactory, $modal) {

  snapper.close();
  
  $scope.range = 10;
  $scope.from = 0;
  $scope.loadShow = false;
  $scope.trips = [];
  // $scope.to = $scope.from + $scope.range;

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

       // $scope.trips = searchTripFactory.getResultList();

    //reset
    $scope.from = 0;
    // $scope.to = $scope.from + $scope.range;

    $http({
      method:'GET', 
      url: searchTripFactory.getOriginPath() + "trips/search?key=" + $scope.key + "&skip=" + $scope.from + "&limit=" + $scope.range
    })
    .success(function(data, status, headers, config) {
        // console.log(data);
        searchTripFactory.clearResultList();

      if(data !=""){
        searchTripFactory.setResultList(data); 
        $scope.loadShow = true;
      }
      else {
        $scope.loadShow = false;
      }

       
    })
    .error(function(data, status, headers, config) {
        alert("Failed to search trip(s), Please Try Again");
    }); 

  };

  // change time from milleseconds to hours and minutes 
  function calDate(number){
      var date = new Date(number);
      var time = "";
      if(date.getHours()<10 && date.getMinutes()<10)
        time = "0"+date.getHours()+":0"+date.getMinutes();
      else if(date.getHours()<10 )
        time = "0"+date.getHours()+":"+date.getMinutes();
      else if(date.getMinutes()<10)
        time = date.getHours()+":0"+date.getMinutes();               
      else 
        time = date.getHours()+":"+date.getMinutes();
      return time;
  };

  $scope.load = function () {

    $scope.from += $scope.range;

    // $scope.to = $scope.from + $scope.range;
    // console.log($scope.from);

    $http({
      method:'GET', 
      url: searchTripFactory.getOriginPath() + "trips/search?key=" + $scope.key + "&skip=" + $scope.from + "&limit=" + $scope.range
    })
    .success(function(data, status, headers, config) {
      // console.log(data);
      //TODO check whether data == [] or not; so, the load more button will be hidden
      if(data != ""){
        searchTripFactory.setResultList(data); 
        $scope.loadShow = true;
      }
      else{
        $scope.loadShow = false;
      }

         
    })
    .error(function(data, status, headers, config) {
        alert("Failed to load trip(s), Please Try Again");
    }); 

  };

  $scope.readmore = function (trip) {

    $http({
      method:'GET', 
      url: searchTripFactory.getOriginPath() + "trip?trip_id=" + trip._id,
    })
    .success(function(data, status, headers, config) {
        // console.log(data);

        if(typeof(data.places) !== "undefined"){
          for (var i=0;i<data.places.length;i++)
          {
            var startTime = data.places[i].time_arrive;
            var endTime = data.places[i].time_leave;
            data.places[i].time_arrive = calDate(startTime);
            data.places[i].time_leave = calDate(endTime);
          }
        }
        else{
          // TODO
        }

        searchTripFactory.setChosenTrip(data);

        var modalInstance = $modal.open({
          templateUrl: 'partials/modal_search_trip.html',
          controller: searchTripModalInstanceCtrl,
          backdrop: true
        });
    })
    .error(function(data, status, headers, config) {
        alert("Failed to open the trip, Please Try Again");
        // console.log(data);
    }); 

  };  

});

var searchTripModalInstanceCtrl = function ($scope, $modalInstance) {

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
};

