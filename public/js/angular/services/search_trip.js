//public/js/angular/services/search_trip.js

var searchTripService = angular.module('searchTripService', []);

searchTripService.factory('searchTripFactory', function($http) {

//=============================== Factory Attributes ===============================
	var   resultList 		 = new Array()
		, chosenTrip  	 = {}

//=============================== Mock up ===============================

	function getUserId(){
		return "5336d2ebf121c5e05456126e";
	}

	// resultList = [
 //    {
 //      name : "Colonel Skipper",
 //      title: "ทริปเที่ยวระยองฮิ",
 //      content: "Trip Description - 1",
 //      photo :"../img/Skipper_2.jpg"
 //    }
 //    ,{
 //      name : "Captain America",
 //      title: "ทริปเที่ยวเชียงใหม่",
 //      content: "Trip Description - 2"
 //    }
 //  ];


//=============================== Factory Methods ===============================

	function getOriginPath() {
		return 'http://158.108.229.243:3000/';
	}

	function getResultList() {
		return resultList;
	}

	function setResultList(trips_server) {

		// TODO handle if trips_server = null

		var i;
		for(i = 0; i < trips_server.length; i++) {
			trips.push(jQuery.extend({}, trips_server[i]));
		}
	}

	function clearResultList(){
		resultList = [];		
	}


//=============================== Factory Return ===============================
	return{
		getUserId: getUserId,


		getOriginPath: getOriginPath,
		getResultList: getResultList,
		setResultList: setResultList,
		clearResultList: clearResultList
	}

});