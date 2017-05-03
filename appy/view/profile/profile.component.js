angular.module('profile')
.controller('profileCtrl', [
	'$http',
	'Auth',
	'$scope',
	function profileCtrl($http, Auth, $scope) {
		var vm = this;
		vm.firstName = Auth.getFirstName();
		vm.lastName = Auth.getLastName();
		$scope.model = Auth.getData();
		//$scope.currentFolder = Auth.getFolder();
		$scope.currentFolder = Auth.getCurrentFolder();
		$scope.folders = Auth.getFolders();


		vm.createFolder = function() {
			Auth.createFolder($scope.folderName);
		};

		vm.deleteFile = function(fileId) {
			var params = {
				"fileId": fileId
			}
			console.log(params);
			// Delete file from S3
			// $http.post("/deleteFromS3", params)
			// 	.then(function successCallback(result) {
					console.log("Successfully deleted from S3");

					id = params.fileId;
					var config = {
						headers: {
							Authorization: Auth.getToken()
						}
					}
					// Remove file from user.
					$http.delete('/user/' + Auth.getId() + '/file/' + id, config)
						.then(function successCallback(result) {
							console.log("Successfully removed file from user");
								var config = {
									data: [ {
										_id : id,
										hardDelete: true
									}],
									headers: {
										Authorization: Auth.getToken()
									}
								}
							// Delete file from database.
							$http.delete('/file', config)
								.then(function successCallback(result) {
									console.log("Successfully deleted file from database.");
								}, function errorCallback(result) {
									console.log("Error deleting file from database.");
									console.log(result);
								});
							Auth.updateTimer();
						}, function errorCallback(result) {
							console.log("Error removing file from user.");
						});
				}, function errorCallback(result) {
					console.log("Error deleting from S3");
					console.log(result);
				//})
		}
    }
]);
