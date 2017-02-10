// CONTROLLER FOR ALL SOCIAL MEDIA

angular.module('userControllers', ['userServices'])

.controller('regCtrl', function($http, $location, User) {

	var app = this;

	this.regUser = function(regData, valid) { // valid - not execute database until it is valid
		app.loading = true;
		app.errorMsg = false;

	// validation of register form 
	//valid - not execute database until it is valid
		if (valid) { // if valid is true
			User.create(app.regData).then(function(data){
				if (data.data.success) {
					app.loading = false;
					// create success message
					app.successMsg = data.data.message; // successMsg inside the scope -> var app = this -> work outside the scope
					// redirect to home page
					$location.path('/');
				} else {
					// create an error message
					app.loading = false;
					app.errorMsg = data.data.message;
			}
		});
		} else {
		    // create an error message
			app.loading = false;
			app.errorMsg = 'Please ensure form is filled properly';			
		}

	};

	//User.checkUsername(regData)
	this.checkUsername = function(regData) {
		app.checkingUserName = true;
		app.usernameMsg = false; // clear msg any time is function accessed 
		app.usernameInvalid = false;

		User.checkUsername(app.regData).then(function(data){
			if (data.data.success) {
				app.checkingUserName = false;
				app.usernameInvalid = false;
				app.usernameMsg = data.data.message;
			} else {
				app.checkingUserName = false;
				app.usernameInvalid = true;
				app.usernameMsg = data.data.message;
			}
		});
	}

	//User.checkEmail(regData)
	this.checkEmail = function(regData) {
		app.checkingEmail = true;
		app.emailMsg = false; // clear msg any time is function accessed 
		app.emailInvalid = false;

		User.checkEmail(app.regData).then(function(data){
			if (data.data.success) {
				app.checkingEmail = false;
				app.emailInvalid = false;
				app.emailMsg = data.data.message;
			} else {
				app.checkingEmail = false;
				app.emailInvalid = true;
				app.emailMsg = data.data.message;
			}
		});
	}
})

// confirmation of password
.directive('match', function() {
  return {
    restrict: 'A', //'A' - only matches attribute name
    controller: function($scope){ // $scope to access frontend // data binding in

    	$scope.confirmed = false;

    	$scope.doConfirm = function(values) {
    		values.forEach(function(ele) {

    			if ($scope.confirm == ele) {
    				$scope.confirmed = true;
    			} else {
					$scope.confirmed = false;
    			}
    		});
    	}
    },

    link: function(scope, element, attrs) {

    	attrs.$observe('match', function() {
    		scope.matches = JSON.parse(attrs.match);
    		scope.doConfirm(scope.matches);
    	});     

    	scope.$watch('confirm', function() {
    		scope.matches = JSON.parse(attrs.match);
    		scope.doConfirm(scope.matches);
    	});

  }
};
})

.controller('facebookCtrl', function($window, $routeParams, Auth, $location) {
	
	var app = this;

	if ($window.location.pathname == '/facebookerror') {
		app.errorMsg = 'Facebook e-mail not found in database.';
	} else {
		Auth.facebook($routeParams.token); // return url of object
		$location.path('/');
	}
})

.controller('twitterCtrl', function($window, $routeParams, Auth, $location) {
	
	var app = this;

	if ($window.location.pathname == '/twittererror') {
		app.errorMsg = 'Twitter e-mail not found in database.';
	} else {
		Auth.facebook($routeParams.token); // return url of object // should be facebook... dkw
		$location.path('/');
	}
})

.controller('googleCtrl', function($window, $routeParams, Auth, $location) {
	
	var app = this;

	if ($window.location.pathname == '/googleerror') {
		app.errorMsg = 'Google e-mail not found in database.';
	} else {
		Auth.facebook($routeParams.token); // return url of object // should be facebook... dkw
		$location.path('/');
	}
});