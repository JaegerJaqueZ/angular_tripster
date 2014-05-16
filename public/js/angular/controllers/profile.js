//public/js/angular/controllers/timeline.js

var profileControllers = angular.module('profileControllers', []);

profileControllers.controller('profileCtrl', function ($location, $rootScope, $scope, $http, profileFactory, authFactory, $modal, timelineFactory) {

  snapper.close();

  $scope.range = 10;
  $scope.from = 0;
  $scope.loadShow = false;

  $scope.$watchCollection(

    function() {

      return profileFactory.getChosenProfile();
    },
    
    function(newValue, oldValue) {
      if(newValue!==oldValue) {

        $scope.profile = newValue;
      }
    }
  );   


    authFactory.getCurrentUser(function(err, user) {

      if(err) {

      }

      else if(user) {

        // get history feeds
        $http({
          method:'GET', 
          url: profileFactory.getOriginPath() + "history?skip=" + $scope.from + "&limit=" + $scope.range+"&user_id="+user._id
        })
        .success(function(data, status, headers, config) {
 
            for (var i=0;i<data.length;i++)
            { 
              //change act code to activity
              var activity = getActivity(data[i].act_code);
              data[i].act_code = activity;

              // change created time to time
              var time =calTime(data[i].created);
              data[i].created = time;
            }  
            $scope.activityLogs = data;
            console.log(data);
        })
        .error(function(data, status, headers, config) {
            alert("Failed to get your Profile, Please Try Again");
        }); 


        // get user profile
        $http({
          method:'GET', 
          url: profileFactory.getOriginPath() + "profile?user_id="+user._id
        })
        .success(function(data, status, headers, config) {
 
            $scope.profile = data;
            console.log(data);
        })
        .error(function(data, status, headers, config) {
            alert("Failed to get your Profile, Please Try Again");
        }); 

      }
      else {

      }

    });

    $scope.goFollowing = function (user_id) {

            profileFactory.setChosenUser(user_id)
            console.log("goFollowing");
            var modalInstance = $modal.open({
              templateUrl: 'partials/modal_following.html',
              controller: followingModalInstanceCtrl,
              backdrop: true
            });

    }; 

    $scope.goFollower = function (user_id) {

            profileFactory.setChosenUser(user_id)
            console.log("goFollower");
            var modalInstance = $modal.open({
              templateUrl: 'partials/modal_follower.html',
              controller: followerModalInstanceCtrl,
              backdrop: true
            });

    }; 
    
    $scope.goBookmark = function () {

            console.log("goBookmark");
            $location.path('/bookmark');

    };

    $scope.goMyTrip = function () {

            console.log("goMyTrip");
            $location.path('/mytrip');

    };

    function getActivity(actCode){
      var activity;
      if(actCode ===20)
      {
        activity = "update trip";
      }
      else if (actCode === 40)
      {
        activity = "bookmarked trip";
      }
      else if (actCode === 60)
      {
        activity = "published trip";
      }
      return activity;
    }


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

    $scope.readmore = function (trip) {

      $http({
        method:'GET', 
        url: profileFactory.getOriginPath() + "trip?trip_id=" + trip._id,
      })
      .success(function(data, status, headers, config) {
          // console.log(data);

          // console.log(data.places);

          if(typeof(data.places) !== "undefined"){
            for (var i=0;i<data.places.length;i++)
            {
              var startTime = data.places[i].time_arrive;
              var endTime = data.places[i].time_leave;
              data.places[i].time_arrive = calDate(startTime);
              data.places[i].time_leave = calDate(endTime);
            }
          }
          else{
            // TODO
          }

          timelineFactory.setChosenTrip(data);

          var modalInstance = $modal.open({
            templateUrl: 'partials/modal_timeline.html',
            controller: timelineModalInstanceCtrl,
            backdrop: true
          });
      })
      .error(function(data, status, headers, config) {
          alert("Failed to open the trip, Please Try Again");
          // console.log(data);
      }); 
  };



    $scope.load = function () {

    $scope.from += $scope.range;

    // $scope.to = $scope.from + $scope.range;
    // console.log($scope.from);

    $http({
      method:'GET', 
      url: profileFactory.getOriginPath() + "timeline?skip=" + $scope.from + "&limit=" + $scope.range
    })
    .success(function(data, status, headers, config) {
      // console.log(data);
      //TODO check whether data == [] or not; so, the load more button will be hidden
      if(data != ""){
        profileFactory.setResultList(data); 
        $scope.loadShow = true;
      }
      else{
        $scope.loadShow = false;
      }

         
    })
    .error(function(data, status, headers, config) {

        // console.log(data);
    }); 

  };


  var followingModalInstanceCtrl = function ($scope, $modalInstance, profileFactory) {

      $scope.cancel = function () {

        // get user profile
        $http({
          method:'GET', 
          url: profileFactory.getOriginPath() + "profile?user_id="+$rootScope.currentUser._id
        })
        .success(function(data, status, headers, config) {
            
            profileFactory.setChosenProfile(data);
        })
        .error(function(data, status, headers, config) {
            alert("Failed to get your Profile, Please Try Again");
        });         
        $modalInstance.dismiss('cancel');
      };
  };


  var followerModalInstanceCtrl = function ($scope, $modalInstance, profileFactory) {

      $scope.cancel = function () {

        // get user profile
        $http({
          method:'GET', 
          url: profileFactory.getOriginPath() + "profile?user_id="+$rootScope.currentUser._id
        })
        .success(function(data, status, headers, config) {
            
            profileFactory.setChosenProfile(data);
        })
        .error(function(data, status, headers, config) {
            alert("Failed to get your Profile, Please Try Again");
        });         
        $modalInstance.dismiss('cancel');
      };
  };  

  var timelineModalInstanceCtrl = function ($scope, $modalInstance,timelineFactory,profileFactory) {

    $scope.cancel = function () {

      // get user profile
      $http({
        method:'GET', 
        url: profileFactory.getOriginPath() + "profile?user_id="+$rootScope.currentUser._id
      })
      .success(function(data, status, headers, config) {
          
          profileFactory.setChosenProfile(data);
      })
      .error(function(data, status, headers, config) {
          alert("Failed to get your Profile, Please Try Again");
      });         



      var before  = timelineFactory.getBackUpTrip();
      var after   = timelineFactory.getChosenTrip();
      console.log(before); 
      console.log(after);      

      if( typeof(before.voteState) !== "undefined" && typeof(after.voteState) !== "undefined"  && before.voteState !== after.voteState){


          console.log("xxxxxxx");
          var path = "";
          // before like , after unlike
          if(before.voteState===1 && after.voteState === -1)
          {
            path = "vote_up/flip";
          }
          // before like , after default
          else if(before.voteState===1 && after.voteState === 0)
          {
            path = "vote_up/cancel";
          }
          // before default , after like
          else if(before.voteState===0 && after.voteState === 1)
          {
            path = "vote_up";
          }
          // before default , after unlike
          else if(before.voteState===0 && after.voteState === -1)
          {
            path = "vote_down";
          }
          // before unlike , after like
          else if(before.voteState===-1 && after.voteState === 1)
          {
            path = "vote_down/flip";
          }
          // before unlike , after default
          else if(before.voteState===-1 && after.voteState === 0)
          {
            path = "vote_down/cancel";
          }



          $http({
            method:'PUT', 
            url: timelineFactory.getOriginPath() + "trip/" + path+"?trip_id="+after._id
          })
          .success(function(data, status, headers, config) {
            console.log("success"); 
          })
          .error(function(data, status, headers, config) {

          });
        }

        $modalInstance.dismiss('cancel');
      };
  };


  var bookmarkInstanceCtrl = function ($scope, $modalInstance, bookmarkFactory) {
     $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    }
  }; 

});



