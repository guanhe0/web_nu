/*
依赖于jquery库, 
依赖于
jquery.ui.draggable.js
jquery.ui.resizable.js
*/
(function ($){
	var _this = "";
	var idIndex = 0;	// DIV index
	var disable = false;	// 
	var offsetb_X,offsetb_Y;
	$.fn.DrawDIV = function (options){
		var options = $.extend({
			maxCount: 4
        }, options);

		_this = $(this);

		var drawFlag = false;	// 是否正在draw方框, true: 正在draw, false: 没draw
		var startX = 0, startY = 0;	// 鼠标的起始坐标值
		var offX = 0, offY = 0;
		var arrayDiv = [];
		var curDivID = "";	// 当前正在操作的DIV的ID号

		$('#' + _this.attr("id") + " div").remove();
		idIndex = 0;
		disable = false;

		// 初始化数组值
		for (var i = 0; i < options.maxCount; i ++) {
			arrayDiv[i] = {};
		}

		function createDivID() {
			if (idIndex >= options.maxCount) {
				idIndex = options.maxCount - 1;
			}
			return "rect_div" + (idIndex ++);
		}
		var flag = -1;
		function isInRange(NewId,event){
			var i;
			for(i = 0; i < NewId; i++){
			 if((event.clientX > arrayDiv[i].left && event.clientX < (arrayDiv[i].left + arrayDiv[i].width))
			 	&&(event.clientY > arrayDiv[i].top && event.clientY < (arrayDiv[i].top + arrayDiv[i].height))){
					flag = i;
					break;
			 	}
			}
			return flag;
		}
				
		// 如果value有值, 根据value的边框来画矩形
		if (options.values) {
			// {"Bottom":0,"Left":0,"Right":0,"Top":0}
			$('#' + _this.attr("id") + " div").remove();
			idIndex = 0;

			for (var i = 0; i < options.values.length; i ++) {
				var _left = parseInt(options.values[i]["Left"],10);
				var _right = parseInt(options.values[i]["Right"],10);
				var _top = parseInt(options.values[i]["Top"],10);
				var _bottom = parseInt(options.values[i]["Bottom"],10);

				// 防止越界
				_left = (_left > 10000) ? 10000 : _left;
				_right = (_right > 10000) ? 10000 : _right;
				_top = (_top > 10000) ? 10000 : _top;
				_bottom = (_bottom > 10000) ? 10000 : _bottom;

				// 从10000 x 10000的坐标系转化到当前div的坐标系
				_left = (_left / 10000) * parseInt(_this.width(),10);
				_right = (_right / 10000) * parseInt(_this.width(),10);
				_top = (_top / 10000) * parseInt(_this.height(),10);
				_bottom = (_bottom / 10000) * parseInt(_this.height(),10);

				// console.log("(_right - _left) = " + (_right - _left) + ", (_bottom - _top) = " + (_bottom - _top));
				if (((_right - _left) > 1) && ((_bottom - _top) > 1)) {
					var divID = createDivID();

					var el = $("<div id=\"" + divID + "\" style=\"overflow:hidden;-moz-opacity:0.5;opacity:0.5;\"></div>");
					el.css({
						position: "absolute",
						top: _top,
						left: _left,
						width: _right - _left,
						height: _bottom - _top,
						border: "1px solid #0B93D5",
						filter: "alpha(opacity=25)",
						background: "#0B93D5"
					});
					_this.append(el);
				}
			}
		}

		_this.unbind("mousedown").bind("mousedown", function (event) {
			if (disable == true) {
				return;
			}
			if (drawFlag == false) {
				drawFlag = true;
				curDivID = createDivID();
				
				if ($('#' + curDivID).length) {
					$('#' + curDivID).remove();
				}
				
				var ret;
				offsetb_X = event.offsetX;
				offsetb_Y = event.offsetY;
				
				if(offsetb_X == undefined || offsetb_Y == undefined){
					var evtOffsets = getOffset(event);
					offsetb_X = evtOffsets.offsetX;
					offsetb_Y = evtOffsets.offsetY;
				}
				
			//	infor("offsetb_X = " + offsetb_X + " offsetb_Y = " + offsetb_Y);
				if((ret = isInRange(idIndex-1,event)) != -1){
					offsetb_X = arrayDiv[ret].offsetX + (event.clientX - arrayDiv[ret].left);
					offsetb_Y = arrayDiv[ret].offsetY + (event.clientY - arrayDiv[ret].top);
				}
				var el = $("<div id=\"" + curDivID + "\" style=\"overflow:hidden;-moz-opacity:0.5;opacity:0.5;\" attr-offsetX=\"" + offsetb_X + "\" attr-offsetY=\"" + offsetb_Y +"\"></div>");
				el.css({
					position: "absolute",
					top: parseInt(offsetb_Y,10),
					left: parseInt(offsetb_X,10),
					border: "1px dashed #0B93D5",
					filter: "alpha(opacity=25)",
					background: "#0B93D5"
				});
				_this.append(el);
				startX = event.clientX;
				startY = event.clientY;
				offX = 0;
				offY = 0;
			}

			return false; 
		});

		_this.unbind("mousemove").bind("mousemove", function (event) {
			if (disable == true) {
				return;
			}
			if (drawFlag == true) {
				var _width = event.clientX - startX;
				var _height = event.clientY - startY;
				var _top = parseInt($('#' + curDivID).css("top"),10);
				var _left = parseInt($('#' + curDivID).css("left"),10);
				var containWidth = parseInt(_this.width(),10);
				var containHeight = parseInt(_this.height(),10);

				// 向右拖动
				if (_width < 0) {
					var beginOffsetX = parseInt($('#' + curDivID).attr('attr-offsetX'),10);
					_width = Math.abs(_width);
					_left = beginOffsetX - _width;
				}

				// 向上拖动
				if (_height < 0) {
					var beginOffsetY = parseInt($('#' + curDivID).attr('attr-offsetY'),10);
					_height = Math.abs(_height);
					_top = beginOffsetY - _height;
				}

				// 防止越界
				if ((_left + _width) >= containWidth) {
					_width = containWidth - _left;
				}
				if ((_top + _height) >= containHeight) {
					_height = containHeight - _top;
				}

				$('#' + curDivID).css({
					top: _top,
					left: _left,
					width: _width,
					height: _height
				});
				offX = _width;
				offY = _height;
			}

			return false;
		});

		_this.unbind("mouseup").bind("mouseup", function (event) {
			if (disable == true) {
				return;
			}
			arrayDiv[idIndex-1] = {"left":startX,"top":startY,"width":offX,"height":offY,"offsetX":offsetb_X,"offsetY":offsetb_Y};
			drawFlag = false;
			$('#' + curDivID).css({
				border: "1px solid #0B93D5"
			});
			return false;
		});
		function getPageCoord(element)
		{
		  var coord = {x: 0, y: 0};
		  while (element)
		  {
			coord.x += element.offsetLeft;
			coord.y += element.offsetTop;
			element = element.offsetParent;
		  }
		  return coord;
		}
		function getOffset(evt)
		{
		  var target = evt.target;
		  if (target.offsetLeft == undefined)
		  {
			target = target.parentNode;
		  }
		  var pageCoord = getPageCoord(target);
		  var eventCoord =
		  {
			x: window.pageXOffset + evt.clientX,
			y: window.pageYOffset + evt.clientY
		  };
		  var offset =
		  {
			offsetX: eventCoord.x - pageCoord.x,
			offsetY: eventCoord.y - pageCoord.y
		  };
		  return offset;
		}		
	};

	$.fn.DrawDIV.clearAll = function() {
		var id = _this.attr("id");
		$('#' + id + " div").remove();
		idIndex = 0;
	};

	$.fn.DrawDIV.getRect = function () {
		var id = _this.attr("id");
		var arrayValues = [];

		$('#' + id + " div").each(function (index) {
			arrayValues[index] = {};
			var top, left, width, height;
			top = parseInt($(this).css("top"),10);
			left = parseInt($(this).css("left"),10);
			width = parseInt($(this).width(),10);
			height = parseInt($(this).height(),10);

			// 从当前坐标系转化到10000 x 10000的坐标系
			arrayValues[index]["Left"] = parseInt(left * 10000 / parseInt(_this.width()),10);
			arrayValues[index]["Top"] = parseInt(top * 10000 / parseInt(_this.height()),10);
			arrayValues[index]["Right"] = parseInt((left + width) * 10000 / parseInt(_this.width()),10);
			arrayValues[index]["Bottom"] = parseInt((top + height) * 10000 / parseInt(_this.height()),10);

		});

		return arrayValues;
	};

	$.fn.DrawDIV.setDisable = function (flag) {
		disaable = flag;
	}
})(jQuery);
