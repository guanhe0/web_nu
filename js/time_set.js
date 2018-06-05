var g_ipctimer = false;
var aMonths = [
IDC_SETTING_DIALOG_BEGINTIME_MONTH_0,
IDC_SETTING_DIALOG_BEGINTIME_MONTH_1,
IDC_SETTING_DIALOG_BEGINTIME_MONTH_2,
IDC_SETTING_DIALOG_BEGINTIME_MONTH_3,
IDC_SETTING_DIALOG_BEGINTIME_MONTH_4,
IDC_SETTING_DIALOG_BEGINTIME_MONTH_5,
IDC_SETTING_DIALOG_BEGINTIME_MONTH_6,
IDC_SETTING_DIALOG_BEGINTIME_MONTH_7,
IDC_SETTING_DIALOG_BEGINTIME_MONTH_8,
IDC_SETTING_DIALOG_BEGINTIME_MONTH_9,
IDC_SETTING_DIALOG_BEGINTIME_MONTH_10,
IDC_SETTING_DIALOG_BEGINTIME_MONTH_11
];
var aWeekThs = [
IDC_SETTING_FIRST_ONE,
IDC_SETTING_SECOND_ONE,
IDC_SETTING_THIRD_ONE,
IDC_SETTING_FOURTH_ONE,
IDC_SETTING_LAST_ONE
];

