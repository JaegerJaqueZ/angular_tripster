//public/js/angular/controllers/modal_search_trip.js

var modalTimelineControllers = angular.module('modalTimelineControllers', []);

modalTimelineControllers.controller('modalTimelineCtrl', function ($rootScope, $scope, $http, timelineFactory, $window, mapFactory) {

  $scope.trip = timelineFactory.getChosenTrip();
 
  mapFactory.setPlaces($scope.trip.places);
  $scope.places = mapFactory.getPlaces();

  console.log($scope.places);
  
  $scope.latlngs = [];

    // marker
  $scope.markers = new Array();   
  for (var i = 0; i < $scope.places.length; i++) {

    $scope.markers.push({

            lat: $scope.places[i].foursquare.location.lat,
            lng: $scope.places[i].foursquare.location.lng,
            message: $scope.places[i].foursquare.name,
            focus: false,
            draggable: false,
            icon : {
              iconUrl: '../img/number_'+(i+1)+'.png',
              //shadowUrl: 'img/leaf-shadow.png',
              iconSize:     [32, 37], // size of the icon
              //shadowSize:   [50, 64], // size of the shadow
              iconAnchor:   [16, 35], // point of the icon which will correspond to marker's location
              //shadowAnchor: [4, 62],  // the same for the shadow
              popupAnchor:  [0, -30] // point from which the popup should open relative to the iconAnchor         
            }                             
        });

       $scope.latlngs.push({  
          lat : $scope.places[i].foursquare.location.lat,
          lng : $scope.places[i].foursquare.location.lng
    });

  }
  console.log($scope.latlngs);

  // path
  $scope.paths = new Array();
  $scope.paths.push({

    color: 'red',
          weight: 4,
          latlngs: $scope.latlngs

  });   

  //  set map properties (zoom, center, layers)
    angular.extend($scope, {    
        defaults: {
            scrollWheelZoom: true,
            //tileLayer: "http://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png",
          maxZoom: 20,
          path: {
              weight: 10,
              color: '#800000',
              opacity: 1
          }
        },
        center : {
          lat: mapFactory.getAvgLat(),
          lng: mapFactory.getAvgLng(),
          zoom:15            
        },
        layers: {
            baselayers: {
                osm: {
                    name: 'YO',
                    url: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                    type: 'xyz'
                },
            }
        }
        // paths: {
       //        polyline: {
       //         type : "polyline",
        //         color: "red",
        //         weight: 4,
        //         latlngs:  $scope.latlngs
        //     }
       //    }            
    });





  var places_temp     = $scope.trip.places;
  $scope.days         = splitPlacesArray(places_temp);
  console.log($scope.trip);

  $scope.radioModel = '';
  // set state of button
  if( $scope.trip.voteState === 0 || typeof($scope.trip.voteState) === "undefined"){
    console.log(0);
    $scope.radioModel = '';   
  }
  else if( $scope.trip.voteState === 1){
    console.log(1);
    $scope.radioModel = 'Like';    
  }
  else if( $scope.trip.voteState === -1){
    console.log(-1);
    $scope.radioModel = 'Unlike';    
  }  

  // progress bar
  $scope.stacked = setBarInProgressBar($scope.trip);

  var just_count = 0;

  $scope.$watch(

    function() {

      return just_count;
    },
    
    function(newValue, oldValue) {
      if(newValue!==oldValue) {

        $scope.stacked = setBarInProgressBar(timelineFactory.getChosenTrip());
      }
    }
  );    


  function setBarInProgressBar(trip) {
    var arrayBar = [];

    if(typeof(trip.percent_vote_up) === 'undefined' || trip.percent_vote_up === null) {
      trip.percent_vote_up =0;
    }

    if(typeof(trip.percent_vote_down) === 'undefined' || trip.percent_vote_down === null) {
      trip.percent_vote_down =0;
    }    

    arrayBar.push({
      value: trip.percent_vote_up,
      type: "primary"
    });

    arrayBar.push({
      value: trip.percent_vote_down,
      type: "danger"
    });    

    return arrayBar;  
  }



  $scope.like = function(){

    console.log($scope.radioModel);

    if( $scope.radioModel !== 'Like' ){

      if($scope.trip.voteState===0){
        $scope.trip.vote_up++;
      }
      else if($scope.trip.voteState===-1){
        $scope.trip.vote_down--;
        $scope.trip.vote_up++;        
      }
      $scope.trip.voteState=1;

    }
    else {
      $scope.trip.vote_up--; 
      $scope.trip.voteState =0;
    }
    
    if($scope.trip.vote_up === 0 && $scope.trip.vote_down === 0) {
      $scope.trip.percent_vote_up = 0;
      $scope.trip.percent_vote_down = 0;
    }
    else {
      $scope.trip.percent_vote_up = 100*$scope.trip.vote_up /($scope.trip.vote_up+$scope.trip.vote_down);
      $scope.trip.percent_vote_down = 100*$scope.trip.vote_down/($scope.trip.vote_up+$scope.trip.vote_down); 
    }
    

    just_count+=1;

    console.log($scope.trip);
  }

  $scope.unlike = function(){
    console.log($scope.radioModel);
    // case like and default 
    if( $scope.radioModel !== "Unlike"){

      if($scope.trip.voteState===0){
        $scope.trip.vote_down++;
      }
      else if($scope.trip.voteState===1){
        $scope.trip.vote_up--;
        $scope.trip.vote_down++;        
      }  
      $scope.trip.voteState=-1;
   
    }
    // case unlike
    else {
      console.log("else");

      $scope.trip.vote_down--; 
      $scope.trip.voteState =0;
    }
    
    if($scope.trip.vote_up === 0 && $scope.trip.vote_down === 0) {
      $scope.trip.percent_vote_up = 0;
      $scope.trip.percent_vote_down = 0;
    }
    else {
      $scope.trip.percent_vote_up = 100*$scope.trip.vote_up /($scope.trip.vote_up+$scope.trip.vote_down);
      $scope.trip.percent_vote_down = 100*$scope.trip.vote_down/($scope.trip.vote_up+$scope.trip.vote_down); 
    }
    


    just_count+=1;

    console.log($scope.trip);
  }  


  function splitPlacesArray(places){
    console.log(places);

    var places_split = [];

    for( var i = 0 ; i < $scope.trip.days; i++ ) {

      places_split.push([]);
    }

    for( var i = 0 ; i < places.length ; i ++) {
      
      places_split[places[i].day-1].push(places[i]);
      
    }
    return places_split;
  }  

  
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
          if(status === 401){
            $window.location.reload();
          }
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
        url: timelineFactory.getOriginPath() + "bookmark?trip_id="+$scope.trip._id    
      })  
      .success(function(data, status, headers, config) {
        // console.log(data);
          // $scope.singleModel = 1;
          $scope.trip.isBookmarkedTrip = true;
          $scope.bookmarkstate = "bookmarked";
          timelineFactory.setBookmarkState(true);          
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
        url: timelineFactory.getOriginPath() + "unbookmark?trip_id="+$scope.trip._id        
      })
      .success(function(data, status, headers, config) {
          // $scope.singleModel = 0;
          $scope.trip.isBookmarkedTrip = false;
          timelineFactory.setBookmarkState(false);
          $scope.bookmarkstate = "bookmark";
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