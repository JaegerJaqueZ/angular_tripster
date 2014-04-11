var searchTripControllers = angular.module('searchTripControllers', []);

searchTripControllers.controller('searchTripCtrl', function ($scope, $http, searchTripFactory) {

  $scope.range = 9;
  $scope.from = 0;
  $scope.to = $scope.from + $scope.range;

  $scope.$watchCollection(

    function() {
      return searchTripFactory.getResultList();
    },
    
    function(newValue, oldValue) {
      if(newValue!==oldValue) {
        $scope.trips = newValue;
      }
    }
  );
	
  $scope.search = function () {

    //reset
    $scope.from = 0;
    $scope.to = $scope.from + $scope.range;

    $http({
      method:'GET', 
      url: searchTripFactory.getOriginPath() + "trips/search?key=" + $scope.key + "&from=" + $scope.from + "&to=" + $scope.to
    })
    .success(function(data, status, headers, config) {
        searchTripFactory.clearResultList();
        searchTripFactory.setResultList(data);
    })
    .error(function(data, status, headers, config) {
        alert("Failed to search trip(s), please Try Again");
    }); 

  };

  $scope.load = function () {

    $scope.from += $scope.range;
    $scope.to = $scope.from + $scope.range;

    $http({
      method:'GET', 
      url: searchTripFactory.getOriginPath() + "trips/search?key=" + $scope.key + "&from=" + $scope.from + "&to=" + $scope.to
    })
    .success(function(data, status, headers, config) {
        searchTripFactory.setResultList(data);     
    })
    .error(function(data, status, headers, config) {
        alert("Failed to search trip(s), please Try Again");
    }); 

  };


  $scope.oneAtATime = false;

  

  //==================================== Carousel ====================================//
  // $scope.myInterval = 5000;

  // var slides = $scope.slides = [];
  // $scope.addSlide = function() {
  //   var newWidth = 600 + slides.length;
  //   slides.push({
  //     image: '../img/place' + newWidth + '.jpg',
  //     text: ['เกาะเสม็ด','หาดA','หาดB','หาดC'][slides.length % 4]
  //   });
  // };
  // for (var i = 0; i < 4; i++) {
  //   $scope.addSlide();
  // }

});

function CarouselDemoCtrl($scope) {
  // $scope.myInterval = 5000;
  var slides = $scope.slides = [];
  $scope.addSlide = function() {
    var newWidth = 600 + slides.length;
    slides.push({
      image: '../img/place' + newWidth + '.jpg',
      text: ['เกาะเสม็ด','หาดA','หาดB','หาดC'][slides.length % 4]
    });
  };
  for (var i = 0; i < 4; i++) {
    $scope.addSlide();
  }
}

