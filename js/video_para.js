var masterInfo, slaveInfo;

var osd_text_48_line_byte_max = 30;
var osd_text_48_line_max = 3;
var osd_text_42_line_byte_max = 30;
var osd_text_42_line_max = 4;
var osd_text_32_line_byte_max = 30;
var osd_text_32_line_max = 5;
var osd_text_24_line_byte_max = 30;
var osd_text_24_line_max = 6;
var osd_text_line_min = 2;
var osd_text_length_max = 30;
var osd_text_length_min = 14;

var g_vp_player = null;
var g_vp_osd_max = 8;
var g_vp_osd_idx = 0;
var g_time_bps_X = 0;
var g_time_bps_Y = 0;
var g_name_X = 0;
var g_name_Y = 0;
var g_text_X = 0;
var g_text_Y = 0;
var g_pre_t1_ck = 0;
var g_pre_t2_ck = 0;
var g_pre_t3_ck = 0;
var g_pre_t4_ck = 0;
var g_pre_t5_ck = 0;
var g_pre_tm_ck = 0;
var g_pre_bps_ck = 0;
function vp_player_load(){
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
		$("#simu_video").empty();
		g_vp_player = IPCPlayer.create({dom_id: "simu_video",port:httpport,stream:0,player_wid:container_wid});
		if(g_vp_player == null){
			alert(IDC_ATIVEX_PLAYER_CREATE_FAIL);
			return false;			
		}
		var ret = 0;
		ret = g_vp_player.play({rtsp_port: parseInt(portInfo["RtspPort"])})
		if(ret != 0){
			alert(IDC_PLAY_VIDEO_FAIL);
		}		
	}).fail(function(){
		
	})
	
}
$(document).on("menu_show_video_param", function () {
//	$("#simu_video").JSVideo();
	
	
//	$("#pm_save_bt_vp").hwbutton();
	
	
	var msgMasterBody = {
		ChannelID: 0,
        StreamId: 0,
        FontSize: 1,
        TimeEnable: 1,
        TimeFormat: 1,
        TimePosX: 1,
        TimePosY: 1,
        StringMainEnable: 1,
        StringMainPosX: 1,
        StringMainPosY: 1,
        StringMain: 1,
        String1Enable: 1,
        String1PosX: 1,
        String1PosY: 1,
        String1: 1,
        String2Enable: 1,
        String2PosX: 1,
        String2PosY: 1,
        String2: 1,
        String3Enable: 1,
        String3PosX: 1,
        String3PosY: 1,
        String3: 1,
        String4Enable: 1,
        String4PosX: 1,
        String4PosY: 1,
        String4: 1,
        String5Enable: 1,
        String5PosX: 1,
        String5PosY: 1,
        String5: 1,
        InfoEnable: 1
	};
	var msgSlaveBody = {
		ChannelID: 0,
        StreamId: 1,
        FontSize: 1,
        TimeEnable: 1,
        TimeFormat: 1,
        TimePosX: 1,
        TimePosY: 1,
        StringMainEnable: 1,
        StringMainPosX: 1,
        StringMainPosY: 1,
        StringMain: 1,
        String1Enable: 1,
        String1PosX: 1,
        String1PosY: 1,
        String1: 1,
        String2Enable: 1,
        String2PosX: 1,
        String2PosY: 1,
        String2: 1,
        String3Enable: 1,
        String3PosX: 1,
        String3PosY: 1,
        String3: 1,
        String4Enable: 1,
        String4PosX: 1,
        String4PosY: 1,
        String4: 1,
        String5Enable: 1,
        String5PosX: 1,
        String5PosY: 1,
        String5: 1,
        InfoEnable: 1
	};
	$.when($.sendCmd("CW_JSON_GetVideoOsd", msgMasterBody), $.sendCmd("CW_JSON_GetVideoOsd", msgSlaveBody)).done(function (masterOsdInfo, slaveOsdInfo) {
		masterInfo = masterOsdInfo;
		slaveInfo = slaveOsdInfo;
		$("#stream_sel").trigger("change", "0");
	})
	
	$("#osd_enable").unbind("click").click(function(){
		showHideOsdTime();
		showHideName();
		showHideText();
		
	})
	if(navigator.appName == 'Microsoft Internet Explorer'){		
	setTimeout("$('#osd_enable').click()",2500);	
	}
	
/*
	$("#stream_sel").change(function () {
		if (parseInt($(this).val()) == 0) {
			showOsdInfo(masterInfo);
		} else if (parseInt($(this).val()) == 1) {
			showOsdInfo(slaveInfo);
		}
	})
	*/
	$("#pm_save_bt").unbind("click").click(function(){
		$("#pm_content").trigger("menu_save_video_param");
	})
	vp_player_load();
	if(g_vp_player)
	{	
		g_vp_player.videoOsdEnable(true,g_vp_osd_max);		
	
	}
	
	showOsdInfo(masterInfo);

	$("#osd_time_chk, #osd_bps_chk").click(function () {
		showOsdWhenChk(0);
	//	showHideOsdTime();
	})

	$("#osd_text1_chk, #osd_text2_chk, #osd_text3_chk, #osd_text4_chk, #osd_text5_chk").click(function () {
		showOsdWhenChk(2);
	//	showHideText();
	})

	$("#osd_name_chk").click(function () {
		showOsdWhenChk(1);
	//	showHideName();
	})

	$("#osd_name_str").on("keyup", function() {
	//	$('#name_drag_div')[0].innerHTML = $.trim($(this).val());	
	//		showHideName();		
		showOsdWhenChk(1);
	})
	
	$("#osd_text1_str, #osd_text2_str, #osd_text3_str, #osd_text4_str, #osd_text5_str").on("keyup", function () {
		
		var text1Chk = $("#osd_text1_chk").prop('checked') ? 1 : 0;
		var text2Chk = $("#osd_text2_chk").prop('checked') ? 1 : 0;
		var text3Chk = $("#osd_text3_chk").prop('checked') ? 1 : 0;
		var text4Chk = $("#osd_text4_chk").prop('checked') ? 1 : 0;
		var text5Chk = $("#osd_text5_chk").prop('checked') ? 1 : 0;
		var insertHtml = "";

		insertHtml = (text1Chk ? ($("#osd_text1_str").val() + "\n") : "\n") +
					 (text2Chk ? ($("#osd_text2_str").val() + "\n") : "\n") +
					 (text3Chk ? ($("#osd_text3_str").val() + "\n") : "\n") +
					 (text4Chk ? ($("#osd_text4_str").val() + "\n") : "\n") +
					 (text5Chk ? ($("#osd_text5_str").val() + "") : "");
	//	$('#text_drag_div')[0].innerHTML = insertHtml;
		var exist_text_options = {};
		exist_text_options.id = 2;
		var ret = g_vp_player.getvideoOsd(exist_text_options);
		ret = ret.split("#");
		var len = ret.length;
		
		
		
		var text_keyup_options = {};
		text_keyup_options.id = 2;
		text_keyup_options.left = parseInt(ret[0]);
		text_keyup_options.top = parseInt(ret[1]);
		
		text_keyup_options.osdText = insertHtml;
		if(insertHtml.length){
		g_vp_player.setvideoOsd(text_keyup_options);
		}else{
		var del_text_obj = {};
		del_text_obj.id = 2;
		g_vp_player.delvideoOsd(del_text_obj);
		}
	})
	$("#pm_save_bt").unbind("click").click(function(){
		$("#pm_content").trigger("menu_save_video_param");
	})
		
})
function fromeNothingToOne(obj){
	var count = 0;
	var pre_count = 0;
	if(g_pre_t1_ck){
		pre_count++;
	}
	if(g_pre_t2_ck){
		pre_count++;
	}
	if(g_pre_t3_ck){
		pre_count++;
	}
	if(g_pre_t4_ck){
		pre_count++;
	}
	if(g_pre_t5_ck){
		pre_count++;
	}
	
	if(obj.one){
		count++;
	} 
	if(obj.two){
		count++;
	} 
	if(obj.three){
		count++;
	}
	if(obj.four){
		count++;
	}
	if(obj.five){
		count++;
	}
	if(count == 1){
		if(pre_count < 1){
			return true;
		}else{
			return false;
		}
	}
}
	

