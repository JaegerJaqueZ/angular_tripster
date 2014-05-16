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

    function calTime(time){

      var currentTime = new Date().getTime();
      var diffTimeMillisec = currentTime - time;

      var one_day=1000*60*60*24;
      var one_hour=1000*60*60;
      var one_minute=1000*60;

      var diffDay = Math.floor(diffTimeMillisec/one_day);
      var diffHour = Math.floor((diffTimeMillisec%one_day)/one_hour);
      var diffMinute = Math.floor(((diffTimeMillisec%one_day)%one_hour)/one_minute);

      // console.log(diffDay+" "+diffHour+" "+diffMinute);

      var result;

      if(diffDay>0){
          result= diffDay+"d";  
      }
      else{
        if(diffHour>0)
        {
          result= diffHour+"h";                 
        }
        else{
          result =  diffMinute+"m";
        }
      }
  
      return result;    
    }  


  var followerModalInstanceCtrl = function ($scope, $modalInstance,profileFactory) {

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };
};

});



