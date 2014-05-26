//public/js/angular/controllers/login.js

var loginControllers = angular.module('loginControllers', []);

loginControllers.controller('loginCtrl', function ($scope, $http, authFactory) {

	$("#menuButton").hide();
	$("#loading").hide();
	// document.body.style.backgroundImage="url('img/tripster2.jpg')";

	// var elem = document.getElementById('content');
 //    elem.style.backgroundImage = "url('img/tripster2.jpg')";
 //    elem.style.height          = 'auto';
 //    elem.style.width           = 'auto';
 //    elem.style.position        = 'absolute',

	var bg = "img/tripster5.png";

	var bgimg = new Image();
	bgimg.className  = "img-responsive";
	bgimg.onload = function() {
	    var elem = document.getElementById('content');
	    elem.style.backgroundImage = 'url(' + bg + ')';
	    elem.style.height          = 'auto';
	    elem.style.maxWidth        = '100%';
	    // elem.style.position        = 'absolute';
	    // elem.style.top             = '20px';
	    // elem.style.left            = '20px';
	};
	bgimg.src = bg;

	// document.getElementById("content").style.backgroundImage="url('img/tripster2.jpg')";
	snapper.close();

});