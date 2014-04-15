
var timePickerCtrl = function ($scope, createTripFactory) {

	var timeBeginTemp = createTripFactory.getChosenPlace().time_arrive || new Date(0, 0, 0, 0, 0, 0).getTime();
	$scope.timeBegin  = new Date(timeBeginTemp);   
	createTripFactory.setTimeBegin(timeBeginTemp); 
	
	var timeEndTemp = createTripFactory.getChosenPlace().time_leave || new Date(0, 0, 0, 0, 0, 0).getTime();
	$scope.timeEnd  = new Date(timeEndTemp);   
	createTripFactory.setTimeEnd(timeEndTemp); 

	$scope.beginTimeChanged = function () {
		createTripFactory.setTimeBegin($scope.timeBegin.getTime());
	};

	$scope.endTimeChanged = function () {
		createTripFactory.setTimeEnd($scope.timeEnd.getTime());
	};

	//AM PM
	$scope.beginTimeIsMeridian = true;
	$scope.toggleMode = function() {
		$scope.beginTimeIsMeridian = ! $scope.beginTimeIsMeridian;
	};
	$scope.endTimeIsMeridian = true;
	$scope.toggleMode = function() {
		$scope.endTimeIsMeridian = ! $scope.endTimeIsMeridian;
	};

	//set hour and minute step for each click
	$scope.hstep = 1;
	$scope.mstep = 15;
};
