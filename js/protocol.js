var g_PageIndex = 1;
var g_ip_addr_len = 60;
var g_info_text_len = 30;
$(document).on("menu_show_protocol", function () {
	var index;
	var insertOption = "";
	var iFirstVisible = -1;
	$(".protocol .tabs").tabs();
	/*¶¨ÖÆselect*/
	for(index = 0; index < g_protocol_count; index++)
	{
		if(g_aprotocolparam[index].ProtocolValue)
		{
			if(iFirstVisible == -1)
			{
				iFirstVisible = index;
			}
			insertOption += '<option value="' + index + '">' + g_aprotocolparam[index].ProtocolName + '</option>';

		}
		else
		{
			document.getElementById("protocol_" + g_aprotocolparam[index].ProtocolId).style.display = "none";
		}
	}
	$("#protocol_option").empty();
	$("#protocol_option").append(insertOption);

	var msgBody = {
		"ThirdPartyProtocolEnable":1,
		"ThirdPartyProtocolType":1,
		"28181Address": 1,
		"28181Port": 1,
		"28181Password": 1,
		"28181RegIntervals": 1,
		"28181HBIntervals": 1,
		"28181ServerId": 1,
		"28181DeviceId": 1,
		"28181ChannelId": 1,
		"28181AlarmInId": 1,
		"28181AlarmOutId": 1,
		"TCLPort": 1,
		"MingsoftSerialNum":1,
		"MingsoftName": 1,
		"MingsoftPasswd": 1,
		"MingsoftIp": 1,
		"MingsoftPort": 1,
		"I8Port": 1,
		"HanyunAddr":1,
		"HanyunPort":1,
		"HanyunHbInterval":1,
		"SvAddr":1,
		"SvPort":1,
		"SvHbInterval":1,
		"AnShiDaSerialNum":1,
		"AnShiDaName":1,
		"AnShiDaPasswd":1,
		"AnShiDaIp":1,
		"AnShiDaPort":1	
	};

	$.sendCmdAsync("CW_JSON_GetNetworkProtocol", msgBody).done(function(Info) {
	
	/**checkbox***/
	$("#thirdpartyprotocol_chk").attr("checked", (parseInt(Info["ThirdPartyProtocolEnable"])==0)?false:true);
	
	/****protocoltype*****/
	$("#protocol_option").val(parseInt(Info["ThirdPartyProtocolType"]));

	
	/****input options******/
	for(index = 0; index < g_protocol_count; index++)
	{
		if(g_aprotocolparam[index].ProtocolValue)
		{
			if(index != Info["ThirdPartyProtocolType"])
			{
				document.getElementById("protocol_" + g_aprotocolparam[index].ProtocolId).style.display = "none";			
			}
		}
	}	
	document.getElementById("protocol_" + g_aprotocolparam[Info["ThirdPartyProtocolType"]].ProtocolId).style.visibility = "visible";
	document.getElementById("protocol_" + g_aprotocolparam[Info["ThirdPartyProtocolType"]].ProtocolId).style.display = "block";


	/***sysselect_disable***/
	if(parseInt(Info["ThirdPartyProtocolEnable"]) == 0)
	{
		$("#protocol_option").addClass("sysselect_disable");
		document.getElementById("protocol_option").disabled = true;
		switch(Info["ThirdPartyProtocolType"])
		{
			case 0:
				ToggleProtocol28181Input(false);
				break;
			case 1:
				ToggleProtocolCMIInput(false);
				break;
			case 2:
				ToggleProtocolMinSoftInput(false);
				break;
			case 3:
				ToggleProtocolI8Input(false);
				break;
			case 4:
				ToggleProtocolhanyun(false);
				break;
			case 5:
				ToggleProtocolAnshida(false);
				break;
			case 6:
				ToggleProtocolXinggu(false);
				break;
			default:
				break;
		}
	}
	else
	{
		$("#protocol_option").removeClass("sysselect_disable");
		document.getElementById("protocol_option").disabled = false;
		switch(Info["ThirdPartyProtocolType"])
		{
			case 0:
				ToggleProtocol28181Input(true);
				break;
			case 1:
				ToggleProtocolCMIInput(true);
				break;
			case 2:
				ToggleProtocolMinSoftInput(true);
				break;
			case 3:
				ToggleProtocolI8Input(true);
				break;
			case 4:
				ToggleProtocolhanyun(true);
				break;
			case 5:
				ToggleProtocolAnshida(true);
				break;
			case 6:
				ToggleProtocolXinggu(true);
				break;
			default:
				break;
		}		
	}

	
//	$("#thirdpartyprotocol_chk").attr("checked", (parseInt(Info["ThirdPartyProtocolEnable"]) == 0) ? false : true);						
//	InitProtocol
	InitProtocol28181Params(Info);
	InitProtocolCmiParams(Info);
	InitProtocolGuoqinParams(Info);
	InitProtocolI8Params(Info);	
	InitProtocolHanYunParams(Info);
	InitProtocolanshidaParams(Info);
	InitProtocolxingguParams(Info);
	});
	$("#pm_save_bt").unbind("click").click(function(){
		$("#pm_content").trigger("menu_save_protocol");
	})
	
})
function ProtocolEnable()
{
	var index = 0;
	var Index = parseInt($("#protocol_option").val());

	if($('#thirdpartyprotocol_chk').prop('checked') == 0)
	{	
		/**protocol type**/
		document.getElementById("protocol_option").disabled = true;
		$("#protocol_option").addClass("sysselect_disable");

		/**protocol param**/
		switch(Index)
		{
			case 0:
				ToggleProtocol28181Input(false);
				break;
			case 1:
				ToggleProtocolCMIInput(false);
				break;
			case 2:
				ToggleProtocolMinSoftInput(false);
				break;
			case 3:
				ToggleProtocolI8Input(false);
				break;
			case 4:
				ToggleProtocolhanyun(false);
				break;
			case 5:
				ToggleProtocolAnshida(false);
				break;
			case 6:
				ToggleProtocolXinggu(false);
				break;
			default:
				break;
		}
	}
	else
	{	
		/**protocol type**/		
		document.getElementById("protocol_option").disabled = false;
		$("#protocol_option").removeClass("sysselect_disable");

		/**protocol param**/
		switch(Index)
		{
			case 0:
				ToggleProtocol28181Input(true);
				break;
			case 1:
				ToggleProtocolCMIInput(true);
				break;
			case 2:
				ToggleProtocolMinSoftInput(true);
				break;
			case 3:
				ToggleProtocolI8Input(true);
				break;
			case 4:
				ToggleProtocolhanyun(true);
				break;
			case 5:
				ToggleProtocolAnshida(true);
				break;
			case 6:
				ToggleProtocolXinggu(true);
				break;
			default:
				break;
		}				
	}
}

