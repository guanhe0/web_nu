var g_recordInfo = null;
var g_try_times = 4;
var upload_file_retry = g_try_times;// 尝试两次获取状态值为0时认为是无效的
var g_upload_timer = null;
var g_ftpPath = "";
var g_upload_progressbar = "";
var Option24 = "";
var Option60 = "";
var g_changelimit = false;
$(document).on("menu_show_frontend_record", function () {
//	var time1 = new Date().getTime();
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
	
	$(".frontend_record .tabs").tabs();
	$('.frontend_record .ui-widget-content').css('border', '0px');

	$("#record_upload").hwbutton();
	$("#copy_to_btn").hwbutton();
	$("#add_task_btn").hwbutton();
	$("#del_task_btn").hwbutton();

	RangeInput({
		domid: "rec_file_len",
		min: 1,
		max: 59
	});

	
	var index = 0;
	$('#input_begin_hour').empty();
	$('#input_end_hour').empty();
	for (index = 0; index < 24; index ++) {
		if(index < 10){
		$("#input_begin_hour").append('<option value="' + index + '">' + 0 + index + '</option>');
        $("#input_end_hour").append('<option value="' + index + '">' + 0 + index + '</option>');
		}
		else{
		$("#input_begin_hour").append('<option value="' + index + '">' + index + '</option>');
        $("#input_end_hour").append('<option value="' + index + '">' + index + '</option>');
		}
	}

	$('#input_begin_minute').empty();
	$('#input_begin_second').empty();
	$('#input_end_minute').empty();
	$('#input_end_second').empty();

	for (index = 0; index < 60; index ++) {
		if(index < 10){
		$("#input_begin_minute").append('<option value="' + index + '">' + 0 + index + '</option>');
        $("#input_begin_second").append('<option value="' + index + '">' + 0 + index + '</option>');
        $("#input_end_minute").append('<option value="' + index + '">' + 0 + index + '</option>');
        $("#input_end_second").append('<option value="' + index + '">' + 0 + index + '</option>');
		}
		else
		{
		$("#input_begin_minute").append('<option value="' + index + '">' + index + '</option>');
        $("#input_begin_second").append('<option value="' + index + '">' + index + '</option>');
        $("#input_end_minute").append('<option value="' + index + '">' + index + '</option>');
        $("#input_end_second").append('<option value="' + index + '">' + index + '</option>');		
		}
	}
	$("#pm_save_bt").unbind("click").click(function(){
		$("#pm_content").trigger("menu_save_frontend_record");
	})

	$('#input_begin_time').datetimepicker(
		{
			theme:'dark',
			lang:GetDatepickLang(),
			timepicker:false,
			format:'Y-m-d',
			mask:'9999-12-31',
			closeOnDateSelect:true,
			id:"input_begin_time_date",
			validateOnBlur:false,
			onSelectDate: function () {
				if ($('#input_end_time_date')) {
					$('#input_end_time').datetimepicker('destroy');
				}

				$('#input_end_time').datetimepicker(
					{
						theme:'dark',
						lang:GetDatepickLang(),
						timepicker:false,
						format:'Y-m-d',
						mask:'9999-12-31',
						closeOnDateSelect:true,
						id:"input_end_time_date",
						minDate: replaceAll($('#input_begin_time').val(), "-", "/"),
						validateOnBlur:false
					}
				)
			}
		}
	)

	$('#input_end_time').datetimepicker(
		{
			theme:'dark',
			lang:GetDatepickLang(),
			timepicker:false,
			format:'Y-m-d',
			mask:'9999-12-31',
			closeOnDateSelect:true,
			id:"input_end_time_date",
			validateOnBlur:false
		}
	)

	$("#record_upload").unbind("click").click(function () {
		
		var beginTime, endTime;
		var beginTimeStr = "", endTimeStr = "";

		beginTimeStr = $.trim($("#input_begin_time").val());
		endTimeStr = $.trim($("#input_end_time").val());

		beginTimeStr = beginTimeStr.split("-");
		endTimeStr = endTimeStr.split("-");

		beginTime = new Date(parseInt(beginTimeStr[0],10), parseInt(beginTimeStr[1] - 1,10), parseInt(beginTimeStr[2],10), $("#input_begin_hour").val(), $("#input_begin_minute").val(), $("#input_begin_second").val());
		endTime = new Date(parseInt(endTimeStr[0],10), parseInt(endTimeStr[1] - 1,10), parseInt(endTimeStr[2],10), $("#input_end_hour").val(), $("#input_end_minute").val(), $("#input_end_second").val());

		var msgBody = {
			ChannelID: 0,
	        FileFormat: parseInt($("#filetype").val(),10),
	        FileTimeStart: Date.UTC(parseInt(beginTimeStr[0],10), parseInt(beginTimeStr[1] - 1,10), parseInt(beginTimeStr[2],10), $("#input_begin_hour").val(), $("#input_begin_minute").val(), $("#input_begin_second").val()) / 1000,
	        FileTimeEnd: Date.UTC(parseInt(endTimeStr[0],10), parseInt(endTimeStr[1] - 1,10), parseInt(endTimeStr[2],10), $("#input_end_hour").val(), $("#input_end_minute").val(), $("#input_end_second").val()) / 1000
		};
		if(msgBody["FileTimeStart"] > msgBody["FileTimeEnd"] || msgBody["FileTimeStart"] == msgBody["FileTimeEnd"])
		{
			alert(IDC_SETTING_DIALOG_SYS_START_TIME_OVER_END_TIME);
			return;
		}
		var UploadStatus = 0;
		$("#record_upload").attr("disabled","disabled");		
		$.sendCmd("CW_JSON_UploadSdFile", msgBody).done(function () {
			g_upload_progressbar = $("#upfile_progress");
			g_upload_progressbar.progressbar({
		      	value: 0,
		      	complete: function () {		      						
					alert(IDC_FILE_ONTPUT_SUCCESS);
					$("#record_upload").attr("disabled",false);
					$('#upfile_contain').hide();					
					return;
		      	}
		    });
			
			UploadStatus = TimerGetStatus();
			if(UploadStatus == -1){
				return;
			}			
						
			$('#upfile_contain').show();
			

			
		});

		var msgNetBody = {
	        FtpAddress: 1,
	        FtpUploadPath: 1
		};

		$.sendCmd("CW_JSON_GetNetworkProtocol", msgNetBody).done(function (netInfo) {
			
			g_ftpPath = "ftp://" + netInfo["FtpAddress"] + "/" + netInfo["FtpUploadPath"];
		});
	});

	$("#copy_to_btn").unbind("click").click(function () {
		
		var ret = CheckAlarmTimeValidity();
		if(ret){
		var display = $(".ui-dialog[aria-describedby='copy_to_dialog']").css("display");
		if (display != 'block') {
			var week_sel = parseInt($("#cur_sel_week").val(),10);
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

			$("#copy_to_dialog").dialog({
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
							if (g_recordInfo == null) {
								g_recordInfo = {};
							}						
							var week_task = GetSelWeek();
							if ($('#dialog_sunday_chk').prop('checked')) {
								g_recordInfo["Sunday"] = week_task;
							}
							if ($('#dialog_monday_chk').prop('checked')) {
								g_recordInfo["Monday"] = week_task;
							}
							if ($('#dialog_tuesday_chk').prop('checked')) {
								g_recordInfo["Tuesday"] = week_task;
							}
							if ($('#dialog_wednesday_chk').prop('checked')) {
								g_recordInfo["Wednesday"] = week_task;
							}
							if ($('#dialog_thursday_chk').prop('checked')) {
								g_recordInfo["Thursday"] = week_task;
							}
							if ($('#dialog_friday_chk').prop('checked')) {
								g_recordInfo["Friday"] = week_task;
							}
							if ($('#dialog_saturday_chk').prop('checked')) {
								g_recordInfo["Saturday"] = week_task;
							}

							$(this).dialog("close");
						}
					}
				]
			});

			$(".ui-dialog[aria-describedby='copy_to_dialog']").bgiframe();
		}
		}
	});

	var msgBody = {
		ChannelID: 0,
        RecordTimeEnable: 1
	};

	$.sendCmd("CW_JSON_GetRecordParam", msgBody).done(function (recordInfo) {
	//	var time2 = new Date().getTime();
		g_recordInfo = recordInfo;
		$("#timer_record_chk").attr("checked", (parseInt(g_recordInfo["RecordTimeEnable"],10) == 0) ? false : true);
		$("#rec_file_len").val(g_recordInfo["RecordTimeLen"]);
		$("input[name='rec_disk_strategy'][value=" + parseInt(g_recordInfo["LowSpaceMethod"],10) + "]").attr("checked",true);

		$("#cur_sel_week").trigger("change", "0");
	});
	if(g_recordInfo != null){
	//	var time3 = new Date().getTime();
		InitRecScheduling1();
	//	var time4 = new Date().getTime();
	}
	$("#add_task_btn").unbind("click").click(function () {
		var len = $("#rec_scheduling").find("tr").length - 1;
		if (len >= 10) {
			alert(IDC_SETTING_DIALOG_SYS_FRONTENDRECORD_MAXTASK);
        	return
		}

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
        insertHtml += '</tr>';
		$("#rec_scheduling").append(insertHtml);

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
	});

	$("#del_task_btn").unbind("click").click(function () {
		var len = $("#rec_scheduling").find("tr").length - 1;
		if (len <= 0) {
        	return;
		}
      
      	$("#rec_scheduling tr:last").remove()
	});

	$("#cur_sel_week").change(function () {
		if(!g_changelimit)
		{
			return; 
		}
		else
		{
			g_changelimit = false;
		}

			
	//	var time5 = new Date().getTime();
		
		$("#rec_scheduling tr:gt(0)").remove();
		var week_sel = parseInt($("#cur_sel_week").val(),10);
		var time_task;
		if (g_recordInfo) {
			
			switch (week_sel) {
				case 0: {
					time_task = g_recordInfo["Sunday"];
					break;
				}
				case 1: {
					time_task = g_recordInfo["Monday"];
					break;
				}
				case 2: {
					time_task = g_recordInfo["Tuesday"];
					break;
				}
				case 3: {
					time_task = g_recordInfo["Wednesday"];
					break;
				}
				case 4: {
					time_task = g_recordInfo["Thursday"];
					break;
				}
				case 5: {
					time_task = g_recordInfo["Friday"];
					break;
				}
				case 6: {
					time_task = g_recordInfo["Saturday"];
					break;
				}
			}
			log(time_task);
			var index = 0;
			
			if (time_task) {
				for (index = 0; index < time_task.length; index ++) 
				{
					var insertHtml = "";
					var len = $("#rec_scheduling").find("tr").length - 1;
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
			        insertHtml += '</tr>';	
					$("#rec_scheduling").append(insertHtml);
					
					$("#start_hour_" + len).append(Option24);
					$("#end_hour_" + len).append(Option24);
					$("#start_minute_" + len).append(Option60);
					$("#end_minute_" + len).append(Option60);
					$("#start_second_" + len).append(Option60);
					$("#end_second_" + len).append(Option60);
					
					var startTime = time_task[index]['TaskTimeStart'];
					var endTime = time_task[index]['TaskTimeEnd'];
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
					
						
				}

			}
		
		}
		
	//	var time6 = new Date().getTime();
		
		
		
	});
});
function Setchange(bStatus)
{

	g_changelimit = bStatus;
}
function TimerGetStatus(timer) {
	$.sendCmd("CW_JSON_GetDevStatus").done(function (devStuInfo) {
		
		if (upload_file_retry == 0) {
			upload_file_retry = g_try_times;
			alert(IDC_UPLOAD_FILE_FAIL);
			$("#record_upload").attr("disabled",false);
			$('#upfile_contain').hide();
			return;
		}
		
		var total = 0, curUpload = 0;
		var ftpInfo = parseInt(devStuInfo["FtpUploadStatus"],10);//ftpInfo = 0 正在上传 -1 上传失败 -2 上传成功

		total = (ftpInfo >> 16) & 65535;
		curUpload = ftpInfo & 65535;		
		
		if(ftpInfo == -1)
		{
			alert(IDC_UPLOAD_FILE_FAIL);
			$("#record_upload").attr("disabled",false);
			$('#upfile_contain').hide();
			return -1;
		}
		else if(ftpInfo > 0)
		{
			var msgStr = "";
			var msgHtml = IDC_SETTING_DIALOG_SYS_FRONTENDRECORD_MSG1 + total + 
							IDC_SETTING_DIALOG_SYS_FRONTENDRECORD_MSG2 + curUpload + IDC_SETTING_DIALOG_SYS_FRONTENDRECORD_MSG3 + g_ftpPath;
			$('#upfile_msg')[0].innerHTML = msgHtml;
			g_upload_progressbar.progressbar("option", "max", total);
			g_upload_progressbar.progressbar("value", curUpload);						
			if (total == curUpload) {
					return;
			}

		}
		else if(ftpInfo == 0)
		{
			upload_file_retry--;
		}
		
		/*
		if ((ftpInfo == -1) || (ftpInfo == 0)) {
			upload_file_retry --;
		} else {
			var msgStr = "";
			total = (ftpInfo >> 16) & 65535;
			curUpload = ftpInfo & 65535;

			var msgHtml = IDC_SETTING_DIALOG_SYS_FRONTENDRECORD_MSG1 + total + 
							IDC_SETTING_DIALOG_SYS_FRONTENDRECORD_MSG2 + curUpload + IDC_SETTING_DIALOG_SYS_FRONTENDRECORD_MSG3 + g_ftpPath;
			$('#upfile_msg')[0].innerHTML = msgHtml;
			if (total == curUpload) {
				
			}
			g_upload_progressbar.progressbar("option", "max", total);
			g_upload_progressbar.progressbar("value", curUpload);
		}
		*/
		oneTime(1000, function () {
			TimerGetStatus();
		});
	})
}