function showOsdWhenChk(id){
	if(id == 0){//time bps
	var timeChk = $("#osd_time_chk").prop('checked') ? 1 : 0;
	var bpsChk = $("#osd_bps_chk").prop('checked') ? 1 : 0;
	var insertHtml = "";
	
	var bps_time_options = {};
	bps_time_options.id = 0;//g_vp_osd_idx;
	var t_ret = g_vp_player.getvideoOsd(bps_time_options);
	var t_ret = t_ret.split("#");
	
	
		if(bpsChk || timeChk){
			if(bpsChk && timeChk){//add \n			
				bps_time_options.left = parseInt(t_ret[0]);
				bps_time_options.top = parseInt(t_ret[1]);
			
				bps_time_options.osdText = buildTimeStr() + "\n" + "FR = 25 BR = 2048K";
			}else{
				if(!g_pre_tm_ck&&!g_pre_bps_ck){
				bps_time_options.left = g_time_bps_X;
				bps_time_options.top = g_time_bps_Y;
				}
				else{
					bps_time_options.left = parseInt(t_ret[0]);;
					bps_time_options.top = parseInt(t_ret[1]);;					
				}
				bps_time_options.osdText = (timeChk ? buildTimeStr() : "") + (bpsChk ? "FR = 25 BR = 2048K" : "");
			}		
		}else{
			g_time_bps_X = parseInt(t_ret[0]);
			g_time_bps_Y = parseInt(t_ret[1]);
			
			bps_time_options.osdText = "";
		}
		g_pre_tm_ck = timeChk;
		g_pre_bps_ck = bpsChk;
		
		if(bps_time_options.osdText.length){
		g_vp_player.setvideoOsd(bps_time_options);
		}else{
		var del_bps_time_obj = {};
		del_bps_time_obj.id = 0;	
		g_vp_player.delvideoOsd(del_bps_time_obj);
		}
		
	}else if(id == 1){//name
		var nameChk = $("#osd_name_chk").prop('checked') ? 1 : 0;
		var name_options = {};
		name_options.id = 1;//g_vp_osd_idx;
		var n_ret = g_vp_player.getvideoOsd(name_options);
		var n_ret = n_ret.split("#");
		if(nameChk){
			name_options.left = g_name_X;
			name_options.top = g_name_Y;
			
			name_options.osdText = $("#osd_name_str").val();						
			$('#osd_name_str').removeAttr('disabled').removeClass('sysinput_disable');			
		}else{
			g_name_X = parseInt(n_ret[0]);
			g_name_Y = parseInt(n_ret[1]);
			
			name_options.osdText = "";
			$('#osd_name_str').attr('disabled', 'disabled').addClass('sysinput_disable');			
		}
		if(name_options.osdText.length){
		g_vp_player.setvideoOsd(name_options);
		}else{
		var del_name_obj = {};
		del_name_obj.id = 1;
		g_vp_player.delvideoOsd(del_name_obj);
		}			
	}else{//text
	
		var text1Chk = $("#osd_text1_chk").prop('checked') ? 1 : 0;
		var text2Chk = $("#osd_text2_chk").prop('checked') ? 1 : 0;
		var text3Chk = $("#osd_text3_chk").prop('checked') ? 1 : 0;
		var text4Chk = $("#osd_text4_chk").prop('checked') ? 1 : 0;
		var text5Chk = $("#osd_text5_chk").prop('checked') ? 1 : 0;
		var insertHtml = "";
		
		if (text1Chk) {
			$('#osd_text1_str').removeAttr('disabled').removeClass('sysinput_disable');
		}
		else {
			$('#osd_text1_str').attr('disabled', 'disabled').addClass('sysinput_disable');
		}

		if (text2Chk) {
			$('#osd_text2_str').removeAttr('disabled').removeClass('sysinput_disable');
		}
		else {
			$('#osd_text2_str').attr('disabled', 'disabled').addClass('sysinput_disable');
		}

		if (text3Chk) {
			$('#osd_text3_str').removeAttr('disabled').removeClass('sysinput_disable');
		}
		else {
			$('#osd_text3_str').attr('disabled', 'disabled').addClass('sysinput_disable');
		}

		if (text4Chk) {
			$('#osd_text4_str').removeAttr('disabled').removeClass('sysinput_disable');
		}
		else {
			$('#osd_text4_str').attr('disabled', 'disabled').addClass('sysinput_disable');
		}

		if (text5Chk) {
			$('#osd_text5_str').removeAttr('disabled').removeClass('sysinput_disable');
		}
		else {
			$('#osd_text5_str').attr('disabled', 'disabled').addClass('sysinput_disable');
		}

		var vp_text_osd = {};
		vp_text_osd.id = 2;//g_vp_osd_idx;
		var x_ret = g_vp_player.getvideoOsd(vp_text_osd);
		x_ret = x_ret.split('#');
		
		if (text1Chk || text2Chk || text3Chk || text4Chk || text5Chk) {
			vp_text_osd.osdText = (text1Chk ? ($("#osd_text1_str").val() + "\n") : "") +
								  (text2Chk ? ($("#osd_text2_str").val() + "\n") : "") +
								  (text3Chk ? ($("#osd_text3_str").val() + "\n") : "") +
								  (text4Chk ? ($("#osd_text4_str").val() + "\n") : "") +
								  (text5Chk ? ($("#osd_text5_str").val() + "") : "");
			var obj = {};
			obj.one = text1Chk;
			obj.two = text2Chk;
			obj.three = text3Chk;
			obj.four = text4Chk;
			obj.five = text5Chk;
			if(fromeNothingToOne(obj)){
				vp_text_osd.left = g_text_X;
				vp_text_osd.top = g_text_Y;
			}else{
				vp_text_osd.left = parseInt(x_ret[0]);
				vp_text_osd.top = parseInt(x_ret[1]);
			}
		}else{
			g_text_X = parseInt(x_ret[0]);
			g_text_Y = parseInt(x_ret[1]);
			
			vp_text_osd.osdText = "";
		}
		g_pre_t1_ck = text1Chk;
		g_pre_t2_ck = text2Chk;
		g_pre_t3_ck = text3Chk;
		g_pre_t4_ck = text4Chk;
		g_pre_t5_ck = text5Chk;

		if(vp_text_osd.osdText.length){
		g_vp_player.setvideoOsd(vp_text_osd);
		}else{
		var delosd = {};
		delosd.id = 2;
		g_vp_player.delvideoOsd(delosd);
		}
		
	}
}

