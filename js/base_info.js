var g_operate_flag = 0; // 0: 正常 1: 升级 2: 重启 3: 恢复出厂默认值
var g_operate_timer = null;
var g_deviceInfo = null;
var g_LogPos = 0;
var g_LogStartTime;
var g_LogEndTime;
var g_LogType;
var g_LogQueryBegin = true;
var g_LogInfo = null;

$(document).on("menu_show_base_info", function () {
	
	
	$(".base_info .tabs").tabs();
	$('.base_info .ui-widget-content').css('border', '0px');

	$('#reset_default').hwbutton();
	$('#reboot').hwbutton();
	$("#upgrade_btn").hwbutton();
	$("#log_query").hwbutton();
	$("#bt_configure").hwbutton();
	$("#bt_configure1").hwbutton();
	
	
	$('#log_input_begin_hour').empty();
	$('#log_input_end_hour').empty();
	
	var index;
	for (index = 0; index < 24; index ++) {
		if(index < 10)
		{
			$("#log_input_begin_hour").append('<option value="' + index + '">' + 0 + index + '</option>');
	        $("#log_input_end_hour").append('<option value="' + index + '">' + 0 + index + '</option>');
		}
		else
		{
			$("#log_input_begin_hour").append('<option value="' + index + '">' + index + '</option>');
	        $("#log_input_end_hour").append('<option value="' + index + '">' + index + '</option>');			
		}
	}

	$('#log_input_begin_minute').empty();
	$('#log_input_begin_second').empty();
	$('#log_input_end_minute').empty();
	$('#log_input_end_second').empty();

	for (index = 0; index < 60; index ++) {
		if(index < 10)
		{
			$("#log_input_begin_minute").append('<option value="' + index + '">' + 0 + index + '</option>');
	        $("#log_input_begin_second").append('<option value="' + index + '">' + 0 + index + '</option>');
	        $("#log_input_end_minute").append('<option value="' + index + '">' + 0 + index + '</option>');
	        $("#log_input_end_second").append('<option value="' + index + '">' + 0 + index + '</option>');
		}
		else
		{
			$("#log_input_begin_minute").append('<option value="' + index + '">' + index + '</option>');
	        $("#log_input_begin_second").append('<option value="' + index + '">' + index + '</option>');
	        $("#log_input_end_minute").append('<option value="' + index + '">' + index + '</option>');
	        $("#log_input_end_second").append('<option value="' + index + '">' + index + '</option>');
		}
	}
	
	//if(navigator.appName == "Netscape"){//firefox
	if(0){//firefox

		var input_param_file_path = "<input type = 'text' name = 'configCfg' id = 'configure_file' class = 'filetext'>";
		
		var input_param_bt_scan = "<input type = 'button' id = 'configure_file_scan' class = 'filebtn' value = " + IDC_BASE_INFO_SCAN + " style='vertical-align:middle'/>";
	//	var hide_file_bt = "<input id = 'hide_file_bt' name = 'configCfg' class = 'stfile1' type = 'file' size = '38' value = '' onchange = 'document.getElementById(" + 'configure_file' + ").value = this.value>";
		var hide_file_bt = "<input id = 'hide_file_bt' name = 'configCfg' class = 'stfile1' type = 'file' size = '38' value = '' >";
		$("#ddfrmUpdate").empty();
		$("#ddfrmUpdate").append(input_param_file_path);
		$("#configure_file").after(input_param_bt_scan);
		$("#configure_file_scan").after(hide_file_bt);
	
		$("#hide_file_bt").change(function(){								
			document.getElementById("configure_file").value = this.value;
		})		
	}
	
	$('#log_input_begin_time').datetimepicker(
		{
			theme:'dark',
			lang:GetDatepickLang(),
			timepicker:false,
			format:'Y-m-d',
			mask:'9999-12-31',
			closeOnDateSelect:true,
			id:"log_input_begin_time_date",
			validateOnBlur:false,
			onSelectDate: function () {
				if ($('#log_input_end_time_date')) {
					$('#log_input_end_time').datetimepicker('destroy');
				}

				$('#log_input_end_time').datetimepicker(
					{
						theme:'dark',
						lang:GetDatepickLang(),
						timepicker:false,
						format:'Y-m-d',
						mask:'9999-12-31',
						closeOnDateSelect:true,
						id:"log_input_end_time_date",
						minDate: replaceAll($('#log_input_begin_time').val(), "-", "/"),
						validateOnBlur:false
					}
				)
			}
		}
		)
		$('#log_input_end_time').datetimepicker(
			{
				theme:'dark',
				lang:GetDatepickLang(),
				timepicker:false,
				format:'Y-m-d',
				mask:'9999-12-31',
				closeOnDateSelect:true,
				id:"log_input_end_time_date",
				validateOnBlur:false
			}
		)
		
	var msgBody = {
		DeviceName: 1,
        HardwareVersion: 1,
        UbootVersion: 1,
        LinuxVersion: 1,
        SoftWareVersion: 1,
        DeviceID: 1,
        PtzVersion: 1
	};
	$.sendCmd("CW_JSON_GetDeviceInfo", msgBody).done(function(deviceInfo) {
		g_deviceInfo = deviceInfo;
		$("#device_name").val(deviceInfo["DeviceName"]);
		$("#device_serialNum").val(deviceInfo["DeviceID"]);
		$("#hardware_version").val(deviceInfo["HardwareVersion"]);
		$("#uboot_version").val(deviceInfo["UbootVersion"]);
		$("#kernel_version").val(deviceInfo["LinuxVersion"]);
		$("#server_version").val(deviceInfo["SoftWareVersion"]);
		$("#ptz_version").val(deviceInfo["PtzVersion"]);
		var ocxVer = $.cookie("ocxVersion");
		if(typeof ocxVer != "undefined")
		{
			$("#ocx_version").val(ocxVer);
		}		
	});
	$("#reset_default").unbind("click").click(function() {
		if (g_operate_flag == 0) {
			reset();
		} else if (g_operate_flag == 1) {
			alert(IDC_SETTING_DIALOG_SYS_BASEINFO_UPDATEING);
		} else if (g_operate_flag == 2) {
			alert(IDC_SETTING_DIALOG_SYS_BASEINFO_REBOOTING);
		} else if (g_operate_flag == 3) {
			alert(IDC_SETTING_DIALOG_SYS_BASEINFO_RESETING);
		}
	});

	$("#reboot").unbind("click").click(function() {
		if (g_operate_flag == 0) {
			reboot();
		} else if (g_operate_flag == 1) {
			alert(IDC_SETTING_DIALOG_SYS_BASEINFO_UPDATEING);
		} else if (g_operate_flag == 2) {
			alert(IDC_SETTING_DIALOG_SYS_BASEINFO_REBOOTING);
		} else if (g_operate_flag == 3) {
			alert(IDC_SETTING_DIALOG_SYS_BASEINFO_RESETING);
		}
	});

	$("#upgrade_btn").unbind("click").click(function () {
		if (g_operate_flag == 0) {
			update();
		} else if (g_operate_flag == 1) {
			alert(IDC_SETTING_DIALOG_SYS_BASEINFO_UPDATEING);
		} else if (g_operate_flag == 2) {
			alert(IDC_SETTING_DIALOG_SYS_BASEINFO_REBOOTING);
		} else if (g_operate_flag == 3) {
			alert(IDC_SETTING_DIALOG_SYS_BASEINFO_RESETING);
		}
	})

	$("#log_query").unbind("click").click(function () {
		var beginTime, endTime;
		var beginTimeStr = "", endTimeStr = "";

		beginTimeStr = $.trim($("#log_input_begin_time").val());
		endTimeStr = $.trim($("#log_input_end_time").val());

		beginTimeStr = beginTimeStr.split("-");
		endTimeStr = endTimeStr.split("-");	

		beginTime = new Date(parseInt(beginTimeStr[0],10), parseInt(beginTimeStr[1] - 1,10), parseInt(beginTimeStr[2],10), $("#log_input_begin_hour").val(), $("#log_input_begin_minute").val(), $("#log_input_begin_second").val());
		endTime = new Date(parseInt(endTimeStr[0],10), parseInt(endTimeStr[1] - 1,10), parseInt(endTimeStr[2],10), $("#log_input_end_hour").val(), $("#log_input_end_minute").val(), $("#log_input_end_second").val());

		g_LogStartTime = (Date.UTC(parseInt(beginTimeStr[0],10), parseInt(beginTimeStr[1] - 1,10), parseInt(beginTimeStr[2],10), $("#log_input_begin_hour").val(), $("#log_input_begin_minute").val(), $("#log_input_begin_second").val()) / 1000);
		g_LogEndTime = (Date.UTC(parseInt(endTimeStr[0],10), parseInt(endTimeStr[1] - 1,10), parseInt(endTimeStr[2],10), $("#log_input_end_hour").val(), $("#log_input_end_minute").val(), $("#log_input_end_second").val()) / 1000);
		g_LogType = parseInt($("#MajorType").val(),10);

		var msgBody = {
			LogPos:g_LogPos,
			LogStart: g_LogStartTime,
			LogEnd: g_LogEndTime,
			LogType: g_LogType
		};		
		var LogCount = 0;
		var bQuerySuccess = true;
		$('#log_query_table').empty();
		while(g_LogQueryBegin)
		{

			$.sendCmd("CW_JSON_LOG_QUERY",msgBody).done(function(LogInfo){				
				g_LogInfo = LogInfo;
				if(g_LogInfo != null)
				{
					g_LogPos = parseInt(LogInfo["LogPos"],10);					
					if(g_LogPos == 0 || parseInt(LogInfo["LogCount"]) == 0)
					{
						g_LogQueryBegin = false;
					}
					else
					{
						ShowLogToTable(g_LogInfo);
						msgBody["LogPos"] = g_LogPos;						
					}
				}
				else
				{
					alert("LogInfo is null");
					g_LogQueryBegin = false;
				}
			}).fail(function(){
				bQuerySuccess = false;
				alert(IDC_GENERAL_QUERY_FAIL);
			});

			if(!bQuerySuccess)
			{
				break;
			}
		}
		g_LogQueryBegin = true;
	})
	$("#pm_save_bt").unbind("click").click(function(){
		$("#pm_content").trigger("menu_save_base_info");
	})

	/*scan button value*/
	/*
	if(g_langIndex == 0)
	{
		document.getElementById("scanbutton").value = ;		
	}
	else if(g_langIndex == 1)
	{
		document.getElementById("scanbutton").value = "Scan...";
	}
	*/
	document.getElementById("scanbutton").value = IDC_BASEINFO_SCAN;
})
function ShowLogToTable(LogInfo)
{
	LogCount = parseInt(LogInfo["LogCount"],10);
	var LogList = LogInfo["LogList"];
	
	var Time;
	var Type;
	var Text;
	
	var i;
//	$('#log_query_table').empty();
	var innserHtml = "";
	for(i = 0; i < LogCount; i++)
	{
		Time = LogList[i].LogTime;
		Type = LogList[i].LogType;
		Text = LogList[i].LogText;
		Time = $.evalJSON(Time);
		innserHtml += "<tr>";
		innserHtml += "<td style='width:120px;'>" + FormTimeStr(Time) + "</td>";
		innserHtml += "<td style='width:50px;'>" + ConvertOperateType(Type) + "</td>";
		innserHtml += "<td style='width:150px;'>" + Text + "</td>";
		innserHtml += "</tr>";
	}
	$('#log_query_table').append(innserHtml);
	
}
function ConvertOperateType(type)
{
	var TypeStr;
	switch(type)
	{
		case 1:
			TypeStr = IDC_SETTING_DIALOG_SYS_LOG_QUERY_TYPE_ALARM;
			break;
		case 2:
			TypeStr = IDC_SETTING_DIALOG_SYS_LOG_QUERY_TYPE_EXCEPTION;
			break;
		case 3:
			TypeStr = IDC_SETTING_DIALOG_SYS_LOG_QUERY_TYPE_OPERATION;
			break;
		case 4:
			TypeStr = IDC_SETTING_DIALOG_SYS_LOG_QUERY_TYPE_INFORMATION;
			break;
		default:
			break;
			
	}
	return TypeStr;
}
function getStrLen(str){
	if (str == null) return 0;
	if (typeof str != "string"){
		str += "";
	 }
	 return str.replace(/[^x00-xff]/g,"01").length;
}
$(document).on("menu_save_base_info", function () {
	var msgBody = {
		DeviceName: $.trim($("#device_name").val())
	};
	var reg = /^(\w|[\u4E00-\u9FA5])*$/;
	var DeviceNa = msgBody["DeviceName"];
	var DeviceNaLen = getStrLen(DeviceNa);
	if(!msgBody["DeviceName"].match(reg))
	{
		alert(IDC_LIVE_DEVICE_NAME_LIMITED);
		return;
	}
	else if(DeviceNaLen > 20)
	{
		alert(IDC_SETTING_DEVICENAME_TOO_LONG);
		return;
	}
	
	$.sendCmd("CW_JSON_SetDeviceInfo", msgBody).done(function() {
		alert(IDC_GENERAL_SAVESUCCESS);
	}).fail(function() {
		alert(IDC_GENERAL_SAVEFAIL);
	});
})

