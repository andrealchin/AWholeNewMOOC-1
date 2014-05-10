$(document).ready(function(){
	//INITIALIZE
	var video = $('#myVideo');
	$('#playing').hide();
	$('#playingNow').show();
	
	
	//remove default control when JS loaded
	video[0].removeAttribute("controls");
	 
	 
	
	//display video buffering bar
	var startBuffer = function() {
		var currentBuffer = video[0].buffered.end(0);
		var maxduration = video[0].duration;
		var perc = 100 * currentBuffer / maxduration;
		$('.bufferBar').css('width',perc+'%');
			
		if(currentBuffer < maxduration) {
			setTimeout(startBuffer, 500);
		}
	};	
	
	//display current video play time
	video.on('timeupdate', function() {
		var currentPos = video[0].currentTime;
		var maxduration = video[0].duration;
		var perc = 100 * currentPos / maxduration;
		$('.timeBar').css('width',perc+'%');	
	});

	//CONTROLS EVENTS
	//video screen and play button clicked
	video.on('click', function() { playpause(); } );
	$('.btnPlay').on('click', function() { playpause(); } );
	
	
	var playpause = function() {
		//automatic reset playbackrate
		video[0].playbackRate = 1;
	 $('.forward').hide();	
	 $('.pausedimg').show().removeAttr('id');
		if(video[0].paused || video[0].ended || !$('.btnPlay').hasClass('paused')) {
			  $('#playingNow').hide();	
				$('#playing').show();
				$('.btnPlay').addClass('paused');
				video[0].play();
		   		$('.pausedimg').attr('id','playing');
		   		
			
		}
		else {
			$('.btnPlay').removeClass('paused');
			video[0].pause();
			 
			$('#playing').removeAttr('id').addClass('pausedimg').show();
			
		}
	};
	
	
 
		//fullscreen button clicked
	$('.fullscreen').on('click', function() {
		if($.isFunction(video[0].webkitEnterFullscreen)) {
			video[0].webkitEnterFullscreen();
		}	
		else if ($.isFunction(video[0].mozRequestFullScreen)) {
			video[0].mozRequestFullScreen();
		}
		else {
			alert('Your browsers doesn\'t support fullscreen');
		}
	});
	
	
	//fast forward button clicked
	//unfortunately Firefox doesn't support video playbackrate yet!
	//and Chrome doesn't support negative value for playbackrate yet!
	//currently only works in Safari
	$('.btnBck').on('click', function() { 
	
	//$('#playing').addClass('backward');
	video[0].playbackRate = -2;
		video[0].play();
		
		$('.btnPlay').addClass('paused').removeClass('pausedimg');
	    $('#playingNow').hide();
	    $('.pausedimg').attr('id','backward');
	     $('#backward').show();
	     $('.forward').hide();
	     $('#backward').show();
	});
	
	$('.btnFwd').on('click', function() { fastfowrd(this, 2); 
	});
	var fastfowrd = function(obj, spd) {
		//user have to click on play button to return to normal speed 
		$('.btnPlay').addClass('paused');
	   
	    $('#playingNow').removeAttr('id').addClass('forward').show();
		 $('.pausedimg').hide();
		 $('#playing').hide();
		 $('#backward').hide();
		 $('.forward').show();
		video[0].playbackRate = spd;
		video[0].play();
	};
	
	//stop or end button clicked
	$('.btnStop').on('click', function() { stopvideo(this); });
	$('.btnEnd').on('click', function() { stopvideo(this, $('.progress').width()); });
	var stopvideo = function(obj, width) {
		//update progress bar and currenttime
		if(!width) {
			width = 0;
		}
		var pos = $('.progress').offset().left + width;
		updatebar(pos);
		$('.btnPlay').removeClass('paused');
		video[0].pause();
	};
	
	//sound button clicked
	$('.speaker').click(function() {
	
	if(	video[0].muted = !video[0].muted) {
		$('.speaker').addClass('muted');
		} else {
		$('.speaker').removeClass('muted');
		}
		 

	});
	
	
	
	//VIDEO PROGRESS BAR
	//when video timebar clicked
	var timeDrag = false;	/* check for drag event */
	$('.progress').mousedown(function(e) {
		timeDrag = true;
		updatebar(e.pageX);
	});
	$(document).mouseup(function(e) {
		if(timeDrag) {
			timeDrag = false;
			updatebar(e.pageX);
		}
	});
	$(document).mousemove(function(e) {
		if(timeDrag) {
			updatebar(e.pageX);
		}
	});
	var updatebar = function(x) {
		var progress = $('.progress');
		
		//calculate drag position
		//and update video currenttime
		//as well as progress bar
		var maxduration = video[0].duration;
		var position = x - progress.offset().left;
		var percentage = 100 * position / progress.width();
		if(percentage > 100) {
			percentage = 100;
		}
		if(percentage < 0) {
			percentage = 0;
		}
		$('.timeBar').css('width',percentage+'%');	
		video[0].currentTime = maxduration * percentage / 100;
	};

	//VOLUME BAR
	//volume bar event
	$('.volumeCover').on('mousedown', function(e) {
		updateVolume(e.pageX);
	});
	var updateVolume = function(x, vol) {
		var volume = $('.volume');
		var percentage;
		//if only volume have specificed
		//then direct update volume
		if(vol) {
			percentage = vol * 100;
		}
		else {
			var position = x - volume.offset().left;
			percentage = 100 * position / volume.width();	
		}
		//ceil to 25 mutiplier
		percentage = Math.ceil(percentage/25)*25;
		
		$('.volumeBar').css('width',percentage+'%');	
		video[0].volume = percentage / 100;
	};
 
});