$(document).on("menu_save_frontend_record", function () {
	var ret = CheckAlarmTimeValidity();
	if(ret){
	var week_task = GetSelWeek();//
	var len = $("#rec_scheduling").find("tr").length - 1;
	var week_sel = parseInt($("#cur_sel_week").val(),10);//which day
	
	var weekArray = ["Sunday",
					 "Monday",
					 "Tuesday",
					 "Wednesday",
					 "Thursday",
					 "Friday",
					 "Saturday"];
	if ((week_sel >= 0) && (week_sel < weekArray.length)) {
		g_recordInfo[weekArray[week_sel]] = week_task;
	}

	var msgBody = {
		ChannelID: parseInt(g_recordInfo["ChannelID"],10),
        RecordTimeEnable: ($('#timer_record_chk').prop('checked') ? 1 : 0),
        RecordTimeLen: parseInt($('#rec_file_len').val(),10),
        LowSpaceMethod: parseInt($('input:radio[name="rec_disk_strategy"]:checked').val(),10),
        Sunday: g_recordInfo["Sunday"],
        Monday: g_recordInfo["Monday"],
        Tuesday: g_recordInfo["Tuesday"],
        Wednesday: g_recordInfo["Wednesday"],
        Thursday: g_recordInfo["Thursday"],
        Friday: g_recordInfo["Friday"],
        Saturday: g_recordInfo["Saturday"]
	};
	$.sendCmd("CW_JSON_SetRecordParam", msgBody).done(function () {
		alert(IDC_GENERAL_SAVESUCCESS);
	}).fail(function () {
		alert(IDC_GENERAL_SAVEFAIL);
	});
	
  }
})

