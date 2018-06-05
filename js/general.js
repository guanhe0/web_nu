var g_player = null;
var g_recordTimer = null;
var g_Ptz3DToggle = 0;
var g_recordTimeLeft = 1;	// 单位分钟
var g_pageInit = 0;			// 1:页面已经加载, 只针对于视频预览页面


/*�ͻ���*/
var g_customer_tcl = true;

/*Э�鼯*/
var g_protocol_28181 = {"ProtocolName":"GB/T28181","ProtocolValue":false,"ProtocolId":"28181"};//national stand
var g_protocol_cmi = {"ProtocolName":"CMI","ProtocolValue":false,"ProtocolId":"CMI"};//tcl
var g_protocol_guoqin = {"ProtocolName":"MINGSOFTAGE","ProtocolValue":false,"ProtocolId":"MINGSOFTAGE"};//tcl
var g_protocol_I8 = {"ProtocolName":"I8","ProtocolValue":false,"ProtocolId":"I8"};//tcl
var g_protocol_hanyun = {"ProtocolName":"CCLIOT","ProtocolValue":false,"ProtocolId":"CCLIOT"};
var g_protocol_anshida = {"ProtocolName":"ANSHIDA","ProtocolValue":false,"ProtocolId":"ANSHIDA"};
var g_protocol_xinggu = {"ProtocolName":"STARVALLEY","ProtocolValue":false,"ProtocolId":"STARVALLEY"};
	
var g_protocol_count = 7;
var g_aprotocolparam = {};
/*多语言菜单*/
var	g_languageMenu = [{
	index: 0,
	language: "中文",
	target: "chinese.js"
}, {
	index: 1,
	language: "English",
	target: "english.js"
},{
	index:2,
	language: "Russian",
	target: "Russian.js"
}];
var g_langIndex = 0;	// 默认中文


var log = function(content) {
	if ((typeof console !== "undefined" && console !== null) && (console.log != null)) {
		return console.log(content);
	}
};
var infor = function(content) {
	if ((typeof console !== "undefined" && console !== null) && (console.log != null)) {
		return console.info(content);
	}
};

$(function(){
	beforeOnReady();
	$('body > .loading').fadeOut("slow", function() {
		return $('.body').fadeIn("slow", onReady);
    });
});

$(window).unload(function () {
    if (typeof onUnload == 'function') {
    	onUnload();
    }
});

String.prototype.trim = function() {
	return this.replace( /(^\s*)|(\s*$)/g, '');
}
function ValueLimited(option){
	var code = event.keyCode;
	if(code >= 48 && code <= 57){
		var value = parseInt($("#" + option.id).val(),10);
		if(isNaN(value)){
			value = 0;
		}
		value = value*10 + code - 48;
		if(value < parseInt(option.start,10) || value > parseInt(option.end,10)){
			event.returnValue=false;
		}
	}
}
function buildPath(options) {
	var options = $.extend({
		type: "record",			// record, capture
		streamId: 0,			// 主码流-0, 次码流-1
		recordType: "Manual"	// 录像方式
	}, options);

	var path = "C:\\IPCamera";
	var ipAddr = (document.URL.split('//')[1]).split('/')[0].split(':')[0];
	if (typeof $.cookie('file_path') != "undefined") {
		path = $.trim($.cookie('file_path'));
	}

	path += "\\" + options.type + "\\" + ipAddr;

	var now = new Date();
	var dateStr = "", timeStr = "";
	var year, month, day, hours, minute, second;

	year = now.getFullYear();
	month = now.getMonth() + 1;
	day = now.getDate();
	hours = now.getHours();
	minute = now.getMinutes();
	second = now.getSeconds();

	dateStr = "" + year + "-" + ((month >= 10) ? month : ("0" + month)) + "-" + ((day >= 10) ? day : ("0" + day));
	timeStr = "" + ((hours >= 10) ? hours : ("0" + hours)) + "-" + ((minute >= 10) ? minute : ("0" + minute)) + "-" + ((second >= 10) ? second : ("0" + second));

	path += "\\" + dateStr;

	if ($.trim(options.type) === "record") {
		path += "\\" + options.recordType + "_" + timeStr + "_" + options.streamId + ".mp4";
	}
	else if ($.trim(options.type) == "capture") {
		path += "\\" + timeStr + "_" + options.streamId + ".bmp";
	}

	log(path);
	return path;
}
function dwn(s)
{
    document.write(s);
}
function InitProtocol()
{	var index;
	if(g_customer_tcl)
	{
		//28181
		g_protocol_28181.ProtocolValue = true;
		//CMI
		g_protocol_cmi.ProtocolValue = true;
		//min ruan
		g_protocol_guoqin.ProtocolValue = true;
		//I8
		g_protocol_I8.ProtocolValue = true;
		//hanyun
		g_protocol_hanyun.ProtocolValue = true;
		//anshida
		g_protocol_anshida.ProtocolValue = true;
		//xinggu
		g_protocol_xinggu.ProtocolValue = true;
	}
	
	for(index = 0; index < g_protocol_count; index++)
	{
		switch(index)
		{
			case 0:
				g_aprotocolparam[index] = g_protocol_28181;	
				break;
			case 1:
				g_aprotocolparam[index] = g_protocol_cmi;
				break;
			case 2:
				g_aprotocolparam[index] = g_protocol_guoqin;
				break;
			case 3:
				g_aprotocolparam[index] = g_protocol_I8;
				break;
			case 4:
				g_aprotocolparam[index] = g_protocol_hanyun;
				break;
			case 5:
				g_aprotocolparam[index] = g_protocol_anshida;
				break;
			case 6:
				g_aprotocolparam[index] = g_protocol_xinggu;
				break;				
			default:
				break;
		}
	}
}
function InitLanguage() {
	if (typeof $.cookie('language') != "undefined") {
		g_langIndex = parseInt($.cookie("language"));
		if(isNaN(g_langIndex))
		{
			g_langIndex = 0;
		}
	}

	var index = 0;
	for (index = 0; index < g_languageMenu.length; index ++) {
		if (g_langIndex == g_languageMenu[index].index) {
			break;
		}
	}
	
	var str = '<script type="text/javascript" src="language/' + g_languageMenu[index].target + '"></script>';
	dwn(str);
}

