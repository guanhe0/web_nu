var g_search_flag = 0; // 正在搜索文件 0: 没搜索, 1: 正在搜索
var g_playBack = null;
var g_playslow = 13;
var g_playfast = 7;
var g_fast_backward1 = 13;
var g_fast_backward2 = 14;
var g_fast_backward3 = 15;
var g_fast_backward4 = 16;
var g_fast_backward5 = 17;
var g_fast_backward6 = 18;
var g_fast_forward2 = 8;
var g_fast_forward4 = 9;
var g_fast_forward8 = 10;
var g_fast_forward16 = 11;
var g_fast_forward32 = 12;
var g_playmode_normal = 1;
var g_canuse_fast_backforward = false;
function beforeOnReady() {
	CheckToken();
	InitPlaySpeed();
	/* 部分IE浏览器不支持li:hover */
	$("#shortcutmenu li").each(function() {
		$(this).mouseenter(function() {
			$(this).addClass("over");
		})
		$(this).mouseleave(function() {
			$(this).removeClass("over");	
		})
	});
	$("#shortcutmenu .playlive").click(function() {
		if(g_playBack){
			g_playBack.stop();
			g_playBack.Logout();
		}
		window.location.href = "/live.html";
	});
	$("#shortcutmenu .logout").click(function() {
		
		var display = $(".ui-dialog[aria-describedby='msgLogout']").css("display");
		if (display != 'block') {
			$("#msgLogout").dialog({
				bgiframe: true,
				resizable: false,
				modal: true,
				width: 300,
	      		height: 140,
	      		title: IDC_GENERAL_MSG_TITLE,
				buttons: [
					{
						text: IDC_GENERAL_OK,
						click: function () {
							$( this ).dialog("close");
							ClearToken();
							window.location.href = "/login.html";
						}
					},
					{
						text: IDC_GENERAL_CANCEL,
						click: function () {
							$( this ).dialog("close");
						}
					}
				]
			});
			$(".ui-dialog[aria-describedby='msgLogout']").bgiframe();
		}
	});
	$('#timeline').slider({
		orientation: "horizontal",
		range: "min",
		min: 0,
		value: 0,
		max: 10000,
		stop: function (event, ui) {
			DragSliderPos(ui.value);
		}
    });

    $('.function .playback_volume .slider').slider({
    	orientation: "horizontal",
		range: "min",
		min: 0,
		value: 0,
		max: 100,
		slide: function (event, ui) {
			$(".function .playback_volume .value").text(ui.value);
		},
		stop: function (event, ui) {
			DragSliderPos(ui.value);
		}
    });

    $('#search_btn').hwbutton();

    $('#video_begin_time').datetimepicker(
		{
			theme:'dark',
			lang:GetDatepickLang(),
			timepicker:false,
			format:'Y-m-d',
			mask:'9999-12-31',
			closeOnDateSelect:true,
			id:"video_begin_time_date",
			validateOnBlur:false,
			onGenerate: function () {
				$('#video_begin_time_date').css({left: "18px"})
			},

			onClose: function () {
			    $('#video_end_time').val($('#video_begin_time').val());
				}

           /*
			onSelectDate: function () {
			   
				if ($('#video_end_time_date')) {
					$('#video_end_time').datetimepicker('destroy');
				}
				
				$('#video_end_time').datetimepicker(
					{
						theme:'dark',
						lang:GetDatepickLang(),
						timepicker:false,
						format:'Y-m-d',
						mask:'9999-12-31',
						closeOnDateSelect:true,
						id:"video_end_time_date",
						validateOnBlur:false,
						minDate: replaceAll($('#video_begin_time').val(), "-", "/"),
						onGenerate: function () {
							$('#video_end_time_date').css({left: "18px"})
						}
					}
				);
			}
			*/
		}
	);

    $('#video_end_time').datetimepicker(
		{
			theme:'dark',
			lang:GetDatepickLang(),
			timepicker:false,
			format:'Y-m-d',
			mask:'9999-12-31',
			closeOnDateSelect:true,
			id:"video_end_time_date",
			validateOnBlur:false,
			onClose: function () {
			    $('#video_begin_time').val($('#video_end_time').val());
				},
				
			onGenerate: function () {
				$('#video_end_time_date').css({left: "18px"})
			}
		}
	);
	
    $('#search_btn').click(function () {
    	if (g_search_flag == 1) {
		    alert(IDC_PLAYBACK_SEARCHING);
    		return;
    	}
    	SearchFiles($('#video_type').val());
    });

    $("#play_back").css({right: 0, left: $('.search').width()});
	
    $('#file_list').dblclick(function () {
    	var fileFullName = $(this).val();
		g_playfast = 7;
    	if (fileFullName && g_playBack) {
    		var fileType = $(this).find('option:selected').attr("type");
    		if (fileType == "remote") {
				g_playfast = 1;
    			var temp = fileFullName.split("/");
    			fileFullName = "";
    			for (var i = 3; i < temp.length - 1; i ++) {
    				fileFullName += temp[i] + "/";
    			}
    			fileFullName += temp[temp.length - 1];
    		}
    		log("fileFullName = " + fileFullName);
			/*when wnd number is 1*/
			var wndAttr = g_playBack.getSelWndAttr();
			wndAttr.playedTime = 0;			
    		g_playBack.playFile({type: fileType, fileName: fileFullName});
			g_playBack.playSound(false);
			g_playBack.playSound(true);
    	}    	
    });

	
    $('#open_file').click(function () {
    	if (g_playBack) {
			var fileAllPath = "";
		if (typeof $.cookie('file_path') != "undefined") {
			fileAllPath = $.trim($.cookie('file_path'));
		} else {
			fileAllPath = "C:\\IPCamera";
		}
			fileAllPath += "\\" + "record" + "\\";
			g_recPath = fileAllPath;
			
    		g_playBack.openFileDialog();
			g_playBack.playSound(false);
			g_playBack.playSound(true);			
    	}
    });
	
    $('#snaps').click(function () {
    	if (g_playBack) {
    		g_playBack.snap();
    	}
    });

    $('.function .play_or_pause').click(function () {

    	if (g_playBack) {
    		var wndAttr = g_playBack.getSelWndAttr();
			var sul = g_playBack.getCurWnd();
    		log("played = " + wndAttr.played + ", sul = " + sul);
    		if (wndAttr.played == 1) {
    			// 正在播放
    			g_playBack.pause(true);
				wndAttr.played = 0;
    			// 切图标
    			$(this).removeClass("pausing").addClass("playing").attr("title", IDC_PLAYBACK_PLAY);
    		} else if (wndAttr.played == 0) {
    		//	if (wndAttr.playFile) {
    				// 正在暂停
    				g_playBack.pause(false);
					wndAttr.played = 1;
    				// 切图标
    				InitPlaySpeed();
					
    				$(this).removeClass("playing").addClass("pausing").attr("title", IDC_PLAYBACK_PAUSE);
    		//	}
    		}
    	}
    });

	$('.playback_decelerate').click(function(){
		if(g_playBack)
		{
			if(g_canuse_fast_backforward == false){
				return;
			}				
			if(g_playslow < g_fast_backward6){
				g_playslow++;
			}
			else{
				g_playslow = g_fast_backward1;
			}
			if(g_playslow > g_fast_backward1){
				g_playBack.slow(g_playslow);				
			}
			else{
				g_playBack.slow(g_playmode_normal);
			}

			var rate = Math.pow(2,g_playslow  - g_fast_backward1);
			
			ShowPlayRate(rate,false);
			

		}
	})

	$('.playback_accelerate').click(function(){
		if(g_playBack)
		{
			var filetype = $('#file_list').find('option:selected').attr("type");
			if(filetype != "remote"){
			if(g_playfast < 12)
			{
				g_playfast++;
			}
			else
			{
				g_playfast = 7;
			}

			if(g_playfast > 7){
				g_playBack.fast(g_playfast)
			}
			else{
				g_playBack.fast(g_playmode_normal);
			}
				
			var rate = Math.pow(2,g_playfast - 7);
			ShowPlayRate(rate,true);
			}
			else{
				if(g_playfast < 32){
					g_playfast = 32;
					g_playBack.fast(g_fast_forward32);
				}
				else{
					g_playfast = 1;
					g_playBack.fast(g_playmode_normal);
				}
				
				ShowPlayRate(g_playfast,true);
			}
		}
	})

    SetTitles();
}
function ShowPlayRate(rate,bInt){
	
	var str = rate + "x";	
	if(bInt){
		$("#playbackrate").text(str);
	}
	else{
		if(rate != 1){
		str = "1/" + str;
		}
		$("#playbackrate").text(str);
	}
}
function SetTitles() {
	$('#snaps').attr("title", IDC_PLAYBACK_SNAP);
	$('#open_file').attr("title", IDC_PLAYBACK_OPENFILE);
}
function InitPlaySpeed()
{
	var g_playslow = g_fast_backward1;
	var g_playfast = 7;	
}
function onUnload() {
	if (g_playBack) {
		g_playBack.stop();
		g_playBack.Logout();
	}
}
function onReady() {

	var port = parseInt(window.location.port);

	if(isNaN(port)){
		port = 80;
	}
	g_playBack = IPCPlayBack.create({dom_id: "play_back",port:port});
	g_playBack.setTimerCB(UpdateSlider);

	showUserInfo();

	RangeInput({
		domid: "video_begin_hour",
		min: 0,
		max: 23
	});

	RangeInput({
		domid: "video_begin_minute",
		min: 0,
		max: 59
	});

	RangeInput({
		domid: "video_begin_second",
		min: 0,
		max: 59
	});
	
	RangeInput({
		domid: "video_end_hour",
		min: 0,
		max: 23
	});
	
	RangeInput({
		domid: "video_end_minute",
		min: 0,
		max: 59
	});
	
	RangeInput({
		domid: "video_end_second",
		min: 0,
		max: 59
	});
}

