//public/js/angular/controllers/modal_search_trip.js

var modalSearchTripControllers = angular.module('modalSearchTripControllers', []);

modalSearchTripControllers.controller('modalSearchTripCtrl', function ($rootScope, $scope, $http, searchTripFactory, $window) {

  $scope.trip = searchTripFactory.getChosenTrip();
  // console.log( $scope.trip );



  // initialize follow button
  if(!$scope.trip.isFollowingAuthor){
      // $scope.follow = 1;
      $scope.followingstate = "Follow";      
    }
    else{
      // $scope.singleModel = 0;
      $scope.followingstate = "Following"; 
    }   

  //initialize bookmark button
  //TODO maybe like follow button
 
  if(!$scope.trip.isBookmarkedTrip){
      // $scope.bookmark = 0;
      $scope.bookmarkstate = "Bookmark";    
    }
    else{
      // $scope.singleModel = 0;
      $scope.bookmarkstate = "Bookmarked"; 
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
        url: searchTripFactory.getOriginPath() + "follow?author_id="+$scope.trip.user_id._id    
      })  
      .success(function(data, status, headers, config) {
          // console.log(data);
          // $scope.singleModel = 1;
          $scope.trip.isFollowingAuthor = true;
          $scope.followingstate = "Following";
      })
      .error(function(data, status, headers, config) {
          alert("Failed to follow, please Try Again");
          if(status === 401){
            $window.location.reload();
          }
      }); 
    }
    else{
      $http({
        method:'PUT', 
        url: searchTripFactory.getOriginPath() + "unfollow?author_id="+$scope.trip.user_id._id        
      })
      .success(function(data, status, headers, config) {
          // $scope.singleModel = 0;
          $scope.trip.isFollowingAuthor = false;
          $scope.followingstate = "Follow";
      })
      .error(function(data, status, headers, config) {
          alert("Failed to follow, please Try Again");
          if(status === 401){
            $window.location.reload();
          }
      }); 
    }

  };

  //bookmark button
  $scope.bookmarking = function () {
  //TODO maybe like follow function
    if(!$scope.trip.isBookmarkedTrip){
      $http({
        method:'PUT', 
        url: searchTripFactory.getOriginPath() + "bookmark?trip_id="+$scope.trip._id    
      })  
      .success(function(data, status, headers, config) {
        // console.log(data);
          // $scope.singleModel = 1;
          $scope.trip.isBookmarkedTrip = true;
          $scope.bookmarkstate = "Bookmarked";
      })
      .error(function(data, status, headers, config) {
        // console.log(data);
          alert("Failed to bookmark, please Try Again");
          if(status === 401){
            $window.location.reload();
          }
      }); 
    }
    else{
      $http({
        method:'PUT', 
        url: searchTripFactory.getOriginPath() + "unbookmark?trip_id="+$scope.trip._id        
      })
      .success(function(data, status, headers, config) {
          // $scope.singleModel = 0;
          $scope.trip.isBookmarkedTrip = false;
          $scope.bookmarkstate = "Bookmark";
      })
      .error(function(data, status, headers, config) {
        // console.log(data);
          alert("Failed to bookmark, please Try Again");
          if(status === 401){
            $window.location.reload();
          }
      }); 
    }
  };

});