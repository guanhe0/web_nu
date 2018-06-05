var g_PtzAutoBegin = false;
var g_PtzOtherBegin = false;

function BindSliderEvents() {

	$('.ptz_container .ptz .direction').mouseleave(function () {
		/*auto ptz icon hilight when first keydown and normal when second keydown*/
		if(g_PtzAutoBegin == false){//autoptz undo
			if(g_PtzOtherBegin){

			g_PtzOtherBegin = false;
			PTZStop();
			}
		}
	});

	$('.ptz_container .ptz .up').mousedown(function () {
		g_PtzOtherBegin = true;
		PTZUp();
	}).mouseup(function () {
		PTZStop();
	});

	$('.ptz_container .ptz .down').mousedown(function () {
		g_PtzOtherBegin = true;
		PTZDown();
	}).mouseup(function () {
		PTZStop();
	});
	
	$('.ptz_container .ptz .left').mousedown(function () {
		g_PtzOtherBegin = true;
		PTZLeft();
	}).mouseup(function () {
		PTZStop();
	});
	
	$('.ptz_container .ptz .right').mousedown(function () {
		g_PtzOtherBegin = true;
		PTZRight();
	}).mouseup(function () {
		PTZStop();
	});

	$('.ptz_container .ptz .middle').click(function () {
		if(g_PtzAutoBegin == false){
		document.getElementById("direction_middle").style.backgroundImage = "url(../themes/images/ptzon.png)";
		g_PtzAutoBegin = true;
		PTZAuto();
		}
		else{
//		document.getElementById("direction_middle").style.backgroundImage = "url(../themes/images/ptz_normal.png)";
		document.getElementById("direction_middle").style.backgroundImage = "url(../themes/images/animated-overlay.png)";
//		document.getElementById("direction_middle").onmouseover = function(){
//		document.getElementById("direction_middle").style.backgroundImage = "url(../themes/images/ptzon.png)";
//		}
		g_PtzAutoBegin = false;
		PTZStop();
		}
	})/*
	.mouseup(function () {
		// PTZStop();
	});*/
	
	$('.ptz_container .ptz .l-u').mousedown(function () {
		g_PtzOtherBegin = true;
		PTZLeftAndUp();
	}).mouseup(function () {
		PTZStop();
	});

	$('.ptz_container .ptz .r-u').mousedown(function () {
		g_PtzOtherBegin = true;
		PTZRightAndUp();
	}).mouseup(function () {
		PTZStop();
	});

	$('.ptz_container .ptz .l-d').mousedown(function () {
		g_PtzOtherBegin = true;
		PTZLeftAndDown();
	}).mouseup(function () {
		PTZStop();
	});

	$('.ptz_container .ptz .r-d').mousedown(function () {
		g_PtzOtherBegin = true;
		PTZRightAndDown();
	}).mouseup(function () {
		PTZStop();
	});

	$('#focus_btn_plus').unbind("click").click(function () {
		Focus(0);
	});
	$('#focus_btn_reduce').unbind("click").click(function () {
		Focus(1);
	});

	var BtnPlusKeyDown = 0;
	$('#zoom_btn_plus').mousedown(function () {
		BtnPlusKeyDown = 1;
		Zoom(0);
	}).mouseup(function(){
		ZoomStop();
	}).mouseleave(function(){
		if(BtnPlusKeyDown == 1)
		{
			BtnPlusKeyDown = 0;
			ZoomStop();
		}
	});

	var BtnReduceKeyDown = 0;
	$('#zoom_btn_reduce').mousedown(function () {
		BtnReduceKeyDown = 1;
		Zoom(1);
	}).mouseup(function(){
		ZoomStop();
	}).mouseleave(function(){
		if(BtnReduceKeyDown == 1)
		{
			BtnReduceKeyDown = 0;
			ZoomStop();
		}
	});

	$('#aperture_btn_plus').unbind("click").click(function () {
		Aperture(1);
	});
	$('#aperture_btn_reduce').unbind("click").click(function () {
		Aperture(0);
	});

	InitPresetSel();
}

function Focus(control) {
	var speed = parseInt($(".speed .slider").slider("value"));
	var msgBody = {
		ChannelID: 0,
		AFModel: 1,
		AFArea: control,
		AFStepLen: speed
	};
	$.sendCmd("CW_JSON_SetCameraAF", msgBody).done(function () {
	});
}

