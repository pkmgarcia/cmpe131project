angular.module('fileView')
.component('fileViewer', {
	template: 'view/fileView/fileView.template.html',
	controller: [
	'$http',
	'Auth',
	'Data',
		function fileViewerCtrl($http, Auth, Data) {

		}
	],
	controllerAs: 'vm'
});