var aWeek = [
IDC_GENERAL_SUNDAY,
IDC_GENERAL_MONDAY,
IDC_GENERAL_TUESDAY,
IDC_GENERAL_WEDNESDAY,
IDC_GENERAL_THURSDAY,
IDC_GENERAL_FRIDAY,
IDC_GENERAL_SATURDAY
];
var aCountry = [
IDC_COUNNTRY_0,
IDC_COUNNTRY_1,
IDC_COUNNTRY_2,
IDC_COUNNTRY_3,
IDC_COUNNTRY_4,
IDC_COUNNTRY_5,
IDC_COUNNTRY_6,
IDC_COUNNTRY_7,
IDC_COUNNTRY_8,
IDC_COUNNTRY_9,
IDC_COUNNTRY_10,
IDC_COUNNTRY_11,
IDC_COUNNTRY_12,
IDC_COUNNTRY_13,
IDC_COUNNTRY_14,
IDC_COUNNTRY_15,
IDC_COUNNTRY_16,
IDC_COUNNTRY_17,
IDC_COUNNTRY_18,
IDC_COUNNTRY_19,
IDC_COUNNTRY_20,
IDC_COUNNTRY_21,
IDC_COUNNTRY_22,
IDC_COUNNTRY_23,
IDC_COUNNTRY_24
];
$(document).on("menu_show_time_set", function() {
	/*
	$("#clock_server").unbind("dblclick").dblclick(function() {
		var insertEdit = '<input type="text" id="clock_server_edit" class="sysinput">';
		var selThis = $(this);

		selThis.after(insertEdit).hide();
		$('#clock_server_edit').css({
			"width": (parseInt($(this).css("width")) - 5) + "px",
			"margin-left": parseInt($(this).css("margin-left")) + "px"
		});
        $('#clock_server_edit').blur(function() {
        	var val = $(this).val();
        	if (val.length > 0) {
        		selThis.append('<option value="' + val + '" selected>' + val + '</option>').show();
        	}
        	else {
        		selThis.val(1).show();	
        	}
        	$(this).remove();
        	$(this).focus();
        })
	});
	*/

	$('#devDate').datetimepicker(
		{
			theme:'dark',
			lang:GetDatepickLang(),
			timepicker:false,
			format:'Y-m-d',
			mask:'9999-12-31',
			closeOnDateSelect:true,
			validateOnBlur:false
		}
	)
	
	$("#synchronous").click(function() {
	if ($(this).prop('checked')) {
		if(g_ipctimer){
		g_ipctimer.stop();
		}
		showipctime(0);
	}
	else{
		if(g_ipctimer){
		g_ipctimer.stop();
		}
	}
	})

	var msgBodyTime = {
		Seconds: 1,
        Minute: 1,
        Hours: 1,
        Day: 1,
        Month: 1,
        Year: 1,
//         TimeZoneCityId: 1,
        NtpEnable: 1,
        NtpAddress: 1,
        TimeZoneId: 1,
        DaylightSaveTimeEnable: 1,
        StartMonth: 1,
        StartWeek: 1,
        StartDay: 1,
        StartHour: 1,
        EndMonth: 1,
        EndWeek: 1,
        EndDay: 1,
        EndHour: 1,
        OffsetTime: 1
	};

	var owntimeoffset = 0;

	if(navigator.appName == "Netscape"){
		$("#summer_time_enable").css("margin-left","11px");
	}	

	/*sumer time start month*/
	var StartMonths = "";
	for(var i = 0; i < 12; i++){
		StartMonths += '<option value = "' + i + '">' + aMonths[i] + '</option>';
	}
	$("#summer_time_start_month").empty();
	$("#summer_time_start_month").append(StartMonths);
	/*summer time start weekth*/
	var WeekTh = "";
	for(var i = 0; i < 5; i++){
		WeekTh += '<option value = "' + i + '">' + aWeekThs[i] + '</option>';
	}
	$("#summer_time_start_weekth").empty();
	$("#summer_time_start_weekth").append(WeekTh);
	/*summer time start week*/
	var Week = "";
	for(var i = 0; i < 7; i++){
		Week += '<option value = "' + i + '">' + aWeek[i] + '</option>';
	}
	$("#summer_time_start_week").empty();
	$("#summer_time_start_week").append(Week);
	/*summer time start hour*/
	var sHour = "";
	for(var i = 0; i < 24; i++){
		if(i < 10){
			sHour += '<option value ="' + i + '">' + 0 + i + '</option>';
		}
		else{
			sHour += '<option value ="' + i + '">' + i + '</option>';
		}
	}
	$("#summer_time_start_hour").empty();
	$("#summer_time_start_hour").append(sHour);

	/*sumer time end month*/
	var EndMonths = StartMonths;
	$("#summer_time_end_month").empty();
	$("#summer_time_end_month").append(EndMonths);	

	/*summer time end weekth*/
	$("#summer_time_end_weekth").empty();
	$("#summer_time_end_weekth").append(WeekTh);	

	/*summer time end week*/
	$("#summer_time_end_week").empty();
	$("#summer_time_end_week").append(Week);

	/*summer time end hour*/
	$("#summer_time_end_hour").empty();
	$("#summer_time_end_hour").append(sHour);
	
	$.sendCmd("CW_JSON_GetTime", msgBodyTime).done(function(timeInfo, zoneListInfo) {
		var dataStr = "", timeStr = "";
		var year, month, day, hours, minute, second;
		var SummerTimeEnable,StartMonth,StartWeek,StartHour,EndMonthr,EndWeek,EndHour,OffsetTime;
		var StartDay,EndDay;
		year = parseInt(timeInfo["Year"], 10);
		
		month = parseInt(timeInfo["Month"], 10);
		day = parseInt(timeInfo["Day"], 10);
		hours = parseInt(timeInfo["Hours"], 10);
		minute = parseInt(timeInfo["Minute"], 10);
		second = parseInt(timeInfo["Seconds"], 10);
		
		SummerTimeEnable = parseInt(timeInfo["DaylightSaveTimeEnable"],10);
		StartMonth = parseInt(timeInfo["StartMonth"], 10);
		StartWeek = parseInt(timeInfo["StartWeek"], 10);
		StartDay = parseInt(timeInfo["StartDay"], 10);
		StartHour = parseInt(timeInfo["StartHour"], 10);
		EndMonthr = parseInt(timeInfo["EndMonth"], 10);
		EndWeek = parseInt(timeInfo["EndWeek"], 10);
		EndDay = parseInt(timeInfo["EndDay"], 10);
		EndHour = parseInt(timeInfo["EndHour"], 10);
		OffsetTime = parseInt(timeInfo["OffsetTime"], 10);
		
		dataStr = "" + (year + 1900) + "-" + ((month >= 10) ? month : ("0" + month)) + "-" + ((day >= 10) ? day : ("0" + day));
		timeStr = "" + ((hours >= 10) ? hours : ("0" + hours)) + ":" + ((minute >= 10) ? minute : ("0" + minute)) + ":" + ((second >= 10) ? second : ("0" + second));
		$("#devDate").val(dataStr);
		$("#devTime").val(timeStr);

		owntimeoffset = CalculateTimeOffset({"year":year,"month":month,"day":day,"hours":hours,"minute":minute,"second":second});
		$("#auto_synchronous").attr("checked", (parseInt(timeInfo["NtpEnable"]) == 0) ? false : true);
		$("#summer_time_enable").attr("checked", SummerTimeEnable == 0 ? false : true);
		$("#summer_time_start_month").val(StartMonth);
		$("#summer_time_start_weekth").val(StartWeek);
		$("#summer_time_start_week").val(StartDay);
		$("#summer_time_start_hour").val(StartHour);

		$("#summer_time_end_month").val(EndMonthr);
		$("#summer_time_end_weekth").val(EndWeek);
		$("#summer_time_end_week").val(EndDay);
		$("#summer_time_end_hour").val(EndHour);
		$("#time_offset").val(OffsetTime);
		var ntpAddress = $.trim(timeInfo["NtpAddress"]);

		if(ntpAddress != ""){
			$("#clock_server").attr("value", ntpAddress);
		}
		/*
		var bExist = false;
		$("#clock_server > option").each(function () {
			if ($(this).attr("value") === ntpAddress) {
				bExist = true;
			}
		})
		if (bExist == true) {
			$("#clock_server").attr("value", ntpAddress);
		}
		else {
			$("#clock_server").prepend("<option value=" + ntpAddress + "'>" + ntpAddress + "</option>");
		}
		*/
		/*
		var index = 0;
		var cityCount = parseInt(zoneListInfo["TimeCityZoneCount"], 10);
		var cityList = zoneListInfo["TimeZoneList"];
		// 清空
		$('#timezone').empty();

		for (index = 0; index < cityCount; index ++) {
			var cityZone = parseInt(cityList[index]["TimeZone"]);
			var cityName = cityList[index]["CityName"];
			var cityIndex = cityList[index]["TimeZoneCityId"];
			$("#timezone").append( '<option value="' + cityZone + '" cityid="' + cityIndex + '">' + (cityName + "  (" + ( (cityZone > 0) ? ("GMT+" + cityZone) : ("GMT" +cityZone)) + ")") + '</option>' ;
		}

		$('#timezone').find('option[cityid="' + parseInt(timeInfo["TimeZoneCityId"], 10) + '"]').attr('selected', true)
		*/
		
		/*TimeZoneId*/
//		var aoffset = ["-12:00","-11:00","-10:00","-09:00","-08:00","-07:00","-06:00","-05:00","-04:00","-03:00","-02:00","-01:00","-00:00",
//		"+01:00","+02:00","+03:00","+04:00","+05:00","+06:00","+07:00","+08:00","+09:00","+10:00","+11:00","+12:00"];
		var aoffset = ["12:00","11:00","10:00","09:00","08:00","07:00","06:00","05:00","04:00","03:00","02:00","01:00","00:00",
		"01:00","02:00","03:00","04:00","05:00","06:00","07:00","08:00","09:00","10:00","11:00","12:00"];		
		var TimeZoneId = parseInt(timeInfo["TimeZoneId"], 10);
		$('#timezone').empty();
		for(var i = 0; i < 25; i++){
			if(i < 12){
			$("#timezone").append('<option value = "' + i + '">' + '(GMT－' + aoffset[i] + ') ' + aCountry[i] + '</option>');}
			else{
			$("#timezone").append('<option value = "' + i + '">' + '(GMT＋' + aoffset[i] + ') ' + aCountry[i] + '</option>');
			}
		}
		$("#timezone").val(TimeZoneId);
	}).fail(function(){
		log("CW_JSON_GetTime fail");
	});
	if(g_ipctimer){
		g_ipctimer.stop();
	}
	$("#pm_save_bt").unbind("click").click(function(){
		$("#pm_content").trigger("menu_save_time_set");
	})
	
})

