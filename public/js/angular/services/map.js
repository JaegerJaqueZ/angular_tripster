//public/js/angular/services/bookmark.js

var mapService = angular.module('mapService', []);

mapService.factory('mapFactory', function($http) {

//=============================== Factory Attributes ===============================
	var	places 	= new Array()
		,avgLat = 0
		,avgLng = 0
		,sumLat = 0
		,sumLng = 0; 


//=============================== Factory Methods ===============================
	
	function getPlaces()
	{
		return places;
	};

	function setPlaces(newPlaces)
	{
		places = newPlaces;
	}

	function getAvgLat()
	{
		sumLat = 0; 
		for (var i = 0; i < places.length; i++) {
			sumLat += places[i].foursquare.location.lat;
		}		
		avgLat = sumLat/places.length;
		console.log(avgLat);		
		return avgLat;
	}	

	function getAvgLng()
	{

		sumLng = 0; 
		for (var i = 0; i < places.length; i++) {
			sumLng += places[i].foursquare.location.lng;
		}		
		avgLng = sumLng/places.length;
		console.log(avgLng);
		return avgLng;
	}	

//=============================== Factory Return ===============================
	return{
		getPlaces: getPlaces,
		setPlaces: setPlaces,
		getAvgLat: getAvgLat,
		getAvgLng: getAvgLng
	}

});