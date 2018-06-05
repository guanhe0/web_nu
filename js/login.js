function beforeOnReady() {
	$('.login').hwbutton();

	InitLangMenu();

	if (CheckIE()) {
		if (false == IsPluginInstall()) {
			$('.layer .container').hide();
			$('.layer .activex_link').show();
		}
	}
}

function InitLangMenu() {
	if (typeof $.cookie('language') != "undefined") {
		g_langIndex = parseInt($.cookie("language"));
	}

	var insertHtml = "",
		index = 0;
	for (index = 0; index < g_languageMenu.length; index ++) {
		if (g_langIndex === g_languageMenu[index].index) {
			insertHtml += "<li class='active' data-lang-index='" + g_languageMenu[index].index + "'>" + g_languageMenu[index].language + "</li>";
			$('.top .language>label').text(g_languageMenu[index].language);
		} else {
			insertHtml += "<li data-lang-index='" + g_languageMenu[index].index + "'>" + g_languageMenu[index].language + "</li>";
		}
	}

	$(".language .language_menu").append(insertHtml);

	$(".top .language").hover(function () {
		$(this).find("ul").stop(true, true);
		$(this).find("ul").slideDown();
	}, function () {
	 	$(this).find("ul").stop(true, true);
		$(this).find("ul").slideUp();
	})

	$('.top .language .language_menu>li').each(function() {
		$(this).click(function () {
			changeLang({
				index: $(this).data("lang-index")
			});
		})
	});
}

function changeLang(options) {
	var defaultIndex = g_langIndex;
	if (typeof $.cookie('language') != "undefined") {
		defaultIndex = parseInt($.cookie("language"));
	}
	var options = $.extend({
		index: defaultIndex
	}, options);

	$.cookie('language', options.index, {expires: 30});
	self.location = "login.html";
}

function onReady() {
	$('#password').focus();
	$('.login').unbind("click").click(function(event) {
		var msgBody = {
			UserName: $.trim($("#username").val()),
			UserPassword: $.trim($("#password").val())
		};
		$.sendCmd("CW_JSON_Auth", msgBody).done(function(authInfo) {
			if ($.trim(authInfo["token"]).length == 0) {
				showMsgDialog();
			} else {
				$.cookie("token", $.trim(authInfo["token"]), {expires: 30});
				$.cookie("loginuser", $.trim($("#username").val()), {expires: 30});
				$.cookie("loginpassword", $.trim($("#password").val()), {expires: 30});

				window.location.href = '/live.html';	

			}
		}).fail(function () {
			showMsgDialog();
		})
	})
	
}

function showMsgDialog() {
	$("#msgLoginFail").dialog({
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
					$(this).dialog("close");
				}
			}
		]
	});

	$(".ui-dialog[aria-describedby='msgLoginFail']").bgiframe();
}

$(document).keypress(function(E){
	if (E.which == 13) {
		$('.login').trigger("click");
	}
});

function CheckIE() {
	try {
		new ActiveXObject('CWPLAY.cwplayCtrl.1');
	} catch (_error) {
		return false;
	}
	return true;
};

function IsPluginInstall() {
//	if (typeof document.all.IPCameraCheck.IPCStartPreviewEx == undefined) {
//		return false;
//	}
	return true;
}