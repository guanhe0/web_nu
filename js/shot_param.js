$(document).on("menu_show_shot_param", function (){
	if(navigator.appName == "Netscape"){
		$("#DigitZoomEnable").css("margin-left","10px");
	}
	var msgbody = {
		AFControlModel: 1,
		AFSensitivity: 1,
		AFArea: 1,
		AFSearchModel: 1,
		DigitZoomEnable: 1,
		ChannelID: 0
	};
	$.sendCmd("CW_JSON_GetCameraLens",msgbody).done(function(shotInfo){
		$("#AFControlModel").val(parseInt(shotInfo["AFControlModel"]));
		$("#AFSensitivity").val(parseInt(shotInfo["AFSensitivity"]));
		$("#AFAreaSelect").val(parseInt(shotInfo["AFArea"]));
		$("#AFSearchModel").val(parseInt(shotInfo["AFSearchModel"]));
		$("#DigitZoomEnable").attr("checked",(parseInt(shotInfo["DigitZoomEnable"]) == 0) ? false : true);
		
		if(parseInt(shotInfo["AFControlModel"]) == 0){
			AFSensitivityEnable(true);
		}
		else{
			AFSensitivityEnable(false);
		}
	})
	$("#pm_save_bt").unbind("click").click(function(){
		$("#pm_content").trigger("menu_save_shot_param");
	})
	
})

function ChangeAFSensitivityStatus(){
	var i = parseInt($("#AFControlModel").val());
	if(i == 0){
		AFSensitivityEnable(true);
	}
	else{
		AFSensitivityEnable(false);
	}
}
function AFSensitivityEnable(bEnable){
	if(bEnable){
		document.getElementById("AFSensitivity").disabled = false;
		$("#AFSensitivity").removeClass("sysinput_disable");
	}
	else{
		document.getElementById("AFSensitivity").disabled = true;
		$("#AFSensitivity").addClass("sysinput_disable");
	}
}
$(document).on("menu_save_shot_param", function (){
	var msgbody = {
		ChannelID: 0,
		AFControlModel: parseInt($.trim($("#AFControlModel").val())),
		AFSensitivity: parseInt($.trim($("#AFSensitivity").val())),
		AFArea: parseInt($.trim($("#AFAreaSelect").val())),
		AFSearchModel:parseInt($.trim($("#AFSearchModel").val())),
		DigitZoomEnable:($("#DigitZoomEnable").prop('checked') ? 1 : 0)
	};
	$.sendCmd("CW_JSON_SetCameraLens",msgbody).done(function(){
		alert(IDC_GENERAL_SAVESUCCESS);
	}).fail(function(){
		alert(IDC_GENERAL_SAVEFAIL);
	})
})
$(document).on("menu_close_shot_param",function(){
	
})
