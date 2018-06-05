var g_ioAlarmInfo = null;

function IOGetPreset() {
	$('#io_preset').empty();

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
			$('#io_preset').append(innerHtml);
		}

		$("#io_preset option:first").prop("selected", 'selected');
	});
	$("#pm_save_bt").unbind("click").click(function(){
		$("#pm_content").trigger("menu_save_io_alarm");
	})
	
}

$(document).on("menu_show_io_alarm", function () {
	IOGetPreset();
	var msgBody = {
		CallPresetEnable: 1,
        CallIoOutEnable: 1,
        CallPresetId0: 1,
        IoOutId0: 1,
        CallPresetId1: 1,
        IoOutId1: 1,
        CallPresetId2: 1,
        IoOutId2: 1,
        CallPresetId3: 1,
        IoOutId3: 1
	};

	$.sendCmd("CW_JSON_GetIoAlarmParam", msgBody).done(function (alarmInfo) {
		g_ioAlarmInfo = alarmInfo;
		//$("#io_chn_sel").trigger("change", "0");
		if (g_ioAlarmInfo) {
			var presetEnable = parseInt(g_ioAlarmInfo['CallPresetEnable'],10);
    		var ioOutEnable = parseInt(g_ioAlarmInfo['CallIoOutEnable'],10);
    		var ioChk = 0,
    			presetChk = 0,
    			ioID = 0,
    			presetID = 0;
    		var index = parseInt($("#io_chn_sel").val(),10);
    		
    		switch (index) {
    			case 1: {
    				ioChk = ioOutEnable & 1;
    				presetChk = presetEnable & 1;
    				presetID = g_ioAlarmInfo["CallPresetId0"];
    				ioID = g_ioAlarmInfo["IoOutId0"];
    				break;
    			}
    			case 2: {
    				ioChk = (ioOutEnable >> 1) & 1;
    				presetChk = (presetEnable >> 1) & 1;
    				presetID = g_ioAlarmInfo["CallPresetId1"];
    				ioID = g_ioAlarmInfo["IoOutId1"];
    				break;
    			}
    			case 3: {
    				ioChk = (ioOutEnable >> 2) & 1;
    				presetChk = (presetEnable >> 2) & 1;
    				presetID = g_ioAlarmInfo["CallPresetId2"];
    				ioID = g_ioAlarmInfo["IoOutId2"];
    				break;
    			}
    			case 4: {
    				ioChk = (ioOutEnable >> 3) & 1;
    				presetChk = (presetEnable >> 3) & 1;
    				presetID = g_ioAlarmInfo["CallPresetId3"];
    				ioID = g_ioAlarmInfo["IoOutId3"];
    				break;
    			}
    		}
    		
    		if (presetChk == 0) {
    			document.all.preset_chk.checked = false;
    			$('#io_preset').attr('disabled', 'disabled').addClass("sysselect_disable");
    		} else if (presetChk == 1) {
    			document.all.preset_chk.checked = true;
    			$("#io_preset").removeAttr("disabled").removeClass("sysselect_disable");
    		}

    		if (ioChk == 0) {
    			document.all.io_output_chk.checked = false;
    			$('#io_output_preset').attr('disabled', 'disabled').addClass("sysselect_disable");
    		} else if (ioChk == 1) {
    			document.all.io_output_chk.checked = true;
    			$("#io_output_preset").removeAttr("disabled").removeClass("sysselect_disable");
    		}

    		$("#io_preset").val(presetID);
    		$("#io_output_preset").val(ioID);
		}
	});

	$("#io_chn_sel").change(function () {
		if (g_ioAlarmInfo) {
			var presetEnable = parseInt(g_ioAlarmInfo['CallPresetEnable'],10);
    		var ioOutEnable = parseInt(g_ioAlarmInfo['CallIoOutEnable'],10);
    		var ioChk = 0,
    			presetChk = 0,
    			ioID = 0,
    			presetID = 0;
    		var index = parseInt($("#io_chn_sel").val(),10);
    		
    		switch (index) {
    			case 1: {
    				ioChk = ioOutEnable & 1;
    				presetChk = presetEnable & 1;
    				presetID = g_ioAlarmInfo["CallPresetId0"];
    				ioID = g_ioAlarmInfo["IoOutId0"];
    				break;
    			}
    			case 2: {
    				ioChk = (ioOutEnable >> 1) & 1;
    				presetChk = (presetEnable >> 1) & 1;
    				presetID = g_ioAlarmInfo["CallPresetId1"];
    				ioID = g_ioAlarmInfo["IoOutId1"];
    				break;
    			}
    			case 3: {
    				ioChk = (ioOutEnable >> 2) & 1;
    				presetChk = (presetEnable >> 2) & 1;
    				presetID = g_ioAlarmInfo["CallPresetId2"];
    				ioID = g_ioAlarmInfo["IoOutId2"];
    				break;
    			}
    			case 4: {
    				ioChk = (ioOutEnable >> 3) & 1;
    				presetChk = (presetEnable >> 3) & 1;
    				presetID = g_ioAlarmInfo["CallPresetId3"];
    				ioID = g_ioAlarmInfo["IoOutId3"];
    				break;
    			}
    		}
    		
    		if (presetChk == 0) {
    			document.all.preset_chk.checked = false;
    			$('#io_preset').attr('disabled', 'disabled').addClass("sysselect_disable");
    		} else if (presetChk == 1) {
    			document.all.preset_chk.checked = true;
    			$("#io_preset").removeAttr("disabled").removeClass("sysselect_disable");
    		}

    		if (ioChk == 0) {
    			document.all.io_output_chk.checked = false;
    			$('#io_output_preset').attr('disabled', 'disabled').addClass("sysselect_disable");
    		} else if (ioChk == 1) {
    			document.all.io_output_chk.checked = true;
    			$("#io_output_preset").removeAttr("disabled").removeClass("sysselect_disable");
    		}

    		$("#io_preset").val(presetID);
    		$("#io_output_preset").val(ioID);
		}
	});

	$("#preset_chk").click(function () {
		var index = parseInt($("#io_chn_sel").val(),10);
		var presetEnable = 0;

		if (g_ioAlarmInfo == null) {
			g_ioAlarmInfo = {};
		} else {
			presetEnable = parseInt(g_ioAlarmInfo['CallPresetEnable'],10);
		}
		
		if ($(this).prop('checked')) {
			$("#io_preset").removeAttr("disabled").removeClass("sysselect_disable");
			presetEnable = presetEnable | (1 << (index - 1));
		} else {
			$("#io_preset").attr("disabled", 'disabled').addClass("sysselect_disable");
			presetEnable = presetEnable ^ (1 << (index - 1));
		}
		
		g_ioAlarmInfo['CallPresetEnable'] = presetEnable;
	});

	$("#io_output_chk").click(function () {
		var index = parseInt($("#io_chn_sel").val(),10);
		var ioOutEnable = 0;

		if (g_ioAlarmInfo == null) {
			g_ioAlarmInfo = {};
		} else {
			ioOutEnable = parseInt(g_ioAlarmInfo['CallIoOutEnable'],10);
		}

		if ($(this).prop('checked')) {
			$("#io_output_preset").removeAttr("disabled").removeClass("sysselect_disable");
			ioOutEnable = ioOutEnable | (1 << (index - 1));
		} else {
			$("#io_output_preset").attr("disabled", 'disabled').addClass("sysselect_disable");
			ioOutEnable = ioOutEnable ^ (1 << (index - 1));
		}
		
		g_ioAlarmInfo['CallIoOutEnable'] = ioOutEnable;
	});
	
	$("#io_preset").change(function () {
		var index = parseInt($("#io_chn_sel").val(),10);

		if (g_ioAlarmInfo == null) {
			g_ioAlarmInfo = {};
		}
		
		if (index == 1) {
			g_ioAlarmInfo["CallPresetId0"] = $("#io_preset").val();
		} else if (index == 2) {
			g_ioAlarmInfo["CallPresetId1"] = $("#io_preset").val();
		} else if (index == 3) {
			g_ioAlarmInfo["CallPresetId2"] = $("#io_preset").val();
		} else if (index == 4) {
			g_ioAlarmInfo["CallPresetId3"] = $("#io_preset").val();
		}
	});

	/*
	$("#io_output_preset").change(function () {
		var index = parseInt($("#io_chn_sel").val(),10);

		if (g_ioAlarmInfo == null) {
			g_ioAlarmInfo = {};
		}
		
		if (index == 1) {
			g_ioAlarmInfo["IoOutId0"] = $("#io_output_preset").val();
		} else if (index == 2) {
			g_ioAlarmInfo["IoOutId1"] = $("#io_output_preset").val();
		} else if (index == 3) {
			g_ioAlarmInfo["IoOutId2"] = $("#io_output_preset").val();
		} else if (index == 4) {
			g_ioAlarmInfo["IoOutId3"] = $("#io_output_preset").val();
		}
	});
	*/
})
function IoOutIdUpdate()
{
	var index = parseInt($("#io_chn_sel").val(),10);

	if (g_ioAlarmInfo == null) {
		g_ioAlarmInfo = {};
	}
	
	if (index == 1) {
		g_ioAlarmInfo["IoOutId0"] = $("#io_output_preset").val();
	} else if (index == 2) {
		g_ioAlarmInfo["IoOutId1"] = $("#io_output_preset").val();
	} else if (index == 3) {
		g_ioAlarmInfo["IoOutId2"] = $("#io_output_preset").val();
	} else if (index == 4) {
		g_ioAlarmInfo["IoOutId3"] = $("#io_output_preset").val();
	}
}

