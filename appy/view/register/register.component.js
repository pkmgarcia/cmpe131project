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
				// console.log('Submitting registration');

				var registerBody = vm.credentials;
				registerBody.role = 'User';
				registerBody = {
					user: registerBody,
					registerType: 'Register'
				};
				Auth
					.register(registerBody)
					.then(function(successCallback){
						console.log(successCallback);
						if(successCallback.status === 200) {
							$location.path('view/status/emailSent');
						} else {
							$location.path('view/status/errorOccured');	
						}
					}, function(errorCallback){
						console.log('Error occured while registering' + errorCallback);
					});
			};
		}
	]);
