// JavaScript Document


//var ctx;
function bw_process(th){
	var origin_canvas=$("#origin_canvas")[0];
	var origin_ctx=origin_canvas.getContext("2d");
	var processed_canvas=$("#processed_canvas")[0];
	var processed_ctx=processed_canvas.getContext("2d");
	
	var cw = processed_canvas.width = origin_canvas.width;
	var ch = processed_canvas.height = origin_canvas.height;
	
	origin_imgData=origin_ctx.getImageData(0,0,cw,ch);
	origin_data=origin_imgData.data;
	processed_imgData=processed_ctx.getImageData(0,0,cw,ch);
	processed_data=processed_imgData.data;
	
	for(var i=0;i<processed_data.length;i+=4){
		red=origin_data[i+0];
		green=origin_data[i+1];
		blue=origin_data[i+2];
		alpha=origin_data[i+3];
		if((red+green+blue)/3 >= th || alpha <= th){
			processed_data[i+0]=255;
			processed_data[i+1]=255;
			processed_data[i+2]=255;
			processed_data[i+3]=255;
			
		} else {
			processed_data[i+0]=0;
			processed_data[i+1]=0;
			processed_data[i+2]=0;
			processed_data[i+3]=255;
		}
	}
	//var encoder = new JPEGEncoder();
	processed_ctx.putImageData(processed_imgData,0,0);
}

function loadImage(file) {
	var origin_canvas=$("#origin_canvas")[0];
	var origin_ctx=origin_canvas.getContext("2d");
	var reader = new FileReader();
	reader.readAsDataURL(file);
	reader.onload = function(e) {
		var img = new Image();
		img.onload = function() {
			var cw = processed_canvas.width = origin_canvas.width = img.width;
			var ch = processed_canvas.height = origin_canvas.height = img.height;
			origin_ctx.drawImage(img, 0,0);
			bw_process(125);
		};
		img.src = e.target.result;
	};
}

var upload_filename = '';
function handleFiles(e) {
    var files = e.target.files, file;
	//test_dat = files;
	if (files && files.length > 0) {
		file = files[0];
		upload_filename = file.name;
		loadImage(file);
	}
}
$(document).on("change","#input",handleFiles);

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
function compress_bitstr(bitstr){
	var encode_num = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
	var cbs = ""; //compressed bit string
	var pre_index = 0, index = 0, next_index = -1;
	var spled_str = bitstr.split('\n').join('');
	
	cbs += String(bitstr.indexOf("\n"));
	
	//if(bitstr(index) == "0"){cbs += "f";} else {cbs += "t";} 
	//cbs += bitstr(index) == "0" ? "f" : "t";
	while(index != -1){
	//for(var j=0;j<10;j++){
		pre_index = index;
		if(spled_str[index] == "0"){
			cbs += "<";
			next_index = spled_str.indexOf('1', index+1);
		} else if(spled_str[index] == "1") {
			cbs += ">";
			next_index = spled_str.indexOf('0', index+1);
		}
		if(next_index != -1) {
			num_of_letter = next_index - pre_index;
		} else {
			num_of_letter = spled_str.length - pre_index - 1;
		}
		if(num_of_letter > 4096){
			next_index = pre_index + 4096;
			num_of_letter = 4096;
		}
		if((num_of_letter-1)>>6 == 0){
			cbs += encode_num[(num_of_letter-1)%64];
		} else {
			cbs += encode_num[(num_of_letter-1)>>6]+encode_num[(num_of_letter-1)%64];
		}
		index = next_index;
	}
	return cbs;
}
var test_dat; 
$(document).on('click','#down_btn',function(){
	link = this;
	if(upload_filename != ''){
		//link.href = $("#processed_canvas")[0].toDataURL("image/png").replace("image/png", "image/bmp"); ;
		//link.href = drawArray($("#processed_canvas")[0].toDataURL("image/png"), 1);
		
		var processed_canvas=$("#processed_canvas")[0];
		var processed_ctx=processed_canvas.getContext("2d");
		
		processed_imgData=processed_ctx.getImageData(0,0,processed_canvas.width,processed_canvas.height);
		processed_data=processed_imgData.data;
		
		var minX = processed_canvas.width, minY = processed_canvas.height;
    
		bitstr = "";
		var pre_curY = 0;
		for(var i=0;i<processed_data.length;i+=4){
			var curX = (i / 4) % processed_canvas.width, curY = ((i / 4) - curX) / processed_canvas.width;
         	if(curY != pre_curY){
				bitstr += "\n";
				pre_curY = curY;
			}
			
			if(processed_data[i+0]==255) {
				bitstr += "0";
			} else {
				bitstr += "1";
			}
			
		}
		test_dat = bitstr;
		//console.log(compress_bitstr(bitstr));
		link.href = make_base64_from_bitstr(bitstr);
		link.download = "down.bmp";
	}
});
$(document).on('change','#in_thres', function(){
	//console.log($('#in_thres').val());
	$('#num_thres').val($('#in_thres').val());
	bw_process($('#in_thres').val());
});

$(document).on('change','#num_thres', function(){
	//console.log($('#in_thres').val());
	$('#in_thres').val($('#num_thres').val());
	bw_process($('#in_thres').val());
});
