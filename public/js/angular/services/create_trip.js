//public/js/angular/services/create_trip.js

var createTripService = angular.module('createTripService', []);

createTripService.factory('createTripFactory', function($http) {

//=============================== Factory Attributes ===============================
	var   trips 		 = new Array()	
		, totalDays		 = 1
		, isEditingTrip  = false
		, isEditingPlace = false
		, chosenTrip	 = {}
		, backUpTrip	 = {}
		, chosenPlace	 = {}
		, chosenDay		 = 0
		, dateBegin		 = new Date().getTime()
		, dateEnd		 = new Date().getTime()
		, timeBegin		 = new Date().getTime()
		, timeEnd		 = new Date().getTime()
		, deleteRequest	 = {
			"figures":[],
			"places":[]
		}
		, addedFigureArr = new Array();

	var	  DEFAULT_TRIP	 = 0
		, PRIVATE_TRIP 	 = 10
		, PUBLIC_TRIP	 = 20
		, FIGURES_LIMIT	 = 3;

//=============================== Mock up ===============================

	

//=============================== Factory Methods ===============================

	function getOriginPath() {
		return 'http://158.108.228.106:4000/api/';
	}

	function getTrips() {
		return trips;
	}

	function setTrips(trips_server) {

		// TODO handle if trips_server = null
		trips.length = 0;
		var i;
		for(i = 0; i < trips_server.length; i++) {
			trips.push(jQuery.extend(true, {}, trips_server[i]));
		}
	}

	function updateTrips(){
		$http({
			method:'GET', 
			url: getOriginPath() + "user/trips"
		})
		.success(function(data, status, headers, config) {
			setTrips(data);
		})
		.error(function(data, status, headers, config) {
			alert("Cannot load your trip(s), please Refresh");
		});
	}
	
	function getTotalDays(){
		return totalDays;
	}

	function setTotalDays(days){
		totalDays = days;
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

	function getBackUpTrip(){
		return backUpTrip;
	}

	function setBackUpTrip(trip){
		backUpTrip = jQuery.extend(true, {}, trip);
	}

	function getChosenPlace(){
		return chosenPlace;
	}

	function setChosenPlace(place){
		chosenPlace = jQuery.extend(true, {}, place);
	}

	function getChosenDay(){
		return chosenDay;
	}

	function setChosenDay(day_index){
		chosenDay = day_index;
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
					"lat":selectedplace.venue.location.lat,
					"address":selectedplace.venue.location.address,
					// district
					"city":selectedplace.venue.location.city,
					"country":selectedplace.venue.location.country,
					"postalCode":selectedplace.venue.location.postalCode,
					// province
					"state":selectedplace.venue.location.state,
					// country code
					"cc":selectedplace.venue.location.cc
				},
				"rate":selectedplace.venue.rating,
				"categories":selectedplace.venue.categories
			}			
		};
	}

	function getDeleteRequest(){
		return deleteRequest;
	}

	function pushDeletedRequestPlace(place_id){
		var dup = false;
		for(var id in deleteRequest.places){
			if(place_id === id){
				dup = true;
				break;
			}
		}

		if(!dup){
			deleteRequest.places.push(place_id);
		}
	}

	function pushDeletedRequestFigure(figure_id){
		var dup = false;
		for(var id in deleteRequest.figures){
			if(figure_id === id){
				dup = true;
				break;
			}
		}

		if(!dup){
			deleteRequest.figures.push(figure_id);
		}		
	}

	function clearDeleteRequest(){
		deleteRequest = {
			"figures":[],
			"places":[]
		};
	}

	function getAddedFigureArr(){
		return addedFigureArr;
	}

	function pushAddedFigure(figure_id){
		
		addedFigureArr.push(figure_id);
				
	}

	function clearAddedFigureArr(){
		
		addedFigureArr = [];
				
	}

//=============================== Factory Return ===============================
	return{
		DEFAULT_TRIP: DEFAULT_TRIP,
		PRIVATE_TRIP: PRIVATE_TRIP,
		PUBLIC_TRIP: PUBLIC_TRIP,
		FIGURES_LIMIT: FIGURES_LIMIT,
		getOriginPath: getOriginPath,
		getTrips: getTrips,
		setTrips: setTrips,
		updateTrips: updateTrips,
		getTotalDays: getTotalDays,
		setTotalDays: setTotalDays,
		getIsEditingTrip: getIsEditingTrip,
		setIsEditingTrip: setIsEditingTrip,
		getIsEditingPlace: getIsEditingPlace,
		setIsEditingPlace: setIsEditingPlace,
		getChosenTrip: getChosenTrip,
		setChosenTrip: setChosenTrip,
		getBackUpTrip: getBackUpTrip,
		setBackUpTrip: setBackUpTrip,
		getChosenPlace: getChosenPlace,
		setChosenPlace: setChosenPlace,
		getChosenDay: getChosenDay,
		setChosenDay: setChosenDay,
		getDateBegin: getDateBegin,
		setDateBegin: setDateBegin,
		getDateEnd: getDateEnd,
		setDateEnd: setDateEnd,
		getTimeBegin: getTimeBegin,
		setTimeBegin: setTimeBegin,
		getTimeEnd: getTimeEnd,
		setTimeEnd: setTimeEnd,
		adjustPlaceObject: adjustPlaceObject,
		getDeleteRequest: getDeleteRequest,
		pushDeletedRequestPlace: pushDeletedRequestPlace,
		pushDeletedRequestFigure: pushDeletedRequestFigure,
		clearDeleteRequest: clearDeleteRequest,
		pushAddedFigure: pushAddedFigure,
		clearAddedFigureArr: clearAddedFigureArr,
		getAddedFigureArr: getAddedFigureArr
	}

});