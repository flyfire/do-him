

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
		
		context.save();

		var x=this.x-this.map.x;
		var y=this.y-this.map.y;

		context.translate( x , y );
		context.rotate( this.rotation*DH.CONST.DEG_TO_RAD );

		context.translate( -this.baseX , -this.baseY );

		this.renderWeapon(context);

		var idx=0;
		if (this.walk){
			this._frameDisplayed++;
			idx=Math.floor( (this._frameDisplayed/5) % 4);
		}

		
		var xy=this.anim[ idx  ];
		console.log(xy)
		context.drawImage(this.img, xy[0],xy[1], this.imgWidth ,this.imgHeight,
						0,0,this.imgWidth ,this.imgHeight);
				
	
		context.restore();


		drawPoly(context,this.bodyBox,this.map.x,this.map.y);
		context.strokeStyle="red";
		drawPoly(context,this.bodyLine,this.map.x,this.map.y);
		drawPoly(context,this.weaponBox,this.map.x,this.map.y);
		context.strokeStyle="black";

		var x=this.AABB[0]-this.map.x;
		var y=this.AABB[1]-this.map.y;
		var w=this.AABB[2]-this.AABB[0];
		var h=this.AABB[3]-this.AABB[1];
		context.strokeRect(x,y,w,h);

		
		this.renderName(context);

		// this.power
		context.fillStyle=this.state==1?"red":(this.power==100?"blue":"green");
		context.fillRect(500,50, this.power, 10);
	},

	renderName : function(context){
		context.fillText(this.name,this.x-this.map.x-20,this.y-this.map.y-30);
	},

	renderWeapon : function(context){

		if (this.state==1){
			var ox=35, oy=33;
			context.translate( ox , oy );
			context.drawImage(this.img, 0, this.imgHeight, this.weaponImgWidth , this.weaponImgHeight,
						0,0,this.weaponImgWidth , this.weaponImgHeight );
			context.translate( -ox , -oy );
		}

	}
};

	for (var p in proto){
		Person.prototype[p]=proto[p];
	}

})();


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

		this.renderWeapon(context);


		context.drawImage(this.img, 0,0, this.imgWidth ,this.imgHeight,
						0,0,this.imgWidth ,this.imgHeight);
				

		context.restore();

		this.renderName(context);

	},

	renderWeapon : Person.prototype.renderWeapon,
	renderName : Person.prototype.renderName

}