function showUserInfo() {
	var msgBody = {
		MacAddress: 1
	};
	$.sendCmd("CW_JSON_GetNetwork", msgBody).done(function (netInfo) {
		var insertHtml = "";
		var ipAddr = (document.URL.split('//')[1]).split('/')[0].split(':')[0];
		var userName = $.cookie("loginuser");
		insertHtml = "IP:" + ipAddr + " MAC:" + netInfo["MacAddress"];
		$("#deviceInfo").text(insertHtml);

		if (typeof userName == "undefined") {
			userName = "";
		}

		insertHtml = "";
		insertHtml = IDC_GENERAL_LOGINUSER + " " + userName;
		$("#deviceUser").text(insertHtml);
	});
}

function SearchFiles(videoType) {
	var beginTime, beginHour, beginMinute, beginSecond;
	var endTime, endHour, endMinute, endSecond;

	beginTime = $('#video_begin_time').val();
//	console.info("beginTime = " + beginTime);
	beginHour = parseInt($('#video_begin_hour').val());
	beginMinute = parseInt($('#video_begin_minute').val());
	beginSecond = parseInt($('#video_begin_second').val());

	endTime = $('#video_end_time').val();
	endHour = parseInt($('#video_end_hour').val());
	endMinute = parseInt($('#video_end_minute').val());
	endSecond = parseInt($('#video_end_second').val());

	if(!beginTime.match("\\d{4}-\\d{1,2}-\\d{1,2}")) {
        return;
    }

	if(!endTime.match("\\d{4}-\\d{1,2}-\\d{1,2}")) {
        return;
    }    

    if ((beginHour < 0) || (beginHour > 23)) {
    	return;
    }

    if ((beginMinute < 0) || (beginMinute > 59)) {
    	return;
    }

    if ((beginSecond < 0) || (beginSecond > 59)) {
    	return;
    }

    if ((endHour < 0) || (endHour > 23)) {
    	return;
    }

    if ((endMinute < 0) || (endMinute > 59)) {
    	return;
    }

    if ((endSecond < 0) || (endSecond > 59)) {
    	return;
    }

    var tempBeginTime = "", tempEndTime = "";
    var ret = 0;
    tempBeginTime = beginTime.split("-");
    tempEndTime = endTime.split("-");
    ret = CompareTime(
    	{
    		"year": tempBeginTime[0],
    		"month": tempBeginTime[1],
    		"day": tempBeginTime[2],
    		"hour": beginHour,
    		"minute": beginMinute,
    		"second": beginSecond
    	},
    	{
    		"year": tempEndTime[0],
    		"month": tempEndTime[1],
    		"day": tempEndTime[2],
    		"hour": endHour,
    		"minute": endMinute,
    		"second": endSecond
    	}
	);

	if (ret != 0) {
		//alert("开始时间不能大于结束时间");
                alert(IDC_PLAYBACK_TIMEERROR);
		return;
	}

    $('#file_list').empty();
	if (videoType == 0) {
		// 本地搜索
		var fileAllPath = "";
		if (typeof $.cookie('file_path') != "undefined") {
			fileAllPath = $.trim($.cookie('file_path'));
		} else {
		   fileAllPath = "C:\\IPCamera";
		}
		fileAllPath += "\\" + "record" + "\\" + window.location.hostname + "\\" + beginTime + "\\";
		g_recPath = fileAllPath;

		var startDate = FormatTime(beginHour) + "-" + FormatTime(beginMinute) + "-00" + "_0";
		var endDate = FormatTime(endHour) + "-" + FormatTime(endMinute) + "-59" + "_0";
		var local_search_ret = 0;
		if (g_playBack) {
				local_search_ret = g_playBack.search({path: fileAllPath, fileType: 0, start: startDate, end: endDate});
		}
				
		if(!local_search_ret)
		{
			alert(IDC_SEARCH_FILE_FAILED);
			g_search_flag = 0;
			return;
		}
	//	g_search_flag = 1;
	} else if (videoType == 1) {
		// 远程搜索
		beginTime = beginTime.split("-");
		endTime = endTime.split("-");
		var beginDate = new Date(parseInt(beginTime[0]), parseInt(beginTime[1] - 1), parseInt(beginTime[2]), beginHour, beginMinute, beginSecond);
		var endDate = new Date(parseInt(endTime[0]), parseInt(endTime[1] - 1), parseInt(endTime[2]), endHour, endMinute, endSecond);
		var msgBody = {
			FileType: 0,
			First: 1,
			FileNum: 20,
			StartTime: Date.UTC(parseInt(beginTime[0]), parseInt(beginTime[1] - 1), parseInt(beginTime[2]), beginHour, beginMinute, beginSecond) / 1000,
			EndTime: Date.UTC(parseInt(endTime[0]), parseInt(endTime[1] - 1), parseInt(endTime[2]), endHour, endMinute, endSecond) / 1000
		};
		
		$.sendCmd("CW_JSON_SearchFile", msgBody).done(function (fileInfo) {
			DealSearchFile(msgBody, fileInfo);
		});
	}
}

