angular.module('pokeHubApp')
	.config([
		'$routeProvider',
		'$locationProvider',
		function ($routeProvider, $locationProvider) {
			$routeProvider
				.when('/view', {
					templateUrl: 'view/home/home.template.html',
					controller: 'homeCtrl',
					controllerAs: 'vm'
				})
				.when('/view/register', {
					templateUrl: 'view/register/register.template.html',
					controller: 'registerCtrl',
					controllerAs: 'vm'
				})
				.when('/view/emailSent', {
					templateUrl: 'view/emailSent/emailSent.template.html',
					controller: 'emailSentCtrl',
					controllerAs: 'vm'
				})
				.when('/view/login', {
					templateUrl: 'view/login/login.template.html',
					controller: 'loginCtrl',
					controllerAs: 'vm'
				})
				.when('/view/profile', {
					templateUrl: 'view/profile/profile.template.html',
					controller: 'profileCtrl',
					controllerAs: 'vm'
				})
				.otherwise({redirectTo: '/view'});

			// use the HTML5 History API
			$locationProvider.html5Mode(true);
		}
	]
);