function ShowMsgDialog(msg) {
	$('#msgImageSetting')[0].innerHTML = '<span>' + msg + '</span>';
	$("#msgImageSetting").dialog({
		bgiframe: true,
		resizable: false,
		modal: true,
		width: 300,
  		height: 140,
  		title: IDC_GENERAL_MSG_TITLE,
		buttons: [
			{
				text: IDC_GENERAL_OK,
				click: function () {
					$( this ).dialog("close");
				}
			}
		]
	});
	$(".ui-dialog[aria-describedby='msgImageSetting']").bgiframe();
}

function RangeInput(options) {
	var options = $.extend({
		domid: null,		// ID
		min: 0,				// 最小值
		max: 255			// 最大值
	}, options);
	
	$('#' + options.domid).blur(function () {
		var value = $(this).val();
        $(this).val(value.replace(/\D|^0/g, options.min));
        value = parseInt($(this).val());
        if (value > options.max) {
        	value = options.max;
        }
        if (value < options.min) {
        	value = options.min;
        }
        $(this).val(value);
	}).bind("paste", function () {
		var value = $(this).val();     
        $(this).val(value.replace(/\D|^0/g, options.min));
        value = parseInt($(this).val());
        if (value > options.max) {
        	value = options.max;
        }
        if (value < options.min) {
        	value = options.min;
        }
        $(this).val(value);
	});
}

function FormatTime(timeNum) {
	var tempnum = timeNum.toString();
    if(tempnum.length < 2){
        return("0" + tempnum);
    }
    else{
        return(tempnum);
    }
}

var g_recPath = ""; // 回放页面的全局变量, 因为2个JS文件互相引用, 所以放到这里.

function ClearToken() {
	$.removeCookie("token");
	$.removeCookie("loginuser");
}

function CheckToken() {
	if (typeof $.cookie("token") == 'undefined') {
		window.location.href = "/login.html";
	}
}

/** 
 * 替换字符串中所有 
 * @param obj   原字符串 
 * @param str1  替换规则 
 * @param str2  替换成什么 
 * @return  替换后的字符串 
 */  
function replaceAll(obj,str1,str2){         
	var result  = obj.replace(eval("/"+str1+"/gi"),str2);        
	return result;  
}

function GetDatepickLang() {
	var ret;
	switch (g_langIndex) {
		case 0: {
			ret = "ch";
			break;
		}

		case 1: {
			ret = "en";
			break;
		}
		default: {
			ret = "ch";
			break;
		}
	}

	return ret;
}

function oneTime(ms, cb) {
	var id = window.setInterval(function () {
		cb();
		innerCB(id);
	}, ms);
}

function innerCB(id) {
	window.clearInterval(id);
}
InitLanguage();
InitProtocol();
