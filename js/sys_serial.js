var g_pInfo;
var Option24 = "";
var Option60 = "";
var OptionPreset = "";
var OptionTour = "";
var OptionPattern = "";
var OptionArea = "";
var OptionDisSelect = "";
var TypeHtml = "";
var OptionType = "";
var g_ptz_changelimit = false;
var g_ptz_page = 0;//0 串口 1 ptz
function OptionInit(){
	var i = 0;
	Option24 = "";
	for (i = 0; i < 24; i ++) 
	{	
		if(i < 10)
		{
			Option24 += '<option value="' + i + '">' + 0 + i + '</option>';
		}
		else
		{
			Option24 += '<option value="' + i + '">' + i + '</option>';
		}
	}
	Option60 = "";
	for (i = 0; i < 60; i ++) 
	{
		if(i < 10)
		{
			Option60 += '<option value="' + i + '">' + 0 + i + '</option>';
		}
		else
		{
			Option60 += '<option value="' + i + '">' + i + '</option>';
		}
	}	
	OptionPreset = "";
	var msgBody = {
		ChannelID: 0
	};
	var innerHtml = "";
	$.sendCmd("CW_JSON_GetPtzPreset", msgBody).done(function (presetInfo) {
		var list = presetInfo["PresetList"];
		var presetID = 0, presetName = "";
		
		if (list) {
			for (var i = 0; i < list.length; i ++) {
				presetID = list[i]["PresetId"];
				presetName = list[i]["PresetName"];
				innerHtml += '<option value="' + presetID + '" preset_name="' + presetName + '">' + presetID + '</option>';
			}
		//	$('#watch_task').append(innerHtml);
		}
	});

	OptionPreset += innerHtml;

	
	OptionTour = "";
	
	innerHtml = "";
	for (i = 1; i <= 4; i ++) {
	innerHtml += '<option value"' + i +'">' + i + '</option>';
//	$('#watch_task').append(innerHtml);
	}
	OptionTour += innerHtml;	
	
	OptionPattern = "";
	OptionPattern += innerHtml;	
	
	OptionDisSelect = "";	
	OptionDisSelect += '<select id = "watch_task"' + 'class = "txt"' + 'style = "width:60px;"'+ 'disabled = "disabled"' + '></select>';
	
	OptionType = "";
	OptionType += '<option value = "0">' + IDC_LIVE_PTZWATCH_CLOSE + '</option>';
	OptionType += '<option value = "1">' + IDC_LIVE_PTZWATCH_PRESET + '</option>';
	OptionType += '<option value = "2">' + IDC_LIVE_PTZWATCH_CRZ + '</option>';
	OptionType += '<option value = "3">' + IDC_LIVE_PTZWATCH_PATTERN + '</option>';
	OptionType += '<option value = "4">' + IDC_LIVE_PTZWATCH_AREA + '</option>';
	
	
}
$(document).on("menu_show_sys_serial", function () {
	
	OptionInit();
    $("#selAddr").empty();
	$(".sys_serial .tabs").tabs();
	$('.sys_serial .ui-widget-content').css('border', '0px');
	
	$('#ptz_copy').hwbutton();
	$('#ptz_add_task').hwbutton();
	$('#ptz_del_task').hwbutton();
	for (var i = 1; i < 256; i ++) {
		$("#selAddr").append('<option value="' + i + '">' + i + '</option>');
	}

	var msgBody = {
		ChannelID: 0,
		BaudRate: 1,
		Protocol: 1,
		Address: 1
	};

	$.sendCmd("CW_JSON_GetPtz", msgBody).done(function (ptzInfo) {
		$('#selAddr').val(ptzInfo['Address']);
		$('#selBaud').val(ptzInfo['BaudRate']);
		$('#selProtocol').val(ptzInfo['Protocol']);
	});
	var ptzmsgBody = {
		"ChannelID": 0,
		"Enable":1,
		"FreeTime":1
	};
	$.sendCmd("CW_JSON_GetPtzTask",ptzmsgBody).done(function(pInfo){
		g_pInfo = pInfo;
		var enable = parseInt(g_pInfo["Enable"]);
		var FreeTime = parseInt(g_pInfo["FreeTime"]);
		if(isNaN(FreeTime)){
			FreeTime = 0;
		}
		$("#ptz_time_task_enable").attr("checked",enable == 0?false:true);
		$("#ptz_task_restart_time").val(FreeTime);
		show_ptz_scheduling();
	})
	$("#ptz_cur_sel_week").change(function () {
		if(!g_ptz_changelimit)
		{
			return; 
		}
		else
		{
			g_ptz_changelimit = false;
		}

			
	//	var time5 = new Date().getTime();
		
		$("#ptz_scheduling tr:gt(0)").remove();
		var week_sel = parseInt($("#ptz_cur_sel_week").val(),10);
		var time_task;
		if (g_pInfo) {
			
			switch (week_sel) {
				case 0: {
					time_task = g_pInfo["Sunday"];
					break;
				}
				case 1: {
					time_task = g_pInfo["Monday"];
					break;
				}
				case 2: {
					time_task = g_pInfo["Tuesday"];
					break;
				}
				case 3: {
					time_task = g_pInfo["Wednesday"];
					break;
				}
				case 4: {
					time_task = g_pInfo["Thursday"];
					break;
				}
				case 5: {
					time_task = g_pInfo["Friday"];
					break;
				}
				case 6: {
					time_task = g_pInfo["Saturday"];
					break;
				}
			}
			log(time_task);
			var index = 0;
			
			if (time_task) {
				for (index = 0; index < time_task.length; index ++) 
				{
					var insertHtml = "";
					var len = $("#ptz_scheduling").find("tr").length - 1;
					insertHtml  = "<tr>";
			        insertHtml += '<td>';
			        insertHtml += '<select id="start_hour_' + len + '" class="start_hour sysselect"></select>';
			        insertHtml += '<label>' + IDC_GENERAL_HOUR_H + '</label>';
			        insertHtml += '<select id="start_minute_' + len + '" class="start_minute sysselect"></select>';
			        insertHtml += '<label>' + IDC_GENERAL_MINUTE_M + '</label>';
			        insertHtml += '<select id="start_second_' + len + '" class="start_second sysselect"></select>';
			        insertHtml += '<label>' + IDC_GENERAL_SECOND_S + '</label>';
			        insertHtml += '</td>';
			        insertHtml += '<td>';
			        insertHtml += '<select id="end_hour_' + len + '" class="end_hour sysselect"></select>';
			        insertHtml += '<label>' + IDC_GENERAL_HOUR_H + '</label>';
			        insertHtml += '<select id="end_minute_' + len + '" class="end_minute sysselect"></select>';
			        insertHtml += '<label>' + IDC_GENERAL_MINUTE_M + '</label>';
			        insertHtml += '<select id="end_second_' + len + '" class="end_second sysselect"></select>';
			        insertHtml += '<label>' + IDC_GENERAL_SECOND_S + '</label>';
			        insertHtml += '</td>';

					insertHtml += '<td class = "td_center">';
					insertHtml += '<select id = "watch_mode_sel_' + len + '"' + 'class = "sel_wid"' + '></select>';
					insertHtml += '</td>';
					insertHtml += '<td class = "td_center">';
					insertHtml += '<select id = "task_number_' + len + '"' + 'class = "sel_wid"' + '></select>';
					insertHtml += '</td>';		
					insertHtml += '</tr>';
								      
					$("#ptz_scheduling").append(insertHtml);
					
					$("#start_hour_" + len).append(Option24);
					$("#end_hour_" + len).append(Option24);
					$("#start_minute_" + len).append(Option60);
					$("#end_minute_" + len).append(Option60);
					$("#start_second_" + len).append(Option60);
					$("#end_second_" + len).append(Option60);
					$("#watch_mode_sel_" + len).append(OptionType);
					$("#watch_mode_sel_" + len).unbind("change").change(function(){												
						var id = this.id;
						var val = this.value;
						BindPtzTypeChange(id,val);
					})
					var startTime = time_task[index]['TaskTimeStart'];
					var endTime = time_task[index]['TaskTimeEnd'];
					var taskType = parseInt(time_task[index]['PtzDo']['TaskType']);
					var taskNumber = parseInt(time_task[index]['PtzDo']['TaskId']);
					
					var hour = 0, minute = 0, second = 0;
					hour = parseInt((startTime / 3600),10);
					startTime -= hour * 3600;
					minute = parseInt((startTime / 60),10);
					startTime -= minute * 60;
					second = startTime;
					$('#start_hour_' + len).val(hour);
					$('#start_minute_' + len).val(minute);
					$('#start_second_' + len).val(second);

					hour = parseInt((endTime / 3600),10);
					endTime -= hour * 3600;
					minute = parseInt((endTime / 60),10);
					endTime -= minute * 60;
					second = endTime;
					$('#end_hour_' + len).val(hour);
					$('#end_minute_' + len).val(minute);
					$('#end_second_' + len).val(second);
					
					$("#watch_mode_sel_" + len).val(taskType);
					$("#task_number_" + len).val(taskNumber);
					showTaskNumber(len,taskType,taskNumber);
				}

			}
		
		}
		
	//	var time6 = new Date().getTime();
		
		
		
	});
	$("#ptz_copy").unbind("click").click(function () {		
		var ret = CheckPyzTimeValidity();
		if(ret){
		var display = $(".ui-dialog[aria-describedby='ptz_copy_to_dialog']").css("display");
		if (display != 'block') {
			var week_sel = parseInt($("#ptz_cur_sel_week").val(),10);
			var weekArray = ["dialog_sunday_chk",
							 "dialog_monday_chk",
							 "dialog_tuesday_chk",
							 "dialog_wednesday_chk",
							 "dialog_thursday_chk",
							 "dialog_friday_chk",
							 "dialog_saturday_chk"];
			// 清除disable
			for (var i = 0; i < weekArray.length; i ++) {
				$("#" + weekArray[i]).removeAttr("disabled");
				// 用jquery的attr方法, 第二次的时候会达不到效果, 故而改为这种写法
				eval("document.all." + weekArray[i] + ".checked = false");
			}
			if ((week_sel >= 0) && (week_sel < weekArray.length)) {
				$('#' + weekArray[week_sel]).attr('disabled', 'disabled');
				eval("document.all." + weekArray[week_sel] + ".checked = true");
			}

			$("#ptz_copy_to_dialog").dialog({
				bgiframe: true,
				resizable: false,
				modal: true,
				width: 360,
		  		height: 160,
		  		title: IDC_GENERAL_MSG_TITLE,
				buttons: [
					{
						text: IDC_GENERAL_OK,
						click: function () {
							if (g_pInfo == null) {
								g_pInfo = {};
							}						
							var week_task = PtzGetSelWeek();
							if ($('#ptz_dialog_sunday_chk').prop('checked')) {
								g_pInfo["Sunday"] = week_task;
							}
							if ($('#ptz_dialog_monday_chk').prop('checked')) {
								g_pInfo["Monday"] = week_task;
							}
							if ($('#ptz_dialog_tuesday_chk').prop('checked')) {
								g_pInfo["Tuesday"] = week_task;
							}
							if ($('#ptz_dialog_wednesday_chk').prop('checked')) {
								g_pInfo["Wednesday"] = week_task;
							}
							if ($('#ptz_dialog_thursday_chk').prop('checked')) {
								g_pInfo["Thursday"] = week_task;
							}
							if ($('#ptz_dialog_friday_chk').prop('checked')) {
								g_pInfo["Friday"] = week_task;
							}
							if ($('#ptz_dialog_saturday_chk').prop('checked')) {
								g_pInfo["Saturday"] = week_task;
							}

							$(this).dialog("close");
						}
					}
				]
			});

			$(".ui-dialog[aria-describedby='ptz_copy_to_dialog']").bgiframe();
		}
		}
	});
	$("#ptz_add_task").unbind("click").click(function () {
		var len = $("#ptz_scheduling").find("tr").length - 1;
		if (len >= 10) {
			alert(IDC_SETTING_DIALOG_SYS_FRONTENDRECORD_MAXTASK);
        	return
		}
		var TypeHtml = "",TaskNumberHtml = "";
		var insertHtml = "";
		insertHtml = "<tr>";
        insertHtml += '<td>';
        insertHtml += '<select id="start_hour_' + len + '" class="start_hour sysselect"></select>';
        insertHtml += '<label>' + IDC_GENERAL_HOUR_H + '</label>';
        insertHtml += '<select id="start_minute_' + len + '" class="start_minute sysselect"></select>';
        insertHtml += '<label>' + IDC_GENERAL_MINUTE_M + '</label>';
        insertHtml += '<select id="start_second_' + len + '" class="start_second sysselect"></select>';
        insertHtml += '<label>' + IDC_GENERAL_SECOND_S + '</label>';
        insertHtml += '</td>';
        insertHtml += '<td>';
        insertHtml += '<select id="end_hour_' + len + '" class="end_hour sysselect"></select>';
        insertHtml += '<label>' + IDC_GENERAL_HOUR_H + '</label>';
        insertHtml += '<select id="end_minute_' + len + '" class="end_minute sysselect"></select>';
        insertHtml += '<label>' + IDC_GENERAL_MINUTE_M + '</label>';
        insertHtml += '<select id="end_second_' + len + '" class="end_second sysselect"></select>';
        insertHtml += '<label>' + IDC_GENERAL_SECOND_S + '</label>';
        insertHtml += '</td>';
		
		insertHtml += '<td class = "td_center">';
		insertHtml += '<select id = "watch_mode_sel_' + len + '"' + 'class = "sel_wid"' + '></select>';
		insertHtml += '</td>';
		insertHtml += '<td class = "td_center">';
		insertHtml += '<select id = "task_number_' + len + '"' + 'class = "sel_wid"' + '></select>';
		insertHtml += '</td>';		
        insertHtml += '</tr>';
		$("#ptz_scheduling").append(insertHtml);
		
		
		var index = 0;
		for (index = 0; index < 24; index ++) {
			if(index < 10){
			$("#start_hour_" + len).append('<option value="' + index + '">' + 0 + index + '</option>');
        	$("#end_hour_" + len).append('<option value="' + index + '">' + 0 + index + '</option>');
			}
			else{
			$("#start_hour_" + len).append('<option value="' + index + '">' + index + '</option>');
        	$("#end_hour_" + len).append('<option value="' + index + '">' + index + '</option>');
			}
		}
		for (index = 0; index < 60; index ++) {
			if(index < 10){
			$("#start_minute_" + len).append('<option value="' + index + '">' + 0 + index + '</option>');
			$("#start_second_" + len).append('<option value="' + index + '">' + 0 + index + '</option>');
			$("#end_minute_" + len).append('<option value="' + index + '">' + 0 + index + '</option>');
			$("#end_second_" + len).append('<option value="' + index + '">' + 0 + index + '</option>');
			}
			else
			{
			$("#start_minute_" + len).append('<option value="' + index + '">' + index + '</option>');
			$("#start_second_" + len).append('<option value="' + index + '">' + index + '</option>');
			$("#end_minute_" + len).append('<option value="' + index + '">' + index + '</option>');
			$("#end_second_" + len).append('<option value="' + index + '">' + index + '</option>');			
			}
		}
		$("#watch_mode_sel_" + len).append(OptionType);
		$("#watch_mode_sel_" + len).unbind("change").change(function(){
			
			var id = this.id;
			var val = this.value;
			BindPtzTypeChange(id,val);
		})
	});
	$("#ptz_del_task").unbind("click").click(function () {
		var len = $("#ptz_scheduling").find("tr").length - 1;
		if (len <= 0) {
        	return;
		}
		
      	$("#ptz_scheduling tr:last").remove()
	});
	
	$("#pm_save_bt").unbind("click").click(function(){
		$("#pm_content").trigger("menu_save_sys_serial");
	})
})
function SetPtzPage(index){
	g_ptz_page = index;
}
function GetPtzPage(){
	return g_ptz_page;
}
function PtzSetchange(bStatus)
{

	g_ptz_changelimit = bStatus;
}
function show_ptz_scheduling(){
	$("#ptz_scheduling tr:gt(0)").remove();
	var week_sel = parseInt($("#ptz_cur_sel_week").val(),10);
	var time_task;
	
	if (g_pInfo) {
		switch (week_sel) {
			case 0: {
				time_task = g_pInfo["Sunday"];
			
				break;
			}
			case 1: {
				time_task = g_pInfo["Monday"];
				break;
			}
			case 2: {
				time_task = g_pInfo["Tuesday"];
				break;
			}
			case 3: {
				time_task = g_pInfo["Wednesday"];
				break;
			}
			case 4: {
				time_task = g_pInfo["Thursday"];
				break;
			}
			case 5: {
				time_task = g_pInfo["Friday"];
				break;
			}
			case 6: {
				time_task = g_pInfo["Saturday"];
				break;
			}
		}
		log(time_task);
		var index = 0;
		if (time_task) {
			for (index = 0; index < time_task.length; index ++) 
			{
				var insertHtml = "";
				var len = $("#ptz_scheduling").find("tr").length - 1;
				insertHtml  = "<tr>";
		        insertHtml += '<td>';
		        insertHtml += '<select id="start_hour_' + len + '" class="start_hour sysselect"></select>';
		        insertHtml += '<label>' + IDC_GENERAL_HOUR_H + '</label>';
		        insertHtml += '<select id="start_minute_' + len + '" class="start_minute sysselect"></select>';
		        insertHtml += '<label>' + IDC_GENERAL_MINUTE_M + '</label>';
		        insertHtml += '<select id="start_second_' + len + '" class="start_second sysselect"></select>';
		        insertHtml += '<label>' + IDC_GENERAL_SECOND_S + '</label>';
		        insertHtml += '</td>';
		        insertHtml += '<td>';
		        insertHtml += '<select id="end_hour_' + len + '" class="end_hour sysselect"></select>';
		        insertHtml += '<label>' + IDC_GENERAL_HOUR_H + '</label>';
		        insertHtml += '<select id="end_minute_' + len + '" class="end_minute sysselect"></select>';
		        insertHtml += '<label>' + IDC_GENERAL_MINUTE_M + '</label>';
		        insertHtml += '<select id="end_second_' + len + '" class="end_second sysselect"></select>';
		        insertHtml += '<label>' + IDC_GENERAL_SECOND_S +'</label>';
		        insertHtml += '</td>';
				insertHtml += '<td class = "td_center">';
				insertHtml += '<select id = "watch_mode_sel_' + len + '"' + 'class = "sel_wid"' + '></select>';
				insertHtml += '</td>';
				insertHtml += '<td class = "td_center">';
				insertHtml += '<select id = "task_number_' + len + '"' + 'class = "sel_wid"' + '></select>';
				insertHtml += '</td>';		
				insertHtml += '</tr>';
				
				$("#ptz_scheduling").append(insertHtml);

					
				$("#start_hour_" + len).append(Option24);
				$("#end_hour_" + len).append(Option24);
				$("#start_minute_" + len).append(Option60);
				$("#end_minute_" + len).append(Option60);
				$("#start_second_" + len).append(Option60);
				$("#end_second_" + len).append(Option60);
				$("#watch_mode_sel_" + len).append(OptionType);
				$("#watch_mode_sel_" + len).unbind("change").change(function(){												
					var id = this.id;
					var val = this.value;
					BindPtzTypeChange(id,val);
				})
				
				var startTime = time_task[index]['TaskTimeStart'];
				var endTime = time_task[index]['TaskTimeEnd'];
				var taskType = parseInt(time_task[index]['PtzDo']['TaskType']);
				var taskNumber = parseInt(time_task[index]['PtzDo']['TaskId']);
				
				var hour = 0, minute = 0, second = 0;
				hour = parseInt((startTime / 3600),10);
				startTime -= hour * 3600;
				minute = parseInt((startTime / 60),10);
				startTime -= minute * 60;
				second = startTime;
				$('#start_hour_' + len).val(hour);
				$('#start_minute_' + len).val(minute);
				$('#start_second_' + len).val(second);

				hour = parseInt((endTime / 3600),10);
				endTime -= hour * 3600;
				minute = parseInt((endTime / 60),10);
				endTime -= minute * 60;
				second = endTime;
				$('#end_hour_' + len).val(hour);
				$('#end_minute_' + len).val(minute);
				$('#end_second_' + len).val(second);

				$("#watch_mode_sel_" + len).val(taskType);
				$("#task_number_" + len).val(taskNumber);
				
				showTaskNumber(len,taskType,taskNumber);	
			}			

		}
	}	
}
function PtzGetSelWeek() {
	var dstDayTime = [];
	var hour, minute, second;
	var index = 0;
	var len = $("#ptz_scheduling").find("tr").length - 1;
	
	for (index = 0; index < len; index ++) {
		dstDayTime[index] = {};
		hour = parseInt($("#start_hour_" + index).val(),10);
		minute = parseInt($("#start_minute_" + index).val(),10);
		second = parseInt($("#start_second_" + index).val(),10);
		dstDayTime[index]["TaskTimeStart"] = hour * 3600 + minute * 60 + second;

		hour = parseInt($("#end_hour_" + index).val(),10);
		minute = parseInt($("#end_minute_" + index).val(),10);
		second = parseInt($("#end_second_" + index).val(),10);
		dstDayTime[index]["TaskTimeEnd"] = hour * 3600 + minute * 60 + second;
		dstDayTime[index]["PtzDo"] = {};
		dstDayTime[index]["PtzDo"]["TaskType"] = parseInt($("#watch_mode_sel_" + index).val());
		dstDayTime[index]["PtzDo"]["TaskId"] = parseInt($("#task_number_" + index).val());
	}
	return dstDayTime;
}

