var currentSlide = 0;

$(function(){
	$(document).keyup(function(e) {
		 if(e.keyCode == 39 || e.keyCode == 40 || e.keyCode == 32) next();
		 else if(e.keyCode == 37 || e.keyCode == 38) back();
		 else if(e.keyCode == 87) $('.slides').fadeToggle();
	});
	
	$('.slides').swipe({
		swipe:function(event, direction, distance, duration, fingerCount) {
			switch(direction) {
				case "left":
					next();
					break;
				case "right":
					back();
					break;	
			}
		}
	});
	
	$(document).dblclick(function(){
			window.fullScreenApi.requestFullScreen(document.body);
	});
	
	initSlides();
});

function initSlides(){
	$('section').eq(currentSlide).addClass('active');
}

function next(){
	goto(currentSlide+1);
}

function back(){
	goto(currentSlide-1);
}

function goto(n){
	if(n > -1 && n < $('section').length) currentSlide = n;
	else return;
	$('section').removeClass('active').eq(currentSlide).addClass('active');
}

/*
Source: http://johndyer.name/native-fullscreen-javascript-api-plus-jquery-plugin/
Native FullScreen JavaScript API
-------------
Assumes Mozilla naming conventions instead of W3C for now
*/

(function() {
	var 
		fullScreenApi = { 
			supportsFullScreen: false,
			isFullScreen: function() { return false; }, 
			requestFullScreen: function() {}, 
			cancelFullScreen: function() {},
			fullScreenEventName: '',
			prefix: ''
		},
		browserPrefixes = 'webkit moz o ms khtml'.split(' ');
	
	// check for native support
	if (typeof document.cancelFullScreen != 'undefined') {
		fullScreenApi.supportsFullScreen = true;
	} else {	 
		// check for fullscreen support by vendor prefix
		for (var i = 0, il = browserPrefixes.length; i < il; i++ ) {
			fullScreenApi.prefix = browserPrefixes[i];
			if (typeof document[fullScreenApi.prefix + 'CancelFullScreen' ] != 'undefined' ) {
				fullScreenApi.supportsFullScreen = true;
				break;
			}
		}
	}
	
	// update methods to do something useful
	if (fullScreenApi.supportsFullScreen) {
		fullScreenApi.fullScreenEventName = fullScreenApi.prefix + 'fullscreenchange';
		
		fullScreenApi.isFullScreen = function() {
			switch (this.prefix) {	
				case '':
					return document.fullScreen;
				case 'webkit':
					return document.webkitIsFullScreen;
				default:
					return document[this.prefix + 'FullScreen'];
			}
		}
		fullScreenApi.requestFullScreen = function(el) {
			return (this.prefix === '') ? el.requestFullScreen() : el[this.prefix + 'RequestFullScreen']();
		}
		fullScreenApi.cancelFullScreen = function(el) {
			return (this.prefix === '') ? document.cancelFullScreen() : document[this.prefix + 'CancelFullScreen']();
		}		
	}

	// jQuery plugin
	if (typeof jQuery != 'undefined') {
		jQuery.fn.requestFullScreen = function() {
	
			return this.each(function() {
				var el = jQuery(this);
				if (fullScreenApi.supportsFullScreen) {
					fullScreenApi.requestFullScreen(el);
				}
			});
		};
	}

	// export api
	window.fullScreenApi = fullScreenApi;	
})();