function showOsdInfo(osdInfo) {
	var fontsize = osdInfo["FontSize"];
	if(fontsize < 0 || fontsize > 3)
	{
		switch(fontsize)
		{
			case 24:
				osdInfo["FontSize"] = 0;
				break;
			case 32:
				osdInfo["FontSize"] = 1;
				break;
			case 42:
				osdInfo["FontSize"] = 2;
				break;
			case 48:
				osdInfo["FontSize"] = 3;
				break;
			default:
				osdInfo["FontSize"] = 0;
				break;
		}
	}
	$("#stream_fontsize").val(osdInfo["FontSize"]);
	$("#osd_time_format").val(osdInfo["TimeFormat"]);
	$("#osd_name_str").val(osdInfo["StringMain"]);
	$("#osd_text1_str").val(osdInfo["String1"]);
	$("#osd_text2_str").val(osdInfo["String2"]);
	$("#osd_text3_str").val(osdInfo["String3"]);
	$("#osd_text4_str").val(osdInfo["String4"]);
	$("#osd_text5_str").val(osdInfo["String5"]);

	$("#osd_bps_chk").attr("checked", (parseInt(osdInfo["InfoEnable"]) == 0) ? false : true);
	$("#osd_time_chk").attr("checked", (parseInt(osdInfo["TimeEnable"]) == 0) ? false : true);
	$("#osd_name_chk").attr("checked", (parseInt(osdInfo["StringMainEnable"]) == 0) ? false : true);
	$("#osd_text1_chk").attr("checked", (parseInt(osdInfo["String1Enable"]) == 0) ? false : true);
	$("#osd_text2_chk").attr("checked", (parseInt(osdInfo["String2Enable"]) == 0) ? false : true);
	$("#osd_text3_chk").attr("checked", (parseInt(osdInfo["String3Enable"]) == 0) ? false : true);
	$("#osd_text4_chk").attr("checked", (parseInt(osdInfo["String4Enable"]) == 0) ? false : true);
	$("#osd_text5_chk").attr("checked", (parseInt(osdInfo["String5Enable"]) == 0) ? false : true);
	var osdInfo;
	if (parseInt($("#stream_sel").val()) == 0) {
		osdInfo = masterInfo;
	} else if (parseInt($("#stream_sel").val()) == 1) {
		osdInfo = slaveInfo;
	}
	g_time_bps_X = parseInt(osdInfo["TimePosX"]);
	g_time_bps_Y = parseInt(osdInfo["TimePosY"]);
	g_name_X = parseInt(osdInfo["StringMainPosX"]);
	g_name_Y = parseInt(osdInfo["StringMainPosY"]);
	g_text_X = parseInt(osdInfo["String1PosX"]);
	g_text_Y = parseInt(osdInfo["String1PosY"]);
	g_pre_bps_ck = parseInt(osdInfo["InfoEnable"]);
	g_pre_tm_ck = parseInt(osdInfo["TimeEnable"]);
	g_pre_t1_ck = parseInt(osdInfo["String1Enable"]);
	g_pre_t2_ck = parseInt(osdInfo["String2Enable"]);
	g_pre_t3_ck = parseInt(osdInfo["String3Enable"]);
	g_pre_t4_ck = parseInt(osdInfo["String4Enable"]);
	g_pre_t5_ck = parseInt(osdInfo["String5Enable"])

	showHideName();
	showHideOsdTime();
	showHideText();
}