function ZoomStop() {
	var msgBody = {
		ChannelID: 0,
		ZoomModel: 2
	};

	$.sendCmd("CW_JSON_SetCameraZoom", msgBody).done(function () {
	});
}

function Zoom(control) {
	var msgBody = {
		ChannelID: 0,
		ZoomModel: control
	};

	$.sendCmd("CW_JSON_SetCameraZoom", msgBody).done(function () {
	});
}

function Aperture(control) {
	var msgBody = {
		ChannelID: 0,
		IrisControl: control
	};

	$.sendCmd("CW_JSON_SetCameraIris", msgBody).done(function () {
	});
}

function PTZCmd(cmd) {
	var speed = parseInt($(".speed .slider").slider("value"));
	var msgBody = {
		ChannelID: 0,
        PtzCmd: cmd,
        Speedx: speed,
        Speedy: speed
	};

	$.sendCmd("CW_JSON_CallPtzPt", msgBody).done(function () {
	});
}

function PTZStop() {
	PTZCmd(0);
}

function PTZUp() {
	PTZCmd(3);
}

function PTZDown() {
	PTZCmd(4);
}

function PTZLeft() {
	PTZCmd(1);
}

function PTZRight() {
	PTZCmd(2);
}

function PTZAuto() {
	PTZCmd(9);
}

function PTZLeftAndUp() {
	PTZCmd(5);
}

function PTZRightAndUp() {
	PTZCmd(6);
}

function PTZLeftAndDown() {
	PTZCmd(7);
}

function PTZRightAndDown() {
	PTZCmd(8);
}

