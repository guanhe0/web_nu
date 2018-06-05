var g_pre_streamtype = 1;
$(document).on("menu_show_local_set", function () {
	RangeInput({
		domid: "file_length",
		min: 1,
		max: 59
	});

	RangeInput({
		domid: "local_prerecord_time",
		min: 5,
		max: 30
	});

	RangeInput({
		domid: "local_alarm_record_time",
		min: 1,
		max: 2592000
	});

	if (typeof $.cookie('file_length') != "undefined") {
		$("#file_length").val(parseInt($.cookie('file_length'), 10));
	}
	if (typeof $.cookie('file_path') != "undefined") {
		$("#file_path").val($.trim($.cookie('file_path')));
	}

	var prerecordEnable = $.cookie('prerecord_enable');
	if (typeof prerecordEnable != "undefined") {
		$("#local_prerecord_chk").attr("checked", (parseInt(prerecordEnable) == 1) ? true : false);
	}

	if (typeof $.cookie('prerecord_time') != "undefined") {
		$("#local_prerecord_time").val(parseInt($.cookie('prerecord_time'), 10));
	}

	var StreamType = $.cookie('stream_type');
	if(typeof StreamType != "undefined")
	{
		$("#playperformance").val(parseInt($.cookie('stream_type'), 10));
	}
	/*
	var alarmEnable = $.cookie('alarm_enable');
	if (typeof alarmEnable != "undefined") {
		$("#local_alarm_record_chk").attr("checked", (parseInt(alarmEnable) == 1) ? true : false);
	}

	if (typeof $.cookie('alarm_time') != "undefined") {
		$("#local_alarm_record_time").val(parseInt($.cookie('alarm_time'), 10));
	}
	*/
	$("#pm_save_bt").unbind("click").click(function(){
		$("#pm_content").trigger("menu_save_local_set");
	})
	
})

$(document).on("menu_save_local_set", function () {
	$.cookie('file_length', parseInt($("#file_length").val(), 10), {expires: 30});
	$.cookie('file_path', $.trim($("#file_path").val()), {expires: 30});
	$.cookie('prerecord_enable', $("#local_prerecord_chk").prop('checked') ? 1 : 0, {expires: 30});
	$.cookie('prerecord_time', parseInt($("#local_prerecord_time").val(), 10), {expires: 30});
	
//	if(g_pre_streamtype != parseInt($("#playperformance").find('option:selected').attr('value')))
	{
		g_pre_streamtype = parseInt($("#playperformance").find('option:selected').attr('value'));
		//g_player.Setstreamtype(g_pre_streamtype);
		$.cookie('stream_type', parseInt($("#playperformance").val(), 10), {expires: 30});
	}
	
	/*
	$.cookie('alarm_enable', $("#local_alarm_record_chk").prop('checked') ? 1 : 0, {expires: 30});
	$.cookie('alarm_time', parseInt($("#local_alarm_record_time").val(), 10), {expires: 30});
	*/

	alert(IDC_GENERAL_SAVESUCCESS);
})

$(document).on("menu_close_local_set", function () {
	
})