function showHideOsdTime() {
	var timeChk = $("#osd_time_chk").prop('checked') ? 1 : 0;
	var bpsChk = $("#osd_bps_chk").prop('checked') ? 1 : 0;
	var osdInfo;
	var insertHtml = "";

	if (parseInt($("#stream_sel").val()) == 0) {
		osdInfo = masterInfo;
	} else if (parseInt($("#stream_sel").val()) == 1) {
		osdInfo = slaveInfo;
	}
	var bps_time_options = {};
	bps_time_options.id = 0;//g_vp_osd_idx;
	bps_time_options.left = parseInt(osdInfo["TimePosX"]);
	bps_time_options.top = parseInt(osdInfo["TimePosY"]);
	
	if (bpsChk || timeChk) {
		// 
		/*
		if(bpsChk && timeChk)
			$('#osd_time_drag_div').css('min-height' , '32px');
		else
			$('#osd_time_drag_div').css('min-height', '16px');
		
		$("#osd_time_drag_div").show().draggable({
			containment: "#simu_video"
		}).bind("mousemove", function () {
			$(this).css("cursor", "move")
		});

		insertHtml = (timeChk ? (buildTimeStr() + "<br>") : "<br>") + (bpsChk ? "FR = 25 BR = 2048K" : "");			
		$('#osd_time_drag_div')[0].innerHTML = insertHtml;
		*/
		if(bpsChk && timeChk){//add \n			
			bps_time_options.osdText = buildTimeStr() + "\n" + "FR = 25 BR = 2048K";
		}else{
			bps_time_options.osdText = (timeChk ? buildTimeStr() : "") + (bpsChk ? "FR = 25 BR = 2048K" : "");
		}		
	}
	else {
	//	$("#osd_time_drag_div").hide();
		bps_time_options.osdText = "";
	}
	if(bps_time_options.osdText.length){
	g_vp_player.setvideoOsd(bps_time_options);
	}else{
	var del_bps_time_obj = {};
	del_bps_time_obj.id = 0;	
	g_vp_player.delvideoOsd(del_bps_time_obj);
	}
}

