//public/js/angular/controllers/bookmark.js

var bookmarkControllers = angular.module('bookmarkControllers', []);

bookmarkControllers.controller('bookmarkCtrl', function ($scope, $http, bookmarkFactory, $modal) {

  //mock up
  $scope.trips = bookmarkFactory.getResultList();

    // $http({
    //   method:'GET', 
    //   url: searchTripFactory.getOriginPath() + "bookmark?user_id=" + bookmarkFactory.getUserId()
    // })
    // .success(function(data, status, headers, config) {
    //     bookmarkFactory.setResultList(data);
    // })
    // .error(function(data, status, headers, config) {
    //     alert("Failed to get your bookmark(s), Please Try Again");
    // }); 

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

  $scope.readmore = function (trip) {

    // $http({
    //   method:'GET', 
    //   url: bookmarkFactory.getOriginPath() + "trips/deep?trip_id=" + trip.trip_id
    // })
    // .success(function(data, status, headers, config) {
        
    //     bookmarkFactory.setChosenTrip(data);

        var modalInstance = $modal.open({
          templateUrl: 'partials/modal_bookmark.html',
          controller: bookmarkModalInstanceCtrl,
          backdrop: true
        });
  //   })
  //   .error(function(data, status, headers, config) {
  //       alert("Failed to open the trip, please Try Again");
  //   }); 
  
  $scope.toggle = true;
  };

  var bookmarkModalInstanceCtrl = function ($scope, $modalInstance) {

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
};
  

       


});