$(document).on("menu_close_base_info", function () {
	// nothing
})

function update() {
	var filePath = $("#textfield").val();
	if ($.trim(filePath).length == 0) {
		return;
	}

	g_operate_flag = 1;
	$("#update_msg").show();

	var progressbar = $("#update_progress");
    var progressLabel = $(".progress_label");
    progressLabel.text("0%");

	var msgBody = {
		"async":true
	};
	$.sendCmd("CW_JSON_UPDATE",msgBody);
    $("#frmUpdate").submit();
//	msgBody.async = false;
//	$.sendCmd("CW_JSON_UPDATE",msgBody);
	progressbar.progressbar({
      	value: 0,
      	change: function () {
      		progressLabel.text(progressbar.progressbar( "value" ) + "%");
      	},
      	complete: function () {
      		g_operate_flag = 0;
      		if (g_operate_timer) {
      			g_operate_timer.stop();
      		}
      		alert(IDC_SETTING_DIALOG_SYS_BASEINFO_UPDATECOMPLETE);
            var ipaddr = (document.URL.split('//')[1]).split('/')[0].split(':')[0];
            var port = (document.URL.split('//')[1]).split('/')[0].split(':')[1] || 80;
            window.location.href = "http://" + ipaddr + ":" + port;
      	}
    });
    $(".update_detail")[0].innerHTML = "";
    g_operate_timer = $.timer(1000, function () {
    	var val = progressbar.progressbar("value") || 0;
        progressbar.progressbar( "value", val + 1 );
    });
}

