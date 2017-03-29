angular.module('login')
.controller('loginCtrl',[
	'$location',
	'Auth',
	function($location, Auth) {
		var vm = this;

		vm.credentials = {
			email : "",
			password : ""
		};

		vm.onSubmit = function () {
			Auth
				.login(vm.credentials)
				.then(function(){
					$location.path('/profile');
				});
		};
	}]);