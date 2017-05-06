angular.module('profile')
.controller('profileCtrl', [
	'$http',
	'Auth',
	'$scope',
	function profileCtrl($http, Auth, $scope) {
		var vm = this;

		Auth.getRootFolder()
			.then(function(result) {
				$scope.rootFolder = result;
			});

		vm.firstName = Auth.getFirstName();
		vm.lastName = Auth.getLastName();
		$scope.folders = Auth.getFolders();
		$scope.files = Auth.getFiles();

		vm.onSubmit = function () {
			var folder = {
				"name" : vm.params.folderName,
				// TODO: Remove parent, have Auth service add the parent (currentFolder)
				"parent" : ''
			};
			Auth.createFolder(folder).then(function(result){
				$scope.folders = Auth.getFolders();
				$scope.files = Auth.getFiles();
			});
		};

		vm.changeFolder = function(folderId) {
			Auth.changeFolder(folderId)
				.then(function(result) {
					Auth.updateFolders();
					Auth.updateFiles();
				});
		};

		vm.deleteFile = function(fileId) {
			var params = {
				"fileId": fileId
			}
			console.log(params);
			// Delete file from S3
			$http.post("/deleteFromS3", params)
				.then(function successCallback(result) {
					Materialize.toast("Successfully deleted file.");

					var key = result.data.Deleted[0].Key;
					var config = {
						headers: {
							Authorization: Auth.getToken()
						}
					}
					// Remove file from user.
					$http.delete('/user/' + Auth.getId() + '/file/' + result.data.Deleted[0].Key, config)
						.then(function successCallback(result) {
							console.log("Successfully removed file from user");
								var config = {
									data: [ {
										_id : key,
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
							console.log("UpdateTimer called in deleteFile");
							Auth.updateFiles();
						}, function errorCallback(result) {
							console.log("Error removing file from user.");
						});
				}, function errorCallback(result) {
					console.log("Error deleting from S3");
					console.log(result);
				})
		}
    }
]);