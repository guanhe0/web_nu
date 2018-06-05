function GetWireless(){
	var msgBody = {
		"4GEnable":1,
		"4GIsSim":1,
		"4GHardwarStatus":1,
		"4GConnectState":1,
		"4GSignalState":1,
		"4GName":1
	}
	$.sendCmd("CW_JSON_GetWireless",msgBody).done(function(Info){
		var g4_signal = document.createElement("label");
		var g4_connect = document.createElement("label");
		var g4_hardware_status = document.createElement("label");
		var g4_sim_card_status = document.createElement("label");
		var g4_module_nm = document.createElement("label");
		
		var g4_enabel = parseInt(Info["4GEnable"]);
		g4_module_nm.innerHTML = Info["4GName"];
		
		$("#3g_4g_module_name").empty();
		$("#3g_4g_module_name").append(g4_module_nm);
		g4_signal.innerHTML = "&nbsp;&nbsp;" + parseInt(Info["4GSignalState"]) + "%";//IDC_SETTING_NOT_EXIST
		$("#3g_4g_signal").empty();
		$("#3g_4g_signal").append(g4_signal);
		g4_connect.innerHTML = (parseInt(Info["4GConnectState"])) == 0 ? IDC_SETTING_3G_DISCONNECT : IDC_SETTING_3G_CONNECTED;
		$("#ppp_status").empty();
		$("#ppp_status").append(g4_connect);
		g4_hardware_status.innerHTML = (parseInt(Info["4GHardwarStatus"]))?IDC_LIVE_TITLE_IMAGE_NORMAL:IDC_SETTING_ERROR;
		$("#3g_4g_hardware_status").empty();
		$("#3g_4g_hardware_status").append(g4_hardware_status);
		g4_sim_card_status.innerHTML = (parseInt(Info["4GIsSim"]))?IDC_SETTING_EXIST:IDC_SETTING_NOT_EXIST;
		$("#sim_card_status").empty();
		$("#sim_card_status").append(g4_sim_card_status);
		$("#3g_4g_switch").attr("checked",g4_enabel == 0? false:true);
	})	
}
$(document).on("menu_show_3g_4g", function () {

	$("#3g_4g_flush").hwbutton();

	$("#3g_4g_flush").unbind("click").click(function(){
		GetWireless();		
	})
	$("#pm_save_bt").unbind("click").click(function(){
		$("#pm_content").trigger("menu_save_3g_4g");
	})
	
	GetWireless();

})
$(document).on("menu_save_3g_4g", function () {
	var msgBody = {
		"4GEnable":($("#3g_4g_switch").prop("checked") ? 1:0)
	}
	$.sendCmd("CW_JSON_SetWireless",msgBody).done(function(){
		alert(IDC_GENERAL_SAVESUCCESS);
	})
})