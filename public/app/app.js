//creating angular module
angular.module('userApp',['appRoutes', 'userControllers', 'userServices', 'ngAnimate', 'mainController', 'authServices']) //'name of the module', [dependencies that we use (routes, cookies, animations...)]

.config(function($httpProvider){
	$httpProvider.interceptors.push('AuthInterceptors');
});