function CheckPyzTimeValidity(){
	var start_hour, start_minute, start_second;
	var end_hour, end_minute, end_second;
	var index = 1;
	var len = $("#ptz_scheduling").find("tr").length - 1;
	var is_validity = 1;
	for (index = 0; index < len; index ++) {
		start_hour = parseInt($("#start_hour_" + index).val(),10);
		start_minute = parseInt($("#start_minute_" + index).val(),10);
		start_second = parseInt($("#start_second_" + index).val(),10);
		end_hour = parseInt($("#end_hour_" + index).val(),10);
		end_minute = parseInt($("#end_minute_" + index).val(),10);
		end_second = parseInt($("#end_second_" + index).val(),10);		
		if(start_hour < end_hour)
		{
			continue;
		}
		else if(start_hour == end_hour)
		{
			if(start_minute < end_minute)
			{
				continue;
			}
			else if(start_minute == end_minute)
			{
				if(start_second <= end_second)
				{
					continue;
				}
				else
				{
					alert(IDC_SETTING_DIALOG_SYS_FRONTENDRECORD_BEGINTIME + ":" + start_second + IDC_GENERAL_SECOND + IDC_GENERAL_GREATER + IDC_SETTING_DIALOG_SYS_FRONTENDRECORD_ENDTIME + ":" + end_second + IDC_GENERAL_SECOND);
					is_validity = 0;
					break;					
				}
			}
			else
			{
				alert(IDC_SETTING_DIALOG_SYS_FRONTENDRECORD_BEGINTIME + ":" + start_minute + IDC_GENERAL_MINUTE + IDC_GENERAL_GREATER + IDC_SETTING_DIALOG_SYS_FRONTENDRECORD_ENDTIME + ":" + end_minute + IDC_GENERAL_MINUTE);
				is_validity = 0;
				break;				
			}
		}
		else
		{
			alert(IDC_SETTING_DIALOG_SYS_FRONTENDRECORD_BEGINTIME + ":" + start_hour + IDC_GENERAL_HOUR + IDC_GENERAL_GREATER + IDC_SETTING_DIALOG_SYS_FRONTENDRECORD_ENDTIME + ":" + end_hour + IDC_GENERAL_HOUR);
			is_validity = 0;
			break;			
		}
	}	
	return is_validity;
}

