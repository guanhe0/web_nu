$(document).on("menu_show_net_port_set", function () {
	RangeInput({
		domid: "web_port",
		min: 1,
		max: 65535
	});

	RangeInput({
		domid: "ftp_port",
		min: 1,
		max: 65535
	});

	RangeInput({
		domid: "rtsp_port",
		min: 1,
		max: 65535
	});
/*
	RangeInput({
		domid: "smtp_port",
		min: 1,
		max: 65535
	});
*/
	var msgBody = {
		HttpPort: 1,
        RtspPort: 1,
        FtpPort: 1,
        SmtpServerPort: 1
	};

	$.sendCmd("CW_JSON_GetNetworkProtocol", msgBody).done(function (portInfo) {
		$("#web_port").val(portInfo["HttpPort"]);
		$("#ftp_port").val(portInfo["FtpPort"]);
		$("#rtsp_port").val(portInfo["RtspPort"]);
	//	$("#smtp_port").val(portInfo["SmtpServerPort"]);
	})
	$("#pm_save_bt").unbind("click").click(function(){
		$("#pm_content").trigger("menu_save_net_port_set");
	})
	
})

$(document).on("menu_save_net_port_set", function () {
	var httpPort = parseInt($("#web_port").val(), 10);
	var msgBody = {
		HttpPort: httpPort,
        RtspPort: parseInt($("#rtsp_port").val(), 10),
        FtpPort: parseInt($("#ftp_port").val(), 10)
    //    SmtpServerPort: parseInt($("#smtp_port").val(), 10)
	};

	$.sendCmd("CW_JSON_SetNetworkProtocol", msgBody).done(function () {
		alert(IDC_GENERAL_SAVESUCCESS);
		var ipAddr = (document.URL.split('//')[1]).split('/')[0].split(':')[0];
		var port = (document.URL.split('//')[1]).split('/')[0].split(':')[1];
    	port = port ? port : 80;

    	if (httpPort != port) {
    		window.location.href = "http://" + ipAddr + ":" + httpPort;
    	}
	}).fail(function () {
		alert(IDC_GENERAL_SAVEFAIL);
	})
})

$(document).on("menu_close_net_port_set", function () {
	
})