function showHideText() {
	var text1Chk = $("#osd_text1_chk").prop('checked') ? 1 : 0;
	var text2Chk = $("#osd_text2_chk").prop('checked') ? 1 : 0;
	var text3Chk = $("#osd_text3_chk").prop('checked') ? 1 : 0;
	var text4Chk = $("#osd_text4_chk").prop('checked') ? 1 : 0;
	var text5Chk = $("#osd_text5_chk").prop('checked') ? 1 : 0;
	var osdInfo;
	var insertHtml = "";

	if (parseInt($("#stream_sel").val()) == 0) {
		osdInfo = masterInfo;
	} else if (parseInt($("#stream_sel").val()) == 1) {
		osdInfo = slaveInfo;
	}

	if (text1Chk) {
		$('#osd_text1_str').removeAttr('disabled').removeClass('sysinput_disable');
	}
	else {
		$('#osd_text1_str').attr('disabled', 'disabled').addClass('sysinput_disable');
	}

	if (text2Chk) {
		$('#osd_text2_str').removeAttr('disabled').removeClass('sysinput_disable');
	}
	else {
		$('#osd_text2_str').attr('disabled', 'disabled').addClass('sysinput_disable');
	}

	if (text3Chk) {
		$('#osd_text3_str').removeAttr('disabled').removeClass('sysinput_disable');
	}
	else {
		$('#osd_text3_str').attr('disabled', 'disabled').addClass('sysinput_disable');
	}

	if (text4Chk) {
		$('#osd_text4_str').removeAttr('disabled').removeClass('sysinput_disable');
	}
	else {
		$('#osd_text4_str').attr('disabled', 'disabled').addClass('sysinput_disable');
	}

	if (text5Chk) {
		$('#osd_text5_str').removeAttr('disabled').removeClass('sysinput_disable');
	}
	else {
		$('#osd_text5_str').attr('disabled', 'disabled').addClass('sysinput_disable');
	}
	
	var vp_text_osd = {};
	vp_text_osd.id = 2;//g_vp_osd_idx;
	vp_text_osd.left = parseInt(osdInfo["String1PosX"]);
	vp_text_osd.top = parseInt(osdInfo["String1PosY"]);
	if (text1Chk || text2Chk || text3Chk || text4Chk || text5Chk) {
		/*
		$("#text_drag_div").show().draggable({
			containment: "#simu_video"
		}).bind("mousemove", function () {
			$(this).css("cursor", "move")
		});
		*/
		
		
		
		
		/*
		insertHtml = (text1Chk ? ($.trim($("#osd_text1_str").val()) + "<br>") : "<br>") +
					 (text2Chk ? ($.trim($("#osd_text2_str").val()) + "<br>") : "<br>") +
					 (text3Chk ? ($.trim($("#osd_text3_str").val()) + "<br>") : "<br>") +
					 (text4Chk ? ($.trim($("#osd_text4_str").val()) + "<br>") : "<br>") +
					 (text5Chk ? ($.trim($("#osd_text5_str").val()) + "") : "");
		*/
		
		vp_text_osd.osdText = (text1Chk ? ($("#osd_text1_str").val() + "\n") : "") +
							  (text2Chk ? ($("#osd_text2_str").val() + "\n") : "") +
							  (text3Chk ? ($("#osd_text3_str").val() + "\n") : "") +
							  (text4Chk ? ($("#osd_text4_str").val() + "\n") : "") +
							  (text5Chk ? ($("#osd_text5_str").val() + "") : "");

//		console.log("str1 = " + $("#osd_text1_str").val() + " \n str2 = " + $("#osd_text2_str").val() + " \nstr3 = " + 
//		$("#osd_text3_str").val() + " \nstr4 = " + $("#osd_text4_str").val() + "\n str5 = " + $("#osd_text5_str").val());
		
	//	$('#text_drag_div')[0].innerHTML = insertHtml;
		
		
		
	}
	else {
	//	$('#text_drag_div').hide();
		vp_text_osd.osdText = "";		
	}
	if(vp_text_osd.osdText.length){
	g_vp_player.setvideoOsd(vp_text_osd);
	}else{
	var delosd = {};
	delosd.id = 2;
	g_vp_player.delvideoOsd(delosd);
	}

}