function ptz_scheduling_init(){
	$("#ptz_scheduling tr:gt(0)").remove();
	var week_sel = parseInt($("#ptz_cur_sel_week").val());
	var time_task;
	if(g_pInfo){
		switch(week_sel){
			case 0:
				time_task = g_pInfo["Sunday"];
			break;
			case 1:
				time_task = g_pInfo["Monday"];
			break;
			case 2:
				time_task = g_pInfo["Tuesday"];
			break;
			case 3:
				time_task = g_pInfo["Wednesday"];
			break;
			case 4:
				time_task = g_pInfo["Thursday"];
			break;
			case 5:
				time_task = g_pInfo["Friday"];
			break;
			case 6:
				time_task = g_pInfo["Saturday"];
			break;
			default:
				time_task = g_pInfo["Sunday"];
			break;
		}
		var index = 0;
		if(time_task){
			for (index = 0; index < time_task.length; index ++) {
				var insertHtml = "";
				var TypeHtml = "",TaskNumberHtml = "";
				var len = $("#ptz_scheduling").find("tr").length - 1;
				insertHtml  = "<tr>";
		        insertHtml += '<td>';
		        insertHtml += '<select id="start_hour_' + len + '" class="start_hour sysselect"></select>';
		        insertHtml += '<label>' + IDC_GENERAL_HOUR_H + '</label>';
		        insertHtml += '<select id="start_minute_' + len + '" class="start_minute sysselect"></select>';
		        insertHtml += '<label>' + IDC_GENERAL_MINUTE_M + '</label>';
		        insertHtml += '<select id="start_second_' + len + '" class="start_second sysselect"></select>';
		        insertHtml += '<label>' + IDC_GENERAL_SECOND_S + '</label>';
		        insertHtml += '</td>';
		        insertHtml += '<td>';
		        insertHtml += '<select id="end_hour_' + len + '" class="end_hour sysselect"></select>';
		        insertHtml += '<label>' + IDC_GENERAL_HOUR_H + '</label>';
		        insertHtml += '<select id="end_minute_' + len + '" class="end_minute sysselect"></select>';
		        insertHtml += '<label>' + IDC_GENERAL_MINUTE_M + '</label>';
		        insertHtml += '<select id="end_second_' + len + '" class="end_second sysselect"></select>';
		        insertHtml += '<label>' + IDC_GENERAL_SECOND_S +'</label>';
		        insertHtml += '</td>';
				insertHtml += '<td>';
				insertHtml += '<select id = "watch_mode_sel_' + len + '"' + 'class = "txt"' + 'style = "width:60px;"></select>';
				insertHtml += '</td>';
				insertHtml += '<td>';
				insertHtml += '<select id = "task_number_' + len + '"' + 'class = "txt"' + 'style = "width:60px;"'+ '></select>';
				insertHtml += '</td>';
												
		        insertHtml += '</tr>';
				$("#ptz_scheduling").append(insertHtml);				
				
				$("#start_hour_" + len).append(Option24);
				$("#end_hour_" + len).append(Option24);
				$("#start_minute_" + len).append(Option60);
				$("#end_minute_" + len).append(Option60);
				$("#start_second_" + len).append(Option60);
				$("#end_second_" + len).append(Option60);
				$("#watch_mode_sel_" + len).append(OptionType);
				$("#watch_mode_sel_" + len).unbind("change").change(function(){
					
					var id = this.id;
					var val = this.value;
					BindPtzTypeChange(id,val);
				})
				var startTime = time_task[index]['TaskTimeStart'];
				var endTime = time_task[index]['TaskTimeEnd'];
				var taskType = parseInt(time_task[index]['PtzDo']['TaskType']);
				var taskNumber = parseInt(time_task[index]['PtzDo']['TaskId']);
				
				var hour = 0, minute = 0, second = 0;
				hour = parseInt((startTime / 3600),10);
				startTime -= hour * 3600;
				minute = parseInt((startTime / 60),10);
				startTime -= minute * 60;
				second = startTime;
				$('#start_hour_' + len).val(hour);
				$('#start_minute_' + len).val(minute);
				$('#start_second_' + len).val(second);

				hour = parseInt((endTime / 3600),10);
				endTime -= hour * 3600;
				minute = parseInt((endTime / 60),10);
				endTime -= minute * 60;
				second = endTime;
				$('#end_hour_' + len).val(hour);
				$('#end_minute_' + len).val(minute);
				$('#end_second_' + len).val(second);
				$("#watch_mode_sel_" + len).val(taskType);				
				$("#task_number_" + len).val(taskNumber);
				
				showTaskNumber(index,taskType,taskNumber);
			}
		}
		
	}
	
}
function BindPtzTypeChange(id,val){
	var NumberId = id.replace(/watch_mode_sel_/,"task_number_");
	var Option = "";
	val = parseInt(val);
	switch(val){
		case 0:		
			break;
		case 1:
			Option = OptionPreset;
			break;
		case 2:
			Option = OptionTour;
			break;
		case 3:
			Option = OptionPattern;
			break;
		case 4:			
			break;
		default:
			break;
	}
	$("#" + NumberId).empty();
	$("#" + NumberId).append(Option);
	if(Option == ""){
		$("#" + NumberId).attr("disabled","disabled");
	}else{
		$("#" + NumberId).attr("disabled",false);
	}
}
function showTaskNumber(index,taskType,taskNumber){
	var type = taskType;
	var num = taskNumber;
	switch(type)
	{
		case 0:			
			break;
		case 1:
			$("#task_number_" + index).append(OptionPreset);						
			break;
		case 2:
			$("#task_number_" + index).append(OptionTour);			
			break;
		case 3:
			$("#task_number_" + index).append(OptionPattern);			
			break;
		case 4:		
			break;
		default:
			break;
	}
	$("#task_number_" + index).val(num);
}
function CheckPtzTimeValidity(){
	var start_hour, start_minute, start_second;
	var end_hour, end_minute, end_second;
	var index = 1;
	var len = $("#ptz_scheduling").find("tr").length - 1;
	var is_validity = 1;
	for (index = 0; index < len; index ++) {
		start_hour = parseInt($("#start_hour_" + index).val(),10);
		start_minute = parseInt($("#start_minute_" + index).val(),10);
		start_second = parseInt($("#start_second_" + index).val(),10);
		end_hour = parseInt($("#end_hour_" + index).val(),10);
		end_minute = parseInt($("#end_minute_" + index).val(),10);
		end_second = parseInt($("#end_second_" + index).val(),10);		
		if(start_hour < end_hour)
		{
			continue;
		}
		else if(start_hour == end_hour)
		{
			if(start_minute < end_minute)
			{
				continue;
			}
			else if(start_minute == end_minute)
			{
				if(start_second <= end_second)
				{
					continue;
				}
				else
				{
					alert(IDC_SETTING_DIALOG_SYS_FRONTENDRECORD_BEGINTIME + ":" + start_second + IDC_GENERAL_SECOND + IDC_GENERAL_GREATER + IDC_SETTING_DIALOG_SYS_FRONTENDRECORD_ENDTIME + ":" + end_second + IDC_GENERAL_SECOND);
					is_validity = 0;
					break;					
				}
			}
			else
			{
				alert(IDC_SETTING_DIALOG_SYS_FRONTENDRECORD_BEGINTIME + ":" + start_minute + IDC_GENERAL_MINUTE + IDC_GENERAL_GREATER + IDC_SETTING_DIALOG_SYS_FRONTENDRECORD_ENDTIME + ":" + end_minute + IDC_GENERAL_MINUTE);
				is_validity = 0;
				break;				
			}
		}
		else
		{
			alert(IDC_SETTING_DIALOG_SYS_FRONTENDRECORD_BEGINTIME + ":" + start_hour + IDC_GENERAL_HOUR + IDC_GENERAL_GREATER + IDC_SETTING_DIALOG_SYS_FRONTENDRECORD_ENDTIME + ":" + end_hour + IDC_GENERAL_HOUR);
			is_validity = 0;
			break;			
		}
	}	
	return is_validity;
}

