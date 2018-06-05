$(document).on("menu_show_tcl_set", function () {
	RangeInput({
		domid: "tcl_port",
		min: 1,
		max: 65535
	});

	var msgBody = {
		TCLEnable: 1,
        TCLPort: 1
	};

	$.sendCmd("CW_JSON_GetNetworkProtocol", msgBody).done(function(tclInfo) {
		$('#tcl_port').val(tclInfo["TCLPort"]);
		$("#tcl_chk").attr("checked", (parseInt(tclInfo["TCLEnable"]) == 0) ? false : true);
	});
})

$(document).on("menu_save_tcl_set", function () {
	var msgBody = {
		TCLEnable: ($('#tcl_chk').prop('checked') ? 1 : 0),
		TCLPort: parseInt($('#tcl_port').val())
	};
	
	$.sendCmd("CW_JSON_SetNetworkProtocol", msgBody).done(function () {
		alert(IDC_GENERAL_SAVESUCCESS);
	}).fail(function () {
		alert(IDC_GENERAL_SAVEFAIL);
	});
})

$(document).on("menu_close_tcl_set", function () {
	
})