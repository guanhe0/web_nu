var sd_card_percent = null;
var sd_precent = 0;
var sd_load_status = 0;
$(document).on("menu_show_sd_status", function () {
	var sdLoadStatus = [IDC_SETTING_DIALOG_SYS_SDSTATUS_SDLOADFAIL, IDC_SETTING_DIALOG_SYS_SDSTATUS_SDLOADSUCCESS];
	var sdFormat = ["", "FAT32", "EXT2", "EXT3"];

	// 进度条使用代码
	$.fn.process_bar = function(option){
		var _target = this;
		
		return new function(){
			this.option = {
				value: 0,
				valueEl: ""
			};
			
			$.extend(true, this.option, option || {});
			
			this.value = function(val, callback){
				typeof(val) != 'undefined' && (this.option.value = val || 0);
				var text = this.option.value + "%";
				$("#" + this.option.valueEl).html(text);
				_target.find("img.front").animate({ "left": text }, "slow", callback || function(){});
				return this.option.value;
			};
			
			this.value();
		};
	};
	
	sd_card_percent = $("#sd_card_percent").process_bar({ value: 0, valueEl: "sd_card_percent_val" });
	
	var msgBody = {
		SdLoad: 1,
		SdFormat: 1,
		SdSize: 1,
		SdUseSize: 1
	};

	$.sendCmd("CW_JSON_GetSdFile", msgBody).done(function(sdInfo) {
		var sdSize = 0, sdUsedSize = 0;
		sdSize = parseInt(sdInfo['SdSize']);
		sdUsedSize = parseInt(sdInfo['SdUseSize']);
		sd_load_status = parseInt(sdInfo['SdLoad']);
		$('#sd_load_status').html(sdLoadStatus[sd_load_status]);
		$('#sd_format').html(sdFormat[parseInt(sdInfo['SdFormat'])]);
		$('#sd_total_volume').html(sdSize + "MB");
		$('#sd_used_volume').html(sdUsedSize + "MB");

		sd_precent = (sdSize == 0) ? 0 : (parseInt((sdUsedSize / sdSize) * 100));
		sd_card_percent.value(sd_precent);
	});
	
	// 格式化按钮事件
	$("#btn_sdcard_format").unbind("click").click(function(){
		if (sd_load_status == 0) {
			
		}
		var btn = $(this);
		sd_card_percent.value(0);
		// 格式化前调用
		$("#sd_card_format_text").show();
		btn.attr("disabled", true);
		
		// 格式化操作
		$.sendCmd("CW_JSON_DelSdFile").done(function(sdInfo) {
			// 格式化完成后调用
			sd_card_percent.value(100, function(){
				$("#sd_card_format_text").hide();
				btn.attr("disabled", false);
			});

			sd_card_percent.value(0);
			$('#sd_used_volume').html("0MB");
		});
	});
});

$(document).on("menu_save_sd_status", function () {


});

$(document).on("menu_close_sd_status", function () {


});