function InitPresetSel() {
	var i = 1;
	var innerHtml = "";

	for (i = 1; i < 256; i ++) {
		innerHtml += '<option value="' + i + '" preset_name = "' + i + '">' + i + '</option>';
	}

	$('#preset_sel_id').append(innerHtml);

	$('#preset_sel_id').change(function () {
		var sel = $(this).val();
		var presetName = $('#preset_sel_id option[value="' + sel + '"]').attr("preset_name");
		if (presetName) {				
			$('#preset_text_name').val(presetName);
		} else {					
			$('#preset_text_name').val("");
		}
		
	});

	$('#add_preset_btn').unbind("click").click(function () {
		var msgBody = {
			ChannelID: 0,
			ControlType: 0,
			PresetId: parseInt($('#preset_sel_id').val()),
			PresetName: $.trim($('#preset_text_name').val())
		};
		
		$.sendCmd("CW_JSON_SetPtzPreset", msgBody).done(function () {
			ShowMsgDialog(IDC_LIVE_MSG_ADDPRESET);
			$('#preset_sel_id option[value="' + msgBody["PresetId"] + '"]').attr("preset_name", msgBody["PresetName"]).css("background-color", "#0B93D5");
		});
	});

	$('#del_preset_btn').unbind("click").click(function () {
		var msgBody = {
			ChannelID: 0,
			ControlType: 2,
			PresetId: parseInt($('#preset_sel_id').val()),
			PresetName: $.trim($('#preset_text_name').val())
		};
		
		$.sendCmd("CW_JSON_SetPtzPreset", msgBody).done(function () {
			ShowMsgDialog(IDC_LIVE_MSG_DELPRESET);
			$('#preset_sel_id option[value="' + msgBody["PresetId"] + '"]').removeAttr("preset_name").css("background-color", "#fff");			
			$('#preset_text_name').val("");
		});
	});

	$('#invoke_preset_btn').unbind("click").click(function () {
		var msgBody = {
			ChannelID: 0,
			ControlType: 1,
			PresetId: parseInt($('#preset_sel_id').val()),
			PresetName: $.trim($('#preset_text_name').val())
		};
		
		if (typeof $('#preset_sel_id option[value="' + msgBody["PresetId"] + '"]').attr("preset_name") != 'undefined') {
			$.sendCmd("CW_JSON_SetPtzPreset", msgBody).done(function () {
			});
		}
	});

	$('#area_left_btn').unbind("click").click(function () {
		var msgBody = {
			ChannelID: 0,
			ZoneId: 1,
			ControlType: 1,
			Speed: parseInt($(".speed .slider").slider("value")),
			RotatingDirection: parseInt($("#scan_mode_sel").val())
		};

		$.sendCmd("CW_JSON_SetPtzZone", msgBody).done(function () {
			ShowMsgDialog(IDC_LIVE_MSG_SETLEFTZONE);
		});
	});

	$('#area_right_btn').unbind("click").click(function () {
		var msgBody = {
			ChannelID: 0,
			ZoneId: 1,
			ControlType: 2
		};

		$.sendCmd("CW_JSON_SetPtzZone", msgBody).done(function () {
			ShowMsgDialog(IDC_LIVE_MSG_SETRIGHTZONE);
		});
	});

	$('#invoke_area_btn').unbind("click").click(function () {
		var msgBody = {
			ChannelID: 0,
			ZoneId: 1,
			ControlType: 0
		//	Speed: parseInt($(".speed .slider").slider("value"))
		};

		$.sendCmd("CW_JSON_SetPtzZone", msgBody).done(function () {
			ShowMsgDialog(IDC_LIVE_MSG_AREASCAN);
		});
	});

	$('#pattern_record').unbind("click").click(function () {
		var msgBody = {
			ChannelID: 0,
			PatternId: parseInt($('#pattern_sel').val()),
			ControlType: 1,
			PatternName: $.trim($('#pattern_name').val())
		};
		$.sendCmd("CW_JSON_SetPtzPattern", msgBody).done(function () {
			ShowMsgDialog(IDC_LIVE_MSG_BEGINPATTERN);
		});
	});

	$('#pattern_stop').unbind("click").click(function () {
		var msgBody = {
			ChannelID: 0,
			PatternId: parseInt($('#pattern_sel').val()),
			ControlType: 2,
			PatternName: $.trim($('#pattern_name').val())
		};

		$.sendCmd("CW_JSON_SetPtzPattern", msgBody).done(function () {
			$('#pattern_sel option[value="' + msgBody["PatternId"] + '"]').attr("pattern_name", msgBody["PatternName"]);
			$('#pattern_sel option[value="' + msgBody["PatternId"] + '"]').css("background-color","#0B93D5");
			ShowMsgDialog(IDC_LIVE_MSG_ENDPATTERN);
		});
		
	});

	$('#pattern_sel').change(function () {
		var sel = $(this).val();
		var presetName = $('#pattern_sel option[value="' + sel + '"]').attr("pattern_name");
		if (presetName) {
			$('#pattern_name').val(presetName);
		} else {
			$('#pattern_name').val("");
		}
	});

	$('#invoke_pattern').unbind("click").click(function () {
		var msgBody = {
			ChannelID: 0,
			PatternId: parseInt($('#pattern_sel').val()),
			ControlType: 0,
			PatternName: $.trim($('#pattern_name').val())
		};

		$.sendCmd("CW_JSON_SetPtzPattern", msgBody).done(function () {
			// ShowMsgDialog(IDC_LIVE_MSG_INVOKEPATTERN);
		});
	});

	$('#watch_mode_sel').unbind("click").click(function () {
		var sel = parseInt($(this).val());
		if (sel == 0) {
			$("#watch_task").empty().attr('disabled', 'disabled');
		} else if (sel == 1) {
			$("#watch_task").empty().removeAttr("disabled");
			var msgBody = {
				ChannelID: 0
			};
			$.sendCmd("CW_JSON_GetPtzPreset", msgBody).done(function (presetInfo) {
				var list = presetInfo["PresetList"];
				var presetID = 0, presetName = "";
				var innerHtml = "";
				if (list) {
					for (var i = 0; i < list.length; i ++) {
						presetID = list[i]["PresetId"];
						presetName = list[i]["PresetName"];
						innerHtml += '<option value="' + presetID + '" preset_name="' + presetName + '">' + presetID + '</option>';
					}
					$('#watch_task').append(innerHtml);
				}
			});
		} else if (sel == 4) {
			$("#watch_task").empty().attr('disabled', 'disabled');
		} else {
			$("#watch_task").empty().removeAttr("disabled");
			var i = 1;
			var innerHtml = "";
			for (i = 1; i <= 4; i ++) {
				innerHtml = '<option value"' + i +'">' + i + '</option>';
				$('#watch_task').append(innerHtml);
			}
		}
	});

	$('#watch_btn').unbind("click").click(function () {
		var taskId = 0;
		var sel = parseInt($('#watch_mode_sel').val());
		
		switch (sel) {
			case 0:
			case 4:
				taskId = 0;
				break;
			case 1:
			case 2:
			case 3:
				taskId = parseInt($('#watch_task').val());
				break;
		}
		
		var msgBody = {
			ChannelID: 0,
			TaskType: parseInt($('#watch_mode_sel').val()),
			TaskId: taskId,
			FreeTime: parseInt($('#watch_time_text').val())
		};

		$.sendCmd("CW_JSON_SetPtzKeepWatch", msgBody).done(function () {
			ShowMsgDialog(IDC_LIVE_MSG_SETWATCH);
		});
	});

	RangeInput({
		domid: "watch_time_text",
		min: 5,
		max: 600
	});

	// 巡航
	$('#tour_sel').change(function () {
		GetTour(parseInt($(this).val()));
	});

	$('#add_tour_btn').unbind("click").click(function () {
		AddTour();
	});

	$('#del_tour_btn').unbind("click").click(function () {
		DelTour();
	});

	$('#invoke_tour_btn').unbind("click").click(function () {
		InvokeTour();
	});

	$('#save_tour_btn').unbind("click").click(function () {
		SaveTour();
		GiveTourSel_Bg();
	});


}
function InitTour(){
	var ptzNum = 4;
	var msgBody = {};
	var temp = 0;
	$("#tour_sel").val(1);
	for(var i = 0; i < ptzNum; i++)
	{
		temp = i + 1;
		
		msgBody = {
			ChannelID: 0,
			TourId: temp
		};
		$.sendCmd("CW_JSON_GetPtzTour", msgBody).done(function (tourInfo) {
			if (tourInfo) {
				var nodeList = tourInfo['NodeList'];
				if (nodeList) {					
					if(nodeList.length){						
						$('#tour_sel option[value="' + temp + '"]').css("background-color","#0B93D5");
					}
					else{						
						$('#tour_sel option[value="' + temp + '"]').css("background-color","#ffffff");
					}
				}
				else{
					$('#tour_sel option[value="' + temp + '"]').css("background-color","#ffffff");
				}
			}
			else{
				$('#tour_sel option[value="' + temp + '"]').css("background-color","#ffffff");
			}
		}).fail(function(){
			$('#tour_sel option[value="' + temp + '"]').css("background-color","#ffffff");
		})
	}	
}
function GetPTZMsg() {
	GetPreset();
	GetPattern();
	GetWatch();
	GetTour(0);
}

