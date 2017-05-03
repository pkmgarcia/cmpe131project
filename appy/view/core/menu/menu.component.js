angular.module('core.menu')
.component('menuBar', {
	templateUrl: 'view/core/menu/menu.template.html',
	controller: [
		'$window',
		'$location',
		'Auth',
		function menuBarCtrl($window, $location, Auth) {
			var vm = this;
			vm.firstName = Auth.getFirstName();
			vm.lastName = Auth.getLastName();
			vm.onClick = function() {
				if($window.localStorage['token'] !== undefined){
					Auth.logout();
					$location.path('/view');
				}
			}

	        $(".button-collapse").sideNav({
    	    	edge: 'right', // Choose the horizontal origin
	        });
	        Waves.displayEffect();
	        $('.dropdown-button').dropdown();
			$('.collapsible').collapsible();
		}
	],
	controllerAs: 'vm'
});