//public/js/angular/controllers/modal_follower.js

var modalFollowerControllers = angular.module('modalFollowerControllers', []);

modalFollowerControllers.controller('modalFollowerCtrl', function ($rootScope, $scope, $http, profileFactory) {

$scope.followerstate ={};

  var user_id = profileFactory.getChosenUser();
  console.log(user_id);

    // get following users
    $http({
      method:'GET', 
      url: profileFactory.getOriginPath() + "followers?user_id="+user_id
    })
    .success(function(data, status, headers, config) {
        $scope.followers = data;
        console.log($scope.followers);


        for(var i =0;i<$scope.followers.length;i++){
          if($scope.followers[i].isFollowingAuthor === true){
              $scope.followerstate[i] = "Following";            
          }
          else
            $scope.followerstate[i] = "Follow";
        }


    })
    .error(function(data, status, headers, config) {
        alert("Failed to get your Profile, Please Try Again");
    }); 




  //follow button
  $scope.following = function (index) {
    
    if($scope.followers[index].isFollowingAuthor ){
      $http({
        method:'PUT', 
        url: profileFactory.getOriginPath() + "unfollow?author_id="+$scope.followers[index].user_id._id     
      })
      .success(function(data, status, headers, config) {
          // $scope.singleModel = 0;
          $scope.followers[index].isFollowingAuthor = false;
          $scope.followerstate[index] = "Follow";
          console.log($scope.followers);
      })
      .error(function(data, status, headers, config) {
          alert("Failed to follow, please Try Again");
      }); 
    }
    else{
      $http({
        method:'PUT', 
        url: profileFactory.getOriginPath() + "follow?author_id="+$scope.followers[index].user_id._id  
      })  
      .success(function(data, status, headers, config) {
           console.log($scope.followers);
          // $scope.singleModel = 1;
          $scope.followers[index].isFollowingAuthor = true;
          $scope.followerstate[index] = "Following";
      })
      .error(function(data, status, headers, config) {
          alert("Failed to follow, please Try Again");
      }); 
    }

  }

  var followerModalInstanceCtrl = function ($scope, $modalInstance,profileFactory) {

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };
};

});



