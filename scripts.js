/* JS */

$(document).ready(drawMyImage("BW/26.png", "canvas1"));
$(document).ready(drawMyImage("BW/7.png", "canvas2"));


var colorMap1 = null;
var colorMap2 = null;
var currentMapping = null;
var divsEmpty = true;



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



function createcolorMap(canvasID) {
	var canvas = $("#" + canvasID)[0];
	var ctx = canvas.getContext('2d');
	var colorMap = [["null", "null", 0]];

	for (x = 0; x < 96; x++) {
		for (y = 0; y < 96; y++) {
			var current_pixel = ctx.getImageData(x, y, 1, 1)
			var current_data = current_pixel.data;
			var rgba = 'rgba(' + current_data[0] + ', ' + current_data[1] + ', ' + current_data[2] + ', ' + (current_data[3] / 255) + ')';
			if (colorMap[0][1] == "null") {
				colorMap[0][1] = rgba;
			} else {
				var match = "no";
				for (i = 0; i < (colorMap.length); i++) {
					if (colorMap[i][1] == rgba) {
						match = "yes";
						colorMap[i][2]++;
					}
				};
				if (match == "no") {
					colorMap.push([current_pixel, rgba, 1]);
				}
			}
		};
	};

	for (i = 0; i < (colorMap.length); i++) {
		if (colorMap[i][1] == "rgba(0, 0, 0, 0)") {
			colorMap.splice(i, 1);
		}
	};

	colorMap.sort(function(a,b){
		return b[2] - a[2];
		});
	
	return colorMap;
}

function createColorMapping(colorMap1, colorMap2) {
	var colorMapping = [];
	var max = colorMap1.length + colorMap2.length;
	for (i = 0; i < max; i++) {
		if (colorMap1[i] != null && colorMap2[i] != null) {
			colorMapping[i]=[i, i];
		}
	}
	return colorMapping;
}

function fillRGBADiv(rgbaMap, $colorDiv) {
	var colorDivID = $colorDiv.attr("id");
	for (i = 0; i < rgbaMap.length; i++) {
		$colorDiv.append("<div class='" + colorDivID + i +" " + "colorBox [" + colorDivID + "][" + i + "]'>" + "<img></img>" + "</div>");
		$("." + colorDivID + i)[0].style.background = rgbaMap[i][1];
	}
	divsEmpty = false;
}

function updateCanvas (originalCanvasID, destinationCanvasID, colorMap1, colorMap2, colorMapping) {
	copyCanvas(originalCanvasID, destinationCanvasID);

	var destCanvas = $("#" + destinationCanvasID)[0];
	var ctx = destCanvas.getContext('2d');

	var swapMapping = [];

	for (i = 0; i < colorMapping.length; i++) {
		var x = colorMapping[i][0];
		var y = colorMapping[i][1];
		swapMapping.push([colorMap1[x][0], colorMap2[y][0]])
	}

	console.log(swapMapping);

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
		Modify currentMapping, then run updateMapping

		Change "colorMap1" and "colorMap2" to "donorColorMap" and "receiverColorMap" in all cases.

		Make drop downs for sprites
			Make one drop down
			Add a few elements
			When value is changed, clearCanvas, drawMyImage, updateMapping(createColorMapping)
			Add more content
	

*/


var thisThingy = null;
$(document).on("click", ".colorBox", function(event) {
	thisThingy = this;
	console.log(thisThingy);
});


$("#canvas1").click(function() {
	colorMap1 = createcolorMap("canvas2");
	colorMap2 = createcolorMap("canvas1");
	if (divsEmpty) {
		fillRGBADiv(colorMap1, $("#0"));
		fillRGBADiv(colorMap2, $("#1"));
	}

	copyCanvas("canvas2", "canvas4");
	currentMapping = createColorMapping(colorMap1, colorMap2);
	updateCanvas("canvas2", "canvas4", colorMap1, colorMap2, currentMapping);
});