function GetSelWeek() {
	var dstDayTime = [];
	var hour, minute, second;
	var index = 0;
	var len = $("#rec_scheduling").find("tr").length - 1;
	
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
	}
	return dstDayTime;
}

function InitRecScheduling1(){
	$("#rec_scheduling tr:gt(0)").remove();
	var week_sel = parseInt($("#cur_sel_week").val(),10);
	var time_task;
	
	if (g_recordInfo) {
		switch (week_sel) {
			case 0: {
				time_task = g_recordInfo["Sunday"];
			
				break;
			}
			case 1: {
				time_task = g_recordInfo["Monday"];
				break;
			}
			case 2: {
				time_task = g_recordInfo["Tuesday"];
				break;
			}
			case 3: {
				time_task = g_recordInfo["Wednesday"];
				break;
			}
			case 4: {
				time_task = g_recordInfo["Thursday"];
				break;
			}
			case 5: {
				time_task = g_recordInfo["Friday"];
				break;
			}
			case 6: {
				time_task = g_recordInfo["Saturday"];
				break;
			}
		}
		log(time_task);
		var index = 0;
		if (time_task) {
			for (index = 0; index < time_task.length; index ++) 
			{
				var insertHtml = "";
				var len = $("#rec_scheduling").find("tr").length - 1;
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
		        insertHtml += '</tr>';
				$("#rec_scheduling").append(insertHtml);

					
				$("#start_hour_" + len).append(Option24);
				$("#end_hour_" + len).append(Option24);
				$("#start_minute_" + len).append(Option60);
				$("#end_minute_" + len).append(Option60);
				$("#start_second_" + len).append(Option60);
				$("#end_second_" + len).append(Option60);

				var startTime = time_task[index]['TaskTimeStart'];
				var endTime = time_task[index]['TaskTimeEnd'];
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
					
			}			

		}
	}
	
}

function CheckAlarmTimeValidity(){
	var start_hour, start_minute, start_second;
	var end_hour, end_minute, end_second;
	var index = 1;
	var len = $("#rec_scheduling").find("tr").length - 1;
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
$(document).on("menu_close_frontend_record", function () {
	
})
