
var Imageturn_s = 0;

function BindImageEvents() {
	$('#white_balance_sel').change(function () {
		var sel = parseInt($(this).val(),10);
		if (sel == 10) {
			 $("#white_balance_handle").show();
		} else {
			$("#white_balance_handle").hide();
		}		
	});

	$('#exposuremodes').unbind("click").click(function () {
		var sel = parseInt($(this).val(),10);

		if (sel == 0) {
			$('#exposure_auto').hide();
			$("#exposure_handle").show();
		} else if (sel == 1) {
			$('#exposure_handle').hide();
			$("#exposure_auto").show();
		}
	});

	$('#day2night_day').unbind("click").click(function () {
		var msgBody = {
			ChannelID: 0,
			DayToNightModel: 1
		};

		$.sendCmd("CW_JSON_SetVideo", msgBody).done(function () {
			// ShowMsgDialog(IDC_LIVE_SWITCHTO_DAY);

			$('#day2night_day').addClass('opr-day-active');
			$('#day2night_night').removeClass('opr-night-active');
			$('#day2night_auto').removeClass('opr-auto-ative');
		});
	});
	
	$('#day2night_night').unbind("click").click(function () {
		var msgBody = {
			ChannelID: 0,
			DayToNightModel: 2
		};

		$.sendCmd("CW_JSON_SetVideo", msgBody).done(function () {
			// ShowMsgDialog(IDC_LIVE_SWITCHTO_NIGHT);

			$('#day2night_day').removeClass('opr-day-active');
			$('#day2night_night').addClass('opr-night-active');
			$('#day2night_auto').removeClass('opr-auto-ative');
		});
	});

	$('#day2night_auto').unbind("click").click(function() {
		var msgBody = {
			ChannelID: 0,
			DayToNightModel: 0,
			DayToNightSwitch: parseInt($('#day2night_threshold').val(),10),
			NightToDaySwitch: parseInt($('#night2day_threshold').val(),10)
		};

		$.sendCmd("CW_JSON_SetVideo", msgBody).done(function () {
			// ShowMsgDialog(IDC_LIVE_SWITCHTO_AUTO);

			$('#day2night_day').removeClass('opr-day-active');
			$('#day2night_night').removeClass('opr-night-active');
			$('#day2night_auto').addClass('opr-auto-ative');
		});
	});

	$('#white_balance_btn').unbind("click").click(function () {
		var white_balance_sel = parseInt($('#white_balance_sel').val(),10);
		var exposuremodes_sel = parseInt($('#exposuremodes').val(),10);
		var msgBody;
		var nError = 0;

		if (white_balance_sel == 10) {
			msgBody = {
				ChannelID: 0,
				AWBMode: white_balance_sel,
				BalanceRGain: parseInt($('#white_balance_R').val(),10),
				BalanceGGain: parseInt($('#white_balance_G').val(),10),
				BalanceBGain: parseInt($('#white_balance_B').val(),10)
			};
		} else {
			msgBody = {
				ChannelID: 0,
				AWBMode: white_balance_sel
			};
		}
		msgBody["VideoInputRate"] = parseInt($('#videoinputrate').val(),10);
		msgBody["EVCompensation"] = parseInt($('#evcomp_sel').val(),10);
		msgBody["EVMode"] = exposuremodes_sel;

		if (exposuremodes_sel == 0) {

		    if ( parseInt($('#max_shutter_sel').val(),10) <= parseInt($('#min_shutter_sel').val(),10) )
			{
			msgBody["AutoMinShutter"] = parseInt($('#min_shutter_sel').val(),10);
			msgBody["AutoMaxShutter"] = parseInt($('#max_shutter_sel').val(),10);
			msgBody["AutoMaxGain"] = parseInt($('#max_gain_sel').val(),10);
			}
			else
			{
				
				$('#save_success_msg').html(IDC_LIVE_MODIFY_FAIL);
			    $('#save_success_msg').show();
			     setTimeout(function(){ // 5秒后隐藏消息
				       $("#save_success_msg").hide();
			     }, 2000);
			return;

			}
			
			

		} else if (exposuremodes_sel == 1) {
			msgBody["ManualShutter"] = parseInt($('#shutter_sel').val(),10);
			msgBody["ManualGain"] = parseInt($('#gain_sel').val(),10);
		}


		$.sendCmd("CW_JSON_SetVideo", msgBody).done(function () {
		$('#save_success_msg').html(IDC_LIVE_MODIFY_SUCCESS);
			$('#save_success_msg').show();
			setTimeout(function(){ // 5秒后隐藏消息
				$("#save_success_msg").hide();
			}, 5000);
			//ShowMsgDialog(IDC_GENERAL_SAVESUCCESS);
		}).fail(function () {
			$('#save_success_msg').html(IDC_LIVE_MODIFY_FAIL);
			$('#save_success_msg').show();
			setTimeout(function(){ // 5秒后隐藏消息
				$("#save_success_msg").hide();
			}, 5000);
			//ShowMsgDialog(IDC_GENERAL_SAVEFAIL);
		});


	});

/*
	$('#image_turn_normal').unbind("click").click(function () {
		var msgBody = {
			ChannelID: 0,
			ImageTurn: 0
		};
		$.sendCmd("CW_JSON_SetVideo", msgBody).done(function () {
			ShowMsgDialog(IDC_LIVE_IMAGE_TURNNORMAL);
		});
	});

 
	$('#image_turn_hor').unbind("click").click(function () {
		var msgBody = {
			ChannelID: 0,
			ImageTurn: 1
		};
		$.sendCmd("CW_JSON_SetVideo", msgBody).done(function () {
			ShowMsgDialog(IDC_LIVE_IMAGE_TURNHOR);
		});
	});
*/
	$('#image_turn_ver').unbind("click").click(function () {
	    
		var oldturn = Imageturn_s;
		var curturn = 0;
		if ( oldturn == 0 )
		{
		    curturn = 1;
		}
		else if ( oldturn == 1 )
		{
		    curturn = 0;
		}
		else if ( oldturn == 2 )
		{
		    curturn = 3;
		} 
		else if ( oldturn == 3 )
		{
		    curturn = 2;
		}  

		var msgBody = {
			ChannelID: 0,
			ImageTurn: curturn
		};
		$.sendCmd("CW_JSON_SetVideo", msgBody).done(function () {

            if ( curturn & 1 )
			{
			$('#image_turn_ver').addClass('opr-txfz-lr-active');
			}
			else
			{
			$('#image_turn_ver').removeClass('opr-txfz-lr-active');
			}

			if ( curturn & 2 )
			{
			$('#image_turn_hor_ver').addClass('opr-txfz-ud-active');
			}
			else
			{
			$('#image_turn_hor_ver').removeClass('opr-txfz-ud-active');
			}
			Imageturn_s = curturn;

//			ShowMsgDialog(IDC_LIVE_IMAGE_TURNVER);
		});
	});

	$('#image_turn_hor_ver').unbind("click").click(function () {

	    var oldturn = Imageturn_s;
		var curturn = 0;
		if ( oldturn == 0 )
		{
		    curturn = 2;
		}
		else if ( oldturn == 1 )
		{
		    curturn = 3;
		}
		else if ( oldturn == 2 )
		{
		    curturn = 0;
		} 
		else if ( oldturn == 3 )
		{
		    curturn = 1;
		}  

		var msgBody = {
			ChannelID: 0,
			ImageTurn: curturn
		};

		$.sendCmd("CW_JSON_SetVideo", msgBody).done(function () {

            if ( curturn & 1 )
			{
			$('#image_turn_ver').addClass('opr-txfz-lr-active');
			}
			else
			{
			$('#image_turn_ver').removeClass('opr-txfz-lr-active');
			}

			if ( curturn & 2 )
			{
			$('#image_turn_hor_ver').addClass('opr-txfz-ud-active');
			}
			else
			{
			$('#image_turn_hor_ver').removeClass('opr-txfz-ud-active');
			}

			Imageturn_s = curturn;

//			ShowMsgDialog(IDC_LIVE_IMAGE_TURNHORVER);
		});
	});

	$('#backlight_btn').unbind("click").click(function () {
		var msgBody = {
			ChannelID: 0
		};

		var showMsg = "";
		var open = 0;
		var _this = $(this);
		if ($(this).hasClass('opr-open')) {
			// 关闭
			msgBody["BackLight"] = 0;
			showMsg = IDC_LIVE_BLACKLIGHT_CLOSE;
			open = 0;
		} else if ($(this).hasClass('opr-close')) {
			msgBody["BackLight"] = 1;
			showMsg = IDC_LIVE_BLACKLIGHT_OPEN;
			open = 1;
		}

		$.sendCmd("CW_JSON_SetVideo", msgBody).done(function () {
			// ShowMsgDialog(showMsg);
			if (open == 0) {
				_this.removeClass('opr-open').addClass('opr-close').attr("title", IDC_LIVE_CLICK_OPEN);
			} else if (open == 1) {
				_this.removeClass('opr-close').addClass('opr-open').attr("title", IDC_LIVE_CLICK_CLOSE);
			}
		});
	});

	$('#wide_dyn_btn').unbind("click").click(function () {
		var msgBody = {
			ChannelID: 0
		};

		var showMsg = "";
		var open = 0;
		var _this = $(this);
		if ($(this).hasClass('opr-open')) {
			msgBody["WideDyn"] = 0;
			showMsg = IDC_LIVE_WDR_OPEN;
			open = 0;
		} else if ($(this).hasClass('opr-close')) {
			msgBody["WideDyn"] = 1;
			showMsg = IDC_LIVE_WDR_CLOSE;
			open = 1;
		}

		$.sendCmd("CW_JSON_SetVideo", msgBody).done(function () {
			// ShowMsgDialog(showMsg);
			if (open == 0) {
				_this.removeClass('opr-open').addClass('opr-close').attr("title", IDC_LIVE_CLICK_OPEN);
			} else if (open == 1) {
				_this.removeClass('opr-close').addClass('opr-open').attr("title", IDC_LIVE_CLICK_CLOSE);
			}
		});
	});

	$('#lum_btn').unbind("click").click(function () {
		var msgBody = {
			ChannelID: 0
		};

		var showMsg = "";
		var open = 0;
		var _this = $(this);
		if ($(this).hasClass('opr-open')) {
			msgBody["LowLumEnable"] = 0;
			showMsg = IDC_LIVE_LOWLIGHT_OPEN;
			open = 0;
		} else if ($(this).hasClass('opr-close')) {
			msgBody["LowLumEnable"] = 1;
			showMsg = IDC_LIVE_LOWLIGHT_CLOSE;
			open = 1;
		}

		$.sendCmd("CW_JSON_SetVideo", msgBody).done(function () {
			// ShowMsgDialog(showMsg);
			if (open == 0) {
				_this.removeClass('opr-open').addClass('opr-close').attr("title", IDC_LIVE_CLICK_OPEN);
			} else if (open == 1) {
				_this.removeClass('opr-close').addClass('opr-open').attr("title", IDC_LIVE_CLICK_CLOSE);
			}
		});
	});

	$('#filter3d_btn').unbind("click").click(function () {
		var msgBody = {
			ChannelID: 0
		};

		var showMsg = "";
		var open = 0;
		var _this = $(this);
		if ($(this).hasClass('opr-open')) {
			msgBody["D3FilteEnable"] = 0;
			showMsg = IDC_LIVE_DENOISE_OPEN;
			open = 0;
		} else if ($(this).hasClass('opr-close')) {
			msgBody["D3FilteEnable"] = 1;
			showMsg = IDC_LIVE_DENOISE_CLOSE;
			open = 1;
		}

		$.sendCmd("CW_JSON_SetVideo", msgBody).done(function () {
			// ShowMsgDialog(showMsg);
			if (open == 0) {
				_this.removeClass('opr-open').addClass('opr-close').attr("title", IDC_LIVE_CLICK_OPEN);
			} else if (open == 1) {
				_this.removeClass('opr-close').addClass('opr-open').attr("title", IDC_LIVE_CLICK_CLOSE);
			}
		});
	});

	$('#image_default').unbind("click").click(function () {
		var msgBody = {
			Bright: 128,
			Hue: 128,
			Contrast: 128,
			Saturate: 128,
			Sharpness: 128
		};

		$.sendCmd("CW_JSON_SetColorVideo", msgBody).done(function () {
			$(".menu_contain .bright .slider").slider("value", 128);
			$(".menu_contain .bright .value").text(128);

			$(".menu_contain .hue .slider").slider("value", 128);
			$(".menu_contain .hue .value").text(128);

			$(".menu_contain .contrast .slider").slider("value", 128);
			$(".menu_contain .contrast .value").text(128);

			$(".menu_contain .saturation .slider").slider("value", 128);
			$(".menu_contain .saturation .value").text(128);

			$(".menu_contain .sharpness .slider").slider("value", 128);
			$(".menu_contain .sharpness .value").text(128);
		});
	});
	/*
	$('#day2night_threshold').on("keyup",function(){
		var value = $('#day2night_threshold').val();
		if(IsNumber(value) == false){
			alert(IDC_SETTING_DIALOG_ENTER_NUMBER);
		}
	});
	$('#night2day_threshold').on("keyup",function(){
		var value = $('#night2day_threshold').val();
		if(IsNumber(value) == false){
			alert(IDC_SETTING_DIALOG_ENTER_NUMBER);
		}		
	});
	$('#white_balance_R').on("keyup",function(){
		var value = $('#white_balance_R').val();
		if(IsNumber(value) == false){
			alert(IDC_SETTING_DIALOG_ENTER_NUMBER);
		}		
	});
	$('#white_balance_G').on("keyup",function(){
		var value = $('#white_balance_G').val();
		if(IsNumber(value) == false){
			alert(IDC_SETTING_DIALOG_ENTER_NUMBER);
		}		
	});	
	$('#white_balance_B').on("keyup",function(){
		var value = $('#white_balance_B').val();
		if(IsNumber(value) == false){
			alert(IDC_SETTING_DIALOG_ENTER_NUMBER);
		}		
	});	
	*/
	InitSpinText("day2night_threshold", "day2night_threshold_up", "day2night_threshold_down", 1, 255);
	InitSpinText("night2day_threshold", "night2day_threshold_up", "night2day_threshold_down", 1, 255);
	InitSpinText("white_balance_R", "white_balance_R_up", "white_balance_R_down", 1, 255);
	InitSpinText("white_balance_G", "white_balance_G_up", "white_balance_G_down", 1, 255);
	InitSpinText("white_balance_B", "white_balance_B_up", "white_balance_B_down", 1, 255);
}

