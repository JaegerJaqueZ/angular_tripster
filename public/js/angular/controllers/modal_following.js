//public/js/angular/controllers/modal_following.js

var modalFollowingControllers = angular.module('modalFollowingControllers', []);

modalFollowingControllers.controller('modalFollowingCtrl', function ($rootScope, $scope, $http, profileFactory) {

  $scope.followingstate = {};




  $scope.followings = {};



  var user_id = profileFactory.getChosenUser();
  console.log(user_id);

    // get following users
    $http({
      method:'GET', 
      url: profileFactory.getOriginPath() + "followings?user_id="+user_id
    })
    .success(function(data, status, headers, config) {
        $scope.followings = data;
        console.log($scope.followings);

        for(var i =0;i<$scope.followings.authors.length;i++){
          $scope.followingstate[i] = "Following";
        }


    })
    .error(function(data, status, headers, config) {
        alert("Failed to get your Profile, Please Try Again");
    }); 




  //follow button
  $scope.following = function (index) {
    console.log(index);

    if($scope.followings.authors[index].isFollowingAuthor || typeof($scope.followings.authors[index].isFollowingAuthor) === "undefined"){
      $http({
        method:'PUT', 
        url: profileFactory.getOriginPath() + "unfollow?author_id="+$scope.followings.authors[index]._id     
      })
      .success(function(data, status, headers, config) {
          // $scope.singleModel = 0;
          $scope.followings.authors[index].isFollowingAuthor = false;
          $scope.followingstate[index] = "Follow";
      })
      .error(function(data, status, headers, config) {
          alert("Failed to follow, please Try Again");
      }); 
    }
    else{
      $http({
        method:'PUT', 
        url: profileFactory.getOriginPath() + "follow?author_id="+$scope.followings.authors[index]._id  
      })  
      .success(function(data, status, headers, config) {
           console.log(data);
          // $scope.singleModel = 1;
          $scope.followings.authors[index].isFollowingAuthor = true;
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



