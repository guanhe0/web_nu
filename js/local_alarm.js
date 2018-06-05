var g_alarm_timer = null;
var alarmPeriodTime = 3000;		// 单位毫秒
var g_dealAlarmMsg = 0;			// 1:有报警信息时用户没点按钮, 显示红色 
var g_AlarmMessageNumber = 31;								// 0:用户已经点击红色报警信息, 显示文字查看报警
var alarmCookieID = "ALARMMSG";	// ALARMMSG:{"AlarmType":0,"AlarmID":1,"AlarmMsg":"","AlarmTime":""};{}
var GETALARMMESSAGEDELAY = 4000;
var g_AlarmTableIsOpen = false;
var g_index_debug = 0;

/*
AlarmType 告警类型
0，I01报警
1，I02报警
2，I03报警
3，I04报警
4，移动侦�?
5，越�?
6，遗�?
7，滞�?
8，跟�?
9，视频遮�?
10，人群聚�?
11，视频丢�?
12，网络故�?
13，设备故�?
*/

function ConvertAlarmType(typeIndex) {
	var typeStr = "";
	switch (typeIndex) {
		case 0: {
			typeStr = IDC_LIVE_ALARM_IO1;
			break;
		}
		case 1: {
			typeStr = IDC_LIVE_ALARM_IO2;
			break;
		}
		case 2: {
			typeStr = IDC_LIVE_ALARM_IO3;
			break;
		}
		case 3: {
			typeStr = IDC_LIVE_ALARM_IO4;
			break;
		}
		case 4: {
			typeStr = IDC_LIVE_ALARM_MD;
			break;
		}
		case 14:{
			typeStr = IDC_LIVE_ALARM_TF;
			break;		
		}
	}

	return typeStr;
}

function AlarmPeriodInit() {
	oneTime(GETALARMMESSAGEDELAY, function () {
		$.sendCmd("CW_GET_AlarmMsg").done(function (alarmInfo) {
			
			DealAlarmMsg(alarmInfo);
		});
	});

	/******************************************** 2014-11-08 修改  start *****************************************************/
	$("#alarm_panel_content").click(function() {
		if ($(".ui-dialog[aria-describedby='setting_dialog']").css("display") == 'block') {
			return;
		}

		// 设置报警信息到table框里
		ShowMsgToTable();

		var sTitle = "";
		if(g_langIndex == 0)
		{
			sTitle = "报警信息";
		}
		else
		{
			sTitle = "Alarm Information";
		}

		$("#alarm_dialog").dialog({
			resizable: false,
			modal: true,
			width: 500,
      		height: 360,
      		title: sTitle,
      		buttons: [
      			{
      				text: IDC_GENERAL_CLOSE,
      				click: function () {
      					$(this).dialog("close");
      				}
      			}
      		],
		   close:function(){SetAlarmTableOpenStatus(false);}
		});
		$(".ui-dialog[aria-describedby='alarm_dialog']").bgiframe();

		ClearAlarmFlag();
		SetAlarmTableOpenStatus(true);

	});
	
	/**
	 * 有报警信息时
	 * $("#alarm_panel_content").show()
	 * 无报警信息时
	 * $("#alarm_panel_content").hide()
	 * 
	 * 
	 * 按钮打开
	 * $("").removeClass("opr-close"); $("").addClass("opr-open");
	 * 关闭状�?
	 * $("").removeClass("opr-open"); $("").addClass("opr-close");
	 * 
	 * opr 按钮
	 * 例如�?<input type="button" id="image_turn_ver" class="opr opr-txfz-lr" />
	 * 选中
	 * $("#image_turn_ver").addClass("opr-txfz-lr-active");
	 * 取消选中
	 * $("#image_turn_ver").removeClass("opr-txfz-lr-active");
	 * 
	 * ptz
	 * $(".ptz .up").mousedown(function(){
	 * 		$(this).addClass("active");
	 * 		type = "ptz_up";
	 *    	do Some things。。�?
	 * });
	 * $(document).mouseup(function(){
	 * 		$(".ptz .direction").removeClass("active");
	 * 		if(type == "ptz_up"){
	 * 			do Some things。。�?
	 * 		} else if(...){
	 * 			do Some things。。�?
	 * 		}
	 *    	
	 * })
	 * 
	 * 保存参数
	 * 默认状态： save_param_btn 显示      save_success_msg 不显�?
	 * 保存成功�?("#save_success_msg").show();
	 * setTimeout(function(){ // 5秒后隐藏消息
	 * 	$("#save_success_msg").hide();
	 * }, 5000);
	 */
	
	/******************************************** 2014-11-08 修改  end *****************************************************/
};

function DealAlarmMsg(alarmMsg) {
	ParseAlarmMsg(alarmMsg);
	
	ShowMsgToTable();
	oneTime(alarmPeriodTime, function () {
		$.sendCmd("CW_GET_AlarmMsg").done(function (alarmInfo) {
			
			DealAlarmMsg(alarmInfo);
		});
	});	
};

