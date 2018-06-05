var g_ParamType = 0;
$(document).ready(function(){
	$("#md_video #cover_video").mousemove(function(){
		window.getSelection?window.getSelection().removeAllRanges():document.selection.empty();
	});
	
	$(".hy-tabs>ul>li[tabpanel]").click(function(){
		$(".hy-tabs>ul>li").each(function(idx, item){
			$(item).removeClass("active");
			$("#" + $(item).attr("tabpanel")).hide();
		});
		$(this).addClass("active");
		$("#" + $(this).attr("tabpanel")).show();
	});
	$(".hy-tabs>ul>li.active").click();

	$('#image_tab').click(function () {
		$(document).trigger("active_image_param");
	});

	$('#ptz_tab').click(function () {
		$(document).trigger("active_ptz_operation");
	//	var PresetName = GetPresetName();
	//	$('#preset_text_name').val(PresetName);
		InitTour();
	});

	$.fn.process_bar = function(option){
		var _target = this;
		
		return new function(){
			this.option = {
				value: 0,
				valueEl: ""
			};
			
			$.extend(true, this.option, option || {});
			
			this.value = function(val, callback){
				typeof(val) != 'undefined' && (this.option.value = val || 0);
				var text = this.option.value + "%";
				$("#" + this.option.valueEl).html(text);
				_target.find("img.front").animate({ "left": text }, "slow", callback || function(){});
				return this.option.value;
			};
			
			this.value();
		};
	};
});

function beforeOnReady() {
	CheckToken();
	InitEffect();
	BindEvents();
	InitToggleMenu();
	InitSlider();
	InitDialogMenu();
	InitTitle();
	BindSliderEvents();
	InitDialog();
	ToggleSlider($.cookie('slider_toggle'));

	// 报警
	AlarmPeriodInit();

	var sliderMenu = $.cookie('slider_menu');
	if ((typeof sliderMenu == "string") && (sliderMenu.trim() == "show")) {
		ShowSlideMenu(true);
	}
	else {
		ShowSlideMenu(false);
	}
}

function onUnload() {
	if (g_player) {
		g_player.stop();
		g_player.Logout();
	}
}