function GetProtocolOption()
{
	/*
	var idex;
	var iSelectLen;
	var index = parseInt($("#protocol_option").val());
	var ProtocolText = "";
	iSelectLen = document.getElementById("protocol_option").length;

	
	for(idex = 0; idex < iSelectLen; idex++)
	{
		ProtocolText = document.getElementById("protocol_option").options[idex].text;
		if(idex != index)
		{
			document.getElementById("protocol_" + ProtocolText).style.display = "none";
		}
	}
	
	ProtocolText = document.getElementById("protocol_option").options[index].text;
	document.getElementById("protocol_" + ProtocolText).style.visibility = "visible";
	document.getElementById("protocol_" + ProtocolText).style.display = "block";

	*/
	var index = parseInt($("#protocol_option").val());
	var i;
	for(i = 0; i < g_protocol_count; i++)
	{
		if(g_aprotocolparam[i].ProtocolValue)
		{
			if(index != i)
			{
				document.getElementById("protocol_" + g_aprotocolparam[i].ProtocolId).style.display = "none";
			}
		}
	}
	document.getElementById("protocol_" + g_aprotocolparam[index].ProtocolId).style.visibility = "visible";
	document.getElementById("protocol_" + g_aprotocolparam[index].ProtocolId).style.display = "block";	
	
}

