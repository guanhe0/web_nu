var g_ParamType = 0;
function setparamtype(val){
	g_ParamType = parseInt(val);	
}
function InputConfFile(){
	var fileName = "";
	fileName = $("#configure_file").val();
	if(fileName == ""){
	  alert(IDC_SETTING_PLEASE_SELECT_FILE);
	  return;
	}
	switch(g_ParamType)
	{
		case 0:
			$("#ddfrmUpdate").attr("action","/webs/config_encode");
			break;
		case 1:
			$("#ddfrmUpdate").attr("action","/webs/config_alarm");
			break;
		case 2:
			$("#ddfrmUpdate").attr("action","/webs/config_image");
			break;
		case 3:
			$("#ddfrmUpdate").attr("action","/webs/config_ptz");
			break;
		case 4:
			$("#ddfrmUpdate").attr("action","/webs/config_server");
			break;
		case 5:
			$("#ddfrmUpdate").attr("action","/webs/config_user");
			break;
		case 6:
			$("#ddfrmUpdate").attr("action","/webs/config_record");
			break;
		default:
			$("#ddfrmUpdate").attr("action","/webs/config_encode");
			break;			
	}
	$("#ddfrmUpdate").submit();
	setTimeout("alert(IEC_SETTING_INPUT_PARAMS_SUCCESS)",1000);
}
function FormTimeStr(seconds)
{
	if (seconds < 0 || seconds == undefined) return (-1);
	
	var now = new Date();
	now.setTime(seconds * 1000);

	// 凿时区
	now.setHours(now.getHours() - 8);
	
	var strDate = now.getFullYear().toString() + "-";
    if ((1 + now.getMonth()).toString().length < 2)
    {// 前面补零，比妿1 -> 01
        strDate += '0';
    }
    strDate += (1 + now.getMonth()).toString() + "-";
    
    if (now.getDate().toString().length < 2)
    {
        strDate += '0';
    }   
    strDate += now.getDate().toString();
    
    strDate += " ";
    if (now.getHours().toString().length < 2)
    {
        strDate += "0";
    }
    strDate += now.getHours().toString() + ":";
    
    if (now.getMinutes().toString().length < 2)
    {
        strDate += "0";
    }
    strDate += now.getMinutes().toString() + ":";
    
    if (now.getSeconds().toString().length < 2)
    {
        strDate += "0";
    }
    strDate += now.getSeconds().toString();
    
    return strDate;
}
function DownLog(){
	window.location.href = "../system.log";
}

function beforeOnReady() {
	InitDialogMenu();

	$("#shortcutmenu .logout").unbind("click").click(function() {
		
		var display = $(".ui-dialog[aria-describedby='msgLogout']").css("display");
		if (display != 'block') {
			$("#msgLogout").dialog({
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
							ClearToken();
							window.location.href = "/login.html";
						}
					},
					{
						text: IDC_GENERAL_CANCEL,
						click: function () {
							$( this ).dialog("close");
						}
					}
				]
			});
			$(".ui-dialog[aria-describedby='msgLogout']").bgiframe();
		}
	});	
	
	$("#shortcutmenu li").each(function() {
		$(this).mouseenter(function() {
			$(this).addClass("over");
		})
		$(this).mouseleave(function() {
			$(this).removeClass("over");	
		})
	})
	
}
function InitDialogMenu() {
	$("#pm_content h3").click(function(event) {
		if ($(event.target).hasClass('ui-state-active')) {
			return;
		}
		$('#pm_content h3.ui-state-active').next('ul').hide();//other ul hide
		$('#pm_content h3.ui-state-active').removeClass('ui-state-active');//other ul remove class active
		$(event.target).addClass('ui-state-active').next('ul').fadeIn('slow');//target ul add class active and fadeIn
		ActiveSubMenu($(event.target).next('ul').find(':first-child'));
	})
	$('#pm_content .left li').click(function(event) {		
		ActiveSubMenu($(event.target));
	})
	$("#pm_content h3:first").addClass('ui-state-active').next('ul').fadeIn('slow');
}

function onReady(){
	
}
function show_baseinfo(){

}
function ActiveSubMenu(menu) {
	
	$("#pm_content").trigger("menu_close_" + $('#pm_content li.active').data('menu'));//current active li been close
	
	$('#pm_content li.active').removeClass('active');//remove class
	
    menu.addClass('active');
	
    $('#pm_content div.right > div').hide();
    $("#pm_content div.right > div." + menu.data('menu')).fadeIn('slow');//active menu fadeIn
    $("#pm_content").trigger("menu_show_" + menu.data('menu'));
    
}
function DownLoadConf(){
	switch(g_ParamType)
	{
		case 0:
			window.location.href = "../config_encode.log";
			break;
		case 1:
			window.location.href = "../config_alarm.log";
			break;
		case 2:
			window.location.href = "../config_image.log";
			break;
		case 3:
			window.location.href = "../config_ptz.log";
			break;
		case 4:
			window.location.href = "../config_server.log";
			break;
		case 5:
			window.location.href = "../config_user.log";
			break;
		case 6:
			window.location.href = "../config_record.log";
			break;
		default:
			window.location.href = "../config_encode.log";
			break;
	}
}
$(document).ready(function(){

//	$("#pm_left").css('height',$(window).height() - 60);
//	$("#pm_right").css('height',$(window).height() - 60);
	if(g_langIndex == 1)//english
	{		
		document.getElementById("bt_configure").value = "parameter input";
		document.getElementById("bt_configure1").value = "parameter output";		
	}
  
	$("#pm_save_bt").hwbutton();
	if ($('#pm_content li.active').data('menu') == null) {	
		ActiveSubMenu($('#pm_content li:first').addClass('active'));
	}
	else {				
		$("#pm_content").trigger("menu_show_" + $("#pm_content li.active").data("menu"));
	}	
	
	$(".playlive").unbind("click").click(function(){
		if(g_vc_player){
			g_vc_player.stop();
			g_vc_player.Logout();
		}
		if(g_vp_player){
			g_vp_player.stop();
			g_vp_player.Logout();
		}
		if(g_md_player){
			g_md_player.stop();
			g_md_player.Logout();
		}
		window.location.href = "live.html";
	})
})