function DealSearchFile(msgBody, fileInfo) {
	if(fileInfo == null)
	{
		alert(IDC_SEARCH_FILE_FAILED);
		return;
	}
	var fileList = fileInfo["FileList"];
	if(fileList == null)
	{
		return;
	}
	var fileName = "";
	var complete = parseInt(fileInfo["Complete"],10);
	for (var i = 0; i < fileList.length; i ++) {
		fileName = fileList[i].split("/");
		$('<option type="remote" value="' + fileList[i] + '">' + fileName[fileName.length - 1] + '</option>').appendTo($('#file_list'));
	}

	if (complete == 0) {
		msgBody["First"] = 0;
		var oneTime = $.timer(1000, function () {
			$.sendCmd("CW_JSON_SearchFile", msgBody).done(function (fileInfo) {
				DealSearchFile(msgBody, fileInfo);
				log(oneTime);
				oneTime.stop();
			});
		});
	}
}

function UpdateSlider() {
	if (g_playBack) {
		var fileLen = g_playBack.getFileLength();
		var playPosition = g_playBack.getPlayPosition();
		var playedtime = g_playBack.getPlayedTime();
		var filetime = g_playBack.getFileTimes();

		var wndAttr = g_playBack.getSelWndAttr();
//		$('#start_times').text(FormatPlayTime(playPosition));
//		$('#end_times').text(FormatPlayTime(fileLen));
		$('#start_times').text(FormatPlayTime(playedtime));
		$('#end_times').text(FormatPlayTime(filetime));

		var max = $("#timeline").slider("option", "max");
		
		var pos = (playPosition / (fileLen == 0 ? 1 : fileLen)) * max;
    	$("#timeline").slider( "option", "value", pos);
	//	 log("fileLen = " + fileLen + ", playedTime = " + wndAttr.playedTime + ", playPosition = " + playPosition + ", pos = " + pos);
	}	
}

