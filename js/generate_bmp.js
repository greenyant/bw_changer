function make_base64_from_bitstr(bitstr){
	var rows = bitstr.split('\n');
	var height = rows.length;
	var width = 0;
	for (var i in rows) {
		if (rows[i].length > width) width = rows[i].length;
	}
	
	var bmp = new BmpFile(width, height, 1);
	bmp.palette = ColourTables.MonochromeColourTable;

	for (var y = 0; y < height; y++) {
		bmp.imageData[y] = [];
		for (var x = 0; x < width; x++) {
			bmp.imageData[y][x] = parseInt(rows[y].charAt(x));
		}
	}

	var bytes = bmp.bytes;
	var ret_dat =  "data:image/bmp,";
	for (var i = 0; i < bytes.byteLength; i++) {
		var byte = bytes.getUint8(i).toString(16);
		ret_dat += "%" + (byte.length == 1 ? "0" : "") + byte;
	}
	return ret_dat;
}

$(document).ready(function(){
	var oa = document.getElementById('outputarea');
	oa.value = make_base64_from_bitstr('111100101011110110\n111001101011101110');
	document.getElementById('outputimage').src = oa.value;
});

