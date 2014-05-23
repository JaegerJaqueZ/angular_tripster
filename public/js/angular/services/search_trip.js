//public/js/angular/services/search_trip.js

var searchTripService = angular.module('searchTripService', []);

searchTripService.factory('searchTripFactory', function($http) {

//=============================== Factory Attributes ===============================
	var   resultList 	= new Array()
		, chosenTrip  	= {};

//=============================== Factory Methods ===============================

	function getOriginPath() {
		return 'http://158.108.140.21:4000/api/';
	}

	function getResultList() {
		return resultList;
	}

	function setResultList(trips_server) {

		// TODO handle if trips_server = null
		for(var i = 0; i < trips_server.length; i++) {
			resultList.push(jQuery.extend(true, {}, trips_server[i]));
		}
	}

	function clearResultList(){
		resultList = [];		
	}

	function getChosenTrip() {
		return chosenTrip;
	}

	function setChosenTrip(trip_server){
		chosenTrip = jQuery.extend(true, {}, trip_server);
	}

//=============================== Factory Return ===============================
	return{
		getOriginPath: getOriginPath,
		getResultList: getResultList,
		setResultList: setResultList,
		clearResultList: clearResultList,
		getChosenTrip: getChosenTrip,
		setChosenTrip: setChosenTrip
	}

});