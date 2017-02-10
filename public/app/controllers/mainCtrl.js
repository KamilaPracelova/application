angular.module('mainController', ['authServices'])

.controller('mainCtrl', function(Auth,$timeout ,$location, $rootScope, $window) {
	var app = this;

	app.loadme = false; // hide html unless it is true -> app.loadme = true; nevidno na bare ako sa nacitavaju veci

	// any time new route 
	$rootScope.$on('$routeChangeStart', function() {
		//if true that user is logged in
		if(Auth.isLoggedIn()) {
			app.isLoggedIn = true; // index.html <!--ng-show="!main.isLoggedIn" show if user is not logged in -->
			Auth.getUser().then(function(data){
				app.username = data.data.username;
				app.useremail = data.data.email;
				app.loadme = true;
			});
		} else {
			app.isLoggedIn = false;
			app.username = '';
			app.loadme = true;
		}
		// after login with facebook http://localhost:8080/#_=_ <- do not want
		if ($location.hash() == '_=_') $location.hash(null);
	});

	// login with facebook without opening new window
	this.facebook = function() {
		//console.log($window.location.host); localhost:8080
		//console.log($window.location.protocol); http:
		$window.location = $window.location.protocol+ '//' + $window.location.host + '/auth/facebook';
	};

		// login with twitter without opening new window
	this.twitter = function() {
		//console.log($window.location.host); localhost:8080
		//console.log($window.location.protocol); http:
		$window.location = $window.location.protocol+ '//' + $window.location.host + '/auth/twitter';
	};

	this.google = function() {
		//console.log($window.location.host); localhost:8080
		//console.log($window.location.protocol); http:
		$window.location = $window.location.protocol+ '//' + $window.location.host + '/auth/google';
	};

	this.doLogin = function(loginData) {
		app.loading = true;
		app.errorMsg = false;

		Auth.login(app.loginData).then(function(data) {
			if (data.data.success) {
				app.loading = false;
				// create success message
				app.successMsg = data.data.message; // successMsg inside the scope -> var app = this -> work outside the scope
				// redirect to home page
				$location.path('/about');
				app.loginData = '';
				app.successMsg = false;
			} else {
				// create an error message
				app.loading = false;
				app.errorMsg = data.data.message;
			}
		});
	};

	this.logout = function() {
		Auth.logout();
		$location.path('/logout');
		$timeout(function() {
			$location.path('/');
		}, 2000);
	};
});