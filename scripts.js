/* JS */

/*
	1. Draw image on canvas given image src and canvas location.
	2. Create color map given canvas with image on it.
	3. Load colors from color map onto color container given color map and color container.
*/

function drawMyImage(src, canvasID) {
	var canvas = $("#" + canvasID)[0];
	var ctx = canvas.getContext('2d');

	var img = new Image();
	img.src = src;

	img.onload = function() {
		ctx.drawImage(img, 0, 0);
	}
}


function createColorMap (canvasID) {
	var canvas = $("#" + canvasID)[0];
	var ctx = canvas.getContext('2d');
	var colorMap = [["null", 0]];

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
					colorMap.push([rgba, 1]);
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


function fillColorDiv (colorMap, $colorDiv) {
	var colorDivID = $colorDiv.attr("id");
	for (i = 0; i < colorMap.length; i++) {
		$colorDiv.append("<div class=" + colorDivID + i + ">" + colorMap[i][0] + "</div>");
		$("." + colorDivID + i)[0].style.background = colorMap[i][0];
	}
}


$(document).ready(drawMyImage("1.png", "canvas1"));
$(document).ready(drawMyImage("4.png", "canvas2"));

$("canvas").click(function(){
	var thisCanvasID = $(this)[0].id;
	var thisColorMap = createColorMap(thisCanvasID);
	var $thisColorDiv = $(this).parent().next(".color_container");
	fillColorDiv(thisColorMap, $thisColorDiv);
});

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
