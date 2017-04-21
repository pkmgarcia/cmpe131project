angular.module('core.fileViewer')
.component('fileViewer', {
	templateUrl: 'view/core/fileViewer/fileViewer.template.html',
	controller: [
		'$scope',
		'$timeout',
		'Auth',
		'Upload',
		'UploadFile',
		function fileViewerCtrl($scope, $timeout, Auth, Upload, UploadFile) {
			var vm = this;
			$scope.$watch('files', function (files) {
				if(files && files.length) {
					for (var i = 0; i < files.length; i++) {
						var file = files[i];
						if (!file.$error) {
							Auth.createFile(file).then(function(result) {
								UploadFile.uploadToS3(file, result);
							});
							console.log(file);
						}
					}
				}
			});
		}],

	controllerAs: 'vm'
});