function onReady() {
	showUserInfo();
	
	var msgBody = {
        RtspPort: 1
	};
	var httpport = 0;

	httpport = parseInt(window.location.port);
	if(isNaN(httpport)){
		httpport = 80;
	}
	$.sendCmd("CW_JSON_GetNetworkProtocol", msgBody).done(function (portInfo) {
		g_player = IPCPlayer.create({dom_id: "player",port:httpport,stream:0});
		
		if(g_player == null)
		{
		//	alert(IDC_ATIVEX_PLAYER_CREATE_FAIL);
			return false;
		}
		var ocxVer = g_player.ocxVersion();
		if(ocxVer.success){			
			$.cookie("ocxVersion",ocxVer.ocxVersion,{expires: 30});
		}
		
		var ret = 0;
		ret = g_player.play({rtsp_port: parseInt(portInfo["RtspPort"])});
		if(ret != 0){
			alert(IDC_PLAY_VIDEO_FAIL);
		}
		g_player.PtzControlEnable(true);		
		var new_stream_type = 0;
		var pre_stream_type = 0;
		new_stream_type = parseInt($.cookie("stream_type"));
		pre_stream_type = parseInt($.cookie("pre_stream_type"));
	
		if(new_stream_type != pre_stream_type){	
			if(isNaN(new_stream_type)){
				new_stream_type = 0;
			}			
			g_player.Setstreamtype(new_stream_type);
		}
		
	});

	var msgAudioMsg = {
		ChannelID: 0,
		AudioInputEnable: 1,
		AudioOutputEnable: 1,
		AudioInputVolume: 1,
		AudioOutputVolume: 1
	};
	$.sendCmd("CW_JSON_GetAudio", msgAudioMsg).done(function (audioInfo) {
		if (parseInt(audioInfo["AudioInputEnable"]) == 0) {
			// microphone
			$('.microphone .icon').removeClass("open").addClass("close");
			g_player.talkBack(false);
			$(".microphone .slider").slider("value", 0);
		} else {
			$('.microphone .icon').removeClass("close").addClass("open");
			g_player.talkBack(true);
			$(".microphone .slider").slider("value", parseInt(audioInfo["AudioInputVolume"]));
		}

		if (parseInt(audioInfo["AudioOutputEnable"]) == 0) {
			$('.volume .icon').removeClass("high middle low").addClass("close");
			g_player.audioOut(false);
			$(".volume .slider").slider("value", 0);
		} else {
			var classStr = "low";
			var outputVolume = parseInt(audioInfo["AudioOutputVolume"]);
			if ((outputVolume >= 0) && (outputVolume < 30)) {
				classStr = "low"
			} else if ((outputVolume >= 30) && (outputVolume < 70)) {
				classStr = "middle"
			} else {
				classStr = "high"
			}
			$('.volume .icon').removeClass("close").addClass(classStr);
			g_player.audioOut(true);
			$(".volume .slider").slider("value", outputVolume);
		}
	});

	$(document).trigger("active_image_param");
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

function InitEffect() {
	$(".handle_bar").bgiframe();
	$('#master_btn').hwbutton();
	$('#slave_btn').hwbutton();

	/* 部分IE浏览器不支持li:hover */
	$("#shortcutmenu li").each(function() {
		$(this).mouseenter(function() {
			$(this).addClass("over");
		})
		$(this).mouseleave(function() {
			$(this).removeClass("over");	
		})
	})

	$(".content .group div").each(function () {
		$(this).mouseenter(function () {
			$(this).addClass("over");
		})
		$(this).mouseleave(function() {
			$(this).removeClass("over");	
		})
	})
}

function BindEvents() {
	$(".content .function .microphone .icon").click(function () {
		var msgBody = {};
		msgBody["ChannelID"] = 0;

		if ($(this).hasClass("open")) {
			$(this).removeClass("open").addClass("close");
			g_player.talkBack(false);
			msgBody["AudioInputEnable"] = 0;
			$(".microphone .slider").slider("value", 0);
			$.sendCmd("CW_JSON_SetAudio", msgBody).done(function () {
			});
		}
		else {
			$(this).removeClass("close").addClass("open");
			g_player.talkBack(true);
			msgBody["AudioInputEnable"] = 1;
			$.sendCmd("CW_JSON_SetAudio", msgBody).done(function () {
			});

			var msgBody2 = {
				ChannelID: 0,
				AudioInputVolume: 1
			};

			$.sendCmd("CW_JSON_GetAudio", msgBody2).done(function (audioInfo) {
				$(".microphone .slider").slider("value", parseInt(audioInfo["AudioInputVolume"]));
			});
		}
	});

	$(".content .function .volume .icon").click(function () {

		var msgBody = {};
		msgBody["ChannelID"] = 0;

		if ($(this).hasClass("close")) {
			$(this).removeClass("close").addClass("low");
			g_player.audioOut(true);
			msgBody["AudioOutputEnable"] = 1;
			$.sendCmd("CW_JSON_SetAudio", msgBody).done(function () {
			});

			var msgBody2 = {
				ChannelID: 0,
				AudioOutputVolume: 1
			};

			$.sendCmd("CW_JSON_GetAudio", msgBody2).done(function (audioInfo) {
				$(".volume .slider").slider("value", parseInt(audioInfo["AudioOutputVolume"]));

				var classStr = "low";
				var outputVolume = parseInt(audioInfo["AudioOutputVolume"]);
				if ((outputVolume >= 0) && (outputVolume < 30)) {
					classStr = "low"
				} else if ((outputVolume >= 30) && (outputVolume < 70)) {
					classStr = "middle"
				} else {
					classStr = "high"
				}
				$('.volume .icon').removeClass("close low").addClass(classStr);
				$(".volume .slider").slider("value", outputVolume);
			});
		} else {
			$(this).removeClass("high middle low").addClass("close");
			g_player.audioOut(false);
			msgBody["AudioOutputEnable"] = 0;
			$(".volume .slider").slider("value", 0);
			$.sendCmd("CW_JSON_SetAudio", msgBody).done(function () {
			});
		}
		// high middle low
		// if ($(this).hasClass("high")) {
		// 	$(this).removeClass("high").addClass("close");
		// }
		// else {
		// 	$(this).removeClass("close").addClass("high");
		// }
	});
	
	$(".content .function .play_and_pause").bind("click", function () {
		if ($(this).hasClass("playing")) {
			$(this).removeClass("playing").addClass("pausing");
			if (g_player) {
				g_player.replay();
				$(".content .function .play_and_pause").unbind("click");
			}
		}
		else {
			$(this).removeClass("pausing").addClass("playing");
			if (g_player) {
				g_player.stop();
			}
		}
	});

	$(".slider_menu .handle_bar").click(function() {
		var sliderMenu = $(".slider_menu");
		if (sliderMenu.hasClass("show_width")) {
			ShowSlideMenu(false);
		}
		else {
			ShowSlideMenu(true);
		}
	});

	$(".content .function .slider_toggle").click(function () {
		var sliderMenu = $(".slider_menu");
		if (sliderMenu.hasClass("left")) {
			ToggleSlider("right");
		} else if (sliderMenu.hasClass("right")) {
			ToggleSlider("left");
		}
	});



	$(".group .ptz3d").click(function() {
	if (g_player) {

		if(g_Ptz3DToggle == 1)
		{
			g_player.stopPtz3D();
			g_player.PtzControlEnable(true);
			g_Ptz3DToggle = 0;
			$(this).parent().removeClass("ptz3d_background");
		}
		else{
			g_player.startPtz3D();
			g_player.PtzControlEnable(false);
			g_Ptz3DToggle = 1;
			$(this).parent().addClass("ptz3d_background");
		}
		
	}
	});

	$(".group .full_screen").click(function() {
		if (g_player) {
			g_player.fullScreen();
		}
	});

	$(".group .record_toggle").click(function () {
		var ret;
		if (g_player) {
			ret = g_player.isRecording();
			log('ret.success isrecording' + ret.success);
			if (ret.success) {
				g_player.stopRecord();
				$(this).parent().removeClass("record_background");
                $(".content .function .record_toggle").removeClass("recording").addClass("record");
				if (g_recordTimer) {
					g_recordTimer.stop();
					g_recordTimeLeft = 0;
				}
			}
			else {
				var recPath = buildPath();

				ret = g_player.startRecord(recPath);
				if (ret.success) {
					$(this).parent().addClass("record_background");
					$(".content .function .record_toggle").removeClass("record").addClass("recording");
					if (typeof $.cookie('file_length') != "undefined") {
						g_recordTimeLeft = parseInt($.cookie('file_length'), 10);
					} else {
						g_recordTimeLeft = 1;
					}
					g_recordTimeLeft = g_recordTimeLeft * 60;
					g_recordTimer = $.timer(1000, function () {
						g_recordTimeLeft -= 1;
						log('g_recordTimeLeft = ' + g_recordTimeLeft);
						if (g_recordTimeLeft <= 0) {
							g_player.stopRecord();
							recPath = buildPath();
							g_player.startRecord(recPath);
							if (typeof $.cookie('file_length') != "undefined") {
								g_recordTimeLeft = parseInt($.cookie('file_length'), 10);
							} else {
								g_recordTimeLeft = 1;
							}
							g_recordTimeLeft = g_recordTimeLeft * 60;
						}
					})
				}
			}
		}
	});

	$(".group .screenshot").click(function () {
		if (g_player) {
			var capPath = buildPath({type: "capture"});
			var ret = g_player.capture(capPath);
			if (ret.success) {
				alert(IDC_GENERAL_SAVEAT + capPath);
			}
		}
	});
	
	$("#master_btn").bind("click", function () {
		if (g_player) {
			g_player.play({stream: 0});
			$("#slave_btn").removeClass("hw-btn-active");
			$(this).addClass("hw-btn-active");
		}
	});

	$("#slave_btn").bind("click", function () {
		if (g_player) {
			g_player.play({stream: 1});
			$("#master_btn").removeClass("hw-btn-active");
			$(this).addClass("hw-btn-active");
		}
	});
}

function ToggleSlider(dir) {
	var sliderMenu = $(".slider_menu");
	if (dir === "right") {
		sliderMenu.removeClass("left").addClass("right");
		$(".content .function .slider_toggle").removeClass("slider_left").addClass("slider_right");
		$("#player").css({left: 0, right: sliderMenu.width()});
		$.cookie('slider_toggle', 'right', {expires: 30});
	}
	else {
		sliderMenu.removeClass("right").addClass("left");
		$(".content .function .slider_toggle").removeClass("slider_right").addClass("slider_left");
		$("#player").css({right: 0, left: sliderMenu.width()});
		$.cookie('slider_toggle', 'left', {expires: 30});
	}
}

function ShowSlideMenu(flag) {
	var sliderMenu = $(".slider_menu");
	if (flag == false) {
		sliderMenu.removeClass("show_width").addClass("hide_width");
		if (sliderMenu.hasClass("left")) {
			$(".slider_menu .handle_bar .handle span").removeClass("left").addClass("right");
			$("#player").css({left: sliderMenu.width()});
		}
		else if (sliderMenu.hasClass("right")) {
			$(".slider_menu .handle_bar .handle span").removeClass("right").addClass("left");
			$("#player").css({right: sliderMenu.width()});
		}
		$(".slider_menu .ptz_container").hide();
		$(".slider_menu .sly_container").hide();
		$(".slider_menu .bjqs_slider").hide();
		$.cookie('slider_menu', 'hide', {expires: 30});
	}
	else if (flag == true) {
		sliderMenu.removeClass("hide_width").addClass("show_width");
		if (sliderMenu.hasClass("left")) {
			$(".slider_menu .handle_bar .handle span").removeClass("right").addClass("left");
			$("#player").css({left: sliderMenu.width()});	
		}
		else if (sliderMenu.hasClass("right")) {
			$(".slider_menu .handle_bar .handle span").removeClass("left").addClass("right");
			$("#player").css({right: sliderMenu.width()});
		}
		$(".slider_menu .ptz_container").show();
		$(".slider_menu .sly_container").show();
		$(".slider_menu .bjqs_slider").show();
		$.cookie('slider_menu', 'show', {expires: 30});
	}
}

function InitToggleMenu() {
	$('#sly_menu').bjqs({
		height      : "100%",
		width       : "100%",
		automatic	: false,
		showcontrols: false,
		showmarkers	: false,
		next_ele	: ".bjqs_slider .ui-rangeSlider-rightArrow",
		prev_ele	: ".bjqs_slider .ui-rangeSlider-leftArrow",
		onShowPage	: function (item) {
			$('#sly_menu').trigger("active_" + item.data("menu"));
		},
		responsive  : true
	});
	
	$('#sly_menu').css({"position": "absolute", "left": "0px", "top": "0px", "right": "0px"});
}

$(document).on("active_image_param", function() {
	$(".menu_contain .bright .slider").slider({
		range: "min",
		min: 1,
		max: 255,
		value: 128,
		slide: function(event, ui) {
			$(".menu_contain .bright .value").text(ui.value);
		},
		stop: function (event, ui) {
			$.sendCmd("CW_JSON_SetColorVideo", {Bright: parseInt(ui.value)}).done(function () {
			});
		}
	});
	$(".menu_contain .hue .slider").slider({
		range: "min",
		min: 1,
		max: 255,
		value: 128,
		slide: function(event, ui) {
			$(".menu_contain .hue .value").text(ui.value);
		},
		stop: function (event, ui) {
			$.sendCmd("CW_JSON_SetColorVideo", {Hue: parseInt(ui.value)}).done(function () {
			});
		}
	});
	$(".menu_contain .contrast .slider").slider({
		range: "min",
		min: 1,
		max: 255,
		value: 128,
		slide: function(event, ui) {
			$(".menu_contain .contrast .value").text(ui.value);
		},
		stop: function (event, ui) {
			$.sendCmd("CW_JSON_SetColorVideo", {Contrast: parseInt(ui.value)}).done(function () {
			});
		}
	});
	$(".menu_contain .saturation .slider").slider({
		range: "min",
		min: 1,
		max: 255,
		value: 128,
		slide: function(event, ui) {
			$(".menu_contain .saturation .value").text(ui.value);
		},
		stop: function (event, ui) {
			$.sendCmd("CW_JSON_SetColorVideo", {Saturate: parseInt(ui.value)}).done(function () {
			});
		}
	});
	$(".menu_contain .sharpness .slider").slider({
		range: "min",
		min: 1,
		max: 255,
		value: 128,
		slide: function(event, ui) {
			$(".menu_contain .sharpness .value").text(ui.value);
		},
		stop: function (event, ui) {
			$.sendCmd("CW_JSON_SetColorVideo", {Sharpness: parseInt(ui.value)}).done(function () {
			});
		}
	});

	$('.bright .slider .ui-slider-handle').css({width: "5px", height: "12px"});
	$('.hue .slider .ui-slider-handle').css({width: "5px", height: "12px"});
	$('.contrast .slider .ui-slider-handle').css({width: "5px", height: "12px"});
	$('.saturation .slider .ui-slider-handle').css({width: "5px", height: "12px"});
	$('.sharpness .slider .ui-slider-handle').css({width: "5px", height: "12px"});

	var msgBody = {
		Bright: 1,
        Contrast: 1,
        Saturate: 1,
        Sharpness: 1,
        Hue: 1,
        Noise: 1
	};
	$.sendCmd("CW_JSON_GetColorVideo", msgBody).done(function (colorInfo) {
		$(".menu_contain .bright .slider").slider("value", parseInt(colorInfo["Bright"]));
		$(".menu_contain .bright .value").text(parseInt(colorInfo["Bright"]));

		$(".menu_contain .hue .slider").slider("value", parseInt(colorInfo["Hue"]));
		$(".menu_contain .hue .value").text(parseInt(colorInfo["Hue"]));

		$(".menu_contain .contrast .slider").slider("value", parseInt(colorInfo["Contrast"]));
		$(".menu_contain .contrast .value").text(parseInt(colorInfo["Contrast"]));

		$(".menu_contain .saturation .slider").slider("value", parseInt(colorInfo["Saturate"]));
		$(".menu_contain .saturation .value").text(parseInt(colorInfo["Saturate"]));

		$(".menu_contain .sharpness .slider").slider("value", parseInt(colorInfo["Sharpness"]));
		$(".menu_contain .sharpness .value").text(parseInt(colorInfo["Sharpness"]));
	});

	BindImageEvents();

	GetImageMsg();
})

$(document).on("active_ptz_operation", function() {
	GetPTZMsg();
})

$(document).on("active_other_set", function() {

})

function InitSlider() {
	$(".volume .slider").slider({
		range: "min",
		min: 0,
		max: 100,
		stop: function(event, ui) {
			var msgBody = {};
			if (ui.value == 0) {
				$('.volume .icon').removeClass("high middle low").addClass("close");
				msgBody["AudioOutputEnable"] = 0;
				g_player.audioOut(false);
			} else if ((ui.value > 0) && (ui.value < 30)) {
				$('.volume .icon').removeClass("high middle low close").addClass("low");
				msgBody["AudioOutputEnable"] = 1;
				g_player.audioOut(true);
			} else if ((ui.value > 30) && (ui.value < 70)) {
				$('.volume .icon').removeClass("high middle low close").addClass("middle");
				msgBody["AudioOutputEnable"] = 1;
				g_player.audioOut(true);
			} else {
				$('.volume .icon').removeClass("high middle low close").addClass("high");
				msgBody["AudioOutputEnable"] = 1;
				g_player.audioOut(true);
			}

			msgBody["ChannelID"] = 0;
			msgBody["AudioOutputVolume"] = parseInt(ui.value);
			$.sendCmd("CW_JSON_SetAudio", msgBody).done(function () {
			});
		}
	});
	$(".microphone .slider").slider({
		range: "min",
		min: 0,
		max: 100,
		stop: function(event, ui) {
			var msgBody = {};
			
			if (ui.value == 0) {
				$('.microphone .icon').removeClass("open").addClass("close");
				g_player.talkBack(false);
				msgBody["AudioInputEnable"] = 0;
			} else {
				$('.microphone .icon').removeClass("close").addClass("open");
				g_player.talkBack(true);
				msgBody["AudioInputEnable"] = 1;
			}

			msgBody["ChannelID"] = 0;
			msgBody["AudioInputVolume"] = parseInt(ui.value);

		//	g_player.setVolume(parseInt(ui.value));
			$.sendCmd("CW_JSON_SetAudio", msgBody).done(function () {

			});
		}
	});
	var SpeedValue = 21;
	$(".speed .slider").slider({
		range: "min",
		min: 1,
		max: 63,
		value: SpeedValue,
		slide: function(event, ui) {
			$(".speed .value").text(ui.value);
		}
	});
	$(".speed .value").text(SpeedValue);
}

function InitDialog() {
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
	////////////////debug/////////////////
	$("#shortcutmenu .playback").click(function() {
		if(g_player){
			g_player.stop();
			g_player.Logout();
		}
		window.location.href = "/playback.html";
	});	
	////////////////debug/////////////////
	$("#shortcutmenu .setting").click(function() {
		if(g_player){
			g_player.stop();
			g_player.Logout();
		}
				
		var stream_type = $.cookie("stream_type");
		$.cookie("pre_stream_type",parseInt(stream_type),{expires: 30});					
		
		window.location.href = "/paramset.html";
		/*
		var display = $(".ui-dialog[aria-describedby='setting_dialog']").css("display");
		if (display != 'block') {
			$("#setting_dialog").dialog({
				resizable: false,
				modal: true,
				width: 774,
	      		height: 560,
	      		title: IDC_GENERAL_SETTING,
	      		buttons: [
	      			{
	      				text: IDC_GENERAL_SAVE,
	      				click: function () {
	      					$("#setting_dialog").trigger("menu_save_" + $("#setting_dialog li.active").data("menu"));
	      				}
	      			},
	      			{
	      				text: IDC_GENERAL_CLOSE,
	      				click: function () {
	      					$(this).dialog("close");
							$("#setting_dialog").trigger("menu_close_" + $("#setting_dialog li.active").data("menu"));
	      				}
	      			}
	      		],
	      		open: function() {
	      			if ($('#setting_dialog li.active').data('menu') == null) {
						
	      				ActiveSubMenu($('#setting_dialog li:first').addClass('active'));
	      			}
	      			else {
						
	      				$("#setting_dialog").trigger("menu_show_" + $("#setting_dialog li.active").data("menu"));
	      			}
	      		},
				close:function(){
				$("#simu_video").JSVideo.stop();
				}
			});
			$(".ui-dialog[aria-describedby='setting_dialog']").bgiframe();
		}*/
	});
}

function ActiveSubMenu(menu) {

	$("#setting_dialog").trigger("menu_close_" + $('#setting_dialog li.active').data('menu'));
	$('#setting_dialog li.active').removeClass('active');
    menu.addClass('active');

    $('#setting_dialog div.right > div').hide();
    $("#setting_dialog div.right > div." + menu.data('menu')).fadeIn('slow');
    $("#setting_dialog").trigger("menu_show_" + menu.data('menu'));
    
}

function InitDialogMenu() {
	$("#setting_dialog h3").click(function(event) {
		if ($(event.target).hasClass('ui-state-active')) {
			return;
		}
		$('#setting_dialog h3.ui-state-active').next('ul').hide();
		$('#setting_dialog h3.ui-state-active').removeClass('ui-state-active');
		$(event.target).addClass('ui-state-active').next('ul').fadeIn('slow');
		ActiveSubMenu($(event.target).next('ul').find(':first-child'));
	})
	$('#setting_dialog .left li').click(function(event) {

		ActiveSubMenu($(event.target));
	})
}

function DealMicroPhone() {
	var microPhone = $(".content .function .microphone .icon");
	var msgBody = {};
	msgBody["ChannelID"] = 0;

	if (microPhone.hasClass("open")) {
		microPhone.removeClass("close").addClass("open");
		g_player.talkBack(true);
		msgBody["AudioInputEnable"] = 1;
		$.sendCmd("CW_JSON_SetAudio", msgBody).done(function () {
		});

		var msgBody2 = {
			ChannelID: 0,
			AudioInputVolume: 1
		};

		$.sendCmd("CW_JSON_GetAudio", msgBody2).done(function (audioInfo) {
			$(".microphone .slider").slider("value", parseInt(audioInfo["AudioInputVolume"]));
		});
	}
	else {

		microPhone.removeClass("open").addClass("close");
		g_player.talkBack(false);
		msgBody["AudioInputEnable"] = 0;
		$(".microphone .slider").slider("value", 0);
		$.sendCmd("CW_JSON_SetAudio", msgBody).done(function () {
		});
	}
}

function DealAudioOut() {
	var audioOutP = $(".content .function .volume .icon");
	
	var msgBody = {};
	msgBody["ChannelID"] = 0;

	if (audioOutP.hasClass("close")) {
		audioOutP.removeClass("high middle low").addClass("close");
		g_player.audioOut(false);
		msgBody["AudioOutputEnable"] = 0;
		$(".volume .slider").slider("value", 0);
		$.sendCmd("CW_JSON_SetAudio", msgBody).done(function () {
		});
	} else {
		audioOutP.removeClass("close").addClass("low");
		g_player.audioOut(true);
		msgBody["AudioOutputEnable"] = 1;
		$.sendCmd("CW_JSON_SetAudio", msgBody).done(function () {
		});

		var msgBody2 = {
			ChannelID: 0,
			AudioOutputVolume: 1
		};

		$.sendCmd("CW_JSON_GetAudio", msgBody2).done(function (audioInfo) {
			$(".volume .slider").slider("value", parseInt(audioInfo["AudioOutputVolume"]));

			var classStr = "low";
			var outputVolume = parseInt(audioInfo["AudioOutputVolume"]);
			if ((outputVolume >= 0) && (outputVolume < 30)) {
				classStr = "low"
			} else if ((outputVolume >= 30) && (outputVolume < 70)) {
				classStr = "middle"
			} else {
				classStr = "high"
			}
			$('.volume .icon').removeClass("close low").addClass(classStr);
			$(".volume .slider").slider("value", outputVolume);
		});
	}
}
function InputConfFile(){
	var fileName = "";
	fileName = $("#configure_file").val();
	if(fileName == ""){
	  alert(IDC_SETTING_PLEASE_SELECT_FILE);
	  return;
	}
	switch(g_ParamType)
	{
		case 0:
			$("#ddfrmUpdate").attr("action","/webs/config_encode");
			break;
		case 1:
			$("#ddfrmUpdate").attr("action","/webs/config_alarm");
			break;
		case 2:
			$("#ddfrmUpdate").attr("action","/webs/config_image");
			break;
		case 3:
			$("#ddfrmUpdate").attr("action","/webs/config_ptz");
			break;
		case 4:
			$("#ddfrmUpdate").attr("action","/webs/config_server");
			break;
		case 5:
			$("#ddfrmUpdate").attr("action","/webs/config_user");
			break;
		case 6:
			$("#ddfrmUpdate").attr("action","/webs/config_record");
			break;
		default:
			$("#ddfrmUpdate").attr("action","/webs/config_encode");
			break;			
	}
	$("#ddfrmUpdate").submit();
	setTimeout("alert(IEC_SETTING_INPUT_PARAMS_SUCCESS)",1000);
}

function InitTitle() {
	$('.menu_desc .opr_bright').attr("title", IDC_LIVE_BRIGHT);
	$('.menu_desc .opr_hue').attr("title", IDC_LIVE_HUE);
	$('.menu_desc .opr_contrast').attr("title", IDC_LIVE_CONTRAST);
	$('.menu_desc .opr_saturation').attr("title", IDC_LIVE_SATURATION);
	$('.menu_desc .opr_sharpness').attr("title", IDC_LIVE_SHARPNESS);
	
	$('.ptz_container .ptz .up').attr("title", IDC_LIVE_PTZ_UP);
	$('.ptz_container .ptz .down').attr("title", IDC_LIVE_PTZ_DOWN);
	$('.ptz_container .ptz .left').attr("title", IDC_LIVE_PTZ_LEFT);
	$('.ptz_container .ptz .right').attr("title", IDC_LIVE_PTZ_RIGHT);
	$('.ptz_container .ptz .middle').attr("title", IDC_LIVE_PTZ_AUTO);
	$('.ptz_container .ptz .l-u').attr("title", IDC_LIVE_PTZ_LEFTUP);
	$('.ptz_container .ptz .r-u').attr("title", IDC_LIVE_PTZ_RIGHTUP);
	$('.ptz_container .ptz .l-d').attr("title", IDC_LIVE_PTZ_LEFTDOWN);
	$('.ptz_container .ptz .r-d').attr("title", IDC_LIVE_PTZ_RIGHTDOWN);
	
	$(".group .ptz3d").attr("title", IDC_LIVE_FUNBAR_PTZ3D);
	//$(".group .record").attr("title", IDC_LIVE_FUNBAR_RECORD);
	$(".content .function .record_toggle").attr("title", IDC_LIVE_FUNBAR_RECORD);
	$(".group .full_screen").attr("title", IDC_LIVE_FUNBAR_FULLSCREEN);
	$(".group .screenshot").attr("title", IDC_LIVE_FUNBAR_SNAP);
	$(".content .function .slider_toggle").attr("title", IDC_LIVE_FUNBAR_SLIDER);
	$(".content .function .volume").attr("title", IDC_LIVE_FUNBAR_VOLUME);
	$(".content .function .microphone").attr("title", IDC_LIVE_FUNBAR_MICROPHONE);

	$("#focus_btn_plus").attr("title", IDC_LIVE_FOCUSPLUS);
	$("#focus_btn_reduce").attr("title", IDC_LIVE_FOCUSREDUCE);
	$("#zoom_btn_plus").attr("title", IDC_LIVE_ZOOMPLUS);
	$("#zoom_btn_reduce").attr("title", IDC_LIVE_ZOOMREDUCE);
	$("#aperture_btn_plus").attr("title", IDC_LIVE_APERTUREPLUS);
	$("#aperture_btn_reduce").attr("title", IDC_LIVE_APERTUREREDUCE);

	$('#day2night_day').attr("title", IDC_LIVE_TITLE_DAYMODEL);
	$('#day2night_night').attr("title", IDC_LIVE_TITLE_NIGHTMODEL);
	$('.opr-menus-tab .opr-auto').attr("title", IDC_LIVE_TITLE_DAY2NIGHT_AUTO);
	$('#add_preset_btn').attr("title", IDC_LIVE_TITLE_SAVE);
	$('#watch_btn').attr("title", IDC_LIVE_TITLE_SAVE);
	$('#del_preset_btn').attr("title", IDC_LIVE_TITLE_DEL);
	$('#invoke_preset_btn').attr("title", IDC_LIVE_TITLE_INVOKE);
	$('#area_left_btn').attr("title", IDC_LIVE_TITLE_SETLEFTZONE);
	$('#area_right_btn').attr("title", IDC_LIVE_TITLE_SETRIGHTZONE);
	$('#invoke_area_btn').attr("title", IDC_LIVE_TITLE_INVOKE);
	$('#pattern_record').attr("title", IDC_LIVE_TITLE_STARTPATTERN);
	$('#pattern_stop').attr("title", IDC_LIVE_TITLE_ENDPATTER);
	$('#invoke_pattern').attr("title", IDC_LIVE_TITLE_INVOKE);

	$('#add_tour_btn').attr("title", IDC_LIVE_TITLE_TOURADDPRESET);
	$('#del_tour_btn').attr("title", IDC_LIVE_TITLE_TOURDELPRESET);
	$('#invoke_tour_btn').attr("title", IDC_LIVE_TITLE_INVOKETOUR);
	$('#save_tour_btn').attr("title", IDC_LIVE_TITLE_SAVE);

//	$('#image_turn_normal').attr("title", IDC_LIVE_TITLE_IMAGE_NORMAL);
//	$('#image_turn_hor').attr("title", IDC_LIVE_TITLE_IMAGE_HOR);
	$('#image_turn_ver').attr("title", IDC_LIVE_TITLE_IMAGE_VER);
	$('#image_turn_hor_ver').attr("title", IDC_LIVE_TITLE_IMAGE_HORVER);
}
