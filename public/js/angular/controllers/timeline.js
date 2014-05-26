//public/js/angular/controllers/timeline.js

var timelineControllers = angular.module('timelineControllers', []);

timelineControllers.controller('timelineCtrl', function ($scope, $http, timelineFactory, $modal, profileFactory) {

	snapper.close();

  document.getElementById("header").innerHTML="tripster";

  $("#menuButton").show();
  $("#loading").hide();

  $scope.range    = 10;
	$scope.from     = 0;
	$scope.loadShow = false;

  	$scope.$watchCollection(

	    function() {
	      return timelineFactory.getResultList();
	    },
	    
	    function(newValue, oldValue) {
	      if(newValue!==oldValue) {
	        $scope.activityLogs = newValue;
	      }
	    }
  	);	  

    $http({
      method:'GET', 
      url: timelineFactory.getOriginPath() + "timeline"+ "?skip=" + $scope.from + "&limit=" + $scope.range
    })
    .success(function(data, status, headers, config) {
    	  console.log(data);
       //  if(data === "")
       //  {
       //    //$("#suggestFriend").html("You need to add friends first to see activities on your timeline");
       //    console.log("kuy");
       //    document.getElementById("suggestFriend").innerHTML="You need to add friends first to see activities on your timeline";
         //  }


        timelineFactory.clearResultList(data);
      	for (var i=0;i<data.length;i++)
      	{	
      		//change act code to activity
      		var activity = getActivity(data[i].act_code);
      		data[i].act_code = activity;

      		// change created time to time
      		var time =calTime(data[i].created);
      		data[i].created = time;
      	}  
        if(data !=""){
          timelineFactory.setResultList(data); 
          $scope.loadShow = true;
        }
        else {
          $scope.loadShow = false;
        }  
    })
    .error(function(data, status, headers, config) {
        alert("Failed to get your timeline, Please Try Again");
    }); 

    function getActivity(actCode){
    	var activity;
    	if(actCode === 20)
    	{
    		activity = "updated";
    	}
    	else if (actCode === 40)
    	{
    		activity = "bookmarked";
    	}
    	else if (actCode === 60)
    	{
    		activity = "published";
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
      // console.log("current time: "+currentTime);
      // console.log("ped time: "+time);
      if(currentTime<time){
       currentTime = time; 
      }

    	var diffTimeMillisec = currentTime - time;

    	var one_day     =  1000*60*60*24;
    	var one_hour    =  1000*60*60;
    	var one_minute  =  1000*60;
      var one_second  =  1000;

    	var diffDay    = Math.floor(diffTimeMillisec/one_day);
    	var diffHour   = Math.floor((diffTimeMillisec%one_day)/one_hour);
    	var diffMinute = Math.floor(((diffTimeMillisec%one_day)%one_hour)/one_minute);
      var diffSecond = Math.floor((((diffTimeMillisec%one_day)%one_hour)%one_minute)/one_second);

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
          if(diffMinute>0)
          {
            result =  diffMinute+"m";
          }
    			else
          {
            result = diffSecond+"s";
          }
    		}
    	}

    	return result;  	
    }

  	$scope.readmore = function (trip) {

      $("#loading").show();
      $("linkTrip").prop('disabled', true);
      //document.getElementById("linkTrip").disabled = true;

	    $http({
	      method:'GET', 
	      url: timelineFactory.getOriginPath() + "trip?trip_id=" + trip._id,
	    })
	    .success(function(data, status, headers, config) {
	         console.log(data);
           // $("#timeline").show();
          $("#loading").hide();
          $("linkTrip").prop('disabled', false);
          // document.getElementById("linkTrip").disabled = false;
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

  $scope.goProfile = function (user_id) {

          profileFactory.setChosenUser(user_id)
          console.log("xxx");
          var modalInstance = $modal.open({
            templateUrl: 'partials/modal_profile.html',
            controller: profileModalInstanceCtrl,
            backdrop: true
          });

  };  


  	$scope.load = function () {

    $scope.from += $scope.range;
    $("#loadingMore").show();
    // $scope.to = $scope.from + $scope.range;
    // console.log($scope.from);

    $http({
      method:'GET', 
      url: timelineFactory.getOriginPath() + "timeline?skip=" + $scope.from + "&limit=" + $scope.range
    })
    .success(function(data, status, headers, config) {
       console.log(data);
      $("#loadingMore").hide();
      //TODO check whether data == [] or not; so, the load more button will be hidden
      if(data != ""){
        timelineFactory.setResultList(data); 
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

  var timelineModalInstanceCtrl = function ($scope, $modalInstance,timelineFactory) {

	  $scope.cancel = function () {
      var before  = timelineFactory.getBackUpTrip();
      var after   = timelineFactory.getChosenTrip();
      console.log(before); 
      console.log(after);      

      if(typeof(before.voteState) !== "undefined" && typeof(after.voteState) !== "undefined"  && before.voteState !== after.voteState){

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

  var profileModalInstanceCtrl = function ($scope, $modalInstance, profileFactory) {
     $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    }
  };

});