function showHideName() {
	var nameChk = $("#osd_name_chk").prop('checked') ? 1 : 0;
	var osdInfo;
	if (parseInt($("#stream_sel").val()) == 0) {
		osdInfo = masterInfo;
	} else if (parseInt($("#stream_sel").val()) == 1) {
		osdInfo = slaveInfo;
	}
	var name_options = {};
	name_options.id = 1;//g_vp_osd_idx;
	name_options.left = parseInt(osdInfo["StringMainPosX"]);
	name_options.top = parseInt(osdInfo["StringMainPosY"]);
	
	if (nameChk) {		
		/*
		$("#name_drag_div").show().draggable({
			containment: "#simu_video"
		}).bind("mousemove", function () {
			$(this).css("cursor", "move")
		});
		*/
		
		name_options.osdText = $("#osd_name_str").val();						
		$('#osd_name_str').removeAttr('disabled').removeClass('sysinput_disable');
	}
	else {
	//	$("#name_drag_div").hide();
		name_options.osdText = "";
		$('#osd_name_str').attr('disabled', 'disabled').addClass('sysinput_disable');
	}
	//$('#name_drag_div')[0].innerHTML = $.trim($("#osd_name_str").val());
	if(name_options.osdText.length){
	g_vp_player.setvideoOsd(name_options);
	}else{
	var del_name_obj = {};
	del_name_obj.id = 1;
	g_vp_player.delvideoOsd(del_name_obj);
	}
}

