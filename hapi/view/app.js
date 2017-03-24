angular.module('pokeHubApp', ['ngRoute']);

function config ($routeProvider, $locationProvider) {
	$routeProvider
		.when('/', {
			templateUrl: 'view/home/home.template.html',
			controller: 'homeCtrl',
			controllerAs: 'vm'
		})
		.when('/register', {
			templateUrl: 'view/register/register.template.html',
			controller: 'registerCtrl',
			controllerAs: 'vm'
		})
		.when('/login', {
			templateUrl: 'view/login/login.template.html',
			controller: 'loginCtrl',
			controllerAs: 'vm'
		})
		.otherwise({redirectTo: '/'});

	// use the HTML5 History API
	$locationProvider.html5Mode(true);
}

angular
	.module('pokeHubApp')
	.config(['$routeProvider', '$locationProvider', config])
	.run(['$rootScope', '$location', 'authentication', run]);