var rect_num_max = 4;
var g_vc_player = null;
var g_rects_array = new Array();

function vc_player_load(){
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
		g_vc_player = IPCPlayer.create({dom_id: "cover_video",port:httpport,stream:0,player_wid:container_wid});
		if(g_vc_player == null){
			alert(IDC_ATIVEX_PLAYER_CREATE_FAIL);
			return false;			
		}
		
		var ret = g_vc_player.play({rtsp_port: parseInt(portInfo["RtspPort"])})
		if(ret != 0){
			alert(IDC_PLAY_VIDEO_FAIL);
		}		
	}).fail(function(){
		
	})	
}
function draw_the_last_time_rect(data){
//	console.log("draw_the_last_time_rect 00");
	var len = data.length;
//	console.log("len = " + len);
	var obj = {};
	if(len <= rect_num_max){
//		console.log("go to for");
		for(var i = 0; i < len; i++){
			obj.id = i;
			obj.left = data[i].Left;
			obj.top = data[i].Top;
			obj.right = data[i].Right;
			obj.bottom = data[i].Bottom;
			if(obj.left == 0 && obj.top == 0 && obj.right == 0 && obj.bottom == 0){
				continue;
			}else{
//			console.log("setVideoCover");
			g_vc_player.setVideoCover(obj);
			}
		}
	}else{
		alert("rect number more than max");
	}
}

$(document).on("menu_show_video_cover", function () {
	


	
//	$("#cover_video").JSVideo();
	$("#cover_clear").hwbutton();
//	$("#pm_save_bt_vc").hwbutton();
	

	var msgBody = {
		ChannelID: 0
	};
	var enable = 0;
	var coverIn;
	$.sendCmd("CW_JSON_GetCoverArea", msgBody).done(function (coverInfo) {
		enable = parseInt(coverInfo['CoverAreaEnable']);
		coverIn = coverInfo;
		$("#cover_chk").attr("checked", (enable == 0) ? false : true);
	});

	$("#cover_video").empty();
	
	
	$("#cover_enable").unbind("click").click(function(){		
		if (enable == 1) {
		//			console.log("enable");
		g_vc_player.videocoverEnable(true,rect_num_max);
		//			console.log("draw_the_last_time_rect");
		draw_the_last_time_rect(coverIn["WindowsMask"]);
		} else if (enable == 0) {
		g_vc_player.videocoverEnable(false,rect_num_max);
		}				
		
	})
	
	$("#cover_clear").unbind("click").click(function () {
	//	$('#cover_video').DrawDIV.clearAll();//clear all draw		
		g_vc_player.videocoverEnable(false,rect_num_max);
		$("#cover_chk").prop("checked",false);
	});

	$("#cover_chk").unbind("click").click(function () {
		if ($(this).prop('checked')) {
		//	$('#cover_video').DrawDIV.setDisable(false);
			g_vc_player.videocoverEnable(true,rect_num_max);
		} else {
		//	$('#cover_video').DrawDIV.clearAll();
			g_vc_player.videocoverEnable(false,rect_num_max);
		//	$('#cover_video').DrawDIV.setDisable(true);
		//	g_vc_player.videocoverEnable(true,rect_num_max);
		}
	});
	
	$("#pm_save_bt").unbind("click").click(function(){
		$("#pm_content").trigger("menu_save_video_cover");
	})
//	setTimeout({alert("begin");$("#cover_enable").click();},1000);

	setTimeout("$('#cover_enable').click()",2500);
	
	vc_player_load();
	
})
function ArrayCopy(des,src){
	var len = src.length;
	for(var i = 0; i < len; i++){
		des[i] = new Object();
	//	console.log("src l = " + src[i].left + " t = " + src[i].top + " r = " + src[i].right + " b = " + src[i].bottom);
		des[i].Left = src[i].left;
		des[i].Top = src[i].top;
		des[i].Right = src[i].right;
		des[i].Bottom = src[i].bottom;
	//	console.log("des l = " + des[i].Left + " t = " + des[i].Top + " r = " + des[i].Right + " b = " + des[i].Bottom);
	}
}
function gerVideoCoverRect(){
	
	var tmp = {};
	var str = "";
	for(var i =0; i < rect_num_max; i++){
		tmp.areaId = i;
		str = g_vc_player.getVideoCover(tmp);
		str = str.split("#");
		
	
		var len = str.length;
		g_rects_array[i] = new Array();
		g_rects_array[i].left = parseInt(str[0]);
		g_rects_array[i].top = parseInt(str[1]);
		g_rects_array[i].right = parseInt(str[2]);
		g_rects_array[i].bottom = parseInt(str[3]);		
	}
	
}
$(document).on("menu_save_video_cover", function () {
//	var rectArray = $('#cover_video').DrawDIV.getRect();//get rect
	
	
	
	var msgBody = {
		ChannelID: 0,
		CoverAreaEnable: ($('#cover_chk').prop('checked') ? 1 : 0)
	//	WindowsMask: rectArray
	};
	
	gerVideoCoverRect();
	
	msgBody["WindowsMask"] = new Array();
	ArrayCopy(msgBody["WindowsMask"],g_rects_array);
	
	$.sendCmd("CW_JSON_SetCoverArea", msgBody).done(function () {
		alert(IDC_GENERAL_SAVESUCCESS);
	}).fail(function () {
		alert(IDC_GENERAL_SAVEFAIL);
	});
})

$(document).on("menu_close_video_cover", function () {
	
//	$("#cover_video").JSVideo.stop();
//	$('#cover_video').DrawDIV.clearAll();//clear but not save
	if(g_vc_player){		
		g_vc_player.stop();
		g_vc_player.Logout();			
		
	}
	$("#cover_video").empty();
})