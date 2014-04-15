//public/js/angular/services/create_trip.js

var createTripService = angular.module('createTripService', []);

createTripService.factory('createTripFactory', function($http) {

//=============================== Factory Attributes ===============================
	var   trips 		 = new Array()
		, isEditingTrip  = false
		, isEditingPlace = false
		, chosenTrip	 = {}
		, chosenPlace	 = {}
		, dateBegin		 = new Date().getTime()
		, dateEnd		 = new Date().getTime()
		, timeBegin		 = new Date().getTime()
		, timeEnd		 = new Date().getTime();

	var	  DEFAULT_TRIP	 = 0
		, PRIVATE_TRIP 	 = 10
		, PUBLIC_TRIP	 = 20;

//=============================== Mock up ===============================

	function getUserId(){
		return "534bd5d550167c1f927ec0e9";
	}

//=============================== Factory Methods ===============================

	function getOriginPath() {
		return 'http://192.168.0.25:3000/';
	}

	function getTrips() {
		return trips;
	}

	function setTrips(trips_server) {

		// TODO handle if trips_server = null
		trips.length = 0;
		var i;
		for(i = 0; i < trips_server.length; i++) {
			trips.push(jQuery.extend({}, trips_server[i]));
		}
	}

	function updateTrips(){
		$http({
			method:'GET', 
			url: getOriginPath() + "user/trips?user_id=" + getUserId()
		})
		.success(function(data, status, headers, config) {
			setTrips(data);
		})
		.error(function(data, status, headers, config) {
			alert("Cannot load your trip(s), please Refresh");
		});
	}

	function getIsEditingTrip(){
		return isEditingTrip;
	}

	function setIsEditingTrip(isEditing){
		isEditingTrip = isEditing;
	}

	function getIsEditingPlace(){
		return isEditingPlace;
	}

	function setIsEditingPlace(isEditing){
		isEditingPlace = isEditing;
	}

	function getChosenTrip(){
		return chosenTrip;
	}

	function setChosenTrip(trip){
		chosenTrip = trip;
	}

	function getChosenPlace(){
		return chosenPlace;
	}

	function setChosenPlace(place){
		chosenPlace = place;
	}

	function getDateBegin(){
		return dateBegin;
	}

	function setDateBegin(date){
		dateBegin = date;
	}

	function getDateEnd(){
		return dateEnd;
	}

	function setDateEnd(date){
		dateEnd = date;
	}

	function getTimeBegin(){
		return timeBegin;
	}

	function setTimeBegin(time){
		timeBegin = time;
	}

	function getTimeEnd(){
		return timeEnd;
	}

	function setTimeEnd(time){
		timeEnd = time;
	}

	function adjustPlaceObject(selectedplace){
		return {
			"foursquare":{
				"name":selectedplace.venue.name,
				"id":selectedplace.venue.id,
				"location":{
					"lng":selectedplace.venue.location.lng,
					"lat":selectedplace.venue.location.lat
				},
				"rate":selectedplace.venue.rating
			}			
		};
	}


//=============================== Factory Return ===============================
	return{
		getUserId: getUserId,


		DEFAULT_TRIP: DEFAULT_TRIP,
		PRIVATE_TRIP: PRIVATE_TRIP,
		PUBLIC_TRIP: PUBLIC_TRIP,
		getOriginPath: getOriginPath,
		getTrips: getTrips,
		setTrips: setTrips,
		updateTrips: updateTrips,
		getIsEditingTrip: getIsEditingTrip,
		setIsEditingTrip: setIsEditingTrip,
		getIsEditingPlace: getIsEditingPlace,
		setIsEditingPlace: setIsEditingPlace,
		getChosenTrip: getChosenTrip,
		setChosenTrip: setChosenTrip,
		getChosenPlace: getChosenPlace,
		setChosenPlace: setChosenPlace,
		getDateBegin: getDateBegin,
		setDateBegin: setDateBegin,
		getDateEnd: getDateEnd,
		setDateEnd: setDateEnd,
		getTimeBegin: getTimeBegin,
		setTimeBegin: setTimeBegin,
		getTimeEnd: getTimeEnd,
		setTimeEnd: setTimeEnd,
		adjustPlaceObject: adjustPlaceObject
	}

});