$(document).on("menu_save_sys_serial", function () {
	if(GetPtzPage() == 0){
	// nothing
	var msgBody = {
		ChannelID: 0,
		BaudRate: parseInt($('#selBaud').val()),
		Protocol: parseInt($('#selProtocol').val()),
		Address: parseInt($('#selAddr').val())
	};

	$.sendCmd("CW_JSON_SetPtz", msgBody).done(function () {
		alert(IDC_GENERAL_SAVESUCCESS);

	}).fail(function () {
		alert(IDC_GENERAL_SAVEFAIL);
	});
	}else if(GetPtzPage() == 1)
	{
	var ret = CheckPtzTimeValidity();
	if(!ret){		
		return;
	}
	var week_task = PtzGetSelWeek();//
	var len = $("#ptz_scheduling").find("tr").length - 1;
	var week_sel = parseInt($("#ptz_cur_sel_week").val(),10);//which day
	var weekArray = ["Sunday",
					 "Monday",
					 "Tuesday",
					 "Wednesday",
					 "Thursday",
					 "Friday",
					 "Saturday"];
	if ((week_sel >= 0) && (week_sel < weekArray.length)) {
		g_pInfo[weekArray[week_sel]] = week_task;
	}
	var ptzmsgBody = {
		"Enable":$("#ptz_time_task_enable").prop("checked") == false ? 0:1,
		"FreeTime":parseInt($("#ptz_task_restart_time").val()),
		"Sunday":g_pInfo["Sunday"],
		"Monday":g_pInfo["Monday"],
		"Tuesday":g_pInfo["Tuesday"],
		"Wednesday":g_pInfo["Wednesday"],
		"Thursday":g_pInfo["Thursday"],
		"Friday":g_pInfo["Friday"],
		"Saturday":g_pInfo["Saturday"]		
	}
	$.sendCmd("CW_JSON_SetPtzTask",ptzmsgBody).done(function(){
		alert(IDC_GENERAL_SAVESUCCESS);
	}).fail(function(){
		alert(IDC_GENERAL_SAVEFAIL);
	})
					 
	}
})

$(document).on("menu_close_sys_serial", function () {
	// nothing
})