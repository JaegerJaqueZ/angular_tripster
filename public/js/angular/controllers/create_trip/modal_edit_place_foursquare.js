//public/js/angular/controllers/modal_edit_place_foursquare.js

var modalEditPlaceFoursquareControllers = angular.module('modalEditPlaceFoursquareControllers', []);

modalEditPlaceFoursquareControllers.controller('modalEditPlaceFoursquareCtrl', function ($scope, $http, createTripFactory) {

	//initialze search (can delete if want)
	$scope.input = {name:'paragon', province:'กรุงเทพมหานคร'};

	$scope.findPlace = function (){

		$http({method: 'GET', url: 'https://api.foursquare.com/v2/venues/explore?client_id=FSEL5ZQNNTPR4RHCVJMQ53541XJPZM4LIHBCNJVBVHRJTE4O&client_secret=KBIQX2U1X4LZ5GWRSAELWH2CFSTPBBNK4NBQZCGB2KQE1ENQ&v=20130619&query=' + $scope.input.name + '&near=' + $scope.input.province}).
		success(function(data, status, headers, config) {

			$scope.foursqplaces = data.response.groups[0].items;

		}).
		error(function(data, status, headers, config) {

			alert("error");

		});
	}	
	
	$scope.selectPlace = function (chosenplace){	

		var temp = createTripFactory.getChosenPlace();
		temp.foursquare = jQuery.extend(true, {}, createTripFactory.adjustPlaceObject(chosenplace).foursquare);	
		
		$scope.cancel();
	}



});