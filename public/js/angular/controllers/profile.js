//public/js/angular/controllers/timeline.js

var profileControllers = angular.module('profileControllers', []);

profileControllers.controller('profileCtrl', function ($scope, $http, profileFactory, $modal) {

  snapper.close();

  $scope.range = 10;
  $scope.from = 0;
  $scope.loadShow = false;

    $scope.$watchCollection(

      function() {
        return profileFactory.getResultList();
      },
      
      function(newValue, oldValue) {
        if(newValue!==oldValue) {
          $scope.activityLogs = newValue;
        }
      }
    );    

    $http({
      method:'GET', 
      url: profileFactory.getOriginPath() + "timeline"+ "?skip=" + $scope.from + "&limit=" + $scope.range
    })
    .success(function(data, status, headers, config) {
      console.log(data);
        profileFactory.clearResultList(data);
        for (var i=0;i<data.length;i++)
        { 
          //change act code to activity
          var activity = getActivity(data[i].act_code);
          data[i].act_code = activity;

          // change created time to time
          var time =calTime(data[i].created);
          data[i].created = time;
        }  
        profileFactory.setResultList(data);
    })
    .error(function(data, status, headers, config) {
        alert("Failed to get your timeline, Please Try Again");
    }); 

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

      console.log(diffDay+" "+diffHour+" "+diffMinute);

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
          console.log(data);

          console.log(data.places);

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

          profileFactory.setChosenTrip(data);

          var modalInstance = $modal.open({
            templateUrl: 'partials/modal_timeline.html',
            controller: timelineModalInstanceCtrl,
            backdrop: true
          });
      })
      .error(function(data, status, headers, config) {
          alert("Failed to open the trip, Please Try Again");
          console.log(data);
      }); 
  };



    $scope.load = function () {

    $scope.from += $scope.range;

    // $scope.to = $scope.from + $scope.range;
    console.log($scope.from);

    $http({
      method:'GET', 
      url: profileFactory.getOriginPath() + "timeline?skip=" + $scope.from + "&limit=" + $scope.range
    })
    .success(function(data, status, headers, config) {
      console.log(data);
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

        console.log(data);
    }); 

  };

  var timelineModalInstanceCtrl = function ($scope, $modalInstance,profileFactory) {

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };
};

});



