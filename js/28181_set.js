$(document).on("menu_show_28181_set", function () {
	RangeInput({
		domid: "28181_port",
		min: 1,
		max: 65535
	});
	
	RangeInput({
		domid: "28181_register_interval",
		min: 1,
		max: 3600
	});

	RangeInput({
		domid: "28181_heart_interval",
		min: 1,
		max: 3600
	});

	var msgBody = {
		"28181Enable": 1,
		"28181Address": 1,
		"28181Port": 1,
		"28181Password": 1,
		"28181RegIntervals": 1,
		"28181HBIntervals": 1,
		"28181ServerId": 1,
		"28181DeviceId": 1,
		"28181ChannelId": 1,
		"28181AlarmInId": 1,
		"28181AlarmOutId": 1
	};

	$.sendCmd("CW_JSON_GetNetworkProtocol", msgBody).done(function(Info) {
		$("#28181_chk").attr("checked", (parseInt(Info["28181Enable"]) == 0) ? false : true);
		$('#28181_addr').val(Info["28181Address"]);
		$('#28181_port').val(Info["28181Port"]);
		$('#28181_passwd').val(Info['28181Password']);
		$('#28181_register_interval').val(Info['28181RegIntervals']);
		$('#28181_heart_interval').val(Info['28181HBIntervals']);
		$('#server_id').val(Info['28181ServerId']);
		$('#device_id').val(Info['28181DeviceId']);
		$('#channel_id').val(Info['28181ChannelId']);
		$('#alarmin_id').val(Info['28181AlarmInId']);
		$('#alarmout_id').val(Info['28181AlarmOutId']);
	});
})

$(document).on("menu_save_28181_set", function () {
	var msgBody = {
		"28181Enable": ($('#28181_chk').prop('checked') ? 1 : 0),
		"28181Address": $('#28181_addr').val(),
		"28181Port": parseInt($('#28181_port').val()),
		"28181Password": $('#28181_passwd').val(),
		"28181RegIntervals": parseInt($('#28181_register_interval').val()),
		"28181HBIntervals": parseInt($('#28181_heart_interval').val()),
		"28181ServerId": $('#server_id').val(),
		"28181DeviceId": $('#device_id').val(),
		"28181ChannelId": $('#channel_id').val(),
		"28181AlarmInId": $('#alarmin_id').val(),
		"28181AlarmOutId": $('#alarmout_id').val()
	};

	$.sendCmd("CW_JSON_SetNetworkProtocol", msgBody).done(function () {
		alert(IDC_GENERAL_SAVESUCCESS);
	}).fail(function () {
		alert(IDC_GENERAL_SAVEFAIL);
	});
})

$(document).on("menu_close_28181_set", function () {
	
})