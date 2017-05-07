angular.module('home')
.controller('homeCtrl',
	function homeCtrl() { 
		Waves.displayEffect();
		Materialize.showStaggeredList('#staggered-list');
	});
