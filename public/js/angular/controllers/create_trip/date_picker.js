
var datePickerBeginCtrl = function ($scope, createTripFactory) {
	
	var dateBeginTemp = createTripFactory.getChosenTrip().date_begin || new Date().getTime();
	$scope.dateBegin  = new Date(dateBeginTemp);   
	createTripFactory.setDateBegin(dateBeginTemp); 

	$scope.format = 'dd-MMMM-yyyy';

	$scope.open = function($event) {
		$event.preventDefault();
		$event.stopPropagation();
		$scope.opened = true;
	};

	$scope.dateOptions = {
		'year-format': "'yy'",
		'starting-day': 1
	};

	$scope.changed = function(){
		createTripFactory.setDateBegin($scope.dateBegin.getTime());			
	}

};

// var datePickerEndCtrl = function ($scope, createTripFactory) {
		
// 	var dateEndTemp = createTripFactory.getChosenTrip().date_end || new Date().getTime();
// 	$scope.dateEnd  = new Date(dateEndTemp);   
// 	createTripFactory.setDateEnd(dateEndTemp); 

// 	$scope.format = 'dd-MMMM-yyyy';

// 	$scope.open = function($event) {
// 		$event.preventDefault();
// 		$event.stopPropagation();
// 		$scope.opened = true;
// 	};

// 	$scope.dateOptions = {
// 		'year-format': "'yy'",
// 		'starting-day': 1
// 	};

// 	$scope.changed = function(){
// 		createTripFactory.setDateEnd($scope.dateEnd.getTime());			
// 	}
// };