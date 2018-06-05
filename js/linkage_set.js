$(document).on("menu_show_linkage_set", function () {

	if(navigator.appName == "Netscape"){
		$("#enable_identity_verify").css("margin-left","10px");
	}
	var msgBody = {
		SmtpServerAddress: 1,
		SmtpServerPort: 1,
		SmtpServerAuther: 1,
        SmtpName: 1,
        SmtpPassword: 1,
        SmtpSend: 1,
        SmtpReceive: 1,
        FtpAddress: 1,
        FtpName: 1,
        FtpPassword: 1,
        FtpUploadPath: 1
	};
	
	$.sendCmd("CW_JSON_GetNetworkProtocol", msgBody).done(function (netInfo) {

		$("#email_addr").val(netInfo["SmtpServerAddress"]);
		$("#email_addr_port").val(netInfo["SmtpServerPort"]);
		$("#enable_identity_verify").attr("checked",netInfo["SmtpServerAuther"] == 0 ? false : true);
		$("#email_username").val(netInfo["SmtpName"]);
		$("#email_userpasswd").val(netInfo["SmtpPassword"]);
		$("#email_sendto").val(netInfo["SmtpSend"]);
		$("#email_receive").val(netInfo["SmtpReceive"]);

		$("#ftp_addr").val(netInfo["FtpAddress"]);
		$("#ftp_username").val(netInfo["FtpName"]);
		$("#ftp_userpasswd").val(netInfo["FtpPassword"]);
		$("#ftp_path").val(netInfo["FtpUploadPath"]);
	}).fail(function(){
	
	
	});
	$("#pm_save_bt").unbind("click").click(function(){
		$("#pm_content").trigger("menu_save_linkage_set");
	})
	

})

$(document).on("menu_save_linkage_set", function () {
//	infor("enable_identity_verify = " + $("#enable_identity_verify").prop("checked"));
	var msgBody = {
		SmtpServerAddress: $.trim($("#email_addr").val()),
		SmtpServerPort: parseInt($.trim($("#email_addr_port").val()),10),
		SmtpServerAuther: $("#enable_identity_verify").prop("checked") == true ? 1 : 0,
        SmtpName: $.trim($("#email_username").val()),
        SmtpPassword: $.trim($("#email_userpasswd").val()),
        SmtpSend: $.trim($("#email_sendto").val()),
        SmtpReceive: $.trim($("#email_receive").val()),
        FtpAddress: $.trim($("#ftp_addr").val()),
        FtpName: $.trim($("#ftp_username").val()),
        FtpPassword: $.trim($("#ftp_userpasswd").val()),
        FtpUploadPath: $.trim($("#ftp_path").val())
	};

	$.sendCmd("CW_JSON_SetNetworkProtocol", msgBody).done(function () {
		alert(IDC_GENERAL_SAVESUCCESS);
	}).fail(function () {
		alert(IDC_GENERAL_SAVEFAIL);
	})
})

$(document).on("menu_close_linkage_set", function () {
	// close
})