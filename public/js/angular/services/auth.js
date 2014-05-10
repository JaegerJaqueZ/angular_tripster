//public/js/angular/services/login.js

var authService = angular.module('authService', []);

authService.factory('authFactory', function($location, $rootScope, $cookieStore, $http) {
    
//============================ Factory Attributes ==============================
	
	$rootScope.currentUser = $cookieStore.get('user') || null;
    $cookieStore.remove('user');

//============================== Factory Methods ===============================

	function getOriginPath() {
		return 'http://158.108.228.106:4000';
	}

	function getCurrentUser() {

		// console.log("getCurrentUser");
		
		$http({
			method:'GET', 
			url: getOriginPath() + "/api/session"
		})
		.success(function(data, status, headers, config) {
			// console.log(data);
			$rootScope.currentUser = data;
		})
		.error(function(data, status, headers, config) {
			// console.log(data);
			alert("Failed to login, Please Try Again");
		}); 
		
	}

	function login(provider, user, callback) {
		var cb = callback || angular.noop;
		// Session.save({
		// 	provider: provider,
		// 	email: user.email,
		// 	password: user.password,
		// 	rememberMe: user.rememberMe
		// }, function(user) {
		// 	$rootScope.currentUser = user;
		// 	return cb();
		// }, function(err) {
		// 	return cb(err.data);
		// });
	}

	function logout(callback) {
		var cb = callback || angular.noop;
		// Session.delete(function(res) {
// 			$rootScope.currentUser = null;
// 			return cb();
// 		},
// 		function(err) {
// 			return cb(err.data);
// 		});
	}
	
	function signUp(userinfo, callback) {
		var cb = callback || angular.noop;
		// User.save(userinfo,
// 			function(user) {
// 				$rootScope.currentUser = user;
// 				return cb();
// 			},
// 			function(err) {
// 				return cb(err.data);
// 			});
	}
	
	

//=============================== Factory Return ===============================

    return {
		getOriginPath: getOriginPath,
		getCurrentUser: getCurrentUser,
  		login: login,
		logout: logout
    }
	
  });