//public/js/angular/controllers/bookmark.js

var bookmarkControllers = angular.module('bookmarkControllers', []);

bookmarkControllers.controller('bookmarkCtrl', function ($scope, $http, bookmarkFactory, $modal) {

  snapper.close();
  
  //mock up
  // $scope.trips = bookmarkFactory.getResultList();

    $http({
      method:'GET', 
      url: bookmarkFactory.getOriginPath() + "bookmarks"
    })
    .success(function(data, status, headers, config) {
        bookmarkFactory.clearResultList(data);
        bookmarkFactory.setResultList(data);
    })
    .error(function(data, status, headers, config) {
        alert("Failed to get your bookmark(s), Please Try Again");
    }); 


  //accordian
  $scope.oneAtATime = true;

  $scope.$watchCollection(

    function() {
      return bookmarkFactory.getResultList();
    },
    
    function(newValue, oldValue) {
      if(newValue!==oldValue) {
        $scope.trips = newValue;
      }
    }
  );

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

  $scope.readmore = function (trip) {

    $http({
      method:'GET', 
      url: bookmarkFactory.getOriginPath() + "trip?trip_id=" + trip._id,
    })
    .success(function(data, status, headers, config) {
        console.log(data);

        console.log(data.places);

        for (var i=0;i<data.places.length;i++)
        {
          var startTime = data.places[i].time_arrive;
          var endTime = data.places[i].time_leave;
          data.places[i].time_arrive = calDate(startTime);
          data.places[i].time_leave = calDate(endTime);
          // console.log(startTime);
          // console.log(endTime);
        }

        bookmarkFactory.setChosenTrip(data);

        var modalInstance = $modal.open({
          templateUrl: 'partials/modal_bookmark.html',
          controller: bookmarkModalInstanceCtrl,
          backdrop: true
        });
    })
    .error(function(data, status, headers, config) {
        alert("Failed to open the trip, Please Try Again");
        console.log(data);
    }); 

  };  





  var bookmarkModalInstanceCtrl = function ($scope, $modalInstance, bookmarkFactory) {

  $scope.cancel = function () {
    // check if bookmarkState has been change
    if(!bookmarkFactory.getBookmarkState()){
        $http({
          method:'GET', 
          url: bookmarkFactory.getOriginPath() + "bookmarks"
        })
        .success(function(data, status, headers, config) {
            bookmarkFactory.clearResultList(data);
            bookmarkFactory.setResultList(data);
        })
        .error(function(data, status, headers, config) {
            alert("Failed to get your bookmark(s), Please Try Again");
        });      
    }
    
    $modalInstance.dismiss('cancel');
  };
};
  

       


});