function ParseAlarmMsg(alarmMsg) {

	var msg = alarmMsg["Msg"];//"Msg":�������
	if (msg) {
		for (var i = 0; i < msg.length; i++) {
			SetAlarmMsgToCookie(msg[i]);
		}
		ShowAlarmFlag();
	}
	
		/*********debug******************
			ShowAlarmFlag();
			var msgdebug = {"AlarmType":0,"AlarmID":g_index_debug++,"AlarmMsg":"","AlarmTime":"1416380432"+g_index_debug};
			SetAlarmMsgToCookie(msgdebug);
	***debug*************************/
}

function ShowAlarmFlag() {
	
	if(false == AlarmTableIsOpen())
	{
		$('#alarm_no_flag').hide();
		$('#alarm_red_flag').show();
	}
}
function AlarmTableIsOpen()
{
	return g_AlarmTableIsOpen;
}
function SetAlarmTableOpenStatus(bStatus)
{
	g_AlarmTableIsOpen = bStatus;
}
function ClearAlarmFlag() {
	$('#alarm_red_flag').hide();
	$('#alarm_no_flag').show();
}

function GetAlarmMsgFromCookie() {

}

function SetAlarmMsgToCookie(msg) {
	var alarmMsg = $.cookie(alarmCookieID);

	if (typeof alarmMsg != "undefined") {
		// 分析, 去掉有相同ID号的信息
		var msgTemp = alarmMsg.split(";");
		var bFound = 0;
	
		for (var i = 0; i < msgTemp.length - 1; i ++) {
			var jsonMsg = $.evalJSON(msgTemp[i]);
			
	//		if (parseInt(jsonMsg["AlarmID"], 10) == parseInt(msg["AlarmID"],10)) {
			if (parseInt(jsonMsg["AlarmTime"], 10) == parseInt(msg["AlarmTime"],10)) {
				
				bFound = 1;
			}
		}

		if (!bFound) 
		{
			if(msgTemp.length < g_AlarmMessageNumber)
			{
				$.cookie(alarmCookieID, $.toJSON(msg) + ";" + alarmMsg, {expires: 30});
			}
			else
			{	
				alarmMsg = "";
				for(var j = msgTemp.length-3; j >= 0; j --)
				{
					msgTemp[j+1] = msgTemp[j];
					$.cookie(alarmCookieID,  msgTemp[j+1] + ";" + alarmMsg, {expires: 30});
					alarmMsg = $.cookie(alarmCookieID);
				}
				$.cookie(alarmCookieID, $.toJSON(msg) +";"+ alarmMsg, {expires: 30});
			}
		}
		
	} else {
		$.cookie(alarmCookieID, $.toJSON(msg) + ";", {expires: 30});
	}

}

function FormTimeStr(seconds)
{
	if (seconds < 0 || seconds == undefined) return (-1);
	
	var now = new Date();
	now.setTime(seconds * 1000);

	// �?时区
	now.setHours(now.getHours() - 8);
	
	var strDate = now.getFullYear().toString() + "-";
    if ((1 + now.getMonth()).toString().length < 2)
    {// 前面补零，比�?1 -> 01
        strDate += '0';
    }
    strDate += (1 + now.getMonth()).toString() + "-";
    
    if (now.getDate().toString().length < 2)
    {
        strDate += '0';
    }   
    strDate += now.getDate().toString();
    
    strDate += " ";
    if (now.getHours().toString().length < 2)
    {
        strDate += "0";
    }
    strDate += now.getHours().toString() + ":";
    
    if (now.getMinutes().toString().length < 2)
    {
        strDate += "0";
    }
    strDate += now.getMinutes().toString() + ":";
    
    if (now.getSeconds().toString().length < 2)
    {
        strDate += "0";
    }
    strDate += now.getSeconds().toString();
    
    return strDate;
}

function ShowMsgToTable() {
	
	var alarmMsg = $.cookie(alarmCookieID);
//	var alarmMsg = '{"AlarmType":14,"AlarmID":1,"AlarmMsg":"","AlarmTime":"1416380432"};{"AlarmType":14,"AlarmID":2,"AlarmMsg":"","AlarmTime":"1416379385"};{"AlarmType":14,"AlarmID":2,"AlarmMsg":"","AlarmTime":"1416379385"}';
		//;{"AlarmType":1,"AlarmID":2,"AlarmMsg":"","AlarmTime":"1416379385"}'
		
		//{"AlarmType":1,"AlarmTime":"1416379385"};{"AlarmType":1,"AlarmTime":"1416379334"}

	$('#alarm_msg_table').empty();
	
	if (typeof alarmMsg != "undefined") {
		var msg = alarmMsg.split(";");//object array
		var innserHtml = "";
		for (var i = 0; i < msg.length-1; i ++) {
			innserHtml = "";
			var jsonMsg = $.evalJSON(msg[i]);

			innserHtml += "<tr>";
			innserHtml += "<td style='width:100px;'>" + ConvertAlarmType(parseInt(jsonMsg["AlarmType"])) + "</td>";
			innserHtml += "<td style='width:200px;'>" + FormTimeStr(jsonMsg["AlarmTime"]) + "</td>";
			innserHtml += "</tr>";

			$('#alarm_msg_table').append(innserHtml);
		}
	}
//	$.removeCookie(alarmCookieID);

}
