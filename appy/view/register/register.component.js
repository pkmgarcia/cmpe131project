angular.module('register')
	.controller('registerCtrl', [
		'$location',
		'Auth',
		function ($location, Auth) {
			var vm = this;
			vm.credentials = {
				firstName : '',
				lastName : '',
				email : '',
				password : ''
			};

			vm.onSubmit = function () {
				console.log('Submitting registration');

				var registerBody = vm.credentials;
				registerBody.role = 'User';
				registerBody = {
					user: registerBody,
					registerType: 'Register'
				};
				Auth
					.register(registerBody)
					.then(function(successCallback){
						$location.path('view/emailSent');
					}, function(errorCallback){
						console.log('Error occured while registering' + errorCallback);
					});
			};
		}
	]);
