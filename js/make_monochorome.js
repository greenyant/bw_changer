// JavaScript Document
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

function loadImage() {
	var origin_canvas=$("#origin_canvas")[0];
	var origin_ctx=origin_canvas.getContext("2d");
	var img = new Image();
	img.crossOrigin = "anonymous";
	img.onload = function() {
		var cw = processed_canvas.width = origin_canvas.width = img.width;
		var ch = processed_canvas.height = origin_canvas.height = img.height;
		origin_ctx.drawImage(img, 0,0);
		bw_process(125);
	};
	//img.src = "img/Sportscar.png";
	img.src = "https://dl.dropboxusercontent.com/u/139992952/multple/marioStanding.png";
}
$(document).ready(function(){
	loadImage();
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
