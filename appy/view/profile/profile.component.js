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
		vm.breadCrumbs = {
			lastUpdated: []
		};

		vm.onSubmit = function () {
			var folder = {
				"name" : vm.params.folderName,
				"parent" : ''
			};
			Auth.createFolder(folder).then(function(result){
				vm.params.folderName = '';
				$scope.folders = Auth.getFolders();
				$scope.files = Auth.getFiles();
			});
		};

		vm.changeFolderToRoot = function() {
			Auth.changeFolder($scope.rootFolder)
				.then(function(result) {
					vm.breadCrumbs.lastUpdated = [];

					Auth.updateFolders();
					Auth.updateFiles();
				});
		};

		vm.changeFolder = function(folderId, folderName, index) {
			Auth.changeFolder(folderId)
				.then(function(result) {
					if(index !== undefined) {
						vm.breadCrumbs.lastUpdated.splice(index, vm.breadCrumbs.lastUpdated.length);
					}

					vm.breadCrumbs.lastUpdated.push({
						name: folderName,
						_id: folderId,
						index: vm.breadCrumbs.lastUpdated.length
					});

					Auth.updateFolders();
					Auth.updateFiles();
				});
		};

		vm.deleteFolder = function (folderId) {
			Auth.deleteFolder(folderId)
			  .then(function(result) {
			  	Materialize.toast(result);
			  }, function(reason) {
			  	Materialize.toast(reason);
			  });
		}

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

					$http.delete('/folder/' + Auth.getCurrentFolder() + '/file/' + result.data.Deleted[0].Key, config)
						.then(function successCallback(result) {
							console.log("Successfully removed file from folder");
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
					/*
					// Original implementation without folders.
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
					*/
				}, function errorCallback(result) {
					console.log("Error deleting from S3");
					console.log(result);
				})
		}
    }
]);