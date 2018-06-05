var g_md_player = null;
var g_md_rect_max = 4;
function md_player_load(){
	var msgBody = {
        RtspPort: 1
	};
	var httpport = 0;

	httpport = parseInt(window.location.port);
	if(isNaN(httpport)){
		httpport = 80;
	}
	var container_wid = parseInt($("#pm_right").css("width"))-2;
	
	$.sendCmd("CW_JSON_GetNetworkProtocol", msgBody).done(function (portInfo) {	
		g_md_player = IPCPlayer.create({dom_id: "md_video",port:httpport,stream:0,player_wid:container_wid});
		if(g_md_player == null){
			alert(IDC_ATIVEX_PLAYER_CREATE_FAIL);
			return false;			
		}
		var ret = 0;
		ret = g_md_player.play({rtsp_port: parseInt(portInfo["RtspPort"])})
		if(ret != 0){
			alert(IDC_PLAY_VIDEO_FAIL);
		}		
	}).fail(function(){
	
	})		
}
function drawMdCover(array){
	var len = array.length;
	if(len > 0){
	var obj = {};
	for(var i = 0; i < len; i++){
		obj.id = i;
		obj.left = parseInt(array[i].Left);
		obj.right = parseInt(array[i].Right);
		obj.top = parseInt(array[i].Top);
		obj.bottom = parseInt(array[i].Bottom);
//		alert("setVideoCover id =" + obj.id + " left = " + obj.left + " right = " + obj.right + " top = " + obj.top + " bottom = " + obj.bottom);
		g_md_player.setVideoCover(obj);
	}
	}
}
$(document).on("menu_show_md_alarm", function () {
//	$("#md_video").JSVideo();
	$("#md_video").empty();
	md_player_load();
	$('#md_clear').hwbutton();
//	var iValue = 1;
	$(".md_sensi .slider").slider({
		range: "min",
		min: 1,
		max: 10,
		value: 1,
		slide: function(event, ui) {
			$(".md_sensi .value").text(ui.value);
		}
	});
	
	$('.md_sensi .slider .ui-slider-handle').css({width: "5px", height: "12px"});

	var msgBody = {
		ChannelID: 0,
		MotionDetectionEnable: 1,
		SensitivityLevel: 1,
		WindowsMask: 1
	};
	var enable = 0;
	var mdIf;
	$.sendCmd("CW_JSON_GetMotionDetection", msgBody).done(function (mdInfo) {
		mdIf = mdInfo;
		enable = parseInt(mdInfo['MotionDetectionEnable']);
		$("#md_chk").attr("checked", (enable == 0) ? false : true);

		$(".md_sensi .slider").slider("value", parseInt(mdInfo["SensitivityLevel"]));
		$(".md_sensi .value").text(parseInt(mdInfo["SensitivityLevel"]));

	});
	$("#md_enable").unbind("click").click(function(){
		if (enable == 1) {			
			g_md_player.videocoverEnable(true,g_md_rect_max);
			drawMdCover(mdIf["WindowsMask"]);
		} else if (enable == 0) {			
			g_md_player.videocoverEnable(false,g_md_rect_max);
		}		
	})
//	$(".md_sensi .value").text(iValue);
	$("#md_clear").unbind("click").click(function () {
	//	$('#md_video').DrawDIV.clearAll();
		g_md_player.videocoverEnable(false,g_md_rect_max);
		$("#md_chk").attr("checked",false);
	});

	$("#md_chk").unbind("click").click(function () {
		if ($(this).prop('checked')) {
		//	$('#md_video').DrawDIV.setDisable(false);
			g_md_player.videocoverEnable(true,g_md_rect_max);
		} else {
		//	$('#md_video').DrawDIV.clearAll();
			g_md_player.videocoverEnable(false,g_md_rect_max);
		//	$('#md_video').DrawDIV.setDisable(true);
		}
	});
	$("#pm_save_bt").unbind("click").click(function(){	
		$("#pm_content").trigger("menu_save_md_alarm");
	})
	setTimeout("$('#md_enable').click()",2500);
})
function getMdRect(obj){
	var tmp = {};
	var str = "";
	for(var i = 0; i < g_md_rect_max; i++){
		tmp.areaId = i;
		str = g_md_player.getVideoCover(tmp);
		
		str = str.split("#");
		var len = str.length;
		obj[i] = new Object();
		obj[i]["id"] = i;
		obj[i]["Left"] = parseInt(str[0]);
		obj[i]["Top"] = parseInt(str[1]);
		obj[i]["Right"] = parseInt(str[2]);
		obj[i]["Bottom"] = parseInt(str[3]);
		/*
		if(obj[i]["Left"] == 0 && obj[i]["Top"] && obj[i]["Right"] == 0 && obj[i] == 0){
			continue;
		}else{
			g_md_player.setVideoCover(obj)
		}
		*/
	}
}
$(document).on("menu_save_md_alarm", function () {

	/*
	var rectArray = $('#md_video').DrawDIV.getRect();

	if (rectArray.length < 4) {
		for (var i = rectArray.length; i < 4; i ++) {
			rectArray[i] = {};
			rectArray[i]["Left"] = 0;
			rectArray[i]["Top"] = 0;
			rectArray[i]["Right"] = 0;
			rectArray[i]["Bottom"] = 0;
		}
	}
	*/
	var rectArray = new Array();
	getMdRect(rectArray);
	var msgBody = {
		ChannelID: 0,
		MotionDetectionEnable: ($('#md_chk').prop('checked') ? 1 : 0),
		SensitivityLevel: parseInt($(".md_sensi .slider").slider("value")),
		WindowsMask: rectArray
	};

	$.sendCmd("CW_JSON_SetMotionDetection", msgBody).done(function () {
		alert(IDC_GENERAL_SAVESUCCESS);
	}).fail(function () {
		alert(IDC_GENERAL_SAVEFAIL);
	});
})

$(document).on("menu_close_md_alarm", function () {
//	$("#md_video").JSVideo.stop();
//	$('#md_video').DrawDIV.clearAll();
	if(g_md_player){	
//	g_md_player.videocoverEnable(false,g_md_rect_max);
	g_md_player.stop();
	g_md_player.Logout();	
	$("#md_video").empty();
	}
})