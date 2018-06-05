/*
依赖于Jquery库
*/
var DrawGrid = {
	create: function (options) {
		var drawGrid = {};
		var options = $.extend({
			widthCount: 16,		// 水平block的个数
			heightCount: 16,	// 垂直block的个数
			dom_id: null,
			canvasid: null
		}, options);
		/*
		selected : 1表示选中, 0表示未选中
		top:
		left:
		right:
		bottom:
		*/
		var blockArray = null;	// widthCount乘heightCount的二维数组, 每个数组都是一个对象, 对象成员如上注释
		var canvas = document.getElementById(options.canvasid);
		var context = canvas.getContext('2d');

		var width = parseInt($('#' + options.dom_id).width(),10);
		var height = parseInt($('#' + options.dom_id).height(),10);
		var blockWidth = ((width - (options.widthCount + 1)) / options.widthCount);	// 浮点数的时候会导致canvas画的线有锯齿
		var blockHeight = ((height - (options.heightCount + 1)) / options.heightCount);
		var startX = 0, startY = 0;

		canvas.attachEvent("onmousedown", function (e) {
			onMouseDown(e);
		});

		canvas.attachEvent("onmousemove", function (e) {
			onMouseMove(e);
		});

		canvas.attachEvent("onmouseup", function (e) {
			onMouseUp(e);
		});

		function getPointOnCanvas(x, y) {  
			var bbox = canvas.getBoundingClientRect();
			var width = bbox.right - bbox.left;
			var height = bbox.bottom - bbox.top;
			return { x: x - bbox.left * (canvas.width  / width),
					 y: y - bbox.top  * (canvas.height / height)
				   };  
		}

		function onMouseDown(event) {
			var ret = getPointOnCanvas(parseInt(event.x,10), parseInt(event.y,10));
   			startX = ret.x;
   			startY = ret.y;
		}

		function onMouseMove(event) {
			// do nothing
		}

		function onMouseUp(event) {
			var ret = getPointOnCanvas(parseInt(event.x,10), parseInt(event.y,10));
			var endX = ret.x;
			var endY = ret.y;

			context.clearRect(0, 0, width, height);
			context.globalAlpha = 0.2;
			context.fillStyle = "#0b93d5";
			context.fillRect(0, 0, width, height);

			for (var i = 0; i < options.heightCount; i ++) {
				for (var j = 0; j < options.widthCount; j ++) {
					var left = blockArray[i][j]["left"];
					var top = blockArray[i][j]["top"];
					var right = blockArray[i][j]["right"];
					var bottom = blockArray[i][j]["bottom"];

					if ((left > startX) && (left < endX) && (top > startY) && (top < endY) ||
						(right > startX) && (right < endX) && (top > startY) && (top < endY) ||
						(right > startX) && (right < endX) && (bottom > startY) && (bottom < endY) ||
						(left > startX) && (left < endX) && (bottom > startY) && (bottom < endY) ||
						(startX > left) && (startX < right) && (startY > top) && (startY < bottom)) {
						blockArray[i][j]["selected"] = !blockArray[i][j]["selected"];
					}
				}
			}
			InitGrid();
		}

		function InitBorder() {
			canvas.style.width = width + "px";
            canvas.style.height = height + "px";
			context.globalAlpha = 0.2;
			context.fillStyle = "#0b93d5";
			context.fillRect(0, 0, width, height);
		}

		function InitGridByArray() {
			for (var i = 0; i < options.widthCount; i ++) {
				for (var j = 0; j < options.heightCount; j ++) {
					blockArray[i][j]["left"] = Math.round(i * blockWidth) + 1;
					blockArray[i][j]["right"] = Math.round(i * blockWidth) + 1 + blockWidth;
					blockArray[i][j]["top"] = Math.round(j * blockHeight) + 1;
					blockArray[i][j]["bottom"] = Math.round(j * blockHeight) + 1 + blockHeight;
				}
			}
		}

		function InitGrid() {
			for (var i = 0; i < options.widthCount; i ++) {
				for (var j = 0; j < options.heightCount; j ++) {
					var flag = blockArray[i][j]["selected"];
					if (flag == 0) {
						context.fillStyle = "#ff0000";
					} else if (flag == 1) {
						context.fillStyle = "#ff0000";
						context.fillRect(blockArray[i][j]["left"], blockArray[i][j]["top"], blockWidth, blockHeight);
					}
					
					context.strokeRect(blockArray[i][j]["left"], blockArray[i][j]["top"], blockWidth, blockHeight);
				}
			}
		}

		function InitArray() {
			blockArray = [];
			for (var i = 0; i < options.widthCount; i ++) {
				blockArray[i] = [];
				for (var j = 0; j < options.heightCount; j ++) {
					blockArray[i][j] = {};
				}
			}

			var index = 1;
			for (var i = 0; i < options.widthCount; i ++) {
				for (var j = 0; j < options.heightCount; j ++) {
					blockArray[j][i]["selected"] = 0;
					blockArray[j][i]["left"] = Math.round(i * blockWidth) + (index + i);
					blockArray[j][i]["right"] = Math.round((i + 1) * blockWidth) + (index + i);
					blockArray[j][i]["top"] = Math.round(j * blockHeight) + (index + j);
					blockArray[j][i]["bottom"] = Math.round((j + 1) * blockHeight) + (index + j);
				}
			}
		}

		InitArray();
		InitBorder();
		InitGrid();

		drawGrid.reDraw = function () {
			InitGrid();
		}

		drawGrid.setValues = function (values) {
			// values : 32长度的8bytes数组
			for (var i = 0; i < options.widthCount; i ++) {
				for (var j = 0; j < options.heightCount; j ++) {
					var index = parseInt((i * options.widthCount + j) / 8,10);
					var offset = (i * options.widthCount + j) % 8;
					blockArray[i][j]["selected"] = (values[index] >> offset) & 1;
				}
			}
		}

		drawGrid.getValues = function () {
			var values = [];
			for (var i = 0; i < 32; i ++) {
				values[i] = 0;
			}

			for (var i = 0; i < options.widthCount; i ++) {
				for (var j = 0; j < options.heightCount; j ++) {
					var index = parseInt((i * options.widthCount + j) / 8,10);
					var offset = (i * options.widthCount + j) % 8;
					values[index] |= blockArray[i][j]["selected"] << offset;
					// console.log('index = ' + index + ", offset = " + offset + "blockArray[" + i + "][" + j + "] = " + blockArray[i][j]["selected"]);
				}
			}

			return values;
		}

		drawGrid.clear = function () {
			context.clearRect(0, 0, width, height);
		}

		return drawGrid;
	}
}