var aVideoSize = [
"176 x 144",
"320 x 240",
"352 x 240",
"352 x 288",
"640 x 480",
"720 x 480",
"720 x 480I",
"720 x 576",
"720 x 576I",
"1280 x 720",
"1280 x 960",
"1600 x 1200",
"1920 x 1080",
"2048 x 1536",
"2560 x 1440",
"2688 x 1512"
];
var g_mvideosize = 0;
var g_svideosize = 0;
var videoInputRate = 0;

var g_mFramerate = new Array();
var g_sFramerate = new Array();

var g_sVideoBitrate = new Array();
var g_mVideoBitrate = new Array();

var g_mFramerateMax = 0;
var g_sFramerateMax = 0;
var g_sVideoBitrateRange = new Array();
var g_mVideoBitrateRange = new Array();

var g_mVideoSizeIdList = new Array();
var g_sVideoSizeIdList = new Array();
$(document).on("menu_show_video_channel_set", function () {
	/*
	RangeInput({
		domid: "m_videoFrameRate",
		min: 1,
		max: 30
	});*/
	
	RangeInput({
		domid: "m_videoGop",
		min: 1,
		max: 50
	});
	/*
	RangeInput({
		domid: "m_bitrateCBR",
		min: 128,
		max: 8192
	});
	
	RangeInput({
		domid: "s_videoFrameRate",
		min: 1,
		max: 30
	});*/

	RangeInput({
		domid: "s_videoGop",
		min: 1,
		max: 50
	});
	/*
	RangeInput({
		domid: "s_bitrateCBR",
		min: 128,
		max: 8192
	});
	*/
	var imageMsgBody = {
		ChannelID: 0,
		VideoInputRate: 1
	};
	
	
	$.sendCmd("CW_JSON_GetVideo", imageMsgBody).done(function (imageInfo) {
		videoInputRate = parseInt(imageInfo['VideoInputRate']);
	})

	
	$.sendCmd("CW_JSON_QueryVideoStreamTypeCapability").done(function (preEncodeInfo) {
		var preMasterInfo = preEncodeInfo[0];
		var preSlaveInfo = preEncodeInfo[1];
		//videosize
		var mVideoSize = parseInt(preMasterInfo['VideoSize']);
		var mVideoSizeList = preMasterInfo['VideoSize'];
		var mVideoSizeCount = parseInt(preMasterInfo['VideoSizeCount']); 
			
		var mVideoSizeSel = "";
		var base = 2;
		var number = 0;
		var k = 0;
		for(var i = 0; i < mVideoSizeCount; i++){
		//	number = Math.pow(base,i);
		//	if(mVideoSize&number)
			{
				k = mVideoSizeList[i].VideoSizeID;
				g_mVideoSizeIdList[i]=parseInt(k);
			//	mVideoSizeSel += '<option value = "' + k + '">' + aVideoSize[i] + '</option>';
				var vs = mVideoSizeList[i].VideoWidth + " x " + mVideoSizeList[i].VideoHeight;
				mVideoSizeSel += '<option value = "' + k + '">' + vs + '</option>';
			}
		}
		$("#m_videoSize").empty();
		$("#m_videoSize").append(mVideoSizeSel);
		


		//VideoMaxQuality
		var mVideoMaxQuality = parseInt(preMasterInfo['VideoMaxQuality']);
		var mQualitySpan = document.createElement("span");
		mQualitySpan.innerHTML = '(1 - ' + mVideoMaxQuality + ')';
		mQualitySpan.id = "mvideomaxquality";
		$("#mvideomaxquality").empty();
		$(mQualitySpan).insertAfter("#m_videoQuality");
		


		//VideoEncode
		var mVideoEncode = parseInt(preMasterInfo['VideoEncode']);		
		//H264Profiles
		var mH264Profiles = parseInt(preMasterInfo['H264Profiles']);	

		//videosize
		var sVideoSize = parseInt(preSlaveInfo['VideoSize']);
		var sVideoSizeList = preSlaveInfo['VideoSize'];
		var sVideoSizeCount = parseInt(preSlaveInfo['VideoSizeCount']); 
		
		var sVideoSizeSel = "";
		base = 2;
		number = 0;
		var k = 0;
		for(var i = 0; i < sVideoSizeCount; i++){
		//	number = Math.pow(base,i);
		//	if(sVideoSize&number)
		{		
				k = sVideoSizeList[i].VideoSizeID;	
				g_sVideoSizeIdList[i] = parseInt(k);
				var vs = sVideoSizeList[i].VideoWidth + " x " + sVideoSizeList[i].VideoHeight;
			//	sVideoSizeSel += '<option value = "' + k + '">' + aVideoSize[i] + '</option>';
				sVideoSizeSel += '<option value = "' + k + '">' + vs + '</option>';
			}
		}
		$("#s_videoSize").empty();
		$("#s_videoSize").append(sVideoSizeSel);
		//VideoMaxQuality
		var sVideoMaxQuality = parseInt(preSlaveInfo['VideoMaxQuality']);
		var sQualitySpan = document.createElement("span");
		sQualitySpan.innerHTML = '(1 - ' + sVideoMaxQuality + ')';
		sQualitySpan.id = "svideomaxquality";
		$("#svideomaxquality").empty();
		$(sQualitySpan).insertAfter("#s_videoQuality");

		
		//VideoEncode
		var sVideoEncode = parseInt(preSlaveInfo['VideoEncode']);		
		//H264Profiles
		var sH264Profiles = parseInt(preSlaveInfo['H264Profiles']);	

		for(var i = 0; i < mVideoSizeCount; i++){
			
			g_mFramerate[i] = new Array();
		//	g_sFramerate[i] = new Array();
			
			g_mVideoBitrate[i] = new Array();
		//	g_sVideoBitrate[i] = new Array();
			
			g_mFramerate[i].s = mVideoSizeList[i].Video60hzMaxFramerate;
			g_mFramerate[i].f = mVideoSizeList[i].Video50hzMaxFramerate;
		//	g_sFramerate[i].s = sVideoSizeList[i].Video60hzMaxFramerate;
		//	g_sFramerate[i].f = sVideoSizeList[i].Video50hzMaxFramerate;	
			
			g_mVideoBitrate[i].max = mVideoSizeList[i].VideoMaxBitrate;
			g_mVideoBitrate[i].min = mVideoSizeList[i].VideoMinBitrate;
		//	g_sVideoBitrate[i].max = sVideoSizeList[i].VideoMaxBitrate;
		//	g_sVideoBitrate[i].min = sVideoSizeList[i].VideoMinBitrate;
		}
		for(var j = 0; j < sVideoSizeCount; j++){
			g_sFramerate[j] = new Array();
			g_sVideoBitrate[j] = new Array();
			g_sFramerate[j].s = sVideoSizeList[j].Video60hzMaxFramerate;
			g_sFramerate[j].f = sVideoSizeList[j].Video50hzMaxFramerate;	
			g_sVideoBitrate[j].max = sVideoSizeList[j].VideoMaxBitrate;
			g_sVideoBitrate[j].min = sVideoSizeList[j].VideoMinBitrate;			
		}
		
	})
	$.sendCmd("CW_JSON_GetVideoEncode").done(function (encodeInfo) {
		var masterInfo = encodeInfo[0];
		var slaveInfo = encodeInfo[1];
		g_mvideosize = parseInt(masterInfo["VideoSize"]);
		g_svideosize = parseInt(slaveInfo["VideoSize"]);
		
		
		mVideoSizeChange(g_mvideosize);
		sVideoSizeChange(g_svideosize);		
		
		
		$("#m_videoSize").val(masterInfo["VideoSize"]);
		$("#m_videoFrameRate").val(masterInfo["VideoFramerate"]);
		$("#m_videoQuality").val(masterInfo["VideoQuality"]);
		$("#m_profile").val(masterInfo["H264Profiles"]);
		$("#m_videoGop").val(masterInfo["VideoGop"]);
		$("#m_bitrateCtrlMode").val(masterInfo["VideoBitrateCtrlMode"]);
		$("#m_bitrateCBR").val(masterInfo["VideoCBRBitrate"]);
		$("#m_bitrateVBRMax").val(masterInfo["VideoVBRMaxBitrate"]);
		$("#m_bitrateVBRMin").val(masterInfo["VideoVBRMinBitrate"]);
		
		
		$("#s_videoSize").val(slaveInfo["VideoSize"]);
		$("#s_videoFrameRate").val(slaveInfo["VideoFramerate"]);
		$("#s_videoQuality").val(slaveInfo["VideoQuality"]);
		$("#s_profile").val(slaveInfo["H264Profiles"]);
		$("#s_videoGop").val(slaveInfo["VideoGop"]);
		$("#s_bitrateCtrlMode").val(slaveInfo["VideoBitrateCtrlMode"]);
		$("#s_bitrateCBR").val(slaveInfo["VideoCBRBitrate"]);
		$("#s_bitrateVBRMax").val(slaveInfo["VideoVBRMaxBitrate"]);
		$("#s_bitrateVBRMin").val(slaveInfo["VideoVBRMinBitrate"]);

		$("#m_bitrateCtrlMode").change(function() {
			var val = parseInt($(this).val(), 10);
			
			if (val == 0) {
				$('#m_bitrateVBRMax').attr('ReadOnly', true).addClass("sysinput_disable");
				$('#m_bitrateVBRMin').attr('ReadOnly', true).addClass("sysinput_disable");
				$("#m_bitrateCBR").attr("ReadOnly", false).removeClass("sysinput_disable");
			}
			else if (val == 1) {
				$("#m_bitrateVBRMax").attr("ReadOnly", false).removeClass("sysinput_disable");
				$("#m_bitrateVBRMin").attr("ReadOnly", false).removeClass("sysinput_disable");
				$('#m_bitrateCBR').attr('ReadOnly', true).addClass("sysinput_disable");
			}
		})

		$("#s_bitrateCtrlMode").change(function() {
			var val = parseInt($(this).val(), 10);
			
			if (val == 0) {
				$('#s_bitrateVBRMax').attr('ReadOnly', true).addClass("sysinput_disable");
				$('#s_bitrateVBRMin').attr('ReadOnly', true).addClass("sysinput_disable");
				$("#s_bitrateCBR").attr("ReadOnly", false).removeClass("sysinput_disable");
			}
			else if (val == 1) {
				$("#s_bitrateVBRMax").attr("ReadOnly", false).removeClass("sysinput_disable");
				$("#s_bitrateVBRMin").attr("ReadOnly", false).removeClass("sysinput_disable");
				$('#s_bitrateCBR').attr('ReadOnly', true).addClass("sysinput_disable");
			}
		})

		$("#m_bitrateCtrlMode").trigger("change", "0");
		$("#s_bitrateCtrlMode").trigger("change", "0");
	})
	$("#pm_save_bt").unbind("click").click(function(){
		$("#pm_content").trigger("menu_save_video_channel_set");
	})
	
	
})
function getSelectId(type,val){
	if(type == "m"){
		var len = g_mVideoSizeIdList.length;
		for(var i = 0; i < len; i++){
			if(val == g_mVideoSizeIdList[i]){
				return i;
			}
		}
		return null;
	}
	else{
		var len1 = g_sVideoSizeIdList.length;
		for(var j = 0; j < len1; j++){
			if(val == g_sVideoSizeIdList[j]){
				return j;
			}				
		}
		return null;
	}
}
function mVideoSizeChange(id){
	//Framerate	
	id = getSelectId('m',parseInt(id));
	var mMaxFramerate = (videoInputRate == 0) ? parseInt(g_mFramerate[id].f):parseInt(g_mFramerate[id].s);
	
	var mMaxFramerateSpan = document.createElement("span");
	mMaxFramerateSpan.innerHTML = '(1 - ' + mMaxFramerate + ')';

	mMaxFramerateSpan.id = "mmaxframerate";
	$("#mmaxframerate").empty();
	$(mMaxFramerateSpan).insertAfter("#m_videoFrameRate");	
	
	
	//Bitrate
	var mVideoMaxBitrate = parseInt(g_mVideoBitrate[id].max);
	var mVideoMinBitrate = parseInt(g_mVideoBitrate[id].min);		
	var mVideoBitrateSpan = document.createElement('span');
	mVideoBitrateSpan.innerHTML = '(' + mVideoMinBitrate + ' - ' + mVideoMaxBitrate + ')Kbps';
	mVideoBitrateSpan.id = "mvideobitrate";
	$("#mvideobitrate").empty();
	$(mVideoBitrateSpan).insertAfter("#m_bitrateCBR");

	/*
	RangeInput({
		domid:"m_bitrateCBR",
		min:mVideoMinBitrate,
		max:mVideoMaxBitrate
	});	
	
	RangeInput({
			domid: "m_videoFrameRate",
			min: 1,
			max: mMaxFramerate
		});
	*/
	g_mFramerateMax = mMaxFramerate;
	g_mVideoBitrateRange[0] = mVideoMinBitrate;
	g_mVideoBitrateRange[1] = mVideoMaxBitrate;
}
function FramerateCheck(id){	
	var val = parseInt($("#" + id).val());
	if(isNaN(val)){
		val = 1;
	}
	if(id == 'm_videoFrameRate'){	
		if(val > g_mFramerateMax){
			$("#" + id).val(g_mFramerateMax);
		}
		else if(val < 1){
			$("#" + id).val(1);
		}
	}
	else{
		if(val > g_sFramerateMax){
			$("#" + id).val(g_sFramerateMax);
		}
		else if(val < 1){
			$("#" + id).val(1);
		}
	}
}
function BitRateCheck(id){
	var val = parseInt($("#" + id).val()); 
	if(isNaN(val)){
		val = 1;
	}
	
	if(id == 'm_bitrateCBR'){
		if(val > g_mVideoBitrateRange[1]){
			$("#" + id).val(g_mVideoBitrateRange[1]);
		}
		else if(val < g_mVideoBitrateRange[0]){
			$("#" + id).val(g_mVideoBitrateRange[0]);
		}
	}
	else{
		if(val > g_sVideoBitrateRange[1]){
			$("#" + id).val(g_sVideoBitrateRange[1]);
		}
		else if(val < g_sVideoBitrateRange[0]){
			$("#" + id).val(g_sVideoBitrateRange[0]);
		}		
	}
}
function sVideoSizeChange(id){
	id = getSelectId('s',parseInt(id));
	var sMaxFramerate = (videoInputRate == 0) ? parseInt(g_sFramerate[id].f):parseInt(g_sFramerate[id].s);
	var sMaxFramerateSpan = document.createElement("span");
	sMaxFramerateSpan.innerHTML = '(1 - ' + sMaxFramerate + ')';

	sMaxFramerateSpan.id = "smaxframerate";
	$("#smaxframerate").empty();
	$(sMaxFramerateSpan).insertAfter("#s_videoFrameRate");

	var sVideoMaxBitrate = parseInt(g_sVideoBitrate[id].max);
	var sVideoMinBitrate = parseInt(g_sVideoBitrate[id].min);		
	var sVideoBitrateSpan = document.createElement('span');
	sVideoBitrateSpan.innerHTML = '(' + sVideoMinBitrate + ' - ' + sVideoMaxBitrate + ')Kbps';
	sVideoBitrateSpan.id = "svideobitrate";
	$("#svideobitrate").empty();
	$(sVideoBitrateSpan).insertAfter("#s_bitrateCBR");

	/*
	RangeInput({
		domid:"s_bitrateCBR",
		min:sVideoMinBitrate,
		max:sVideoMaxBitrate
	});	
	
	RangeInput({
		domid: "s_videoFrameRate",
		min: 1,
		max: sMaxFramerate
	});	
	*/
	g_sFramerateMax = sMaxFramerate;
	g_sVideoBitrateRange[0] = sVideoMinBitrate;
	g_sVideoBitrateRange[1] = sVideoMaxBitrate;
	
}	
function max_and_min_bitrate_check(mMaxid,mMinid,sMaxid,sMinid){
	var m_bitrateMax = parseInt($("#" + mMaxid).val());
	var m_bitrateMin = parseInt($("#" + mMinid).val());
	var s_bitrateMax = parseInt($("#" + sMaxid).val());
	var s_bitrateMin = parseInt($("#" + sMinid).val());
	
	if(m_bitrateMax > g_mVideoBitrateRange[1]){		
		$("#" + mMaxid).val(g_mVideoBitrateRange[1]);
	}
	else if(m_bitrateMax < g_mVideoBitrateRange[0]){
		$("#" + mMaxid).val(g_mVideoBitrateRange[0]);		
	}
	
	if(m_bitrateMin < g_mVideoBitrateRange[0]){
		$("#" + mMinid).val(g_mVideoBitrateRange[0]);		
	}
	else if(m_bitrateMin > g_mVideoBitrateRange[1]){
		$("#" + mMinid).val(g_mVideoBitrateRange[1]);		
	}
	
	if(s_bitrateMax > g_sVideoBitrateRange[1]){
		$("#" + sMaxid).val(g_sVideoBitrateRange[1]);
	}
	else if(s_bitrateMax < g_sVideoBitrateRange[0]){
		$("#" + sMaxid).val(g_sVideoBitrateRange[0]);
	}
	
	if(s_bitrateMin > g_sVideoBitrateRange[1]){
		$("#" + sMinid).val(g_sVideoBitrateRange[1]);		
	}
	else if(s_bitrateMin < g_sVideoBitrateRange[0]){
		$("#" + sMinid).val(g_sVideoBitrateRange[0]);		
	}
	
}		
$(document).on("menu_save_video_channel_set", function () {
	var m_videoSize = parseInt($("#m_videoSize").val(), 10);
	var s_videoSize = parseInt($("#s_videoSize").val(), 10);

	if (s_videoSize > m_videoSize) {
		alert(IDC_SETTING_DIALOG_AV_MSCONDITION);
		return;
	}

	max_and_min_bitrate_check("m_bitrateVBRMax","m_bitrateVBRMin","s_bitrateVBRMax","s_bitrateVBRMin");
	if ( parseInt($("#m_bitrateVBRMin").val(), 10) > parseInt($("#m_bitrateVBRMax").val(), 10) || parseInt($("#s_bitrateVBRMin").val(), 10) > parseInt($("#s_bitrateVBRMax").val(), 10) )
	{
	alert(IDC_GENERAL_SAVEFAIL);
	return;

	}
	
	FramerateCheck("m_videoFrameRate");
	FramerateCheck("s_videoFrameRate");
	BitRateCheck("m_bitrateCBR");
	BitRateCheck("s_bitrateCBR");
	var msgBody = [
		{
			StreamId: 0,
			VideoSize: m_videoSize,
			VideoQuality: parseInt($("#m_videoQuality").val(), 10),
			VideoFramerate: parseInt($("#m_videoFrameRate").val(), 10),
			VideoGop: parseInt($("#m_videoGop").val(), 10),
			VideoBitrateCtrlMode: parseInt($("#m_bitrateCtrlMode").val(), 10),
			VideoEncodeFormat: parseInt($("#m_encodeFormat").val(), 10),
			H264Profiles: parseInt($("#m_profile").val(), 10),
			VideoCBRBitrate: parseInt($("#m_bitrateCBR").val(), 10),
			VideoVBRMinBitrate: parseInt($("#m_bitrateVBRMin").val(), 10),
			VideoVBRMaxBitrate: parseInt($("#m_bitrateVBRMax").val(), 10)
		},
		{
			StreamId: 1,
			VideoSize: s_videoSize,
			VideoQuality: parseInt($("#s_videoQuality").val(), 10),
			VideoFramerate: parseInt($("#s_videoFrameRate").val(), 10),
			VideoGop: parseInt($("#s_videoGop").val(), 10),
			VideoBitrateCtrlMode: parseInt($("#s_bitrateCtrlMode").val(), 10),
			VideoEncodeFormat: parseInt($("#s_encodeFormat").val(), 10),
			H264Profiles: parseInt($("#s_profile").val(), 10),
			VideoCBRBitrate: parseInt($("#s_bitrateCBR").val(), 10),
			VideoVBRMinBitrate: parseInt($("#s_bitrateVBRMin").val(), 10),
			VideoVBRMaxBitrate: parseInt($("#s_bitrateVBRMax").val(), 10)
		}
	];

	$.sendCmd("CW_JSON_SetVideoEncode", msgBody).done(function() {
		alert(IDC_GENERAL_SAVESUCCESS);
	}).fail(function() {
		alert(IDC_GENERAL_SAVEFAIL);
	})
})

$(document).on("menu_close_video_channel_set", function () {
	// nothing
})