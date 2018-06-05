/*
* 依赖于jquery, 后期把vlc的封装进来
*/
var g_browser_type = 0;//0:IE 1:firfox
var IPCPlayer = {
	
	create: function (options) {
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
		}, options);
		 if(navigator.appName == "Netscape"){
			g_browser_type = 1;//firefox
			
		 }			
		function ValidPlugin() {
			if(g_browser_type){//not ie
			return true;
			}
		    try {
			//	new ActiveXObject('IPCAMERA.IPCameraCtrl.1');
				new ActiveXObject('CWPLAY.cwplayCtrl.1');
		    } catch (_error) {
				return false;
		    }
		    return true;
		};
		
		var player_div = $("#" + options.dom_id),
			width = player_div.width(),
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
	//	$("#" + options.dom_id).append('<embed width=' + width + 'height=' + height + ' type=application/x-npcwplay-plugin' + ' id=pluginId>');
		
		$("#" + options.dom_id).append('<embed width=' + width + ' height=' + height + ' type="application/x-npcwplay-plugin"' + ' id="pluginId">');
		var player_obj = document.getElementById("pluginId");
		}
	
		
		if (ValidPlugin()) {
      		player_obj.CWP_SetPlayWndNum(1);
		//	console.info("play ip = " + options.device_ip + "port = " + options.rtsp_port + "username = " + options.username + "password = " + options.password);
			player_obj.CWP_SetDeviceInfo(0,options.device_ip,options.rtsp_port,options.username,options.password);
			var LoginResult = player_obj.CWP_Login(0);
			if(LoginResult != 0)
			{
				alert(IDC_ATIVEX_LOGIN_FAIL);
			}
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
      		})
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
		//	console.info("id = " + options.camera_id,"type = " + options.connection_type," stream = " + options.stream);
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
		player.fullScreen = function () {
			if (!ValidPlugin()) {
				return {success: false};
			}
			return {success: player_obj.CWP_FullScreen(1)};
		}

		player.isFullScreen = function(){
			if (!ValidPlugin()){
				return {success: false};
			}
			return {success:player_obj.CWP_IsFullScreen()};
		}
		player.replay = function () {
			if (!ValidPlugin()) {
				return {success: false};
			}

			return {success: player_obj.CWP_StartRealPlay(0,options.camera_id,options.connection_type, options.stream)};
											
		}

		player.startRecord = function(options) {
			if (!ValidPlugin()) {
				return {success: false};
			}

		//	return {success: player_obj.CWP_StartRecord(0, options.FileName, options.type)};
			return {success: !(player_obj.CWP_StartRecord(0, options, 0))};
		}
		player.stopRecord = function() {
			if (!ValidPlugin()) {
				return {success: false};
			}

			return {success: player_obj.CWP_StopRecord(0)};
		}
		
		player.getVolume = function() {
			if (!ValidPlugin()) {
				return {success: false};
			}

			return {success: player_obj.CWP_GetVolume(0)};
		}	
		
		player.setVolume = function(value) {
			if (!ValidPlugin()) {
				return {success: false};
			}

			return {success: player_obj.CWP_SetVolume(0,value)};
		}		
		player.startPtz3D = function() {
			if (!ValidPlugin()) {
				return {success: false};
			}

			
			return {success: player_obj.CWP_3DPtzControlEnable(0,true)};
		}

		player.stopPtz3D = function() {
			if (!ValidPlugin()) {
				return {success: false};
			}

			return {success: player_obj.CWP_3DPtzControlEnable(0,false)};
		}
		player.capture = function(options) {
			if (!ValidPlugin()) {
				return {success: false};
			}
		//	return {success: (!player_obj.CWP_GetJPEGFile(0,100,options))};
			return {success: (!player_obj.CWP_GetBMPFile(0,options))};
		}
		
		player.isRecording = function () {
			if (!ValidPlugin()) {
				return {success: false};
			}

			return {success: player_obj.CWP_IsRecording(0)};
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
	
		player.talkBack = function (flag) {
			if (!ValidPlugin()) {
				return {success: false};
			}
			if(flag == false)
			{
				var ret = player_obj.CWP_StopSound(0);

				return {success:ret };	
			}
			else
			{	var rets = player_obj.CWP_PlaySound(0);

				return {success: rets};	
			}
		//	return {success: player_obj.IPCStartAudioBroadCast(0, flag)};
		}
		
		player.audioOut = function (flag) {
			if (!ValidPlugin()) {
				return {success: false};
			}
			
			if(flag == true)
			{		
				return {success: player_obj.CWP_StartVoiceCom(0)};
			}
			else
			{	
				return {success: player_obj.CWP_StopVoiceCom(0)};
			}
		}
		return player;
	}
}
