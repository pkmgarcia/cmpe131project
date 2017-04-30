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

		vm.deleteFile = function(fileId) {
			Auth.deleteFile(fileId);
		};

		vm.onSubmit = function () {
			var folder = {
				"name" : vm.params.folderName,
				"parent" : '',
				"isRoot" : false
			};
			Auth.createFolder(folder, '/');
		};

		console.log("In profile, RootFolder is: " + Auth.getRootFolderId());

		// Populate with current folder's folders
		$scope.select = {
            value: "Move",
            choices: ["Folder", "Folder","Folder","Folder","Folder","Folder"]
        };
	}
]);