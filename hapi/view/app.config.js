angular.module('pokeHubApp')
	.config([
		'$routeProvider',
		'$locationProvider',
		function ($routeProvider, $locationProvider) {
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
				.when('/profile', {
					templateUrl: 'view/profile/profile.template.html',
					controller: 'profileCtrl',
					controllerAs: 'vm'
				})
				.otherwise({redirectTo: '/'});

			// use the HTML5 History API
			$locationProvider.html5Mode(true);
		}
	])
	.run(['$rootScope', '$location', 'Auth', function ($rootScope, $location, Auth) {
		$rootScope.$on('$routeChangeStart', function(event, nextRoute, currentRoute) {
			if ($location.path() === '/profile' && !Auth.isLoggedIn()) {
				$location.path('/');
			}
		});
	}]);
