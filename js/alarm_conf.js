var g_alarmConf = null;
var Alarm_Option24 = "";
var Alarm_Option60 = "";
var g_limit_select_change = false;
$(document).on("menu_show_alarm_set", function () {
	var i = 0;
	Alarm_Option24 = "";
	for (i = 0; i < 24; i ++) 
	{	
		if(i < 10)
		{
			Alarm_Option24 += '<option value="' + i + '">' + 0 + i + '</option>';
		}
		else
		{
			Alarm_Option24 += '<option value="' + i + '">' + i + '</option>';
		}
	}
	Alarm_Option60 = "";
	for (i = 0; i < 60; i ++) 
	{
		if(i < 10)
		{
			Alarm_Option60 += '<option value="' + i + '">' + 0 + i + '</option>';
		}
		else
		{
			Alarm_Option60 += '<option value="' + i + '">' + i + '</option>';
		}
	}
	var date1 = new Date().getTime();
	
	$(".alarm_set .tabs").tabs();
	$('.alarm_set .ui-widget-content').css('border', '0px');

	$("#alarm_copy_to_btn").hwbutton();
	$("#alarm_add_task_btn").hwbutton();
	$("#alarm_del_task_btn").hwbutton();

	var msgBody = {
		AlarmModel: 1,
        FtpUploadEnable: 1,
        EmailEnable: 1
	};
	var msgBodyFunc = {
		SnapPicCount: 1,
        SnapPicFrequency: 1,
        AlarmRecordTime: 1,
        AlarmDeviceAction: 1,
        AlarmChannel0Action: 1
	};

	$.when($.sendCmd("CW_JSON_GetAlarmActionParam", msgBody), $.sendCmd("CW_JSON_GetAlarmParam", msgBodyFunc)).done(function (actionInfo, funcInfo) {
		if (actionInfo) {
			g_alarmConf = actionInfo;
			$("#alarm_cur_sel_week").trigger("change", "0");
		}
		var date2 = new Date().getTime();
		if (funcInfo) {
			$('#alarm_strategy').val(parseInt(actionInfo["AlarmModel"]));
			$("#enable_ftp").attr('checked', (parseInt(actionInfo["FtpUploadEnable"],10) == 0) ? false : true);
			$("#enable_email").attr('checked', (parseInt(actionInfo["EmailEnable"],10) == 0) ? false : true);
			$("#record_time").val(parseInt(funcInfo["AlarmRecordTime"],10));
			$("#snap_num").val(parseInt(funcInfo["SnapPicCount"],10));
			$("#snap_freq").val(parseInt(funcInfo["SnapPicFrequency"],10));

			var deviceAction = parseInt(funcInfo["AlarmDeviceAction"],10);
			$('#device_alarm_io1').attr('checked', ((deviceAction) & 1 == 1) ? true : false);
			$('#device_alarm_io2').attr('checked', ((deviceAction >> 1) & 1 == 1) ? true : false);
			$('#device_alarm_io3').attr('checked', ((deviceAction >> 2) & 1 == 1) ? true : false);
			$('#device_alarm_io4').attr('checked', ((deviceAction >> 3) & 1 == 1) ? true : false);
			$('#device_alarm_neterror').attr('checked', ((deviceAction >> 4) & 1 == 1) ? true : false);
			$('#device_alarm_deverror').attr('checked', ((deviceAction >> 5) & 1 == 1) ? true : false);

		//	var chn0Action = parseInt(funcInfo["AlarmChannel0Action"]);
		//	$('#chn_alarm_motion').attr('checked', ((chn0Action) & 1 == 1) ? true : false);
		}
	});
	
	$("#pm_save_bt").unbind("click").click(function(){
		$("#pm_content").trigger("menu_save_alarm_set");
	})
	
	if(g_alarmConf != null){
		var date3 = new Date().getTime();
		InitRecScheduling();
		var date4 = new Date().getTime();
	}
	
	$("#alarm_cur_sel_week").change(function () {
		if(!g_limit_select_change)
		{
			return;
		}
		else
		{
			g_limit_select_change = false;
		}
		var datechan1 = new Date().getTime();
		$("#alarm_rec_scheduling tr:gt(0)").remove();
		var week_sel = parseInt($("#alarm_cur_sel_week").val(),10);
		var time_task;

		if (g_alarmConf) {
			switch (week_sel) {
				case 0: {
					time_task = g_alarmConf["Sunday"];
					break;
				}
				case 1: {
					time_task = g_alarmConf["Monday"];
					break;
				}
				case 2: {
					time_task = g_alarmConf["Tuesday"];
					break;
				}
				case 3: {
					time_task = g_alarmConf["Wednesday"];
					break;
				}
				case 4: {
					time_task = g_alarmConf["Thursday"];
					break;
				}
				case 5: {
					time_task = g_alarmConf["Friday"];
					break;
				}
				case 6: {
					time_task = g_alarmConf["Saturday"];
					break;
				}
			}

			var index = 0;
			if (time_task) {
				for (index = 0; index < time_task.length; index ++)  
				{
					var insertHtml = "";
					var len = $("#alarm_rec_scheduling").find("tr").length - 1;
					insertHtml = "<tr>";
			        insertHtml += '<td>';
			        insertHtml += '<select id="alarm_start_hour_' + len + '" class="start_hour sysselect"></select>';
			        insertHtml += '<label>' + IDC_GENERAL_HOUR + '</label>';
			        insertHtml += '<select id="alarm_start_minute_' + len + '" class="start_minute sysselect"></select>';
			        insertHtml += '<label>' + IDC_GENERAL_MINUTE + '</label>';
			        insertHtml += '<select id="alarm_start_second_' + len + '" class="start_second sysselect"></select>';
			        insertHtml += '<label>' + IDC_GENERAL_SECOND + '</label>';
			        insertHtml += '</td>';
			        insertHtml += '<td>';
			        insertHtml += '<select id="alarm_end_hour_' + len + '" class="end_hour sysselect"></select>';
			        insertHtml += '<label>' + IDC_GENERAL_HOUR + '</label>';
			        insertHtml += '<select id="alarm_end_minute_' + len + '" class="end_minute sysselect"></select>';
			        insertHtml += '<label>' + IDC_GENERAL_MINUTE + '</label>';
			        insertHtml += '<select id="alarm_end_second_' + len + '" class="end_second sysselect"></select>';
			        insertHtml += '<label>' + IDC_GENERAL_SECOND + '</label>';
			        insertHtml += '</td>';
			        insertHtml += '</tr>';

					$("#alarm_rec_scheduling").append(insertHtml);
				
					$("#alarm_start_hour_" + len).append(Alarm_Option24);
					$("#alarm_end_hour_" + len).append(Alarm_Option24);
					$('#alarm_start_minute_' + len).append(Alarm_Option60);
					$("#alarm_end_minute_" + len).append(Alarm_Option60);
					$("#alarm_start_second_" + len).append(Alarm_Option60);
					$("#alarm_end_second_" + len).append(Alarm_Option60);

					var startTime = time_task[index]['TaskTimeStart'];
					var endTime = time_task[index]['TaskTimeEnd'];
					var hour = 0, minute = 0, second = 0;
					hour = parseInt((startTime / 3600),10);
					startTime -= hour * 3600;
					minute = parseInt((startTime / 60),10);
					startTime -= minute * 60;
					second = startTime;
					$('#alarm_start_hour_' + len).val(hour);
					$('#alarm_start_minute_' + len).val(minute);
					$('#alarm_start_second_' + len).val(second);

					hour = parseInt((endTime / 3600),10);
					endTime -= hour * 3600;
					minute = parseInt((endTime / 60),10);
					endTime -= minute * 60;
					second = endTime;
					$('#alarm_end_hour_' + len).val(hour);
					$('#alarm_end_minute_' + len).val(minute);
					$('#alarm_end_second_' + len).val(second);
						
				}				
				/*
				for (index = 0; index < time_task.length; index ++) {
					var len = $("#alarm_rec_scheduling").find("tr").length - 1;
					var insertHtml = "";
					insertHtml = "<tr>";
			        insertHtml += '<td>';
			        insertHtml += '<select id="alarm_start_hour_' + len + '" class="start_hour sysselect"></select>';
			        insertHtml += '<label>' + IDC_GENERAL_HOUR + '</label>';
			        insertHtml += '<select id="alarm_start_minute_' + len + '" class="start_minute sysselect"></select>';
			        insertHtml += '<label>' + IDC_GENERAL_MINUTE + '</label>';
			        insertHtml += '<select id="alarm_start_second_' + len + '" class="start_second sysselect"></select>';
			        insertHtml += '<label>' + IDC_GENERAL_SECOND + '</label>';
			        insertHtml += '</td>';
			        insertHtml += '<td>';
			        insertHtml += '<select id="alarm_end_hour_' + len + '" class="end_hour sysselect"></select>';
			        insertHtml += '<label>' + IDC_GENERAL_HOUR + '</label>';
			        insertHtml += '<select id="alarm_end_minute_' + len + '" class="end_minute sysselect"></select>';
			        insertHtml += '<label>' + IDC_GENERAL_MINUTE + '</label>';
			        insertHtml += '<select id="alarm_end_second_' + len + '" class="end_second sysselect"></select>';
			        insertHtml += '<label>' + IDC_GENERAL_SECOND + '</label>';
			        insertHtml += '</td>';
			        insertHtml += '</tr>';
					$("#alarm_rec_scheduling").append(insertHtml);

					var i = 0;
					for (i = 0; i < 24; i ++) {
						$("#alarm_start_hour_" + len).append('<option value="' + i + '">' + i + '</option>');
						$("#alarm_end_hour_" + len).append('<option value="' + i + '">' + i + '</option>');
					}
					for (i = 0; i < 60; i ++) {
						$("#alarm_start_minute_" + len).append('<option value="' + i + '">' + i + '</option>');
						$("#alarm_start_second_" + len).append('<option value="' + i + '">' + i + '</option>');
						$("#alarm_end_minute_" + len).append('<option value="' + i + '">' + i + '</option>');
						$("#alarm_end_second_" + len).append('<option value="' + i + '">' + i + '</option>');
					}

					var startTime = time_task[index]['TaskTimeStart'];
					var endTime = time_task[index]['TaskTimeEnd'];
					var hour = 0, minute = 0, second = 0;
					hour = parseInt((startTime / 3600),10);
					startTime -= hour * 3600;
					minute = parseInt((startTime / 60),10);
					startTime -= minute * 60;
					second = startTime;// - minute * 60;
					$('#alarm_start_hour_' + len).val(hour);
					$('#alarm_start_minute_' + len).val(minute);
					$('#alarm_start_second_' + len).val(second);

					hour = parseInt((endTime / 3600),10);
					endTime -= hour * 3600;
					minute = parseInt((endTime / 60),10);
					endTime -= minute * 60;
					second = endTime;// - minute * 60;
					$('#alarm_end_hour_' + len).val(hour);
					$('#alarm_end_minute_' + len).val(minute);
					$('#alarm_end_second_' + len).val(second);
				}
				*/
			}
			
		}
		var datechan2 = new Date().getTime();
	});

	$("#alarm_copy_to_btn").unbind("click").click(function () {
		var ret = CheckTimeValidity();
		if(ret){
		var display = $(".ui-dialog[aria-describedby='alarm_copy_to_dialog']").css("display");
		if (display != 'block') {
			var week_sel = parseInt($("#alarm_cur_sel_week").val(),10);
			var weekArray = ["alarm_dialog_sunday_chk",
							 "alarm_dialog_monday_chk",
							 "alarm_dialog_tuesday_chk",
							 "alarm_dialog_wednesday_chk",
							 "alarm_dialog_thursday_chk",
							 "alarm_dialog_friday_chk",
							 "alarm_dialog_saturday_chk"];

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
		
			$("#alarm_copy_to_dialog").dialog({
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
							if (g_alarmConf == null) {
								g_alarmConf = {};
							}
							var week_task = getSelWeek();
							if ($('#alarm_dialog_sunday_chk').prop('checked')) {
								g_alarmConf["Sunday"] = week_task;
							}
							if ($('#alarm_dialog_monday_chk').prop('checked')) {
								g_alarmConf["Monday"] = week_task;
							}
							if ($('#alarm_dialog_tuesday_chk').prop('checked')) {
								g_alarmConf["Tuesday"] = week_task;
							}
							if ($('#alarm_dialog_wednesday_chk').prop('checked')) {
								g_alarmConf["Wednesday"] = week_task;
							}
							if ($('#alarm_dialog_thursday_chk').prop('checked')) {
								g_alarmConf["Thursday"] = week_task;
							}
							if ($('#alarm_dialog_friday_chk').prop('checked')) {
								g_alarmConf["Friday"] = week_task;
							}
							if ($('#alarm_dialog_saturday_chk').prop('checked')) {
								g_alarmConf["Saturday"] = week_task;
							}

							$(this).dialog("close");
						}
					}
				]
			});

			$(".ui-dialog[aria-describedby='alarm_copy_to_dialog']").bgiframe();
		}
		}
	});

	$("#alarm_add_task_btn").unbind("click").click(function () {
		var len = $("#alarm_rec_scheduling").find("tr").length - 1;
		if (len >= 10) {
			alert(IDC_SETTING_DIALOG_ALARM_MAXTASK);
        	return
		}

		var insertHtml = "";
		insertHtml = "<tr>";
        insertHtml += '<td>';
        insertHtml += '<select id="alarm_start_hour_' + len + '" class="start_hour sysselect"></select>';
        insertHtml += '<label>' + IDC_GENERAL_HOUR + '</label>';
        insertHtml += '<select id="alarm_start_minute_' + len + '" class="start_minute sysselect"></select>';
        insertHtml += '<label>' + IDC_GENERAL_MINUTE + '</label>';
        insertHtml += '<select id="alarm_start_second_' + len + '" class="start_second sysselect"></select>';
        insertHtml += '<label>' + IDC_GENERAL_SECOND + '</label>';
        insertHtml += '</td>';
        insertHtml += '<td>';
        insertHtml += '<select id="alarm_end_hour_' + len + '" class="end_hour sysselect"></select>';
        insertHtml += '<label>' + IDC_GENERAL_HOUR + '</label>';
        insertHtml += '<select id="alarm_end_minute_' + len + '" class="end_minute sysselect"></select>';
        insertHtml += '<label>' + IDC_GENERAL_MINUTE + '</label>';
        insertHtml += '<select id="alarm_end_second_' + len + '" class="end_second sysselect"></select>';
        insertHtml += '<label>' + IDC_GENERAL_SECOND + '</label>';
        insertHtml += '</td>';
        insertHtml += '</tr>';
		$("#alarm_rec_scheduling").append(insertHtml);

		var index = 0;
		for (index = 0; index < 24; index ++) {
			if(index < 10){
			$("#alarm_start_hour_" + len).append('<option value="' + index + '">' + 0 + index + '</option>');
        	$("#alarm_end_hour_" + len).append('<option value="' + index + '">' + 0 + index + '</option>');
			}
			else{
			$("#alarm_start_hour_" + len).append('<option value="' + index + '">' + index + '</option>');
        	$("#alarm_end_hour_" + len).append('<option value="' + index + '">' + index + '</option>');
			}
		}
		for (index = 0; index < 60; index ++) {
			if(index < 10){
			$("#alarm_start_minute_" + len).append('<option value="' + index + '">' + 0 + index + '</option>');
			$("#alarm_start_second_" + len).append('<option value="' + index + '">' + 0 + index + '</option>');
			$("#alarm_end_minute_" + len).append('<option value="' + index + '">' + 0 + index + '</option>');
			$("#alarm_end_second_" + len).append('<option value="' + index + '">' + 0 + index + '</option>');
			}
			else{
			$("#alarm_start_minute_" + len).append('<option value="' + index + '">' + index + '</option>');
			$("#alarm_start_second_" + len).append('<option value="' + index + '">' + index + '</option>');
			$("#alarm_end_minute_" + len).append('<option value="' + index + '">' + index + '</option>');
			$("#alarm_end_second_" + len).append('<option value="' + index + '">' + index + '</option>');
			}
		}
	});
	
	$("#alarm_del_task_btn").unbind("click").click(function () {
		var len = $("#alarm_rec_scheduling").find("tr").length - 1;
		if (len <= 0) {
        	return;
		}
      
      	$("#alarm_rec_scheduling tr:last").remove()
	});
})
function SetChange1(bStatus)
{
	g_limit_select_change = bStatus;
}
function InitRecScheduling()
{
	$("#alarm_rec_scheduling tr:gt(0)").remove();
	var week_sel = parseInt($("#alarm_cur_sel_week").val(),10);
	var time_task;
	
	if (g_alarmConf) {
		switch (week_sel) {
			case 0: {
				time_task = g_alarmConf["Sunday"];
				break;
			}
			case 1: {
				time_task = g_alarmConf["Monday"];
				break;
			}
			case 2: {
				time_task = g_alarmConf["Tuesday"];
				break;
			}
			case 3: {
				time_task = g_alarmConf["Wednesday"];
				break;
			}
			case 4: {
				time_task = g_alarmConf["Thursday"];
				break;
			}
			case 5: {
				time_task = g_alarmConf["Friday"];
				break;
			}
			case 6: {
				time_task = g_alarmConf["Saturday"];
				break;
			}
		}

		var index = 0;
		if (time_task) {
			
			for (index = 0; index < time_task.length; index ++)  
			{
				var insertHtml = "";
				var len = $("#alarm_rec_scheduling").find("tr").length - 1;
				insertHtml = "<tr>";
		        insertHtml += '<td>';
		        insertHtml += '<select id="alarm_start_hour_' + len + '" class="start_hour sysselect"></select>';
		        insertHtml += '<label>' + IDC_GENERAL_HOUR + '</label>';
		        insertHtml += '<select id="alarm_start_minute_' + len + '" class="start_minute sysselect"></select>';
		        insertHtml += '<label>' + IDC_GENERAL_MINUTE + '</label>';
		        insertHtml += '<select id="alarm_start_second_' + len + '" class="start_second sysselect"></select>';
		        insertHtml += '<label>' + IDC_GENERAL_SECOND + '</label>';
		        insertHtml += '</td>';
		        insertHtml += '<td>';
		        insertHtml += '<select id="alarm_end_hour_' + len + '" class="end_hour sysselect"></select>';
		        insertHtml += '<label>' + IDC_GENERAL_HOUR + '</label>';
		        insertHtml += '<select id="alarm_end_minute_' + len + '" class="end_minute sysselect"></select>';
		        insertHtml += '<label>' + IDC_GENERAL_MINUTE + '</label>';
		        insertHtml += '<select id="alarm_end_second_' + len + '" class="end_second sysselect"></select>';
		        insertHtml += '<label>' + IDC_GENERAL_SECOND + '</label>';
		        insertHtml += '</td>';
		        insertHtml += '</tr>';

				$("#alarm_rec_scheduling").append(insertHtml);
					
				$("#alarm_start_hour_" + len).append(Alarm_Option24);
				$("#alarm_end_hour_" + len).append(Alarm_Option24);
				$('#alarm_start_minute_' + len).append(Alarm_Option60);
				$("#alarm_end_minute_" + len).append(Alarm_Option60);
				$("#alarm_start_second_" + len).append(Alarm_Option60);
				$("#alarm_end_second_" + len).append(Alarm_Option60);

				var startTime = time_task[index]['TaskTimeStart'];
				var endTime = time_task[index]['TaskTimeEnd'];
				var hour = 0, minute = 0, second = 0;
				hour = parseInt((startTime / 3600),10);
				startTime -= hour * 3600;
				minute = parseInt((startTime / 60),10);
				startTime -= minute * 60;
				second = startTime;
				$('#alarm_start_hour_' + len).val(hour);
				$('#alarm_start_minute_' + len).val(minute);
				$('#alarm_start_second_' + len).val(second);

				hour = parseInt((endTime / 3600),10);
				endTime -= hour * 3600;
				minute = parseInt((endTime / 60),10);
				endTime -= minute * 60;
				second = endTime;
				$('#alarm_end_hour_' + len).val(hour);
				$('#alarm_end_minute_' + len).val(minute);
				$('#alarm_end_second_' + len).val(second);
					
			}			
			/*
			for (index = 0; index < time_task.length; index ++) {
				var len = $("#alarm_rec_scheduling").find("tr").length - 1;
				var insertHtml = "";
				insertHtml = "<tr>";
		        insertHtml += '<td>';
		        insertHtml += '<select id="alarm_start_hour_' + len + '" class="start_hour sysselect"></select>';
		        insertHtml += '<label>' + IDC_GENERAL_HOUR + '</label>';
		        insertHtml += '<select id="alarm_start_minute_' + len + '" class="start_minute sysselect"></select>';
		        insertHtml += '<label>' + IDC_GENERAL_MINUTE + '</label>';
		        insertHtml += '<select id="alarm_start_second_' + len + '" class="start_second sysselect"></select>';
		        insertHtml += '<label>' + IDC_GENERAL_SECOND + '</label>';
		        insertHtml += '</td>';
		        insertHtml += '<td>';
		        insertHtml += '<select id="alarm_end_hour_' + len + '" class="end_hour sysselect"></select>';
		        insertHtml += '<label>' + IDC_GENERAL_HOUR + '</label>';
		        insertHtml += '<select id="alarm_end_minute_' + len + '" class="end_minute sysselect"></select>';
		        insertHtml += '<label>' + IDC_GENERAL_MINUTE + '</label>';
		        insertHtml += '<select id="alarm_end_second_' + len + '" class="end_second sysselect"></select>';
		        insertHtml += '<label>' + IDC_GENERAL_SECOND + '</label>';
		        insertHtml += '</td>';
		        insertHtml += '</tr>';
				$("#alarm_rec_scheduling").append(insertHtml);

				var i = 0;
				for (i = 0; i < 24; i ++) {
					$("#alarm_start_hour_" + len).append('<option value="' + i + '">' + i + '</option>');
					$("#alarm_end_hour_" + len).append('<option value="' + i + '">' + i + '</option>');
				}
				for (i = 0; i < 60; i ++) {
					$("#alarm_start_minute_" + len).append('<option value="' + i + '">' + i + '</option>');
					$("#alarm_start_second_" + len).append('<option value="' + i + '">' + i + '</option>');
					$("#alarm_end_minute_" + len).append('<option value="' + i + '">' + i + '</option>');
					$("#alarm_end_second_" + len).append('<option value="' + i + '">' + i + '</option>');
				}

				var startTime = time_task[index]['TaskTimeStart'];
				var endTime = time_task[index]['TaskTimeEnd'];
				var hour = 0, minute = 0, second = 0;
				hour = parseInt((startTime / 3600),10);
				startTime -= hour * 3600;
				minute = parseInt((startTime / 60),10);
				startTime -= minute * 60;
				second = startTime;// - minute * 60;
				$('#alarm_start_hour_' + len).val(hour);
				$('#alarm_start_minute_' + len).val(minute);
				$('#alarm_start_second_' + len).val(second);

				hour = parseInt((endTime / 3600),10);
				endTime -= hour * 3600;
				minute = parseInt((endTime / 60),10);
				endTime -= minute * 60;
				second = endTime;// - minute * 60;
				$('#alarm_end_hour_' + len).val(hour);
				$('#alarm_end_minute_' + len).val(minute);
				$('#alarm_end_second_' + len).val(second);
			}
			*/
		}
		
	}
}
function getSelWeek() {
	var dstDayTime = [];
	var hour, minute, second;
	var index = 0;
	var len = $("#alarm_rec_scheduling").find("tr").length - 1;

	for (index = 0; index < len; index ++) {
		dstDayTime[index] = {};
		hour = parseInt($("#alarm_start_hour_" + index).val(),10);
		minute = parseInt($("#alarm_start_minute_" + index).val(),10);
		second = parseInt($("#alarm_start_second_" + index).val(),10);
		dstDayTime[index]["TaskTimeStart"] = hour * 3600 + minute * 60 + second;

		hour = parseInt($("#alarm_end_hour_" + index).val(),10);
		minute = parseInt($("#alarm_end_minute_" + index).val(),10);
		second = parseInt($("#alarm_end_second_" + index).val(),10);
		dstDayTime[index]["TaskTimeEnd"] = hour * 3600 + minute * 60 + second;
	}
	return dstDayTime;
}

