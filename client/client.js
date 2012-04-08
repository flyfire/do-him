

var require=function(){};
var module={};
var exports={};
var util=console;

var DH={}

	DH.pixelRatio=window.devicePixelRatio || 1 ; //DH.getDevicePixelRatio();
	
	DH.browser={};
	DH.os={};

	var ua= window.navigator.userAgent.toLowerCase();
	var match = /(webkit)[ \/]([\w.]+)/.exec( ua ) ||
			/(opera)(?:.*version)?[ \/]([\w.]+)/.exec( ua ) ||
			/(msie) ([\w.]+)/.exec( ua ) ||
			!/compatible/.test( ua ) && /(mozilla)(?:.*? rv:([\w.]+))?/.exec( ua ) || [];		
	
	
	DH.browser[ match[1] ]=true;
	DH.browser.air=!!window.air;
	
	DH.browser.mobile=ua.indexOf("mobile")>0; // || ua.indexOf("nova-embark")>0;

	
	DH.browser.viewport={
		width:window.innerWidth,
		height:window.innerHeight
	};
    DH.browser.screen={
		width:window.screen.availWidth*DH.pixelRatio, 
		height:window.screen.availHeight*DH.pixelRatio
		};
		
	DH.browser.iPhone=/iphone/.test(ua);
	DH.browser.iPad=/ipad/.test(ua);
	DH.browser.safari=DH.browser.iPhone|| DH.browser.iPad;
	
	DH.browser.iPhone4=DH.browser.iPhone && DH.pixelRatio==2;	
	DH.browser.iOS4= DH.browser.iOS && ua.indexOf("os 4")>0;


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




