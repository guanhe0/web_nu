$(document).on("menu_show_ethernet_set", function () {
	var msgBody = {
		IPType: 1,
        IPv4Address: 1,
        IPv4Mask: 1,
        IPv4Gateway: 1,
        IPv4DNS: 1,
        MacAddress: 1
	};

	$.sendCmd("CW_JSON_GetNetwork", msgBody).done(function (ethInfo) {
		$("#dnsAddr").val(ethInfo["IPv4DNS"]);
		$("#ipAddr").val(ethInfo["IPv4Address"]);
		$("#subnet_mask").val(ethInfo["IPv4Mask"]);
		$("#gateway").val(ethInfo["IPv4Gateway"]);
		$("#macAddr").val(ethInfo["MacAddress"]);

		$("#dhcp_chk").attr("checked", (parseInt(ethInfo["IPType"],10) == 0) ? false : true);
	})
	$("#pm_save_bt").unbind("click").click(function(){
		$("#pm_content").trigger("menu_save_ethernet_set");
	})
	
})

$(document).on("menu_save_ethernet_set", function () {
	var newIp = $.trim($("#ipAddr").val());
	var msgBody = {
		IPType: ($('#dhcp_chk').prop('checked') ? 1 : 0),
        IPv4Address: newIp,
        IPv4Mask: $.trim($("#subnet_mask").val()),
        IPv4Gateway: $.trim($("#gateway").val()),
        IPv4DNS: $.trim($("#dnsAddr").val())
	}
	$.sendCmd("CW_JSON_SetNetwork", msgBody).done(function() {
		alert(IDC_GENERAL_SAVESUCCESS);
		var ipAddr = (document.URL.split('//')[1]).split('/')[0].split(':')[0];
    	var port = (document.URL.split('//')[1]).split('/')[0].split(':')[1];
    	port = port ? port : 80;
		
    	if (ipAddr !== newIp) {
    		window.location.href = "http://" + newIp + ":" + port;
    	}
	}).fail(function() {
		alert(IDC_GENERAL_SAVEFAIL);
	})
})

$(document).on("menu_close_ethernet_set", function () {
	
})