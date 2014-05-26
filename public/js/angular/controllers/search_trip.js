//public/js/angular/controllers/search_trip.js

var searchTripControllers = angular.module('searchTripControllers', []);

searchTripControllers.controller('searchTripCtrl', function ($scope, $http, searchTripFactory, $modal) {

  snapper.close();
  $("#loading").hide();
  

  // set header name
  document.getElementById("header").innerHTML="Search Trip"; 

  getTopTrips();
  
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

  function getTopTrips(){
    $http({
      method:'GET', 
      url: searchTripFactory.getOriginPath() + "trips/top"
    })
    .success(function(data, status, headers, config) {
        $scope.topTrips = data
        console.log(data);
       
    })
    .error(function(data, status, headers, config) {
        alert("Failed to get top trips, Please Try Again");
    });
  }
	
  $scope.search = function () {
    
    //reset
    $("#searchTab").show();
    $scope.from = 0;
    $http({
      method:'GET', 
      url: searchTripFactory.getOriginPath() + "trips/search?key=" + $scope.key + "&skip=" + $scope.from + "&limit=" + $scope.range
    })
    .success(function(data, status, headers, config) {
        console.log(data);
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
    $("#loadingMore").show();
    $scope.from += $scope.range;
    $scope.loadShow = false;
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
      $("#loadingMore").hide();
         
    })
    .error(function(data, status, headers, config) {
        alert("Failed to load trip(s), Please Try Again");
    }); 

  };

  $scope.readmore = function (trip) {

    $("#loading").show();
    $("linkTrip").prop('disabled', true);
    //document.getElementById("linkTrip").disabled = true;    

    $http({
      method:'GET', 
      url: searchTripFactory.getOriginPath() + "trip?trip_id=" + trip._id,
    })
    .success(function(data, status, headers, config) {
        // console.log(data);

        $("#loading").hide();
        $("linkTrip").prop('disabled', false);
        //document.getElementById("linkTrip").disabled = false;        

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

var searchTripModalInstanceCtrl = function ($scope, $modalInstance, timelineFactory, searchTripFactory) {

  $scope.cancel = function () {

      var before  = timelineFactory.getBackUpTrip();
      var after   = searchTripFactory.getChosenTrip();
      console.log(before); 
      console.log(after);      

      if(typeof(before.voteState) !== "undefined" && typeof(after.voteState) !== "undefined"  && before.voteState !== after.voteState){

          var path = "";
          // before like , after unlike
          if(before.voteState===1 && after.voteState === -1)
          {
            path = "vote_up/flip";
          }
          // before like , after default
          else if(before.voteState===1 && after.voteState === 0)
          {
            path = "vote_up/cancel";
          }
          // before default , after like
          else if(before.voteState===0 && after.voteState === 1)
          {
            path = "vote_up";
          }
          // before default , after unlike
          else if(before.voteState===0 && after.voteState === -1)
          {
            path = "vote_down";
          }
          // before unlike , after like
          else if(before.voteState===-1 && after.voteState === 1)
          {
            path = "vote_down/flip";
          }
          // before unlike , after default
          else if(before.voteState===-1 && after.voteState === 0)
          {
            path = "vote_down/cancel";
          }

          $http({
            method:'PUT', 
            url: timelineFactory.getOriginPath() + "trip/" + path+"?trip_id="+after._id
          })
          .success(function(data, status, headers, config) {
            console.log("success"); 
          })
          .error(function(data, status, headers, config) {

          });        

      }
        
    $modalInstance.dismiss('cancel');
  };
};



});



