angular.module('core.fileViewer')
.component('fileViewer', {
	templateUrl: 'view/core/fileViewer/fileViewer.template.html',
	controller: function fileViewerCtrl() {
			var vm = this;
/*
			vm.upload = function (files) {
				if(files && files.length; i++) {

					for (var i = 0; i < files.length; i++) {
						var file = files[i];
						if (!file.$error) {
							Upload.upload({
								url: '/upload',
								data: {
									htmlInputName: file.name,
									file: file
								}
							}).then(function (resp) {
								$timeout(function() {
									$scope.log = 'file: ' +
										resp.config.data.file.name +
										', Response: ' + JSON.stringify(resp.data) +
										'\n' + $scope.log;
								});
							}, null, function (evt) {
								var progressPercentage = parseInt(100.0 *
									evt.loaded / evt.total);
								$scope.log = 'progress: ' + progressPercentage + 
									'% ' + evt.config.data.file.name + '\n' + 
									$scope.log;
							});
						}
					}
				}
			}
*/
		},
	controllerAs: 'vm'
});