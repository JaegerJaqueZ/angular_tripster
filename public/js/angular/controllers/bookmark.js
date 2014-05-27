//public/js/angular/controllers/bookmark.js

var bookmarkControllers = angular.module('bookmarkControllers', []);

bookmarkControllers.controller('bookmarkCtrl', function ($scope, $http, bookmarkFactory, $modal) {

  snapper.close();
  $("#loading").hide();

    // set color of snap
  $("#timeline").css("background-color","");
  $("#myTrip").css("background-color","");
  $("#searchTrip").css("background-color","");
  $("#bookmark").css("background-color","#a31d2e");
  $("#profile").css("background-color","");
  $("#friend").css("background-color","");

  // change header name
  document.getElementById("header").innerHTML="Bookmark"; 

  //mock up
  // $scope.trips = bookmarkFactory.getResultList();

    $http({
      method:'GET', 
      url: bookmarkFactory.getOriginPath() + "bookmarks"
    })
    .success(function(data, status, headers, config) {
        console.log(data);
        bookmarkFactory.clearResultList();
        bookmarkFactory.setResultList(data);
    })
    .error(function(data, status, headers, config) {
        alert("Failed to get your bookmark(s), Please Try Again");
    }); 


  //accordian
  $scope.oneAtATime = true;

  $scope.$watchCollection(

    function() {
      return bookmarkFactory.getResultList();
    },
    
    function(newValue, oldValue) {
      if(newValue!==oldValue) {
        $scope.trips = newValue;
      }
    }
  );

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
  };

  $scope.readmore = function (trip) {

    $("#loading").show();
    $("linkTrip").prop('disabled', true);
    //document.getElementById("linkTrip").disabled = true;

    $http({
      method:'GET', 
      url: bookmarkFactory.getOriginPath() + "trip?trip_id=" + trip._id,
    })
    .success(function(data, status, headers, config) {
        // console.log(data);
        $("#loading").hide();
        $("linkTrip").prop('disabled', false);
        //document.getElementById("linkTrip").disabled = false;
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

        bookmarkFactory.setChosenTrip(data);

        var modalInstance = $modal.open({
          templateUrl: 'partials/modal_bookmark.html',
          controller: bookmarkModalInstanceCtrl,
          backdrop: true
        });
    })
    .error(function(data, status, headers, config) {
        alert("Failed to open the trip, Please Try Again");
        // console.log(data);
    }); 

  };  





  var bookmarkModalInstanceCtrl = function ($scope, $modalInstance, timelineFactory, bookmarkFactory) {

  $scope.cancel = function () {
    // check if bookmarkState has been change
    if(!bookmarkFactory.getBookmarkState()){
        $http({
          method:'GET', 
          url: bookmarkFactory.getOriginPath() + "bookmarks"
        })
        .success(function(data, status, headers, config) {
            bookmarkFactory.clearResultList(data);
            bookmarkFactory.setResultList(data);
        })
        .error(function(data, status, headers, config) {
            alert("Failed to get your bookmark(s), Please Try Again");
        });      
    }

      var before  = timelineFactory.getBackUpTrip();
      var after   = bookmarkFactory.getChosenTrip();
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
  

       


});