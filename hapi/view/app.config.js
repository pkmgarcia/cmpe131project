angular.
module('pokeHubApp', [
	'ng-route'
	]).
config([$routeProvider, 
	$locationProvider,
	configCtrl
	]);

function configCtrl ($routeProvider, $locationProvider) {
	$routeProvider
		.when('/', {
			templateUrl: 'home/home.view.html',
			controller: 'home/home.controller.js',
			controllerAs: 'vm'
		})
		.when('/register', {
			templateUrl: 'register/register.view.html',
			controller: 'register/register.controller.js',
			controllerAs: 'vm'
		})
		.when('/login', {
			templateUrl: 'login/login.view.html',
			controller: 'login.controller.js',
			controllerAs: 'vm'
		})
		.otherwise({
			redirectTo: '/'
		});

	// use the HTML5 History API
	$locationProvider.html5Mode(true);
}
