//public/js/angular/controllers/modal_search_trip.js

var modalbookmarkControllers = angular.module('modalbookmarkControllers', []);

modalbookmarkControllers.controller('modalbookmarkCtrl', function ($scope, $http, bookmarkFactory) {

  $scope.trip = bookmarkFactory.getChosenTrip();

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
        url: bookmarkFactory.getOriginPath() + "follow",
        data: { "user_id": bookmarkFactory.getUserId(),"follow_user": trip.author_id}
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
        url: bookmarkFactory.getOriginPath() + "unfollow?user_id=" + bookmarkFactory.getUserId() + "&following_user=" + trip.author_id        
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