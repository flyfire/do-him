
;(function(scope,undefined){

	var DH=scope.DH=scope.DH||{};
	

	DH.getDoc = function(){ return window.document; };
	DH.getFragment = (function(){
		var fragment = DH.getDoc().createDocumentFragment();
		var div = DH.getDoc().createElement("div");
		
		DH.tryCssAttribute=function(style,attrList){
				var normalName=attrList[0];
				DH.css=DH.css||{};
				for(var i=0;i<attrList.length;i++){
					if (attrList[i] in style){
						DH.css[normalName]=attrList[i];
						break ;
					}
				}	
			};
		var s=div.style;
		DH.tryCssAttribute(s,["backgroundSize", "MozBackgroundSize", "webkitBackgroundSize","OBackgroundSize"]);
		DH.tryCssAttribute(s,["opacity", "MozOpacity", "webkitOpacity","OOpacity"]);
		DH.tryCssAttribute(s,["transform", "MozTransform", "webkitTransform", "OTransform"]);					
		
		fragment.appendChild(div);
		var fn= (function(_fragment){
					return function(){
						var div=null;
						if (_fragment){
							div=_fragment.firstChild;
						}
						return div;
					};
				})(fragment);
		fragment=null;
		return fn;
	})() ;
		
	DH.isMobile = function(){
		return "orientation" in window;
	}		
	DH.isMobile = function(){
		return "orientation" in window;
	}
	
	DH.merger(DH,{
		$id : function(id){
			return document.getElementById(id);
		},

		loadImages : function(srcList,callback,onloading){


			var imgs={};
			var totalCount=srcList.length;
			var loadedCount=0;
			var Me=this;
			var loadedList=[];

			for (var i=0;i<totalCount;i++){
				var img=srcList[i];
				var image=imgs[img.id]=new Image();		
				image.src=img.url;
				image.onload=function(event){
					loadedList.push( this );
				}		
			}
			
			function check(){
				if (loadedCount>=totalCount){

					if (typeof callback=="function"){
						setTimeout(function(){
							callback.apply(Me,[totalCount]);
						},100);	
					}
				}else{
					var _delay=0;
					var img=loadedList[loadedCount];
					if (img){
						loadedList[loadedCount]=null;				
						loadedCount++;
						if (typeof onloading=="function"){
							_delay=onloading.apply(Me,[ loadedCount,totalCount,img ]);
						}
					}
					setTimeout(check,_delay||10);
				}	
			}
			check();

			return imgs;
		},
		

		addEvent : (function(){
				if ( "addEventListener" in DH.getFragment() ){
					return function(dom, type, fn, useCapture){
							//if (type=="tap"){
							//	return DH.touchClick(dom,fn, useCapture);
							//}
							dom.addEventListener(type, fn, !!useCapture);
						};
				}
				return function(dom, type, fn, useCapture){
						//if (type=="tap"){
						//	return DH.touchClick(dom,fn, useCapture);
						//}
						type="on"+type;
						dom.attachEvent(type, fn);
						
					};	
			})(),
			
		stopEvent : function (event) {
			event.stopPropagation();
			event.preventDefault();
			if (event.stopImmediatePropagation){
				event.stopImmediatePropagation();
			}
			event.stopped=true;
		},			
		removeEvent : function(dom, type, fn, useCapture) {
			if (!fn || !dom || !type) {
				return false;
			}
			dom.removeEventListener(type, fn, !!useCapture);
		},

		KeyState : {},

		Key : {
			A : 65,	
			D : 68,	
			S : 83,	
			W : 87,
			P : 80,
			J : 74,
			LEFT : 37,
			UP : 38,
			RIGHT : 39,
			DOWN : 40,
			SPACE : 32 ,
			MOUSE_LEFT : 1,
			MOUSE_MID : 2,
			MOUSE_RIGHT : 3,			
			MOUSEDOWN : "MOUSEDOWN",
			TOUCH : "TOUCH"
		},

		initEvent : function (){

			var DH=this;
			
		
			DH.addEvent(document,"keydown",function(evt){
					DH.KeyState[evt.keyCode]=true;
				},true);
			DH.addEvent(document,"keyup",function(evt){
					DH.KeyState[evt.keyCode]=false;
				},true);

			DH.addEvent(document,"mousedown",function(evt){
				DH.KeyState[DH.Key.MOUSEDOWN]=true;
			},true);
			DH.addEvent(document,"mouseup",function(evt){
				DH.KeyState[DH.Key.MOUSEDOWN]=false;
			},true);			
	
			DH.addEvent(document,"touchstart",function(evt){
				DH.KeyState[DH.Key.TOUCH]=true;
			},true);
			DH.addEvent(document,"touchend",function(evt){
				DH.KeyState[DH.Key.TOUCH]=false;
			},true);

		}

	});

})(this);
