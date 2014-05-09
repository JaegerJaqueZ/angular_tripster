//public/js/angular/controllers/modal_search_trip.js

var modalTimelineControllers = angular.module('modalTimelineControllers', []);

modalTimelineControllers.controller('modalTimelineCtrl', function ($rootScope, $scope, $http, timelineFactory) {

  $scope.trip = timelineFactory.getChosenTrip();
  
  timelineFactory.setBookmarkState(true);

  // initialize follow button
  if(!$scope.trip.isFollowingAuthor){
      // $scope.follow = 1;
      $scope.followingstate = "follow";      
    }
    else{
      // $scope.singleModel = 0;
      $scope.followingstate = "following"; 
    }   

  //initialize bookmark button
  //TODO maybe like follow button
 
  if(!$scope.trip.isBookmarkedTrip){
      // $scope.bookmark = 0;
      $scope.bookmarkstate = "bookmark";    
    }
    else{
      // $scope.singleModel = 0;
      $scope.bookmarkstate = "bookmarked"; 
    } 
  
  // check user id with author id 
  $scope.checkIsOwner = function(){
    if($rootScope.currentUser._id == $scope.trip.user_id._id) 
      return true;
    else 
      return false;
  };

  //follow button
  $scope.following = function () {

    if(!$scope.trip.isFollowingAuthor){
      $http({
        method:'PUT', 
        url: timelineFactory.getOriginPath() + "follow?author_id="+$scope.trip.user_id._id    
      })  
      .success(function(data, status, headers, config) {
          // console.log(data);
          // $scope.singleModel = 1;
          $scope.trip.isFollowingAuthor = true;
          $scope.followingstate = "following";
      })
      .error(function(data, status, headers, config) {
          alert("Failed to follow, please Try Again");
      }); 
    }
    else{
      $http({
        method:'PUT', 
        url: timelineFactory.getOriginPath() + "unfollow?author_id="+$scope.trip.user_id._id        
      })
      .success(function(data, status, headers, config) {
          // $scope.singleModel = 0;
          $scope.trip.isFollowingAuthor = false;
          $scope.followingstate = "follow";
      })
      .error(function(data, status, headers, config) {
          alert("Failed to follow, please Try Again");
      }); 
    }

  };

  //bookmark button
  $scope.bookmarking = function () {
  //TODO maybe like follow function
    if(!$scope.trip.isBookmarkedTrip){
      $http({
        method:'PUT', 
        url: timelineFactory.getOriginPath() + "bookmark?trip_id="+$scope.trip._id    
      })  
      .success(function(data, status, headers, config) {
        console.log(data);
          // $scope.singleModel = 1;
          $scope.trip.isBookmarkedTrip = true;
          $scope.bookmarkstate = "bookmarked";
          timelineFactory.setBookmarkState(true);          
      })
      .error(function(data, status, headers, config) {
        console.log(data);
          alert("Failed to bookmark, please Try Again");
      }); 
    }
    else{
      $http({
        method:'PUT', 
        url: timelineFactory.getOriginPath() + "unbookmark?trip_id="+$scope.trip._id        
      })
      .success(function(data, status, headers, config) {
          // $scope.singleModel = 0;
          $scope.trip.isBookmarkedTrip = false;
          timelineFactory.setBookmarkState(false);
          $scope.bookmarkstate = "bookmark";
      })
      .error(function(data, status, headers, config) {
        console.log(data);
          alert("Failed to bookmark, please Try Again");
      }); 
    }
  };


});