function buildTimeStr() {
	var now = new Date();
	var dataStr = "";
	var year, month, day, hours, minute, second;

	year = now.getFullYear();
	month = now.getMonth() + 1;
	day = now.getDate();
	hours = now.getHours();
	minute = now.getMinutes();
	second = now.getSeconds();

	dataStr = "" + year + "-" + ((month >= 10) ? month : ("0" + month)) + "-" + ((day >= 10) ? day : ("0" + day));
	dataStr += " " + ((hours >= 10) ? hours : ("0" + hours)) + "-" + ((minute >= 10) ? minute : ("0" + minute)) + "-" + ((second >= 10) ? second : ("0" + second));
	
	return dataStr;
}
function line_and_max(msgBody)
{
	var count = 0;
	var max = 0;
	if(msgBody["StringMainEnable"])
	{		
		
		if(parseInt(msgBody["StringMain"].length) > max)
		{
			max = parseInt(msgBody["StringMain"].length);			
		}
		if(parseInt(msgBody["StringMain"].length))
		{
			count += 1;
		}
	}
	if(msgBody["String1Enable"])
	{		
		if(parseInt(msgBody["String1"].length) > max)
		{
			max = parseInt(msgBody["String1"].length);
		}	
		if(parseInt(msgBody["String1"].length))
		{
			count += 1;
		}		
	}
	if(msgBody["String2Enable"])
	{		
		if(parseInt(msgBody["String2"].length) > max)
		{
			max = parseInt(msgBody["String2"].length);
		}
		if(parseInt(msgBody["String2"].length))
		{
			count += 1;
		}		
	}
	if(msgBody["String3Enable"])
	{
		if(parseInt(msgBody["String3"].length) > max)
		{
			max = parseInt(msgBody["String3"].length);			
		}	
		if(parseInt(msgBody["String3"].length))
		{
			count += 1;
		}		
	}
	if(msgBody["String4Enable"])
	{
		if(parseInt(msgBody["String4"].length) > max)
		{
			max = parseInt(msgBody["String4"].length);
		}		
		if(parseInt(msgBody["String4"].length))
		{
			count += 1;
		}		
	}
	if(msgBody["String5Enable"])
	{		
		if(parseInt(msgBody["String5"].length) > max)
		{
			max = parseInt(msgBody["String5"].length);
		}
		if(parseInt(msgBody["String5"].length))
		{
			count += 1;
		}		
	}
	return {"count":count,"max":max};
}