$(document).on("menu_save_io_alarm", function () {
	IoOutIdUpdate();

	if (g_ioAlarmInfo) {
		var msgBody = {
			CallPresetEnable: parseInt(g_ioAlarmInfo['CallPresetEnable'], 10),
	        CallIoOutEnable: parseInt(g_ioAlarmInfo['CallIoOutEnable'], 10),
	        CallPresetId0: parseInt(g_ioAlarmInfo['CallPresetId0'], 10),
	        IoOutId0: parseInt(g_ioAlarmInfo['IoOutId0'], 10),
	        CallPresetId1: parseInt(g_ioAlarmInfo['CallPresetId1'], 10),
	        IoOutId1: parseInt(g_ioAlarmInfo['IoOutId1'], 10),
	        CallPresetId2: parseInt(g_ioAlarmInfo['CallPresetId2'], 10),
	        IoOutId2: parseInt(g_ioAlarmInfo['IoOutId2'], 10),
	        CallPresetId3: parseInt(g_ioAlarmInfo['CallPresetId3'], 10),
	        IoOutId3: parseInt(g_ioAlarmInfo['IoOutId3'], 10)
		};
		
		$.sendCmd("CW_JSON_SetIoAlarmParam", msgBody).done(function () {
			alert(IDC_GENERAL_SAVESUCCESS);
		}).fail(function () {
			alert(IDC_GENERAL_SAVEFAIL);
		})
	}
})

$(document).on("menu_close_io_alarm", function () {
	// close
})