function DragSliderPos(pos) {
	var max = $("#timeline").slider("option", "max");
	var fileLen = g_playBack.getFileLength()/25;
//	var fileLen = g_playBack.getFileTimes();
	var playPosition = (pos / max) * fileLen;

	if (g_playBack) {
		g_playBack.setPlayPosition({pos: playPosition});
	}
}

function FormatPlayTime(TimeSeconds) {
	var strtime, FTime, temptime;
    FTime = "";
    strtime = TimeSeconds % 60;
    if(strtime >= 10) {
        FTime=":" + strtime + FTime;
    } else {
        FTime = ":0" + strtime + FTime;
    }
    strtime = parseInt(TimeSeconds / 60) % 60;
    if(strtime >= 10) {
        FTime = ":" + strtime + FTime;
    } else {
        FTime = ":0" + strtime + FTime;
    }

    strtime = parseInt(parseInt(TimeSeconds / 60) / 60) % 60;
    if(strtime >= 10) {
        FTime = strtime + FTime;
    } else {
        FTime = "0" + strtime + FTime;
    }

    return(FTime);
}

function CompareTime(begin, end) {
	var beginTime = new Date(begin['year'], begin['month'], begin['day'], begin['hour'], begin['minute'], begin['second']);
	var endTime = new Date(end['year'], end['month'], end['day'], end['hour'], end['minute'], end['second']);

    if ( begin['hour'] >= 24 ||  begin['hour'] < 0 || begin['minute'] >= 60 || begin['minute'] < 0 || begin['second'] >= 24 || begin['second'] < 0 || endTime['hour'] >= 24 ||  endTime['hour'] < 0 || endTime['minute'] >= 60 || endTime['minute'] < 0 || endTime['second'] >= 24 || endTime['second'] < 0 )
	{
	   return 2;
	}
	if (beginTime.getTime() > endTime.getTime()) {
		return 1;
	}

	return 0;
}
