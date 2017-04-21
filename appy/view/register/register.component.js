angular.module('register')
	.controller('registerCtrl', [
		'$window',
		'$location',
		'Auth',
		function ($window, $location, Auth) {
			var vm = this;
			vm.credentials = {
				firstName : '',
				lastName : '',
				email : '',
				password : ''
			};

			vm.onSubmit = function () {
				console.log(vm.credentials);
				var params = {
				  "user": {
				    "firstName": vm.credentials.firstName,
				    "lastName": vm.credentials.lastName,
				    "email": vm.credentials.email,
				    "role": "SuperAdmin",
				    "password": vm.credentials.password
				  },
				  "registerType": "Register"
				}
				
				Auth
					.register(params)
					.then( function(response) {
						if(response.data['message'] === 'Success.') {
							$location.path('view/status/emailSent');
						} else {
							// TODO: Put what happens if a registration fails here
							// $location.path('view/status/errorOccured');
							console.log(response);
							if(response.status === 409) {
								$window.alert("Email already registered.");
							}
						}
					}
				);
			};
		}
	]);
