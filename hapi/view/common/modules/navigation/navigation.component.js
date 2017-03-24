angular.
module('navigation').
component('navigation', {
	templateUrl: 'navigation/navigation.template.html',
	controller: [
		'$http',
		'SrouteParams',
		function navigationCtrl($http, $routeParams) {
			var self = this;

			$http.get($routeParams.route);
		}
	]
});

function navigationCtrl('$http', '$routeProvider') {

}
