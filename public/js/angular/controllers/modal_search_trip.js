//public/js/angular/controllers/modal_search_trip.js

var modalSearchTripControllers = angular.module('modalSearchTripControllers', []);

modalSearchTripControllers.controller('modalSearchTripCtrl', function ($scope, $http, searchTripFactory) {

  $scope.trip = searchTripFactory.getChosenTrip();

  //initialize follow button
  // if(!$scope.trip.follow){
      $scope.follow = 1;
      $scope.followingstate = "following";      
    // }
    // else{
    //   $scope.singleModel = 0;
    //   $scope.followingstate = "follow"; 
    // }   

  //initialize bookmark button
  //TODO maybe like follow button
      $scope.bookmark = 0;
      $scope.bookmarkstate = "bookmark"; 

  
  //follow button
  $scope.follow = function () {

    if(!$scope.trip.follow){
      $http({
        method:'POST', 
        url: searchTripFactory.getOriginPath() + "follow",
        data: { "user_id": searchTripFactory.getUserId(),"follow_user": trip.author_id}
      })
      .success(function(data, status, headers, config) {
          $scope.singleModel = 1;
          $scope.followingstate = "following";
      })
      .error(function(data, status, headers, config) {
          alert("Failed to follow, please Try Again");
      }); 
    }
    else{
      $http({
        method:'DELETE', 
        url: searchTripFactory.getOriginPath() + "unfollow?user_id=" + searchTripFactory.getUserId() + "&following_user=" + trip.author_id        
      })
      .success(function(data, status, headers, config) {
          $scope.singleModel = 0;
          $scope.followingstate = "follow";
      })
      .error(function(data, status, headers, config) {
          alert("Failed to follow, please Try Again");
      }); 
    }

  };

  //bookmark button
  $scope.bookmark = function () {
  //TODO maybe like follow function

  };

});