function showipctime(offset){

	g_ipctimer = $.timer(1000,function(){	
	var d = new Date();
	var year, month, day, hours, minute, second;
	
	year = parseInt(d.getFullYear(),10);
	month = parseInt(d.getMonth(),10) + 1;
	day = parseInt(d.getDate(),10);
	hours = parseInt(d.getHours(),10);
	minute = parseInt(d.getMinutes(),10);
	second = parseInt(d.getSeconds(),10);
	
//	var timestamp = Date.UTC(year,month,day,hours,minute,second) + offset;
	var timestamp = {"year":year,"month":month,"day":day,"hours":hours,"minute":minute,"second":second}; 
	drawipctime(timestamp);
	
	})
}
function drawipctime(timestamp){
			
	var year = timestamp.year;
	
	var month = timestamp.month;
	
	var date = timestamp.day;
	
	var hour = timestamp.hours;
	
	var minute = timestamp.minute;
	
	var second = timestamp.second;
	
	
	var dataStr = "" + (year) + "-" + ((month >= 10) ? month : ("0" + month)) + "-" + ((date >= 10) ? date : ("0" + date));
	var timeStr = "" + ((hour >= 10) ? hour : ("0" + hour)) + ":" + ((minute >= 10) ? minute : ("0" + minute)) + ":" + ((second >= 10) ? second : ("0" + second));	
	$("#devDate").val(dataStr);
	$("#devTime").val(timeStr);		
}
function syncTimezoneTime(){
	
	if($("#synchronous").prop('checked') == false){
	var ZoneTimeOffset = parseInt($('#timezone').find('option:selected').attr('value'), 10) - 12; 
	
	ZoneTimeOffset = ZoneTimeOffset*3600000;

	var local = new Date();
	var LocalOffset = local.getTimezoneOffset()*60000;
	var offset = ZoneTimeOffset + LocalOffset;
	if(g_ipctimer){
	g_ipctimer.stop();
	}
	InitTimeAndDate(offset);
	}
}
function InitTimeAndDate(offset){
	var d = new Date();
	var year, month, day, hours, minute, second;

	year = parseInt(d.getFullYear(),10)-1900;
	month = parseInt((d.getMonth()+1),10);
	day = parseInt(d.getDate(),10);
	hours = parseInt(d.getHours(),10);
	minute = parseInt(d.getMinutes(),10);
	second = parseInt(d.getSeconds(),10);
	var timestamp = Date.UTC(year,month,day,hours,minute,second) + offset;
	drawUTCtime(timestamp);	
}
function drawUTCtime(timestamp)
{
	var nd = new Date(timestamp);
	var year = nd.getUTCFullYear();
	var month = nd.getUTCMonth();
	var date = nd.getUTCDate();
	var hour = parseInt(nd.getUTCHours(),10);
	var minute = parseInt(nd.getUTCMinutes(),10);
	var second = parseInt(nd.getUTCSeconds(),10);
	
	var dataStr = "" + (year + 1900) + "-" + ((month >= 10) ? month : ("0" + month)) + "-" + ((date >= 10) ? date : ("0" + date));
	var timeStr = "" + ((hour >= 10) ? hour : ("0" + hour)) + ":" + ((minute >= 10) ? minute : ("0" + minute)) + ":" + ((second >= 10) ? second : ("0" + second));	
	$("#devDate").val(dataStr);
	$("#devTime").val(timeStr);		
}
function CalculateTimeOffset(obj){
	var d = new Date(); 
	var year, month, day, hours, minute, second;

	//own
	var ownstamp = Date.UTC(obj.year,obj.month,obj.day,obj.hours,obj.minute,obj.second);

	//stand	
	year = parseInt(d.getFullYear(),10)-1900;
	month = parseInt((d.getMonth() + 1),10);
	day = parseInt(d.getDate(),10);
	hours = parseInt(d.getHours(),10);
	minute = parseInt(d.getMinutes(),10);
	second = parseInt(d.getSeconds(),10);
	var standstamp = Date.UTC(year,month,day,hours,minute,second);

	//offset
	var offset = ownstamp - standstamp;
	return offset;
	
}
function syncTime() {
	var now = new Date();
	var dataStr = "", timeStr = "";
	var year, month, day, hours, minute, second;

	year = now.getFullYear();
	month = now.getMonth() + 1;
	day = now.getDate();
	hours = now.getHours();
	minute = now.getMinutes();
	second = now.getSeconds();

	dataStr = "" + year + "-" + ((month >= 10) ? month : ("0" + month)) + "-" + ((day >= 10) ? day : ("0" + day));
	timeStr = "" + ((hours >= 10) ? hours : ("0" + hours)) + ":" + ((minute >= 10) ? minute : ("0" + minute)) + ":" + ((second >= 10) ? second : ("0" + second));

	$("#devDate").val(dataStr);
	$("#devTime").val(timeStr);
}