function InitProtocol28181Params(Info)
{
	RangeInput({
		domid: "28181_port",
		min: 1,
		max: 65535
	});
	
	RangeInput({
		domid: "28181_register_interval",
		min: 1,
		max: 3600
	});

	RangeInput({
		domid: "28181_heart_interval",
		min: 1,
		max: 3600
	});
		
	$('#28181_addr').val(Info["28181Address"]);
	$('#28181_port').val(Info["28181Port"]);
	$('#28181_passwd').val(Info['28181Password']);
	$('#28181_register_interval').val(Info['28181RegIntervals']);
	$('#28181_heart_interval').val(Info['28181HBIntervals']);
	$('#server_id').val(Info['28181ServerId']);
	$('#device_id').val(Info['28181DeviceId']);
	$('#channel_id').val(Info['28181ChannelId']);
	$('#alarmin_id').val(Info['28181AlarmInId']);
	$('#alarmout_id').val(Info['28181AlarmOutId']);
}
function ToggleProtocol28181Input(bable)
{
	if(bable == true)
	{
		document.getElementById("28181_addr").disabled = false;
		document.getElementById("28181_port").disabled = false;
		document.getElementById("28181_passwd").disabled = false;
		document.getElementById("28181_register_interval").disabled = false;
		document.getElementById("28181_heart_interval").disabled = false;
		document.getElementById("server_id").disabled = false;
		document.getElementById("device_id").disabled = false;
		document.getElementById("channel_id").disabled = false;
		document.getElementById("alarmin_id").disabled = false;
		document.getElementById("alarmout_id").disabled = false;	

		$("#28181_addr").removeClass("sysinput_disable");
		$("#28181_port").removeClass("sysinput_disable");
		$("#28181_passwd").removeClass("sysinput_disable");
		$("#28181_register_interval").removeClass("sysinput_disable");
		$("#28181_heart_interval").removeClass("sysinput_disable");
		$("#server_id").removeClass("sysinput_disable");
		$("#device_id").removeClass("sysinput_disable");
		$("#channel_id").removeClass("sysinput_disable");
		$("#alarmin_id").removeClass("sysinput_disable");
		$("#alarmout_id").removeClass("sysinput_disable");		
	}
	else
	{
		$('#28181_addr').attr("disabled","disabled");
		$('#28181_port').attr("disabled","disabled");
		$('#28181_passwd').attr("disabled","disabled");
		$('#28181_register_interval').attr("disabled","disabled");
		$('#28181_heart_interval').attr("disabled","disabled");
		$('#server_id').attr("disabled","disabled");
		$('#device_id').attr("disabled","disabled");
		$('#channel_id').attr("disabled","disabled");
		$('#alarmin_id').attr("disabled","disabled");
		$('#alarmout_id').attr("disabled","disabled");

		$("#28181_addr").addClass("sysinput_disable");
		$("#28181_port").addClass("sysinput_disable");
		$("#28181_passwd").addClass("sysinput_disable");
		$("#28181_register_interval").addClass("sysinput_disable");
		$("#28181_heart_interval").addClass("sysinput_disable");
		$("#server_id").addClass("sysinput_disable");
		$("#device_id").addClass("sysinput_disable");
		$("#channel_id").addClass("sysinput_disable");
		$("#alarmin_id").addClass("sysinput_disable");
		$("#alarmout_id").addClass("sysinput_disable");
		
	}
}
function InitProtocolCmiParams(Info)
{
	RangeInput({
		domid: "tcl_port",
		min: 1,
		max: 65535
	});

	$('#tcl_port').val(Info["TCLPort"]);
}
function InitProtocolI8Params(Info)
{
	$('#I8Port').val(Info['I8Port']);
}
function ToggleProtocolCMIInput(bable)
{
	if(bable == true)
	{
		document.getElementById("tcl_port").disabled = false;
		
		$("#tcl_port").removeClass("sysinput_disable");
	}
	else
	{
		$('#tcl_port').attr("disabled","true");
		
		$("#tcl_port").addClass("sysinput_disable");
	}
}

