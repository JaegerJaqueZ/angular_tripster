//public/js/angular/services/bookmark.js

var bookmarkService = angular.module('bookmarkService', []);

bookmarkService.factory('bookmarkFactory', function($http) {

//=============================== Factory Attributes ===============================
	var   resultList 	= new Array()
		, chosenTrip  	= {}
		, bookmarkState;

//=============================== Factory Methods ===============================
	


	function getOriginPath() {
		return 'http://158.108.140.21:4000/api/';
	}

	function getResultList() {
		return resultList;
	}

	function setResultList(trips_server) {

		// TODO handle if trips_server = null

		var i;
		for(i = 0; i < trips_server.length; i++) {
			resultList.push(jQuery.extend({}, trips_server[i]));
		}
	}

	function clearResultList(){
		resultList = [];		
	}

	function getChosenTrip() {
		return chosenTrip;
	}

	function setChosenTrip(trip_server){
		chosenTrip = jQuery.extend({}, trip_server);
	}

	function getBookmarkState(){
		return bookmarkState;
	};

	function setBookmarkState(newBookmarkState){
		return bookmarkState = newBookmarkState ;
	};	

//=============================== Factory Return ===============================
	return{
		getOriginPath: getOriginPath,
		getResultList: getResultList,
		setResultList: setResultList,
		clearResultList: clearResultList,
		getChosenTrip: getChosenTrip,
		setChosenTrip: setChosenTrip,
		getBookmarkState: getBookmarkState,
		setBookmarkState: setBookmarkState
	}

});