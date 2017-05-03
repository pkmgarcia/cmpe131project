angular.module('home')
.controller('homeCtrl',
	function homeCtrl() { 
		Waves.displayEffect();
		$('.carousel.carousel-slider').carousel({fullWidth: true});
});
