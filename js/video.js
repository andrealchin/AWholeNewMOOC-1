$(document).ready(function () {
    //INITIALIZE
    var video = $('#myVideo');
    $('#playing').hide();
    $('#playingNow').show();
	$('.totaltime').hide();

    //remove default control when JS loaded
    video[0].removeAttribute("controls");



    //display video buffering bar
    var startBuffer = function () {
        var currentBuffer = video[0].buffered.end(0);
        var maxduration = video[0].duration;
        var perc = 100 * currentBuffer / maxduration;
        $('.bufferBar').css('width', perc + '%');

        if (currentBuffer < maxduration) {
            setTimeout(startBuffer, 500);
        }
    };

    //display current video play time
    video.on('timeupdate', function () {
        var currentPos = video[0].currentTime;
        var maxduration = video[0].duration;
        var perc = 100 * currentPos / maxduration;
        $('.timeBar').css('width', perc + '%');
    });

    //CONTROLS EVENTS
    //video screen and play button clicked
    video.on('click', function () {
        playpause();
    });
    $('.btnPlay').on('click', function () {
        playpause();
    });


    var playpause = function () {
        //automatic reset playbackrate
        video[0].playbackRate = 1;
        $('.forward').hide();
        $('.pausedimg').show().removeAttr('id');
        if (video[0].paused || video[0].ended || !$('.btnPlay').hasClass('paused')) {
            $('#playingNow').hide();
            $('#playing').show();
            $('.btnPlay').addClass('paused');
            video[0].play();
            $('.pausedimg').attr('id', 'playing');
            $('#backward').removeAttr('id').addClass('pausedimg').show();


        } else {
            $('.btnPlay').removeClass('paused');
            video[0].pause();
            $('#backward').removeAttr('id').addClass('pausedimg').show();

            $('#playing').removeAttr('id').addClass('pausedimg').show();

        }
    };


    //fast forward button clicked
    //unfortunately Firefox doesn't support video playbackrate yet!
    //and Chrome doesn't support negative value for playbackrate yet!
    //currently only works in Safari
    $('.btnBck').on('click', function () {

        $('#playing').attr('id', 'backward');
        video[0].playbackRate = -2;
        video[0].play();

        $('.btnPlay').addClass('paused').removeClass('pausedimg');
        $('#playingNow').hide();
        $('.pausedimg').attr('id', 'backward');
        $('#backward').show();
        $('.forward').hide();
        $('#backward').show();
    });

    $('.btnFwd').on('click', function () {
        fastfowrd(this, 2);
    });
    var fastfowrd = function (obj, spd) {
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

  

    //fullscreen button clicked
    $('.fullscreen').on('click', function () {
        if ($.isFunction(video[0].webkitEnterFullscreen)) {
            video[0].webkitEnterFullscreen();
        } else if ($.isFunction(video[0].mozRequestFullScreen)) {
            video[0].mozRequestFullScreen();
        } else {
            alert('Your browsers doesn\'t support fullscreen');
        }
    });




    //sound button clicked
    $('.speaker').click(function () {

        if (video[0].muted = !video[0].muted) {
            $('.speaker').addClass('muted');
        } else {
            $('.speaker').removeClass('muted');
        }


    });



    //VIDEO PROGRESS BAR
    //when video timebar clicked
    var timeDrag = false; /* check for drag event */
    $('.progress').mousedown(function (e) {
        timeDrag = true;
        updatebar(e.pageX);
    });
    $(document).mouseup(function (e) {
        if (timeDrag) {
            timeDrag = false;
            updatebar(e.pageX);
        }
    });
    $(document).mousemove(function (e) {
        if (timeDrag) {
            updatebar(e.pageX);
        }
    });
    var updatebar = function (x) {
        var progress = $('.progress');

        //calculate drag position
        //and update video currenttime
        //as well as progress bar
        var maxduration = video[0].duration;
        var position = x - progress.offset().left;
        var percentage = 100 * position / progress.width();
        if (percentage > 100) {
            percentage = 100;
        }
        if (percentage < 0) {
            percentage = 0;
        }
        $('.timeBar').css('width', percentage + '%');
        video[0].currentTime = maxduration * percentage / 100;

    };
    //display current video play time
    video.on('timeupdate', function () {
        var currentPos = video[0].currentTime;
        var maxduration = video[0].duration;
        var perc = 100 * currentPos / maxduration;
        $('.timeBar').css('width', perc + '%');
        $('.current').text(timeFormat(currentPos));
        $('.duration').text(timeFormat(video[0].duration));
    });

    //set video properties



    //VOLUME BAR
    //volume bar event
    $('.volumeCover').on('mousedown', function (e) {
        updateVolume(e.pageX);
    });
    var updateVolume = function (x, vol) {
        var volume = $('.volumeBar');
        var percentage;
        //if only volume have specificed
        //then direct update volume
        if (vol) {
            percentage = vol * 100;
        } else {
            var position = x - volume.offset().left;
            percentage = 100 * position / volume.width();
        }
     //ceil to 25 mutiplier
		percentage = Math.ceil(percentage/25)*25;
		
		$('.volumeBar').css('width',percentage+'%');	
		video[0].volume = percentage / 100;
    };

    //Time format converter - 00:00
    var timeFormat = function (seconds) {
        var m = Math.floor(seconds / 60) < 10 ? "0" + Math.floor(seconds / 60) : Math.floor(seconds / 60);
        var s = Math.floor(seconds - (m * 60)) < 10 ? "0" + Math.floor(seconds - (m * 60)) : Math.floor(seconds - (m * 60));
        return m + ":" + s;
    };

});

$(window).load(function () {
$('.totaltime').show();
});