var g_browser_type = 0;//0:IE 1:firfox
var IPCPlayBack = {
	create: function (options) {
		var playBack = {};
		var options = $.extend({
			dom_id: null,
			device_ip: window.location.hostname,
      		camera_id: 0,//"channel1",
      		connection_type: 1,	// 1 TCP 0 UDP
      		rtsp_port: options.port,
			username: "admin",
			password: "admin",
			stream: 0,
			version: 'V2.00'
		}, options);

		 if(navigator.appName == "Netscape"){
			g_browser_type = 1;//firefox
			
		 }	
		 
		function ValidPlugin() {
			if(g_browser_type){
				return true;
			}
		    try {
				new ActiveXObject('CWPLAY.cwplayCtrl.1');
		    } catch (_error) {
				return false;
		    }
		    return true;
		};

		var playBack_div = $("#" + options.dom_id),
			width = playBack_div.width(),
			height = playBack_div.height(),
			left = parseInt(playBack_div.css("left"), 10),
			right = parseInt(playBack_div.css("right"), 10);
		if(g_browser_type == 0){
		$('<object id="PlayBack" classid=CLSID:96BA7EF6-8389-430E-9806-36A3D30696B5 width=' 
			+ width + ' height='
			+ height + '></object>').appendTo(playBack_div);

		var playBack_obj = playBack_div.find("object")[0];
		}
		else if(g_browser_type == 1)
		{
			$('<embed width=' + width + ' height=' + height + ' type="application/x-npcwplay-plugin"' + ' id="pluginId">').appendTo(playBack_div);
			var playBack_obj = document.getElementById("pluginId");	
			
			function FireEvent_ClickWndIndex(lWndNo){
				if (g_playBack) {
					g_playBack.setCurWnd(lWndNo);
					UpdateSlider();
					// 切换图标
					var wndAttr = g_playBack.getSelWndAttr();
					if (wndAttr.played == 0) {
						// 暂停
						$(".function .play_or_pause").removeClass("pausing").addClass("playing").attr("title", IDC_PLAYBACK_PLAY);
					} else if (wndAttr.played == 1) {
						// 播放
						$(".function .play_or_pause").removeClass("playing").addClass("pausing").attr("title", IDC_PLAYBACK_PAUSE);
					}
				}				
			}
			function FireEvent_SearchFileState(lSearchState){
				if(lSearchState == 0){
				g_search_flag = 0;
				}				
			}
			function FireEvent_SearchFile(pFile){
				var aFile = pFile.split("\\");
				$('<option type="local" value="' + pFile + '">' + aFile[aFile.length-1] + '</option>').appendTo($('#file_list'));
			}	

			playBack_obj.FireEvent_SearchFile = FireEvent_SearchFile;
			playBack_obj.FireEvent_ClickWndIndex = FireEvent_ClickWndIndex;
			playBack_obj.FireEvent_SearchFileState = FireEvent_SearchFileState;			
		}
		if (ValidPlugin()) {
			playBack_obj.CWP_SetPlayWndNum(1);
		//	console.info("back ip = " + options.device_ip + "port = " + options.rtsp_port + "username = " + options.username + "password = " + options.password);
			playBack_obj.CWP_SetDeviceInfo(0,options.device_ip,options.rtsp_port,options.username,options.password);
			var LoginResult = playBack_obj.CWP_Login(0);
			if(LoginResult != 0)
			{
				alert(IDC_ATIVEX_LOGIN_FAIL);
			}			
			$.timer(500, function () {
				var curLeft = parseInt(playBack_div.css("left"), 10),
      				curRight = parseInt(playBack_div.css("right"), 10),
      				curWidth = playBack_div.width(),
      				curHeight = playBack_div.height();
      			if (width != curWidth) {
      				width = curWidth;
      				playBack_obj.width = width;
      			}
      			if (height != curHeight) {
      				height = curHeight;
      				playBack_obj.height = height;
      			}
			})
		}
		var curSelWnd = 0;	// 当前被选中的窗口
		var maxWnd = 4;		// 回放窗口最大的个数
		var wndAttr = new Array(maxWnd);
		var timerCB = null;	// 定时回调函数, 在播放文件时, 这个函数会1S执行一次
		var timerHandle = null;	// 定时器句柄
		function InitWndAttr() {
			// 数组的每一个元素指向这同一个对象的时候, 给数组中的一个元素赋值的时候, 其他元素也赋了相同的值
			var opt = {
				played: 0,		// 是否有文件在播放, 1: 在播放, 0: 暂停/停止
				playedTime: 0,		// 文件已经播放了多长时间, 单位: 秒
				playFile: ""	// 正在播放的文件的全路径
			};

			var i = 0;
			for (i = 0; i < maxWnd; i ++) {
				wndAttr[i] = {};
				wndAttr[i].played = 0;
				wndAttr[i].playedTime = 0;
				wndAttr[i].playFile = "";
			}
		}
		InitWndAttr();

		playBack.setTimerCB = function (cb) {
			if (typeof cb == 'function') {
				timerCB = cb;
			}
		}

		playBack.getSelWndAttr = function () {
			return wndAttr[curSelWnd];
		}

		playBack.getWndAttr = function (wndIndex) {
			var opt = {
				played: 0,
				playFile: ""
			};
			if ((wndIndex < 0) || (wndIndex >= maxWnd)) {
				return opt;
			} else {
				return wndAttr[wndIndex];
			}
		}

		// 这个接口一般不要调, 在OCX返回的播放结束事件里调
		playBack.clearWndAttr = function (wndIndex) {
			if ((wndIndex < 0) || (wndIndex >= maxWnd)) {
				return;
			}

			wndAttr[wndIndex].played = 0;
			wndAttr[wndIndex].playedTime = 0;
			wndAttr[wndIndex].playFile = "";

			var playCount = 0;
			for (var i = 0; i < maxWnd; i ++) {
				if (wndAttr[i].played == 1) {
					playCount ++;
				}
			}
			if (playCount == 0) {
				// 清除定时器
				if (timerHandle) {
					timerHandle.stop();
					timerHandle = null;
					timerCB(); // 执行最后一次
				}
			}
		}

		playBack.setCurWnd = function (selWnd) {
			curSelWnd = selWnd;
		}

		playBack.getCurWnd = function () {
			return curSelWnd;
		}

		playBack.search = function (opt) {
			var opt = $.extend({
				path: "",
				fileType: 0,
				start: 0,
				end:0
			}, opt);

			if (!ValidPlugin()) {
				return {success: false};
			}

		//	return {success: playBack_obj.CWP_OpenFile(opt.path, opt.fileType, opt.start, opt.end)};
		//	infor("search path = " + opt.path + " type = " + opt.fileType + " start =" + opt.start + " end = " + opt.end + "\n");
			var ret = playBack_obj.CWP_SearchLocalFile(opt.path, opt.fileType, opt.start, opt.end);
		//	var ret = playBack_obj.CWP_SearchLocalFile("C:\\IPCamera\\record\\192.168.2.15\\2015-01-30\\", 0, "00-00-00_0", "23-59-59_0");
			return ret;
		}

		// 这个接口最好不要直接调用, 相当于C++中的private接口, 调用playFile
		playBack.localPlay = function (opt) {
			var opt = $.extend({
				fileName: ""
			}, opt);

			if (!ValidPlugin()) {
				return {success: false};
			}
			
			wndAttr[curSelWnd].played = 1;
			wndAttr[curSelWnd].playFile = opt.fileName;
			
			// 定时1S执行回调
			if (timerHandle == null) {
				timerCB();
				timerHandle = $.timer(1000, function () {
					if (wndAttr[curSelWnd].played) {
						wndAttr[curSelWnd].playedTime += 1;
					}
					
					timerCB();
				});
			}
			
		//	return {success: playBack_obj.OpenFile(opt.fileName, curSelWnd)};
			return {success: playBack_obj.CWP_OpenFile(0,opt.fileName)};
		}

		playBack.playFile = function (opt) {
			var opt = $.extend({
				type: "local",
				fileName: ""
			}, opt);

			if ((opt.type !== "local") && (opt.type !== "remote")) {
				return;
			}

			var playFlag = 0;
			if (opt.type == "local") {
			//	playFlag = playBack_obj.OpenFile(opt.fileName, curSelWnd);
				playFlag = playBack_obj.CWP_OpenFile(curSelWnd, opt.fileName);
			} else if (opt.type == "remote") {
				var url = "rtsp://" + $.cookie("loginuser") + ":" + $.cookie("loginpassword") + "@" + window.location.hostname + '/' + opt.fileName;
				
				playFlag = playBack_obj.CWP_OpenNetRecord(curSelWnd,url);
			}
			playFlag = !playFlag;
			if (playFlag) {
				wndAttr[curSelWnd].played = 1;
				wndAttr[curSelWnd].playFile = opt.fileName;

				// 定时1S执行回调
				if (timerHandle == null) {
					timerCB();
					timerHandle = $.timer(1000, function () {
						if (wndAttr[curSelWnd].played) {
							wndAttr[curSelWnd].playedTime += 1;
						}
						
						timerCB();
					});
				}
			}
		}
		
		playBack.openFileDialog = function () {
			if (!ValidPlugin()) {
				return {success: false};
			}

		//	var strFileName = playBack_obj.GetOpenFileDialog(g_recPath);
			
			var strFileName = playBack_obj.CWP_OpenFileDialog(g_recPath);
			if (strFileName) {
				playBack.localPlay({fileName: strFileName});
			}
		}
		

		playBack.snap = function () {
			if (!ValidPlugin()) {
				return {success: false};
			}

			var attr = playBack.getSelWndAttr();
			if (attr.playFile) {
				// 抓拍, 暂停的时候也可以抓！
				var options = buildPath({type: "capture"});
			//	playBack_obj.SnapPic(snapPath, curSelWnd);
				playBack_obj.CWP_GetJPEGFile(0,100,options);
				alert(IDC_PLAYBACK_SNAPTO + options);
				
			}
		}

		playBack.stop = function () {
			if (!ValidPlugin()) {
				return {success: false};
			}

			wndAttr[curSelWnd].played = 0;
			wndAttr[curSelWnd].playFile = "";
			return {success: playBack_obj.CWP_StopRealPlay(0)};
		}
		playBack.Logout = function(){
			if (!ValidPlugin()) {
				return {success: false};
			}
			return {success: playBack_obj.CWP_Logout(0)};
		}
		playBack.pause = function (opt) {
			if (!ValidPlugin()) {
				return {success: false};
			}

			wndAttr[curSelWnd].played = 0;
			if (timerHandle) {
				if(opt == true){
				timerHandle.pause();
				}
				else{
				timerHandle.resume();
				}				
			}
		//	return {success: playBack_obj.Pause(curSelWnd)};
			return {success: playBack_obj.CWP_Pause(curSelWnd)};
		}		

		playBack.fast = function (opt) {
			if (!ValidPlugin()) {
				return {success: false};
			}

			wndAttr[curSelWnd].played = 1;
			if (timerHandle) {
				timerHandle.pause();
			}
		//	return {success: playBack_obj.Pause(curSelWnd)};
		//	FORWARD2:8/FORWARD4:9/FORWARD8:10/FORWARD16:11/FORWARD32:12
			if(timerHandle != null){
				timerHandle.resume();
			}
			return {success: playBack_obj.CWP_Fast(curSelWnd,opt)};
		}

		playBack.slow = function (opt) {
			if (!ValidPlugin()) {
				return {success: false};
			}

			wndAttr[curSelWnd].played = 1;
			if (timerHandle) {
				timerHandle.pause();
			}
		//	return {success: playBack_obj.Pause(curSelWnd)};
		//	SLOW2:2/SLOW4:3/SLOW8:4/SLOW16:5/SLOW32:6
			if(timerHandle != null){
				timerHandle.resume();
			}		
			return {success: playBack_obj.CWP_Slow(curSelWnd,opt)};
		}		

		playBack.oneByone = function (opt) {
			if (!ValidPlugin()) {
				return {success: false};
			}

			wndAttr[curSelWnd].played = 1;
			if (timerHandle) {
				timerHandle.pause();
			}
		//	return {success: playBack_obj.Pause(curSelWnd)};
			if(opt == false)
			{
				
				return {success: playBack_obj.CWP_OneByOne(curSelWnd,0)};
			}
			else
			{
				return {success: playBack_obj.CWP_OneByOne(curSelWnd,1)};
			}
		}		
		//NORMAL:1
		/*
		playBack.play = function () {
			if (!ValidPlugin()) {
				return {success: false};
			}

			wndAttr[curSelWnd].played = 1;
			if (timerHandle) {
				timerHandle.resume();
			}
			return {success: playBack_obj.Play(curSelWnd)};
		}
		*/
		playBack.getFileLength = function () {
			if (!ValidPlugin()) {
				return {success: false};
			}

		//	return playBack_obj.CWP_GetFileTimes(curSelWnd);
			var total = playBack_obj.CWP_GetPlayedFrames(curSelWnd);
		//	return playBack_obj.CWP_GetPlayedFrames(curSelWnd);
			return total;
		}
		playBack.getFileTimes = function () {
			if (!ValidPlugin()) {
				return {success: false};
			}

			return playBack_obj.CWP_GetFileTimes(curSelWnd);
		}		
		playBack.GetVolume = function () {
			if (!ValidPlugin()) {
				return {success: false};
			}

		//	return playBack_obj.CWP_GetFileTime(curSelWnd);
			return playBack_obj.CWP_GetVolume(curSelWnd);
		}		

		playBack.getPlayPosition = function () {
			if (!ValidPlugin()) {
				return {success: false};
			}

			return playBack_obj.CWP_GetPlayPos(curSelWnd);
		//	return playBack_obj.CWP_GetPlayedFrames(curSelWnd);
		}
		playBack.getPlayedTime = function () {
			if (!ValidPlugin()) {
				return {success: false};
			}

			return playBack_obj.CWP_GetPlayedTime(curSelWnd);
		}		

		playBack.setPlayPosition = function (opt) {
			if (!ValidPlugin()) {
				return {success: false};
			}

			var opt = $.extend({
				pos: 0 // 播放位置
			}, opt);
			return playBack_obj.CWP_SetPlayPos(curSelWnd, parseInt(opt.pos)*25);
			
		}
		
		playBack.playSound = function(sel){
			if (!ValidPlugin()) {
				return {success: false};
			}

			if(sel == false){
			return playBack_obj.CWP_StopSound(0);
			}else{
			return playBack_obj.CWP_PlaySound(0);
			}
				
		}
			
		return playBack;
	}
};