function IsValidText(msgBody)
{
	
	var fontsize = parseInt(msgBody["FontSize"]);
	var lineAndmax = line_and_max(msgBody);
	
	if(lineAndmax.count <= osd_text_line_min)
	{
		if(lineAndmax.max > osd_text_length_max)
		{
			alert(IDC_TEXT_LENGTH_OR_NUMBER_OUTLIMITED);
		}
	}
	else
	{
		if(lineAndmax.max > osd_text_length_min)
		{
			alert(IDC_TEXT_LENGTH_OR_NUMBER_OUTLIMITED);
		}
	}
	/*
	var ret = true;
	switch(fontsize)
	{
		case 0:
			if(lineAndmax.max > osd_text_24_line_byte_max)
			{
				alert(IDC_OSD_STRING_OUTLIMITED);
				ret = false;		
			}
			break;
		case 1:
			if(lineAndmax.max > osd_text_32_line_byte_max)
			{
				alert(IDC_OSD_STRING_OUTLIMITED);
				ret = false;				
			}
			else if(lineAndmax.count > osd_text_32_line_max)
			{
				alert(IDC_OSD_TEXT_NUMBER_OUTLIMITED)
				ret = false;
			}
			break;
		case 2:
			if(lineAndmax.max > osd_text_42_line_byte_max)
			{
				alert(IDC_OSD_STRING_OUTLIMITED);
				ret = false;				
			}
			else if(lineAndmax.count > osd_text_42_line_max)
			{
				alert(IDC_OSD_TEXT_NUMBER_OUTLIMITED)
				ret = false;				
			}
			break;
		case 3:
			if(lineAndmax.max > osd_text_48_line_byte_max)
			{
				alert(IDC_OSD_STRING_OUTLIMITED);
				ret = false;
			}
			else if(lineAndmax.count > osd_text_48_line_max)
			{
				alert(IDC_OSD_TEXT_NUMBER_OUTLIMITED)
				ret = false;				
			}
			break;
		default:
			ret = true;
			break;
	}
	*/	
}
function GetvideoOsd(obj){
	var tmp = {};
	var str = "";
	for(var i = 0; i < g_vp_osd_max; i++){
		tmp["id"] = i;
		str = g_vp_player.getvideoOsd(tmp);
		if(str.length){
			var strarray = str.split("#");
			var content = strarray[2];
			var posX = parseInt(strarray[0]);
			var posY = parseInt(strarray[1]);
			switch(i)
			{	//time || bps
				case 0:
					obj["TimePosX"] = posX;
					obj["TimePosY"] = posY;
					break;
				// name
				case 1:
					obj["StringMainPosX"] = posX;
					obj["StringMainPosY"] = posY;
				//	obj["StringMain"] = content;
					break;
				//text
				case 2:
					obj["String1PosX"] = posX;
					obj["String1PosY"] = posY;					
					break;
				default:
					break;
			}
		}
	}
}
$(document).on("menu_save_video_param", function () {
	var msgBody = {
		ChannelID: 0,
        StreamId: parseInt($("#stream_sel").val()),
        FontSize: parseInt($("#stream_fontsize").val()),
        TimeEnable: ($('#osd_time_chk').prop('checked') ? 1 : 0),
        TimeFormat: parseInt($("#osd_time_format").val()),
     // TimePosX: parseInt(($("#osd_time_drag_div").offset().left - $("#simu_video").offset().left) / parseInt($("#simu_video").css("width")) * 10000, 10),
     // TimePosY: parseInt(($("#osd_time_drag_div").offset().top - $("#simu_video").offset().top) / parseInt($("#simu_video").css("height")) * 10000, 10),
        StringMainEnable: ($('#osd_name_chk').prop('checked') ? 1 : 0),
     //   StringMainPosX: parseInt(($("#name_drag_div").offset().left - $("#simu_video").offset().left) / parseInt($("#simu_video").css("width")) * 10000, 10),
     //   StringMainPosY: parseInt(($("#name_drag_div").offset().top - $("#simu_video").offset().top) / parseInt($("#simu_video").css("height")) * 10000, 10),
        StringMain: $("#osd_name_str").val(),
        String1Enable: ($('#osd_text1_chk').prop('checked') ? 1 : 0),
     //   String1PosX: parseInt(($("#text_drag_div").offset().left - $("#simu_video").offset().left) / parseInt($("#simu_video").css("width")) * 10000, 10),
     //   String1PosY: parseInt(($("#text_drag_div").offset().top - $("#simu_video").offset().top) / parseInt($("#simu_video").css("height")) * 10000, 10),
        String1: $("#osd_text1_str").val(),
        String2Enable: ($('#osd_text2_chk').prop('checked') ? 1 : 0),
        String2: $("#osd_text2_str").val(),
        String3Enable: ($('#osd_text3_chk').prop('checked') ? 1 : 0),
        String3: $("#osd_text3_str").val(),
        String4Enable: ($('#osd_text4_chk').prop('checked') ? 1 : 0),
        String4: $("#osd_text4_str").val(),
        String5Enable: ($('#osd_text5_chk').prop('checked') ? 1 : 0),
        String5: $("#osd_text5_str").val(),
        InfoEnable: ($('#osd_bps_chk').prop('checked') ? 1 : 0)
	};
	GetvideoOsd(msgBody);
	IsValidText(msgBody);
	$.sendCmd("CW_JSON_SetVideoOsd", msgBody).done(function () {
		alert(IDC_GENERAL_SAVESUCCESS);
	}).fail(function () {
		alert(IDC_GENERAL_SAVEFAIL);
	})
})

$(document).on("menu_close_video_param", function () {
//	$("#simu_video").JSVideo.stop();

	if(g_vp_player != null){		
	g_vp_player.videoOsdEnable(false,g_vp_osd_max);
	g_vp_player.stop();
	g_vp_player.Logout();
		
	}
	$("#simu_video").empty();
})
