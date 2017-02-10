//creating angular module
var app 	 = angular.module('appRoutes',['ngRoute']) //'name of the module', [dependencies that we use (routes, cookies, animations...)]

.config(function($routeProvider, $locationProvider){

	$routeProvider

	.when('/', {
		templateUrl: 'app/views/pages/home.html'
	})

	.when('/about', {
		templateUrl: 'app/views/pages/about.html'
	})

	.when('/register', {
		templateUrl: 'app/views/pages/users/register.html',
		controller: 'regCtrl',
		controllerAs: 'register',
		authenticated: false // page will show only if user is not authenticated
	})

	.when('/login', {
		templateUrl: 'app/views/pages/users/login.html',
		authenticated: false
	})

	.when('/logout', {
		templateUrl: 'app/views/pages/users/logout.html',
		authenticated: true
	})

	.when('/profile', {
		templateUrl: 'app/views/pages/users/profile.html',
		authenticated: true
	})

	.when('/facebook/:token', {
		templateUrl: 'app/views/pages/users/social/social.html',
		controller: 'facebookCtrl',
		controllerAs: 'facebook',
		authenticated: false
	})

	.when('/twitter/:token', {
		templateUrl: 'app/views/pages/users/social/social.html',
		controller: 'twitterCtrl',
		controllerAs: 'twitter',
		authenticated: false
	})

	.when('/google/:token', {
		templateUrl: 'app/views/pages/users/social/social.html',
		controller: 'googleCtrl',
		controllerAs: 'google',
		authenticated: false
	})

	.when('/facebookerror', {
		templateUrl: 'app/views/pages/users/login.html',
		controller: 'facebookCtrl',
		controllerAs: 'facebook',
		authenticated: false
	})

	.when('/twittererror', {
		templateUrl: 'app/views/pages/users/login.html',
		controller: 'twitterCtrl',
		controllerAs: 'twitter',
		authenticated: false
	})

	.when('/googleerror', {
		templateUrl: 'app/views/pages/users/login.html',
		controller: 'googleCtrl',
		controllerAs: 'google',
		authenticated: false
	})

	.otherwise({ redirectTo: '/'} );

	// use application without #
	$locationProvider.html5Mode({
	 enabled: true,
	 requireBase: false
	});
});

// prevent user who is not logged in going to pages where he need to be logged
// prevent user from accesing pages without autherized view
app.run(['$rootScope', 'Auth', '$location',  function($rootScope, Auth, $location) {
	$rootScope.$on('$routeChangeStart', function(event, next, current) {
		
		if (next.$$route.authenticated == true) { // if authentication required
			if(!Auth.isLoggedIn()) { // if user is not logged in
				event.preventDefault(); // it prevent showing him e.g. profile page
				$location.path('/'); // redirect user no home page
			}

		} else if (next.$$route.authenticated == false) { // if authentication is not required
			if(Auth.isLoggedIn()) { // if user is logged in
				event.preventDefault();
				$location.path('/');
			}
		}
	});
}]);