function InitProtocolGuoqinParams(Info)
{
	$('#MingsoftSerialNum').val(Info['MingsoftSerialNum']);
	$('#MingsoftName').val(Info['MingsoftName']);
	$('#MingsoftPasswd').val(Info['MingsoftPasswd']);
	$('#MingsoftIp').val(Info['MingsoftIp']);
	$('#MingsoftPort').val(Info['MingsoftPort']);
	
}


function ToggleProtocolMinSoftInput(bable)
{
	if(bable == true)
	{
		document.getElementById("MingsoftSerialNum").disabled = false;
		document.getElementById("MingsoftName").disabled = false;
		document.getElementById("MingsoftPasswd").disabled = false;
		document.getElementById("MingsoftIp").disabled = false;
		document.getElementById("MingsoftPort").disabled = false;
		
		
		$("#MingsoftSerialNum").removeClass("sysinput_disable");
		$("#MingsoftName").removeClass("sysinput_disable");
		$("#MingsoftPasswd").removeClass("sysinput_disable");
		$("#MingsoftIp").removeClass("sysinput_disable");
		$("#MingsoftPort").removeClass("sysinput_disable");
				
	}
	else
	{	
		$('#MingsoftSerialNum').attr("disabled","true");
		$('#MingsoftName').attr("disabled","true");
		$('#MingsoftPasswd').attr("disabled","true");
		$('#MingsoftIp').attr("disabled","true");
		$('#MingsoftPort').attr("disabled","true");
		

		$("#MingsoftSerialNum").addClass("sysinput_disable");
		$("#MingsoftName").addClass("sysinput_disable");
		$("#MingsoftPasswd").addClass("sysinput_disable");
		$("#MingsoftIp").addClass("sysinput_disable");
		$("#MingsoftPort").addClass("sysinput_disable");
		
	}
}
function ToggleProtocolI8Input(bable)
{
	if(bable == true)
	{
		document.getElementById("I8Port").disabled = false;
		$("#I8Port").removeClass("sysinput_disable");
	}
	else
	{
		$('#I8Port').attr("disabled","true");
		$("#I8Port").addClass("sysinput_disable");
	}
}
function InitProtocolHanYunParams(Info){
	$("#hanyun_addr").val(Info["HanyunAddr"]);
	$("#hanyun_port").val(Info["HanyunPort"]);
	$("#hanyun_heart_interval").val(Info["HanyunHbInterval"]);	
}
function InitProtocolanshidaParams(Info)
{
	$('#anshida_serialnumber').val(Info['AnShiDaSerialNum']);
	$('#anshida_register_username').val(Info['AnShiDaName']);
	$('#anshida_pwd').val(Info['AnShiDaPasswd']);
	$('#anshida_access_server_addr').val(Info['AnShiDaIp']);
	$('#anshida_access_port').val(Info['AnShiDaPort']);	
}
function InitProtocolxingguParams(Info)
{
	$("#xinggu_addr").val(Info["SvAddr"]);
	$("#xinggu_port").val(Info["SvPort"]);
	$("#xinggu_heart_interval").val(Info["SvHbInterval"]);		
}
function ToggleProtocolhanyun(bable){
	if(bable == true){
		document.getElementById("hanyun_addr").disabled = false;
		document.getElementById("hanyun_port").disbaled = false;
		document.getElementById("hanyun_heart_interval").disabled = false;
		
		$("#hanyun_addr").removeClass("sysinput_disable");
		$("#hanyun_port").removeClass("sysinput_disable");
		$("#hanyun_heart_interval").removeClass("sysinput_disable");
	}
	else{
		$("#hanyun_addr").attr("disabled","true");
		$("#hanyun_port").attr("disabled","true");
		$("#hanyun_heart_interval").attr("disabled","true");
		
		$("#hanyun_addr").addClass("sysinput_disable");
		$("#hanyun_port").addClass("sysinput_disable");
		$("#hanyun_heart_interval").addClass("sysinput_disable");
	}
}
function ToggleProtocolAnshida(bable){
	if(bable == true)
	{
		document.getElementById("anshida_serialnumber").disabled = false;
		document.getElementById("anshida_register_username").disabled = false;
		document.getElementById("anshida_pwd").disabled = false;
		document.getElementById("anshida_access_server_addr").disabled = false;
		document.getElementById("anshida_access_port").disabled = false;
		
		$("#anshida_serialnumber").removeClass("sysinput_disable");
		$("#anshida_register_username").removeClass("sysinput_disable");
		$("#anshida_pwd").removeClass("sysinput_disable");
		$("#anshida_access_server_addr").removeClass("sysinput_disable");
		$("#anshida_access_port").removeClass("sysinput_disable");
	}
	else
	{
		$('#anshida_serialnumber').attr("disabled","true");
		$('#anshida_register_username').attr("disabled","true");
		$('#anshida_pwd').attr("disabled","true");
		$('#anshida_access_server_addr').attr("disabled","true");
		$('#anshida_access_port').attr("disabled","true");
		
		$("#anshida_serialnumber").addClass("sysinput_disable");
		$("#anshida_register_username").addClass("sysinput_disable");
		$("#anshida_pwd").addClass("sysinput_disable");
		$("#anshida_access_server_addr").addClass("sysinput_disable");
		$("#anshida_access_port").addClass("sysinput_disable");
	}
}
function ToggleProtocolXinggu(bable){
	if(bable == true){
		document.getElementById("xinggu_addr").disabled = false;
		document.getElementById("xinggu_port").disbaled = false;
		document.getElementById("xinggu_heart_interval").disabled = false;
		
		$("#xinggu_addr").removeClass("sysinput_disable");
		$("#xinggu_port").removeClass("sysinput_disable");
		$("#xinggu_heart_interval").removeClass("sysinput_disable");
	}
	else{
		$("#xinggu_addr").attr("disabled","true");
		$("#xinggu_port").attr("disabled","true");
		$("#xinggu_heart_interval").attr("disabled","true");
		
		$("#xinggu_addr").addClass("sysinput_disable");
		$("#xinggu_port").addClass("sysinput_disable");
		$("#xinggu_heart_interval").addClass("sysinput_disable");
	}		
}
$(document).on("menu_save_protocol", function () {

	var index = parseInt($("#protocol_option").val());
	var msgBody = {
	"ThirdPartyProtocolEnable":false,
	"ThirdPartyProtocolType":0,
	"28181Address": 1,
	"28181Port": 1,
	"28181Password": 1,
	"28181RegIntervals": 1,
	"28181HBIntervals": 1,
	"28181ServerId": 1,
	"28181DeviceId": 1,
	"28181ChannelId": 1,
	"28181AlarmInId": 1,
	"28181AlarmOutId": 1,
	"TCLPort": 1,
	"MingsoftSerialNum":0,
	"MingsoftName": "",
	"MingsoftPasswd": "",
	"MingsoftIp": "",
	"MingsoftPort": 0,
	"I8Port": 0,
	"HanyunAddr":"",
	"HanyunPort":0,
	"HanyunHbInterval":0,
	"AnShiDaSerialNum":"",
	"AnShiDaName":"",
	"AnShiDaPasswd":"",
	"AnShiDaIp":"",
	"AnShiDaPort":0,
	"SvAddr":"",
	"SvPort":0,
	"SvHbInterval":0
	};
	/*protocol checkbox*/
	msgBody["ThirdPartyProtocolEnable"] = $('#thirdpartyprotocol_chk').prop('checked') ? 1 : 0;
	/*protocol type*/
	msgBody["ThirdPartyProtocolType"] = index;
		
	
//	var sCurrenSelectProName = document.getElementById("protocol_option").options[index].text;
	
	
//	if(sCurrenSelectProName == "28181")//Protocol28181
	{
		msgBody["28181Address"] = $.trim($('#28181_addr').val());
		msgBody["28181Port"] = parseInt($('#28181_port').val());
		msgBody["28181Password"] = $('#28181_passwd').val();
		msgBody["28181RegIntervals"] = parseInt($('#28181_register_interval').val());
		msgBody["28181HBIntervals"] = parseInt($('#28181_heart_interval').val());
		msgBody["28181ServerId"] = $.trim($('#server_id').val());
		msgBody["28181DeviceId"] = $.trim($('#device_id').val());
		msgBody["28181ChannelId"] = $.trim($('#channel_id').val());
		msgBody["28181AlarmInId"] = $.trim($('#alarmin_id').val());
		msgBody["28181AlarmOutId"] = $.trim($('#alarmout_id').val());
	}
//	else if(sCurrenSelectProName == "CMI")//Protocolcmi
	{

		msgBody["TCLPort"] = parseInt($('#tcl_port').val());
	}
//	else if(sCurrenSelectProName == "minruan")//guoqin
	{
		msgBody["MingsoftSerialNum"] = 	$.trim($('#MingsoftSerialNum').val());
		msgBody["MingsoftName"] = 	$.trim($('#MingsoftName').val());
		msgBody["MingsoftPasswd"] = $('#MingsoftPasswd').val();	
		msgBody["MingsoftIp"] = $.trim($('#MingsoftIp').val());	
		msgBody["MingsoftPort"] = parseInt($('#MingsoftPort').val());	
		msgBody["I8Port"] = parseInt($('#I8Port').val());	
	}
//hanyun
		msgBody["HanyunAddr"] = $.trim($("#hanyun_addr").val());
		msgBody["HanyunPort"] = parseInt($("#hanyun_port").val());
		msgBody["HanyunHbInterval"] = parseInt($("#hanyun_heart_interval").val());
		
		if($("#anshida_access_server_addr").val().length > g_ip_addr_len)
		{
			alert(IDC_ACCESS_IP_LENGTH_OVER + g_ip_addr_len + "Byte");
			return;
		}
		if($("#anshida_serialnumber").val().length > g_info_text_len || $("#anshida_register_username").val().length > g_info_text_len ||
		$("#anshida_pwd").val().length > g_info_text_len)
		{
			alert(IDC_INFO_TEXT_LEN_VOER + g_info_text_len + "Byte");
			return;
		}
		msgBody["AnShiDaSerialNum"] = $.trim($("#anshida_serialnumber").val());
		msgBody["AnShiDaName"] = $.trim($("#anshida_register_username").val());
		msgBody["AnShiDaPasswd"] = $.trim($("#anshida_pwd").val());
		msgBody["AnShiDaIp"] = $.trim($("#anshida_access_server_addr").val());
		msgBody["AnShiDaPort"] = parseInt($("#anshida_access_port").val());
//xinggu		
		msgBody["SvAddr"] = $.trim($("#xinggu_addr").val());
		msgBody["SvPort"] = parseInt($("#xinggu_port").val());
		msgBody["SvHbInterval"] = parseInt($("#xinggu_heart_interval").val());		
		
		
	$.sendCmdAsync("CW_JSON_SetNetworkProtocol", msgBody).done(function () {
		alert(IDC_GENERAL_SAVESUCCESS);
	}).fail(function () {
		alert(IDC_GENERAL_SAVEFAIL);
	});	
})

$(document).on("menu_close_protocol", function () {

})
