var g_userInfo;
$(document).on("menu_show_user_manage", function () {
	$("#userstable tr").eq(0).nextAll().remove();

	$.sendCmd("CW_JSON_GetUsersList").done(function (userInfo) {
		var index = 0;
		var userStr = "";
		g_userInfo = userInfo;
		for (index = 0; index < userInfo.length; index ++) {
			userStr += "<tr>";
			userStr += "<td>" + userInfo[index]["UserName"] + "</td>";
			var group = parseInt(userInfo[index]["Authority"], 10);
			if (group == 0) {
				userStr += "<td data-group-index='0'>admin</td>";
			} else if (group == 1) {
				userStr += "<td data-group-index='1'>operate</td>";
			} else if (group == 2) {
				userStr += "<td data-group-index='2'>user</td>";
			}
			
			userStr += "</tr>";
		}
		$("#userstable").append(userStr);

		refreshTable();
	});

	
	$("#add_user_btn").hwbutton();
	$("#del_user_btn").hwbutton();
	$("#modify_passwd_btn").hwbutton();

	$("#add_user_btn").click(function () {
		var display = $(".ui-dialog[aria-describedby='adduserdialog']").css("display");
		if (display != 'block') {
			$("#show_save_msg").text("");
			$("#dialog_user_name").val("");
			$("#dialog_user_password").val("");
			$("#adduserdialog").dialog({
				bgiframe: true,
				resizable: false,
				modal: true,
				width: 360,
		  		height: 220,
		  		title: IDC_SETTING_DIALOG_SYS_USRMANAGE_DIALOG_USERINFO,
				closeOnEscape: true,				
				buttons: [
					{
						text: IDC_GENERAL_ADD,
						click: function () {
							var user = $.trim($("#dialog_user_name").val());
							var passwd = $.trim($("#dialog_user_password").val());
							var group = parseInt($("#dialog_user_group").val(), 10);
							var index = 0;
							var sameUser = false;
							for (index = 0; index < g_userInfo.length; index ++) {
								if (user === g_userInfo[index]["UserName"]) {
									sameUser = true;
									break;
								}
							}
							var pattern = /^\w+$/;//只能输入由数字、26个英文字母或者下划线组成的字符串：
							if ( !user.match(pattern) /*&& !user.match(minchar_pattern) && !user.match(maxchar_pattern)*/ )
							{
							$("#show_save_msg").text(IDC_SETTING_DIALOG_SYS_USRMANAGE_DIALOG_CHARERROR);
								return;
							}
							if (user.length == 0) {
								$("#show_save_msg").text(IDC_SETTING_DIALOG_SYS_USRMANAGE_DIALOG_USERNOTEMPTY);
								return;
							}
							if (sameUser == true) {
								$("#show_save_msg").text(IDC_SETTING_DIALOG_SYS_USRMANAGE_DIALOG_USEREXIST);
							} else {
								var msgBody = {
									UserCmd: 0,
									UserName: user,
									UserPassword: passwd,
									Authority: group
								};
								$.sendCmd("CW_JSON_SetUsers", msgBody).done(function () {
									var userStr = "<tr>";
									userStr += "<td>" + user + "</td>";
									if (group == 0) {
										userStr += "<td data-group-index='0'>admin</td>";
									} else if (group == 1) {
										userStr += "<td data-group-index='1'>operate</td>";
									} else if (group == 2) {
										userStr += "<td data-group-index='2'>user</td>";
									}
									userStr += "</tr>";
									$("#userstable").append(userStr);
									refreshTable();

									$("#show_save_msg").text(IDC_SETTING_DIALOG_SYS_USRMANAGE_DIALOG_ADDUSERSUCCESS);
									hideDialogSeconds($(this));
									g_userInfo.push({"UserName" : user, "Authority" : group});
								}).fail(function () {
									$("#show_save_msg").text(IDC_SETTING_DIALOG_SYS_USRMANAGE_DIALOG_ADDUSERFAIL);
									hideDialogSeconds($(this));
								})
							}
						}
					},
					{
						text: IDC_GENERAL_CANCEL,
						click: function () {
							$(this).dialog("close");
						}
					}
				]
			});

			$(".ui-dialog[aria-describedby='adduserdialog']").bgiframe();
			
			
			var left = (parseInt($(window).width()) - parseInt($("#adduserdialog").css("width")))/2 + "px";
			var top = (parseInt($(window).height())-parseInt($("#adduserdialog").css("height")))/2 + "px";
			$("#adduserdialog").parent().css('left',left);
			$("#adduserdialog").parent().css('top',top);	
		}
	});

	$("#del_user_btn").click(function () {
		var activeTr = $('#userstable tr.tr_active')[0];
		if (activeTr) {
			var groupIndex = parseInt($("#user_group").val());
			// admin 鐢ㄦ埛缁?
			if ((groupIndex == 0) && (GetAdminCount() <= 1)) {
				$("#msgdeluser_one").dialog({
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

				$(".ui-dialog[aria-describedby='msgdeluser']").bgiframe();

				return;
			}
			
			if ($.trim($("#user_name").val()) === $.trim($.cookie("loginuser"))) {
				return;
			}

			$("#msgdeluser").dialog({
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
							var user = $.trim($("#user_name").val());
							var group = parseInt($("#user_group").val());

							var msgBody = {
								UserCmd: 1,
								UserName: user,
								Authority: group
							};
							var _this = $(this);
							$.sendCmd("CW_JSON_SetUsers", msgBody).done(function () {
								$('#userstable tr.tr_active').remove();
								$("#user_name").val("");
								var temp = g_userInfo;
								g_userInfo = [];
								var index = 0;
								for (index = 0; index < temp.length; index ++) {
									if (temp[index]["UserName"] !== user) {
										g_userInfo.push(temp[index]);
									}
								}

								_this.dialog("close");
							});
						}
					},
					{
						text: IDC_GENERAL_CANCEL,
						click: function () {
							$(this).dialog("close");
						}
					}
				]
			});

			$(".ui-dialog[aria-describedby='msgdeluser']").bgiframe();	
			var left = (parseInt($(window).width()) - parseInt($("#msgdeluser").css("width")))/2 + "px";
			var top = (parseInt($(window).height())-parseInt($("#msgdeluser").css("height")))/2 + "px";
			$("#msgdeluser").parent().css('left',left);
			$("#msgdeluser").parent().css('top',top);
			
		}
	});

	$("#modify_passwd_btn").click(function () {
		var activeTr = $('#userstable tr.tr_active')[0];
		$("#show_modify_msg").text("");
		
		if (activeTr) {
			$("#dialog_mdy_user_name").val($.trim($("#user_name").val()));
			var logName = $.trim($.cookie("loginuser"));
			var userName = $.trim($("#dialog_mdy_user_name").val());
			if(logName != "admin")
			{
				if(userName != logName)
				{
					alert(IDC_USER_MANAGE_MODIFY_PWD_ONLY_YOURSELF);
					return;
				}
			}
			$("#modifyuserdialog").dialog({
				bgiframe: true,
				resizable: false,
				modal: true,
				width: 360,
		  		height: 180,
		  		title: IDC_GENERAL_MSG_TITLE,
				buttons: [
					{
						text: IDC_GENERAL_MODIFY,
						click: function () {
							var user = $.trim($("#dialog_mdy_user_name").val());
							
							var passwd = "";
							var confirm_pwd = "";
							var index = 0;
							var found = false;
							for (index = 0; index < g_userInfo.length; index ++) {
								if (g_userInfo[index]["UserName"] === user) {
									found = true;
								}
							}

							if (found == false) {
								$("#show_modify_msg").text(IDC_SETTING_DIALOG_SYS_USRMANAGE_DIALOG_USERNOTEXIST);
							} else if (found == true) {
								passwd = $.trim($("#dialog_mdy_user_password").val());
								confirm_pwd = $.trim($("#dialog_mdy_user_confirm_password").val());
								if(passwd != confirm_pwd)
								{
									alert(IDC_SETTING_PASSWD_NOT_MATCH);
									return;
								}
								var msgBody = {
									UserCmd: 2,
									UserName: user,
									UserPassword: passwd
								};
								$.sendCmd("CW_JSON_SetUsers", msgBody).done(function () {
									$("#show_modify_msg").text(IDC_SETTING_DIALOG_SYS_USRMANAGE_DIALOG_MODIFYSUCCESS);
								}).fail(function () {
									$("#show_modify_msg").text(IDC_SETTING_DIALOG_SYS_USRMANAGE_DIALOG_MODIFYFAIL);
								});
							}
						}
					},
					{
						text: IDC_GENERAL_CANCEL,
						click: function () {
							$(this).dialog("close");
						}
					}
				]
			});
			
			$("#modifyuserdialog").css("height",132);
			$(".ui-dialog[aria-describedby='modifyuserdialog']").bgiframe();
			var left = (parseInt($(window).width()) - parseInt($("#modifyuserdialog").css("width")))/2 + "px";
			var top = (parseInt($(window).height())-parseInt($("#modifyuserdialog").css("height")))/2 + "px";
			$("#modifyuserdialog").parent().css('left',left);
			$("#modifyuserdialog").parent().css('top',top);
			
		}
	});
})

