(function ($){
	var thisID = "";
	$.fn.JSVideo = function (params){
		var options = $.extend({
                pause: null,
                fpsinfo: null
        }, params);

        var gpsinfo = "";
		var imageNr = 0;
		var paused = false;
		var previous_time = new Date();
		thisID = $(this).attr("id");
		
		$('#' + thisID + 'img').remove();
		$(this).append("<img id='" + (thisID + "img") + "'>");
		var h = parseInt($(this).css("height"));
		var w = parseInt($(this).css("width"));

		$('#' + thisID + 'img').css('width', w);
		$('#' + thisID + 'img').css('height', h);
		$('#' + thisID + 'img').attr('src', '/?action=snapshot&n=' + (++imageNr));
		$('#' + thisID + 'img').css('zIndex', -1);
		$('#' + thisID + 'img').css('cursor', 'default');
		$('#' + thisID + 'img').css('margin', '0');
		$('#' + thisID + 'img').attr('draggable', false);
		$('#' + thisID + 'img').bind("load", imageOnload);
		
		function createImageLayer()
		{
			$('#' + thisID + 'img').attr('src', '/?action=snapshot&n=' + (++imageNr));
		}

		function imageOnload()
		{
		
			this.style.zIndex = imageNr;
			var current_time = new Date();
			delta = current_time.getTime() - previous_time.getTime();
			fps   = (1000.0 / delta).toFixed(3);
			gpsinfo = delta + " ms (" + fps + " fps)";
			if (options.fpsinfo)
				$("#" + options.fpsinfo).html(gpsinfo);
			previous_time = current_time;
			if (!paused)
				createImageLayer();
			delete current_time;
		}

		function imageOnclick()
		{
			paused = !paused;
			if (!paused)
				createImageLayer();
		}

		if (options.pause != null)
		{
			imageOnclick();
			if (typeof options.pause == "function")
				options.pause();
		}
	};
	
	$.fn.JSVideo.stop = function()
	{
		$('#' + thisID + 'img').unbind("load");
		$('#' + thisID + 'img').remove();
	}
})(jQuery);