function GetPreset() {
	var msgBody = {
		ChannelID: 0
	};
	
	$.sendCmd("CW_JSON_GetPtzPreset", msgBody).done(function (presetInfo) {
		var list = presetInfo["PresetList"];
		var presetID = 0, presetName = "";
		
		if (list) {
			for (var i = 0; i < list.length; i ++) {
				presetID = list[i]["PresetId"];
				presetName = list[i]["PresetName"];
				$('#preset_sel_id option[value="' + presetID + '"]').attr("preset_name", presetName).css("background-color", "#0B93D5");								
		 		if(presetID == 1){						
		 		$('#preset_text_name').val(presetName);
		 		}
			}
		}
		$("#preset_sel_id").val(1);
	});
}

function GetPattern() {
	var msgBody = {
		ChannelID: 0,
		PatternId: 1
	};

	var i = 1;
	var nodeNum  = 0;
	for (i = 1; i <= 4; i ++) {
		msgBody["PatternId"] = i;		
		$.sendCmd("CW_JSON_GetPtzPattern", msgBody).done(function (patternInfo) {
			$('#pattern_sel option[value="' + patternInfo["PatternId"] + '"]').attr("pattern_name", patternInfo["PatternName"]);
			nodeNum = patternInfo["NodeNum"];
			if(nodeNum){
				$('#pattern_sel option[value="' + patternInfo["PatternId"] + '"]').css("background-color","#0B93D5");
			}
		});		
	}

	$("#pattern_sel").trigger("change", "0");
}

function GetWatch() {
	var msgBody = {
		ChannelID: 0
	};

	$.sendCmd("CW_JSON_GetPtzKeepWatch", msgBody).done(function (watchInfo) {
		$('#watch_time_text').val(watchInfo['FreeTime']);
		$('#watch_mode_sel').val(watchInfo['TaskType']);
		$('#watch_mode_sel').trigger('click');
		$('#watch_task').val(watchInfo['TaskId']);
	});
}