$(document).on("menu_save_alarm_set", function () {
	var ret = CheckTimeValidity();
	if(ret){
	var week_task = getSelWeek();
	var week_sel = parseInt($("#alarm_cur_sel_week").val(),10);
	if (g_alarmConf == null) {
		g_alarmConf = {};
	}
	switch (week_sel) {
		case 0: {
			g_alarmConf["Sunday"] = week_task;
			break;
		}
		case 1: {
			g_alarmConf["Monday"] = week_task;
			break;
		}
		case 2: {
			g_alarmConf["Tuesday"] = week_task;
			break;
		}
		case 3: {
			g_alarmConf["Wednesday"] = week_task;
			break;
		}
		case 4: {
			g_alarmConf["Thursday"] = week_task;
			break;
		}
		case 5: {
			g_alarmConf["Friday"] = week_task;
			break;
		}
		case 6: {
			g_alarmConf["Saturday"] = week_task;
			break;
		}
	}

	var msgBody = {
		AlarmModel: parseInt($("#alarm_strategy").val(),10),
        FtpUploadEnable: ($('#enable_ftp').prop('checked') ? 1 : 0),
        EmailEnable: ($('#enable_email').prop('checked') ? 1 : 0),
        Sunday: g_alarmConf["Sunday"],
        Monday: g_alarmConf["Monday"],
        Tuesday: g_alarmConf["Tuesday"],
        Wednesday: g_alarmConf["Wednesday"],
        Thursday: g_alarmConf["Thursday"],
        Friday: g_alarmConf["Friday"],
        Saturday: g_alarmConf["Saturday"]
	};

	var deviceAction = 0,
		chn0Action = 0;

	if ($('#device_alarm_io1').prop('checked')) {
		deviceAction = deviceAction | 1;
	}
	if ($('#device_alarm_io2').prop('checked')) {
		deviceAction = deviceAction | (1 << 1);
	}
	if ($('#device_alarm_io3').prop('checked')) {
		deviceAction = deviceAction | (1 << 2);
	}
	if ($('#device_alarm_io4').prop('checked')) {
		deviceAction = deviceAction | (1 << 3);
	}
	if ($('#device_alarm_neterror').prop('checked')) {
		deviceAction = deviceAction | (1 << 4);
	}
	if ($('#device_alarm_deverror').prop('checked')) {
		deviceAction = deviceAction | (1 << 5);
	}

/*
	if ($('#chn_alarm_motion').prop('checked')) {
		chn0Action = chn0Action | 1;
	}
*/	
	if($("#record_time").val() >30 || $("#record_time").val() < 10)
	{
		alert(IDC_GENERAL_SECOND_ALARMRECORD_PROMPT);
		return;
	}
	var msgBodyFunc = {
		SnapPicCount: parseInt($("#snap_num").val(),10),
        SnapPicFrequency: parseInt($("#snap_freq").val(),10),
        AlarmRecordTime: parseInt($("#record_time").val(),10),
        AlarmDeviceAction: deviceAction,
        AlarmChannel0Action: chn0Action
	};

	$.when($.sendCmd("CW_JSON_SetAlarmActionParam", msgBody), $.sendCmd("CW_JSON_SetAlarmParam", msgBodyFunc)).done(function () {
		alert(IDC_GENERAL_SAVESUCCESS);
	}).fail(function () {
		alert(IDC_GENERAL_SAVEFAIL);
	});
	}
})
function CheckTimeValidity(){
	var start_hour, start_minute, start_second;
	var end_hour, end_minute, end_second;
	var index = 1;
	var len = $("#alarm_rec_scheduling").find("tr").length - 1;
	var is_validity = 1;
	for (index = 0; index < len; index ++) {
		start_hour = parseInt($("#alarm_start_hour_" + index).val(),10);
		start_minute = parseInt($("#alarm_start_minute_" + index).val(),10);
		start_second = parseInt($("#alarm_start_second_" + index).val(),10);
		end_hour = parseInt($("#alarm_end_hour_" + index).val(),10);
		end_minute = parseInt($("#alarm_end_minute_" + index).val(),10);
		end_second = parseInt($("#alarm_end_second_" + index).val(),10);		
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
$(document).on("menu_close_base_info", function () {

})
