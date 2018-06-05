var g_browser_type = 0;//0:IE 1:firfox
var IPCPlayer = {
	create:function(options)	{
		var player = {};
		var options = $.extend({
			dom_id: null,
			device_ip: window.location.hostname,
			camera_id: 0,//"channel1",
			connection_type: 0,	//0 TCP 1 UDP
			rtsp_port: options.port,
			username: $.cookie("loginuser"),
			password: $.cookie("loginpassword"),
			stream: options.stream,
			version: 'V2.00'
		},options);
		if(navigator.appName == "Netscape"){
			g_browser_type = 1;//firefox
		}
		function ValidPlugin() {
			if(g_browser_type){//not ie
			return true;
			}
		    try {
				new ActiveXObject('CWPLAY.cwplayCtrl.1');
		    } catch (_error) {
				return false;
		    }
		    return true;			
		}
		
		var player_div = $("#" + options.dom_id),
			width = options.player_wid,
			height = player_div.height(),
			left = parseInt(player_div.css("left"), 10),
			right = parseInt(player_div.css("right"), 10);
		
		if(g_browser_type == 0)	{
		$("#" + options.dom_id).append('<object id="IPCamera" classid=clsid:96BA7EF6-8389-430E-9806-36A3D30696B5 width=' 
										+ width + ' height='
										+ height + '></object>');
		var player_obj = player_div.find("object")[0];		
		}
		else if(g_browser_type == 1){		
		$("#" + options.dom_id).append('<embed width=' + width + ' height=' + height + ' type="application/x-npcwplay-plugin"' + ' id="pluginId">');
		var player_obj = document.getElementById("pluginId");
		}
		
		if (ValidPlugin()) {
      		player_obj.CWP_SetPlayWndNum(1);		
			player_obj.CWP_SetDeviceInfo(0,options.device_ip,options.rtsp_port,options.username,options.password);
			var LoginResult = player_obj.CWP_Login(0);
			if(LoginResult != 0)
			{
				alert(IDC_ATIVEX_LOGIN_FAIL);
			}
			/*
      		$.timer(500, function () {
      			var curLeft = parseInt(player_div.css("left"), 10),
      				curRight = parseInt(player_div.css("right"), 10),
      				curWidth = player_div.width(),
      				curHeight = player_div.height();
      			if (width != curWidth) {
      				width = curWidth;
      				player_obj.width = width;
      			}
      			if (height != curHeight) {
      				height = curHeight;
      				player_obj.height = height;
      			}
      		})*/
		}	
		else{	
			alert(IDC_PLEASE_INSTALL_ACTIVEX);
			return null;
		}
		
		player.Logout = function () {
			if (!ValidPlugin()) {
				return {success: false};
			}

			return {success: player_obj.CWP_Logout(0)};
		}
		player.play = function(opt) {
			if (!ValidPlugin()) {
				return {success: false};
			}
			$.extend(options, opt);
		//	console.log("id = " + options.camera_id,"type = " + options.connection_type," stream = " + options.stream);
			var ret = player_obj.CWP_StartRealPlay(0,options.camera_id,options.connection_type, options.stream);
		//	return {success: ret};			
			return ret;
		}
		player.Setstreamtype = function(opt) {
			if (!ValidPlugin()) {
				return {success: false};
			}
			return {success: player_obj.CWP_SetStreamType(0,opt)};
		}
		player.PtzControlEnable = function (opt) {
			if (!ValidPlugin()) {
				return {success: false};
			}

			return {success: player_obj.CWP_PtzControlEnable(0,opt)};
		}
		player.stop = function () {
			if (!ValidPlugin()) {
				return {success: false};
			}

			return {success: player_obj.CWP_StopRealPlay(0)};
		}		
		player.stopAll = function () {
			if (!ValidPlugin()) {
				return {success: false};
			}

			return {success: player_obj.CWP_StopAll(0)};
		}
		player.ocxVersion = function() {
			if (!ValidPlugin()) {
				return {success: false};
			}
			var ocxVer = player_obj.CWP_GetVersion();
		//	ocxVer = ocxVer.split("=")[1];
		//	ocxVer = ocxVer.split(";")[0];
			return {success: true, ocxVersion: ocxVer};
		}
		player.videocoverEnable = function(b,max){
			if (!ValidPlugin()) {				
				return {success: false};
			}			
			if(b == false){
				player_obj.CWP_VideoCoverEnable(0,0,max);
			}else{
				player_obj.CWP_VideoCoverEnable(0,1,max);
				
				
			}					
		}
		player.setVideoCover = function(options){
			if (!ValidPlugin()) {
				return {success: false};
			}		
			
		//	alert("set cover id = " + options.id + " left = " + options.left + " right = " + options.right + " top = " + options.top + "bottom = " + options.bottom);
			player_obj.CWP_SetVideoCover(0,options.id,options.left,options.top,options.right,options.bottom);
		
			
		}
		player.getVideoCover = function(options){
			if (!ValidPlugin()) {
				return {success: false};
			}			
			return player_obj.CWP_GetVideoCover(0,options.areaId);
		}
		player.videoOsdEnable = function(b,max){			
			if (!ValidPlugin()) {
				return {success: false};
			}	
			if(b == false){
			
			player_obj.CWP_VideoOsdEnable(0,0,max,g_browser_type);
			}else{
			player_obj.CWP_VideoOsdEnable(0,1,max,g_browser_type);				
			}
		}
		player.setvideoOsd = function(options){
			if (!ValidPlugin()) {
				return {success: false};
			}
			player_obj.CWP_SetVideoOsd(0,options.id,options.left,options.top,options.osdText);
		//alert("osd id = " + options.id + " left = " + options.left + " top = " + options.top + " text = \n" + options.osdText);
		}
		
		player.getvideoOsd = function(options){
			if (!ValidPlugin()) {
				return {success: false};
			}
			return player_obj.CWP_GetVideoOsd(0,options.id);
		}
		player.delvideoOsd = function(options){
			if (!ValidPlugin()) {
				return {success: false};
			}
			player_obj.CWP_DelVideoOsd(0,options.id);
	//	console.log("del v osd id = " + options.id);
		}				
		return player;
		
	}
}