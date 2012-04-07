

var require=function(){};
var module={};
var exports={};
var util=console;

function drawPoly(context,poly,ox,oy){
	ox=ox||0;
	oy=oy||0;
	context.beginPath();
	context.moveTo( poly[0][0]-ox ,poly[0][1]-oy );
	for (var i=1,len=poly.length;i<len;i++){
		context.lineTo( poly[i][0]-ox ,poly[i][1]-oy );
	}
	context.lineTo( poly[0][0]-ox ,poly[0][1]-oy );
	context.closePath();

	context.stroke();

	// context.strokeStyle=bak;	
}


function setDomPos(dom,x,y){
	dom.style.webkitTransform="translate3d("+ x+"px,"+y+"px,0px)";
}

function $id(id){
	return document.getElementById(id);
}




