angular.module('register')
	.controller('registerCtrl', [
		'$location',
		'Auth',
		function ($location, Auth) {
			var vm = this;
			vm.credentials = {
				firstName : "",
				lastName : "",
				email : "",
				password : ""
			};

			vm.onSubmit = function () {
				console.log('Submitting registration');
				Auth
					.register(vm.credentials)
					.error(function(error){
						alert(error);
					})
					.then(function(){
						//$location.path('/confirmEmail');
					});
			};
		}
	]);