function reboot() {
	var msgBody = {
		DataCmd: 5
	};
	$.sendCmdAsync("CW_JSON_ManageData", msgBody).done(function() {
		// 重启设备进度条?
		g_operate_flag = 2;

		$("#operate_msg").show();

		var progressbar = $("#operate_progress");
	    var progressLabel = $(".operate_progress_label");
	    progressLabel.text("0%");

		progressbar.progressbar({
	      	value: 0,
	      	change: function () {
	      		progressLabel.text(progressbar.progressbar( "value" ) + "%");
	      	},
	      	complete: function () {
	      		g_operate_flag = 0;
	      		if (g_operate_timer) {
	      			g_operate_timer.stop();
	      		}
	      		alert(IDC_SETTING_DIALOG_SYS_BASEINFO_REBOOTCOMPLETE);
	            var ipaddr = (document.URL.split('//')[1]).split('/')[0].split(':')[0];
	            var port = (document.URL.split('//')[1]).split('/')[0].split(':')[1] || 80;
	            window.location.href = "http://" + ipaddr + ":" + port;
	      	}
	    });
	    g_operate_timer = $.timer(200, function () {
	    	var val = progressbar.progressbar("value") || 0;
	        progressbar.progressbar( "value", val + 1 );
	    })
	});
}