function IsNumber(value){
	var pattern = /^[0-9]*$/;
	if(value.match(pattern)){
		return true;
	}
	else{
		return false;
	}
}
function onlyNum(){
	if(!(event.keyCode==46)&&!(event.keyCode==8)&&!(event.keyCode==37)&&!(event.keyCode==39)){
	if(!((event.keyCode>=48&&event.keyCode<=57)||(event.keyCode>=96&&event.keyCode<=105))){
//	if(!((event.keyCode>=48&&event.keyCode<=57){
		event.returnValue=false;
	}
	}
}
function InitSpinText(textId, upId, downId, min, max) {
	$("#" + upId).unbind("click").click(function () {
		var value = parseInt($("#" + textId).val(),10);
		if (isNaN(value)) {
			value = min - 1;
		}
		value += 1;

		if (value < min) {
			value = min;
		}
		if (value > max) {
			value = max;
		}
		$("#" + textId).val(value);
	});

	$("#" + downId).unbind("click").click(function () {
		var value = parseInt($("#" + textId).val(),10);
		if (isNaN(value)) {
			value = min - 1;
		}
		value -= 1;

		if (value < min) {
			value = min;
		}
		if (value > max) {
			value = max;
		}
		$("#" + textId).val(value);
	});
}

function GetImageMsg() {
	var msgBody = {
		ChannelID: 0,
		DayToNightModel: 1,
		DayToNightSwitch: 1,
		NightToDaySwitch: 1,
		AWBMode: 1,
		BalanceRGain: 1,
		BalanceGGain: 1,
		BalanceBGain: 1,
		VideoInputRate: 1,
		EVCompensation: 1,
		EVMode: 1,
		AutoMaxShutter: 1,
		AutoMinShutter: 1,
		AutoMaxGain: 1,
		ManualShutter: 1,
		ManualGain: 1,
		ImageTurn: 1,
		WideDyn: 1,
		BackLight: 1,
		D3FilteEnable: 1,
		LowLumEnable: 1
	};

	$.sendCmd("CW_JSON_GetVideo", msgBody).done(function (imageInfo) {
		$('#day2night_threshold').val(imageInfo['DayToNightSwitch']);
		$('#night2day_threshold').val(imageInfo['NightToDaySwitch']);
		$('#white_balance_sel').val(imageInfo['AWBMode']);
		$('#white_balance_R').val(imageInfo['BalanceRGain']);
		$('#white_balance_G').val(imageInfo['BalanceGGain']);
		$('#white_balance_B').val(imageInfo['BalanceBGain']);
		$('#videoinputrate').val(imageInfo['VideoInputRate']);
		$('#evcomp_sel').val(imageInfo['EVCompensation']);
		$('#exposuremodes').val(imageInfo['EVMode']);
		$('#shutter_sel').val(imageInfo['ManualShutter']);
		$('#gain_sel').val(imageInfo['ManualGain']);
		$('#max_shutter_sel').val(imageInfo['AutoMaxShutter']);
		$('#min_shutter_sel').val(imageInfo['AutoMinShutter']);
		$('#max_gain_sel').val(imageInfo['AutoMaxGain']);
		
		var evMode = parseInt(imageInfo['EVMode'],10);
		if (evMode == 0) {
			$('#exposure_auto').hide();
			$("#exposure_handle").show();
		} else if (evMode == 1) {
			$('#exposure_handle').hide();
			$("#exposure_auto").show();
		}

		var awbMode = parseInt(imageInfo['AWBMode'],10);
		if (awbMode == 10) {
			 $("#white_balance_handle").show();
		} else {
			$("#white_balance_handle").hide();
		}

		if (parseInt(imageInfo["DayToNightModel"],10) == 0) {
			$('#day2night_day').removeClass('opr-day-active');
			$('#day2night_night').removeClass('opr-night-active');
			$('#day2night_auto').addClass('opr-auto-ative');
		} else if (parseInt(imageInfo["DayToNightModel"],10) == 1) {
			$('#day2night_day').addClass('opr-day-active');
			$('#day2night_night').removeClass('opr-night-active');
			$('#day2night_auto').removeClass('opr-auto-ative');
		} else if (parseInt(imageInfo["DayToNightModel"],10) == 2) {
			$('#day2night_day').removeClass('opr-day-active');
			$('#day2night_night').addClass('opr-night-active');
			$('#day2night_auto').removeClass('opr-auto-ative');
		}
		/*
		liuhongtao fixed
		if (parseInt(imageInfo['ImageTurn']) == 0) {
			$('#image_turn_normal').addClass('opr-txxs-r-active');
			$('#image_turn_hor').removeClass('opr-txxs-l-active');
			$('#image_turn_ver').removeClass('opr-txfz-lr-active');
			$('#image_turn_hor_ver').removeClass('opr-txfz-ud-active');
		} else if (parseInt(imageInfo['ImageTurn']) == 1) {
			$('#image_turn_normal').removeClass('opr-txxs-r-active');
			$('#image_turn_hor').addClass('opr-txxs-l-active');
			$('#image_turn_ver').removeClass('opr-txfz-lr-active');
			$('#image_turn_hor_ver').removeClass('opr-txfz-ud-active');
		} else if (parseInt(imageInfo['ImageTurn']) == 2) {
			$('#image_turn_normal').removeClass('opr-txxs-r-active');
			$('#image_turn_hor').removeClass('opr-txxs-l-active');
			$('#image_turn_ver').addClass('opr-txfz-lr-active');
			$('#image_turn_hor_ver').removeClass('opr-txfz-ud-active');
		} else if (parseInt(imageInfo['ImageTurn']) == 3) {
			$('#image_turn_normal').removeClass('opr-txxs-r-active');
			$('#image_turn_hor').removeClass('opr-txxs-l-active');
			$('#image_turn_ver').removeClass('opr-txfz-lr-active');
			$('#image_turn_hor_ver').addClass('opr-txfz-ud-active');
		}
		*/

        //liuhongtao
	
		Imageturn_s = parseInt(imageInfo['ImageTurn'],10);

		if (Imageturn_s == 0) {
			$('#image_turn_ver').removeClass('opr-txfz-lr-active');
			$('#image_turn_hor_ver').removeClass('opr-txfz-ud-active');
		} else if (Imageturn_s == 1) {
			$('#image_turn_ver').addClass('opr-txfz-lr-active');
			$('#image_turn_hor_ver').removeClass('opr-txfz-ud-active');
		} else if (Imageturn_s == 2) {
			$('#image_turn_ver').removeClass('opr-txfz-lr-active');
			$('#image_turn_hor_ver').addClass('opr-txfz-ud-active');
		} else if (Imageturn_s == 3) {
			$('#image_turn_ver').addClass('opr-txfz-lr-active');
			$('#image_turn_hor_ver').addClass('opr-txfz-ud-active');
		}
		else {
		    $('#image_turn_ver').removeClass('opr-txfz-lr-active');
			$('#image_turn_hor_ver').removeClass('opr-txfz-ud-active');

		}
	



        

		if (parseInt(imageInfo['WideDyn'],10) == 0) {
			$('#wide_dyn_btn').removeClass('opr-open').addClass('opr-close').attr("title", IDC_LIVE_CLICK_OPEN);
		} else if (parseInt(imageInfo['WideDyn'],10) == 1) {
			$('#wide_dyn_btn').removeClass('opr-close').addClass('opr-open').attr("title", IDC_LIVE_CLICK_CLOSE);
		}

		if (parseInt(imageInfo['BackLight'],10) == 0) {
			$('#backlight_btn').removeClass('opr-open').addClass('opr-close').attr("title", IDC_LIVE_CLICK_OPEN);
		} else if (parseInt(imageInfo['BackLight'],10) == 1) {
			$('#backlight_btn').removeClass('opr-close').addClass('opr-open').attr("title", IDC_LIVE_CLICK_CLOSE);
		}

		if (parseInt(imageInfo['D3FilteEnable'],10) == 0) {
			$('#filter3d_btn').removeClass('opr-open').addClass('opr-close').attr("title", IDC_LIVE_CLICK_OPEN);
		} else if (parseInt(imageInfo['D3FilteEnable'],10) == 1) {
			$('#filter3d_btn').removeClass('opr-close').addClass('opr-open').attr("title", IDC_LIVE_CLICK_CLOSE);
		}

		if (parseInt(imageInfo['LowLumEnable'],10) == 0) {
			$('#lum_btn').removeClass('opr-open').addClass('opr-close').attr("title", IDC_LIVE_CLICK_OPEN);
		} else if (parseInt(imageInfo['LowLumEnable'],10) == 1) {
			$('#lum_btn').removeClass('opr-close').addClass('opr-open').attr("title", IDC_LIVE_CLICK_CLOSE);
		}
	});
}