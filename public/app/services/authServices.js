angular.module('authServices', [])

.factory('Auth', function($http, AuthToken) {
	var authFactory = {};

	//Auth.create(regData)
	authFactory.login = function(loginData) {
			return $http.post('/api/authenticate', loginData).then(function(data){
				AuthToken.setToken(data.data.token);
				return data;
			});
	};

	// function tell us if the user is logged in
	//Auth.isLoggedIn();
	authFactory.isLoggedIn = function() {
		if (AuthToken.getToken()) {
			return true;
		}	else {
			return false;
		}
	};

	// Auth.facebook(token)
	// hide token acter login with fb
	authFactory.facebook = function(token) {
		AuthToken.setToken(token);
	};

	// Auth.getUser();
	authFactory.getUser = function() {
		if(AuthToken.getToken()) {
			return $http.post('/api/me');
		} else {
			$q.reject({ message: 'User has no token'});
		}
	};

	//Auth.logout()
	authFactory.logout = function() {
		AuthToken.setToken();
	};

	return authFactory;
})

// save token in the browser
.factory('AuthToken', function($window){
	var authTokenFactory = {};

	//AuthToken.setToken(token);
	authTokenFactory.setToken = function(token) {
		if (token) {
			$window.localStorage.setItem('token', token);
		} else {
			$window.localStorage.removeItem('token');
		}
	};

	// AuthToken.getToken();
	authTokenFactory.getToken = function(){
		return $window.localStorage.getItem('token');
	};

	return authTokenFactory;
})

// attach token to every request
.factory('AuthInterceptors', function(AuthToken) {
	var authInterceptorsFactory = {};

	authInterceptorsFactory.request = function(config) {

		var token = AuthToken.getToken();

		if (token) config.headers['x-access-token'] = token; // asign token to the header

		return config;
	};

	return authInterceptorsFactory;
});




