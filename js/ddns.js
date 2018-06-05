$(document).on("menu_show_ddns_set", function () {
	$("#ddns_chk").click(function() {
		if ($(this).prop('checked')) {
			$("#ddns_provide").removeAttr("disabled").removeClass("sysselect_disable");
			$("#ddns_domain_name").attr("ReadOnly", false).removeClass("sysinput_disable");
			$("#ddns_name").attr("ReadOnly", false).removeClass("sysinput_disable");
			$("#ddns_passwd").attr("ReadOnly", false).removeClass("sysinput_disable");
		}
		else {
			$("#ddns_provide").attr("disabled", 'disabled').addClass("sysselect_disable");
			$("#ddns_domain_name").attr('ReadOnly', true).addClass("sysinput_disable");
			$("#ddns_name").attr('ReadOnly', true).addClass("sysinput_disable");
			$("#ddns_passwd").attr('ReadOnly', true).addClass("sysinput_disable");
		}
	})
	if(g_langIndex == 1)
	{
		$("#ddns_ck").removeClass("sysinfo_desc").addClass("sysinfo_descoffset");
		$("#ddns_provid").removeClass("sysinfo_desc").addClass("sysinfo_descoffset");
		$("#device_domain_name").removeClass("sysinfo_desc").addClass("sysinfo_descoffset");
		$("#ddns_nam").removeClass("sysinfo_desc").addClass("sysinfo_descoffset");
		$("#ddns_pwd").removeClass("sysinfo_desc").addClass("sysinfo_descoffset");
	}
	var msgBody = {
		DdnsProtocol: 1,
        DdnsName: 1,
        DdnsPassword: 1,
        DdnsDevName: 1
	};
	$.sendCmd("CW_JSON_GetNetworkProtocol", msgBody).done(function (ddnsInfo) {
		var ddnsProtocol = parseInt(ddnsInfo["DdnsProtocol"], 10);
		$("#ddns_name").val(ddnsInfo["DdnsName"]);
		$("#ddns_passwd").val(ddnsInfo["DdnsPassword"]);
		$("#ddns_domain_name").val(ddnsInfo["DdnsDevName"]);
		
		if (ddnsProtocol == 0) {
			$("#ddns_chk").attr("checked", true);
		}
		else {
			$("#ddns_chk").attr("checked", false);
			$("#ddns_provide").val(ddnsProtocol);
		}
		$("#ddns_chk").trigger("click");
	})
	$("#pm_save_bt").unbind("click").click(function(){
		$("#pm_content").trigger("menu_save_ddns_set");
	})
	
})

$(document).on("menu_save_ddns_set", function () {
	var ddnsProtocol = 0;
	if ($("#ddns_chk").prop('checked')) {
		ddnsProtocol = parseInt($("#ddns_provide").val(), 10);
	}
	else {
		ddnsProtocol = 0;
	}

	var msgBody = {
		DdnsProtocol: ddnsProtocol,
		DdnsDevName:$.trim($("#ddns_domain_name").val()),
        DdnsName: $.trim($("#ddns_name").val()),
        DdnsPassword: $.trim($("#ddns_passwd").val())
	};
	$.sendCmd("CW_JSON_SetNetworkProtocol", msgBody).done(function () {
		alert(IDC_GENERAL_SAVESUCCESS);
	}).fail(function() {
		alert(IDC_GENERAL_SAVEFAIL);
	})
})

$(document).on("menu_close_ddns_set", function () {
	
})