function refreshTable() {
	$("#userstable tr:not(:first)").click(function () {
		$('#userstable tr.tr_active').removeClass('tr_active');
		$(this).addClass('tr_active');

		$(this).find("td").each(function (index){
			if (index == 0) {
				$("#user_name").val($(this).text());
			} else if (index == 1) {
				$("#user_group").val($(this).data("group-index"));
			}
		})
	});
}

function hideDialogSeconds(dialog) {
	$("#dialog_user_name").val("");
	$("#dialog_user_password").val("");
}

function GetAdminCount() {
	var count = 0;
	for (var index = 0; index < g_userInfo.length; index ++) {
		if (g_userInfo[index]["Authority"] == 0) {
			count ++;
		}
	}

	return count;
}

$(document).on("menu_save_user_manage", function () {
	// nothing
	alert(IDC_GENERAL_SAVESUCCESS);
})

$(document).on("menu_close_user_manage", function () {
	// nothing
	var add_display = $(".ui-dialog[aria-describedby='adduserdialog']").css("display");
	var del_display = $(".ui-dialog[aria-describedby='msgdeluser']").css("display");
	var modify_display = $(".ui-dialog[aria-describedby='modifyuserdialog']").css("display");
	
	if(typeof add_display != 'undefined'){
	$("#adduserdialog").dialog("close");
	}
	if(typeof del_display != 'undefined'){
	$("#msgdeluser").dialog("close");
	}
	if(typeof modify_display != 'undefined'){
	$("#modifyuserdialog").dialog("close");
	}
})