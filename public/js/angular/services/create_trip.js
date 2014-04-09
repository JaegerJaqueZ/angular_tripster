//public/js/angular/services/create_trip.js

var createTripService = angular.module('createTripService', []);

createTripService.factory('createTripFactory', function() {

//=============================== Factory Attributes ===============================
	var   trips = []
		, isEditingTrip  = false
		, isEditingPlace = false
		, chosenTrip	 = {}
		, chosenPlace	 = {};


//=============================== Factory Methods ===============================

	function getOriginPath() {
		return 'http://158.108.229.243:3000/';
	}

	function getTrips() {
		return trips;
	}

	function setTrips(trips_server) {

		// TODO handle if trips_server = null

		var i;
		for(i = 0; i < trips_server.length; i++) {
			trips.push(jQuery.extend({}, trips_server[i]));
		}
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

//=============================== Factory Return ===============================
	return{
		getOriginPath: getOriginPath,
		getTrips: getTrips,
		setTrips: setTrips,
		getIsEditingTrip: getIsEditingTrip,
		setIsEditingTrip: setIsEditingTrip,
		getIsEditingPlace: getIsEditingPlace,
		setIsEditingPlace: setIsEditingPlace,
		getChosenTrip: getChosenTrip,
		setChosenTrip: setChosenTrip,
		getChosenPlace: getChosenPlace,
		setChosenPlace: setChosenPlace
	}

});