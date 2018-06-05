(function ($){
	var thisID = "";
	$.fn.JSDraw = function (options){
		var options = $.extend({
			widthCount: 64,
			heightCount: 64,
		}, options);

		var blockWidth = 0, blockHeight = 0;

		blockWidth = $(this).width() / (options.widthCount + 1);
		blockHeight = $(this).height() / (options.heightCount + 1);

		var table = document.createElement("table");
		table.style.borderCollapse = "collapse";
		table.style.width = $(this).width() + "px";
		table.style.height = $(this).height() + "px";
		table.id = "selectabletable";

		for (var h = 0; h < options.heightCount; h ++) {
			var tr = document.createElement("tr");
			tr.style.height = blockHeight + "px";
			for (var w = 0; w < options.widthCount; w ++) {
				var td = document.createElement("td");
				td.style.border = "1px solid #0b93d5";
				td.style.width = blockWidth + "px";
				tr.appendChild(td);
			}
			table.appendChild(tr);
		}
		document.getElementById($(this).attr("id")).appendChild(table);


		$("#selectabletable").selectable({
			selected: function (event, ui) {
				// console.log(ui.selected);
			},
			filter: "td"
		});
	};
	
	// $.fn.JSVideo.stop = function()
	// {
	// 	$('#' + thisID + 'img').unbind("load");
	// 	$('#' + thisID + 'img').remove();
	// }
})(jQuery);