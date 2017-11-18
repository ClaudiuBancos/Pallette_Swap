/* JS */

$(document).ready(drawMyImage("BW/83.png", "canvas1"));
$(document).ready(drawMyImage("BW/48.png", "canvas2"));








function drawMyImage(src, canvasID) {
	var canvas = $("#" + canvasID)[0];
	var ctx = canvas.getContext('2d');

	var img = new Image();
	img.src = src;

	img.onload = function() {
		ctx.drawImage(img, 0, 0);
	}
}

function clearCanvas(canvasID) {
	var canvas = $("#" + canvasID)[0];
	var ctx = canvas.getContext('2d');

	currentImageData = null;

	for (x = 0; x < 96; x++) {
		for (y = 0; y < 96; y++) {
			var current_pixel = ctx.getImageData(x, y, 1, 1)
			if (currentImageData == null) {
				currentImageData = current_pixel;
			} else {
				ctx.putImageData(currentImageData, x, y);
			};
		};
	};
}

function copyCanvas(srcCanvasID, destCanvasID) {
	clearCanvas(destCanvasID);
	var destCanvas = $("#" + destCanvasID)[0];
	var ctx = destCanvas.getContext('2d');
	ctx.drawImage($("#" + srcCanvasID)[0], 0, 0);
}


function createColorMap (canvasID) {
	var canvas = $("#" + canvasID)[0];
	var ctx = canvas.getContext('2d');
	var colorMap = [["null", 0]];

	for (x = 0; x < 96; x++) {
		for (y = 0; y < 96; y++) {
			var current_pixel = ctx.getImageData(x, y, 1, 1)
			if (colorMap[0][0] == "null") {
				colorMap[0][0] = current_pixel;
			} else {
				var match = "no";
				for (i = 0; i < (colorMap.length); i++) {
					if (colorMap[i][0].data[0] == current_pixel.data[0] && colorMap[i][0].data[1] == current_pixel.data[1] && colorMap[i][0].data[2] == current_pixel.data[2] && colorMap[i][0].data[3] == current_pixel.data[3]) {
						match = "yes";
						colorMap[i][1]++;
					}
				};
				if (match == "no") {
					colorMap.push([current_pixel, 1]);
				}
			}
		};
	};

	for (i = 0; i < (colorMap.length); i++) {
		if (colorMap[i][0].data[3] == 0) {
			colorMap.splice(i, 1);
		}
	};

	colorMap.sort(function(a,b){
		return b[1] - a[1];
		});
	
	return colorMap;
}

function createColorMapping(colorMap1, colorMap2) {
	var colorMapping = [];
	for (i = 0; i < 250; i++) {
		if (colorMap1[i] != null && colorMap2[i] != null) {
			colorMapping[i] = [colorMap1[i][0], colorMap2[i][0]];
		}
	}
	return colorMapping;
}

function testFunction() {
	var CM1 = createColorMap("canvas1");
	var CM2 = createColorMap("canvas2");
	return createColorMapping(CM1, CM2);
}


function paletteSwap (receiverCanvasID, donorCanvasID) {
	var receivingColorMap = createColorMap(receiverCanvasID);
	var donatingColorMap = createColorMap(donorCanvasID);
	var swapMapping = createColorMapping(receivingColorMap, donatingColorMap);
	
	var receivingCanvas = $("#" + receiverCanvasID)[0];
	var ctx = receivingCanvas.getContext('2d');

	for (x = 0; x < 96; x++) {
		for (y = 0; y < 96; y++) {
			var current_pixel = ctx.getImageData(x, y, 1, 1)
			
			var newImageData = current_pixel;

			for (i = 0; i < swapMapping.length; i++) {
				if (swapMapping[i][0].data[0] == current_pixel.data[0] && swapMapping[i][0].data[1] == current_pixel.data[1] && swapMapping[i][0].data[2] == current_pixel.data[2] && swapMapping[i][0].data[3] == current_pixel.data[3]) {

					newImageData = swapMapping[i][1];
				}
			}

			ctx.putImageData(newImageData, x, y);
		};
	};
}


var currentMapping = null;

function updateMapping (mapping, originalCanvasID, destinationCanvasID) {
	
	copyCanvas(originalCanvasID, destinationCanvasID);

	var swapMapping = currentMapping;

	var receivingCanvas = $("#" + destinationCanvasID)[0];
	var ctx = receivingCanvas.getContext('2d');

	for (x = 0; x < 96; x++) {
		for (y = 0; y < 96; y++) {
			var current_pixel = ctx.getImageData(x, y, 1, 1)
			
			var newImageData = current_pixel;

			for (i = 0; i < swapMapping.length; i++) {
				if (swapMapping[i][0].data[0] == current_pixel.data[0] && swapMapping[i][0].data[1] == current_pixel.data[1] && swapMapping[i][0].data[2] == current_pixel.data[2] && swapMapping[i][0].data[3] == current_pixel.data[3]) {

					newImageData = swapMapping[i][1];
				}
			}

			ctx.putImageData(newImageData, x, y);
		};
	};

}




/*

	Goals:
		updateMapping (mapping, originalCanvasID, destinationCanvasID)
	

*/







function createRGBAMap (canvasID) {
	var canvas = $("#" + canvasID)[0];
	var ctx = canvas.getContext('2d');
	var colorMap = [["null", 0, 0]];

	for (x = 0; x < 96; x++) {
		for (y = 0; y < 96; y++) {
			var current_pixel = ctx.getImageData(x, y, 1, 1)
			var current_data = current_pixel.data;
			var rgba = 'rgba(' + current_data[0] + ', ' + current_data[1] + ', ' + current_data[2] + ', ' + (current_data[3] / 255) + ')';
			if (colorMap[0][0] == "null") {
				colorMap[0][0] = rgba;
			} else {
				var match = "no";
				for (i = 0; i < (colorMap.length); i++) {
					if (colorMap[i][0] == rgba) {
						match = "yes";
						colorMap[i][1]++;
					}
				};
				if (match == "no") {
					colorMap.push([rgba, 1, current_pixel]);
				}
			}
		};
	};

	for (i = 0; i < (colorMap.length); i++) {
		if (colorMap[i][0] == "rgba(0, 0, 0, 0)") {
			colorMap.splice(i, 1);
		}
	};

	colorMap.sort(function(a,b){
		return b[1] - a[1];
		});
	
	return colorMap;
}

function fillRGBADiv (rgbaMap, $colorDiv) {
	var colorDivID = $colorDiv.attr("id");
	for (i = 0; i < rgbaMap.length; i++) {
		$colorDiv.append("<div class=" + colorDivID + i + ">" + "<img></img>" + "</div>");
		$("." + colorDivID + i)[0].style.background = rgbaMap[i][0];
	}
}

$("canvas").click(function(){
	var thisCanvasID = $(this)[0].id;
	var thisRGBAMap = createRGBAMap(thisCanvasID);
	var $thisColorDiv = $(this).parent().siblings(".color_container");
	fillRGBADiv(thisRGBAMap, $thisColorDiv);
});

$("#canvas2").click(function() {
	copyCanvas("canvas2", "canvas4");
	paletteSwap("canvas4", "canvas1");

	currentMapping = createColorMapping(createColorMap("canvas2"), createColorMap("canvas1"));
});





