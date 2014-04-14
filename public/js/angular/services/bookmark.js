//public/js/angular/services/bookmark.js

var bookmarkService = angular.module('bookmarkService', []);

bookmarkService.factory('bookmarkFactory', function($http) {

//=============================== Factory Attributes ===============================
	var   resultList 	= new Array()
		, chosenTrip  	= {}

//=============================== Mock up ===============================

	function getUserId(){
		return "5336d2ebf121c5e05456126e";
	}

 resultList = [
 	{
 		trip_id : 5310542222,
 		authorname : "Colonel Skipper",
 		authorphoto :"../img/Skipper_2.jpg",
 		title: "ทริปเที่ยวระยองฮิ",
 		content: "Trip Description - 1",
 		places: [
 			{
 				name: "warm up",
 				figure_cover: "../img/place600.jpg"
 			},
 			{
 				name: "นั่งเล่น",
 				figure_cover: "../img/place603.jpg"
 			}
 		]

 	}
 ];

 chosenTrip = {
 	  author_id: 1234,
      author:'Captian Skipper',
      authorPhoto:'../img/Skipper_2.jpg',
      tripName:'ทริปเที่ยวระยองฮิ',
      tripDesc:' ย่างเข้าปลายเดือนกรกฎาคม คลื่นลมในทะเลหลายแห่งของเมืองไทยมักจะมีมรสุม ยกเว้นโซนอ่าวไทยที่ท้องฟ้าใส น้ำทะเลสีครามสวย ถ้าอยากหาที่ชาร์จแบตพักผ่อน บรรยากาศริมทะเล แบบไม่ต้องลาพักร้อน สัก 2 วัน 1 คืน ก็กำลังดีใช่ไหมครับ',
      places:[
	      {
	        name:'เกาะเสม็ด',
	        placeDesc:'อิอิอิอิอิอิ',
	        beginTime:'8.00',
	        endTime: '10.00',
	        figures:[ 
	        	'../img/place600.jpg',
	        	'../img/place601.jpg'
	        ],
	        place_id: '4bd95a8ecc5b95216b4bf24f',
	        lat: 13.85518,
	        lng: 100.54209
	      },
	      {
	        name:'เกาะช้าง',
	        placeDesc:'ฮี่ฮี่ฮี่ฮี่',
	        beginTime:'11.00',
	        endTime: '13.00',
	        figures:[
	        	'../img/place602.jpg',
	        	'../img/place603.jpg'
	        ],
	        place_id: '4bd95a8ecc5b95216b4bf24f',
	        lat: 13.85518,
	        lng: 100.54209
	      }
      ]
 };


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

	function getChosenTrip() {
		return chosenTrip;
	}

	function setChosenTrip(trip_server){
		chosenTrip = jQuery.extend({}, trip_server);
	}

//=============================== Factory Return ===============================
	return{
		getUserId: getUserId,


		getOriginPath: getOriginPath,
		getResultList: getResultList,
		setResultList: setResultList,
		clearResultList: clearResultList,
		getChosenTrip: getChosenTrip,
		setChosenTrip: setChosenTrip
	}

});