function GetTour(tourId) {
	$("#tour_table tr").eq(0).nextAll().remove();
	var msgBody = {
		ChannelID: 0,
		TourId: tourId
	};

	$.sendCmd("CW_JSON_GetPtzTour", msgBody).done(function (tourInfo) {
		if (tourInfo) {
			var nodeList = tourInfo['NodeList'];
			if (nodeList) {
				var insertHtml = "";
				for (var i = 0; i < nodeList.length; i ++) {
					insertHtml += '<tr>';
					insertHtml += '<td>' + nodeList[i]['PresetId'] + '</td>';
					insertHtml += '<td>' + nodeList[i]['delay'] + '</td>';
					insertHtml += '</tr>';
				}
				
				$('#tour_table').append(insertHtml);
				RefreshTable();
			}
		}
	});
}
function IsTourMaxNumberOutLimited(){	
	var len = $("#tour_table").find("tr").length - 1;
	if(len >= 32){
		alert(IDC_PTZ_TOUR_SCAN_MAX_NUMBER_LIMITED);
		return true;
	}else{
		var tour_time = parseInt($("#dialog_tour_time").val());
		if(tour_time < 2||tour_time > 255){
			alert(IDC_PTZ_TOUR_TIME_OUTLIMITED);
			return true;
		}
		return false;
	}	
}
function AddTour() {

		
	$('#dialog_tour_presetid').empty();
	$('#dialog_tour_time').val("");

	$("#addtourdialog").dialog({
		bgiframe: true,
		resizable: false,
		modal: true,
		width: 360,
  		height: 180,
  		title: IDC_GENERAL_MSG_TITLE,
		buttons: [
			{
				text: IDC_GENERAL_ADD,
				click: function () {
					if(IsTourMaxNumberOutLimited()){
						return;
					}					
					var insertHtml = "";
					var presetId = parseInt($('#dialog_tour_presetid').val());
					var delayTime = parseInt($('#dialog_tour_time').val());

					if (presetId && delayTime) {
						insertHtml += '<tr>';
						insertHtml += '<td>' + presetId + '</td>';
						insertHtml += '<td>' + delayTime + '</td>';
						insertHtml += '</tr>';
						$('#tour_table').append(insertHtml);
						RefreshTable();
					}
				}
			},
			{
				text: IDC_GENERAL_CANCEL,
				click: function () {
					$(this).dialog("close");
				}
			}
		]
	});

	$(".ui-dialog[aria-describedby='addtourdialog']").bgiframe();

	var msgBody = {
		ChannelID: 0
	};

	$.sendCmd("CW_JSON_GetPtzPreset", msgBody).done(function (presetInfo) {
		var list = presetInfo["PresetList"];
		var presetID = 0, presetName = "";
		var insertHtml = "";

		if (list) {
			for (var i = 0; i < list.length; i ++) {
				presetID = list[i]["PresetId"];
				presetName = list[i]["PresetName"];
				insertHtml += '<option presetName="' + presetName + '" value="' + presetID + '">' + presetID + '</option>';
			}

			$("#dialog_tour_presetid").append(insertHtml);
		}
	});
}

function DelTour() {
	var activeTr = $('#tour_table tr.tr_active')[0];
	if (activeTr) {
		$('#tour_table tr.tr_active').remove();
	}
	
}

function InvokeTour() {
	var msgBody = {
		ChannelID: 0,
		TourId: parseInt($('#tour_sel').val())
	};

	$.sendCmd("CW_JSON_CallPtzTour", msgBody).done(function () {
	});
}

function SaveTour() {
	var len = $("#tour_table").find("tr").length - 1;
	var tourList = [];

	$("#tour_table tr:not(:first)").each(function (index) {
		var td = $(this).find("td");
		var presetID = parseInt($(td[0]).text());
		var delayTime = parseInt($(td[1]).text());

		tourList[index] = {};
		tourList[index]["PresetId"] = presetID;
		tourList[index]["delay"] = delayTime;
	});

	var msgBody = {
		ChannelID: 0,
		TourId: parseInt($('#tour_sel').val()),
		TourName: "",
		NodeList: tourList
	};
	
	$.sendCmd("CW_JSON_SetPtzTour", msgBody).done(function () {
		ShowMsgDialog(IDC_LIVE_MSG_SETTOUR);
	});

}
function GiveTourSel_Bg()
{
	var len = $("#tour_table").find("tr").length - 1;
	var TourId = parseInt($('#tour_sel').val());
	if(len == 0)
	{
		$('#tour_sel option[value="' + TourId + '"]').css("background-color","#ffffff");
	}
	else
	{
		$('#tour_sel option[value="' + TourId + '"]').css("background-color","#0B93D5");
	}
}
function RefreshTable () {
	$("#tour_table tr:not(:first)").click(function () {
		$('#tour_table tr.tr_active').removeClass('tr_active');
		$(this).addClass('tr_active');
	});
}