$(document).on("menu_save_time_set", function () {
	var dataStr = $("#devDate").val(),
		timeStr = $("#devTime").val();
	var year, month, day, hours, minute, second;
	if (!(dataStr.match("\\d{4}-\\d{1,2}-\\d{1,2}"))) {
		alert(IDC_SETTING_DIALOG_SYS_TIMEZONE_INVALIDTIMESTR);
		return;
	}

	dataStr = dataStr.split("-");
	if (parseInt(dataStr[1], 10) > 12) {
		alert(IDC_SETTING_DIALOG_SYS_TIMEZONE_INVALIDTIMESTR);
		return;
	}
	if (parseInt(dataStr[2], 10) > 31) {
		alert(IDC_SETTING_DIALOG_SYS_TIMEZONE_INVALIDTIMESTR);
		return;	
	}

	timeStr = timeStr.split(":");
	if (parseInt(timeStr[0], 10) > 24) {
		alert(IDC_SETTING_DIALOG_SYS_TIMEZONE_INVALIDTIMESTR);
		return;	
	}
	if (parseInt(timeStr[1], 10) > 59) {
		alert(IDC_SETTING_DIALOG_SYS_TIMEZONE_INVALIDTIMESTR);
		return;	
	}
	if (parseInt(timeStr[2], 10) > 59) {
		alert(IDC_SETTING_DIALOG_SYS_TIMEZONE_INVALIDTIMESTR);
		return;	
	}
	
	if(0)//(($("#synchronous").prop('checked') == false)&&($("#auto_synchronous").prop('checked') == false))
	{
		var d = new Date(); 
		var localTime = d.getTime();
		var localOffset = d.getTimezoneOffset() * 60000;
		var utc = localTime + localOffset;
		var offset = parseInt($('#timezone').find('option:selected').attr('value'), 10) - 12; 
		var calctime = utc + (3600000*offset);
		var nd = new Date(calctime);
		dataStr[0] = nd.getFullYear();
		dataStr[1] = (nd.getMonth()+1);
		dataStr[2] = nd.getDate();
		timeStr[0] = nd.getHours();
		timeStr[1] = nd.getMinutes();
		timeStr[2] = nd.getSeconds();
	}
	
	var msgBodyTime = {
		Seconds: parseInt(timeStr[2], 10),
        Minute: parseInt(timeStr[1], 10),
        Hours: parseInt(timeStr[0], 10),
        Day: parseInt(dataStr[2], 10),
        Month: parseInt(dataStr[1], 10),
        Year: (parseInt(dataStr[0], 10) - 1900),
        NtpEnable: ($('#auto_synchronous').prop('checked') ? 1 : 0),
        NtpAddress: $("#clock_server").val(),
//        TimeZoneCityId: parseInt($('#timezone').find('option:selected').attr('cityid'), 10)
		TimeZoneId: parseInt($("#timezone").val()),
		DaylightSaveTimeEnable: ($('#summer_time_enable').prop('checked') ? 1:0),
		StartMonth: parseInt($("#summer_time_start_month").val()),
		StartWeek: parseInt($("#summer_time_start_weekth").val()),
		StartDay: parseInt($("#summer_time_start_week").val()),
		StartHour: parseInt($("#summer_time_start_hour").val()),
		EndMonth: parseInt($("#summer_time_end_month").val()),
		EndWeek: parseInt($("#summer_time_end_weekth").val()),
		EndDay: parseInt($("#summer_time_end_week").val()),
		EndHour: parseInt($("#summer_time_end_hour").val()), 
		OffsetTime: parseInt($("#time_offset").val())
	};
	
	
	$.sendCmd("CW_JSON_SetTime", msgBodyTime).done(function() {
		alert(IDC_GENERAL_SAVESUCCESS);
	}).fail(function() {
		alert(IDC_GENERAL_SAVEFAIL);
	})
})

$(document).on("menu_close_time_set", function () {
	// close	
})