function reset() {
	var msgBody = {
		DataCmd: 2
	};
	$.sendCmdAsync("CW_JSON_ManageData", msgBody).done(function() {
		// 恢复出厂默认值进度条?
		g_operate_flag = 3;
		$("#operate_msg").show();

		var progressbar = $("#operate_progress");
	    var progressLabel = $(".operate_progress_label");
	    progressLabel.text("0%");

		progressbar.progressbar({
	      	value: 0,
	      	change: function () {
	      		progressLabel.text(progressbar.progressbar( "value" ) + "%");
	      	},
	      	complete: function () {
	      		g_operate_flag = 0;
	      		if (g_operate_timer) {
	      			g_operate_timer.stop();
	      		}
	      		alert(IDC_SETTING_DIALOG_SYS_BASEINFO_RESETCOMPLETE);
	            var ipaddr = (document.URL.split('//')[1]).split('/')[0].split(':')[0];
	            var port = (document.URL.split('//')[1]).split('/')[0].split(':')[1] || 80;
	            window.location.href = "http://" + ipaddr + ":" + port;
	      	}
	    });
	    g_operate_timer = $.timer(200, function () {
	    	var val = progressbar.progressbar("value") || 0;
	        progressbar.progressbar( "value", val + 1 );
	    })
	});
}
