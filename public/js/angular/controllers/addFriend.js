//public/js/angular/controllers/modal_following.js

var addFriendControllers = angular.module('addFriendControllers', []);

addFriendControllers.controller('addFriendCtrl', function ($rootScope, $scope, $http, profileFactory) {

  snapper.close();

  $scope.loading = true;
  $scope.header = false;

  $scope.followingstate = {};

  // get following users
  $http({
    method:'GET', 
    url: profileFactory.getOriginPath() + "user/friends"
  })
  .success(function(data, status, headers, config) {
    console.log(data);
    console.log(data[0]);
    console.log(data[1]);
    $scope.friendsInApps = data[0];
    $scope.friendsInvites = data[1];

    for(var i =0;i<$scope.friendsInApps.length;i++){
      if($scope.friendsInApps[i].isFollowing === true){
          $scope.followingstate[i] = "Following";            
      }
      else
        $scope.followingstate[i] = "Follow";
    }        
     $scope.loading = false;
     $scope.header  = true;
  })
  .error(function(data, status, headers, config) {
      alert("Failed to get your Profile, Please Try Again");
  }); 




  //follow button
  $scope.following = function (index) {
    
    if($scope.friendsInApps[index].isFollowing || typeof($scope.friendsInApps[index].isFollowing) === "undefined"){
      $http({
        method:'PUT', 
        url: profileFactory.getOriginPath() + "unfollow?author_id="+$scope.friendsInApps[index]._id     
      })
      .success(function(data, status, headers, config) {
          // $scope.singleModel = 0;
          $scope.friendsInApps[index].isFollowing = false;
          $scope.followingstate[index] = "Follow";
      })
      .error(function(data, status, headers, config) {
          alert("Failed to follow, please Try Again");
      }); 
    }
    else{
      $http({
        method:'PUT', 
        url: profileFactory.getOriginPath() + "follow?author_id="+$scope.friendsInApps[index]._id  
      })  
      .success(function(data, status, headers, config) {
           console.log(data);
          // $scope.singleModel = 1;
          $scope.friendsInApps[index].isFollowing = true;
          $scope.followingstate[index] = "Following";
      })
      .error(function(data, status, headers, config) {
          alert("Failed to follow, please Try Again");
      }); 
    }

  };


  var followingModalInstanceCtrl = function ($scope, $modalInstance,profileFactory) {

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };
};

});



