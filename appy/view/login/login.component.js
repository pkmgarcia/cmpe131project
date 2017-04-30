angular.module('login')
.controller('loginCtrl',[
	'$window',
	'$location',
	'Auth',
	function($window, $location, Auth) {
		var vm = this;

		vm.credentials = {
			email : "",
			password : ""
		};

		vm.onSubmit = function () {
			Auth.login(vm.credentials)
				.then(function(response){
					console.log(response);
					if(response.status === 400){
						$window.alert(response.data.message);
					}
					if(response.data['refreshToken']){
						Auth.updateTimer();
						if(Auth.getRootFolderId() === "undefined") {
							Auth.createRootFolder();
						}
						$location.path('view/profile');
					}
				});
		};
	}]);