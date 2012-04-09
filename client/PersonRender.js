

;(function(){


var proto={

	img : null ,
	imgWidth : 60 ,
	imgHeight : 90 ,
	weaponImgWidth : 56 ,
	weaponImgHeight : 26 ,

	anim : [
		[0,0],
		[60,0],
		[0,0],
		[120,0]		
	],
	_frameDisplayed : 0,
	render : function(context){
		
		

		var x=this.x-this.map.x;
		var y=this.y-this.map.y;

		context.save();

		context.translate( x , y );
		context.rotate( this.rotation*DH.CONST.DEG_TO_RAD );

		context.translate( -this.baseX , -this.baseY );

		// this.renderWeapon(context);

		var idx=0;
		if (this.walk){
			this._frameDisplayed++;
			idx=Math.floor( (this._frameDisplayed/5) % 4);
		}

		
		var xy=this.anim[ idx  ];
		context.drawImage(this.img, xy[0],xy[1], this.imgWidth ,this.imgHeight,
						0,0,this.imgWidth ,this.imgHeight);
				
	
		context.restore();


		// drawPoly(context,this.bodyBox,this.map.x,this.map.y);
		// context.strokeStyle="red";
		// drawPoly(context,this.bodyLine,this.map.x,this.map.y);
		// drawPoly(context,this.weaponBox,this.map.x,this.map.y);
		// context.strokeStyle="black";

		// var x=this.AABB[0]-this.map.x;
		// var y=this.AABB[1]-this.map.y;
		// var w=this.AABB[2]-this.AABB[0];
		// var h=this.AABB[3]-this.AABB[1];
		// context.strokeRect(x,y,w,h);

		
		this.renderName(context);

	
	},
	
	drawViewPath : function(context,ox,oy){

		var poly=this.viewPoly;
		context.beginPath();

		context.moveTo( poly[0][0]-ox ,poly[0][1]-oy );
		context.lineTo( poly[1][0]-ox ,poly[1][1]-oy );
		context.lineTo( poly[2][0]-ox ,poly[2][1]-oy );
		context.lineTo( poly[3][0]-ox ,poly[3][1]-oy );
		context.lineTo( poly[0][0]-ox ,poly[0][1]-oy );

		context.closePath();	

	},
	renderName : function(context){
		var name=this.name;
		if (name==null || name=="null"){
			name="not connected server"
		}
		context.fillText(name,this.x-this.map.x-20,this.y-this.map.y-30);
	},


	renderWeapon : function(context){

		if (this.state==1){

			var x=this.x-this.map.x;
			var y=this.y-this.map.y;

			context.save();

			context.translate( x , y );
			context.rotate( this.rotation*DH.CONST.DEG_TO_RAD );

			context.translate( -this.baseX , -this.baseY );

		
			var ox=35, oy=34;
			context.translate( ox , oy );
			context.drawImage(this.img, 0, this.imgHeight, this.weaponImgWidth , this.weaponImgHeight,
						0,0,this.weaponImgWidth , this.weaponImgHeight );
			context.translate( -ox , -oy );

			context.restore();
		}

	}
};

	for (var p in proto){
		Person.prototype[p]=proto[p];
	}

})();

var Flower = function(cfg){	

	for (var property in cfg ){
		this[property]=cfg[property];
	}

};

Flower.prototype={

	constructor : Flower ,
	x : 0,
	y : 0,
	alpha : 1 ,
	scale : 0.1 ,

	img : null,


	init : function(){
		this.baseX=this.img.width/2;
		this.baseY=this.img.height/2;
	},

	reset : function(){
		this.enabled=true;
		this.alpha=1;
		this.scale=0.1;
	},

	update : function(deltaTime){
		if (!this.enabled){
			return;
		}
		this.alpha-=deltaTime*0.0004;
		this.scale+=deltaTime*0.003;
		this.alpha=Math.max(0,this.alpha);

		if (this.alpha==0){
			this.enabled=false;
			this.onEnd();
		}

	},
	onEnd : function(){},
	render : function(context){
		if (!this.enabled){
			return;
		}
		var x=this.x;
		var y=this.y;
		var alpha=this.alpha;
		var scale=this.scale;
		context.globalAlpha=alpha;
		context.save();
		context.translate(x,y);
		context.scale(scale,scale);
		context.drawImage(this.img,-this.baseX,-this.baseY);
		context.restore();
		context.globalAlpha=1;
	}
}


var Milk = function(cfg){	

	for (var property in cfg ){
		this[property]=cfg[property];
	}

};

Milk.prototype={

	constructor : Milk ,
	x : 0,
	y : 0,
	alpha : 1 ,
	scale : 0.1 ,

	img : null,

	init : function(){
		this.baseX=this.img.width/2;
		this.baseY=this.img.height/2;
	},

	reset : function(){
		this.enabled=true;
		this.alpha=1;
		this.scale=0.1;
	},

	update : function(deltaTime){
		if (!this.enabled){
			return;
		}
		this.scale+=deltaTime*0.01;
		this.scale=Math.min(1,this.scale);
	
		if (this.scale==1){
			this.alpha-=deltaTime*0.0004;
		}
		this.alpha=Math.max(0,this.alpha);

		if (this.alpha==0){
			this.enabled=false;
			this.onEnd();
		}

	},
	onEnd : function(){},

	render : Flower.prototype.render
}

var PersonShare=function(cfg){	

	for (var property in cfg ){
		this[property]=cfg[property];
	}

};

PersonShare.prototype={

	constructor : PersonShare ,
	id : null ,
	x : 0,
	y : 0,
	rotation : 0,
	state : 0 ,


	img : null,
	baseX : 0,
	baseY : 0,

	imgWidth : 48 ,
	imgHeight : 80 ,

	weaponImgWidth : 56 ,
	weaponImgHeight : 24 ,



	render : function(context){
		
		context.save();

		var x=this.x-this.map.x;
		var y=this.y-this.map.y;

		context.translate( x , y );
		context.rotate( this.rotation*DH.CONST.DEG_TO_RAD );

		context.translate( -this.baseX , -this.baseY );

		if (this.state==1){
			var ox=35, oy=34;
			context.translate( ox , oy );
			context.drawImage(this.img, 0, this.imgHeight, this.weaponImgWidth , this.weaponImgHeight,
						0,0,this.weaponImgWidth , this.weaponImgHeight );
			context.translate( -ox , -oy );
		}

		context.drawImage(this.img, 0,0, this.imgWidth ,this.imgHeight,
						0,0,this.imgWidth ,this.imgHeight);
				

		context.restore();

		this.renderName(context);

	},

	renderName : Person.prototype.renderName

}
