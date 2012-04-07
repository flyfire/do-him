
var Person=function(cfg){	

	for (var property in cfg ){
		this[property]=cfg[property];
	}

};

Person.prototype={

	constructor : Person ,

	id : null,
	name : null,
	x : 0,
	y : 0,
	
	rotation : 0,
	rotationD : 0,
	
	speed : 3,
	speedR : 6,

	baseX : 25,
	baseY : 40,
	walk : false ,

	bodyBox : null,
	AABB : null,

	view : null ,

	img : null ,

	state : 0 ,

	imgWidth : 48 ,
	imgHeight : 80 ,

	weaponImgWidth : 56 ,
	weaponImgHeight : 24 ,

	power : 100 ,
	powerSpeed : 0.4,


	init : function(){

		var x=this.x-18;
		var y=this.y-25;
		var w=15;
		var h=50;

		this.bodyBox=[
			[ x,y],
			[ x+w,y],
			[ x+w,y+h],
			[ x,y+h]
		];

		var x=this.x;
		var y=this.y-10;
		var w=64;
		var h=22;

		this.weaponBox=[
			[ x,y],
			[ x+w,y],
			[ x+w,y+h],
			[ x,y+h]
		];

		this.bodyLine=[];



		this.view=new ViewField({
			person : this
		});

		this.view.init();
		this.AABB=[];

		this.updateAABB();

	},

	setPos : function(){

	},
	setRotation : function(rotation){
		this.rotationD=rotation;

	},
	rage : function(){
		if (this.power==100 && this.state!=1){
			this.state=1;
		}
	},

	update : function(deltaTime ){

		if (this.state==1){
			this.power-=this.powerSpeed;
			if (this.power<=0){
				this.power=0;
				this.state=0;
			}


		}else{
			if (this.power<100){
				this.power+=this.powerSpeed;
			}else{
				this.power=100;
			}
		}

		if (!this.walk){
			return
		}

		var speedR=this.speedR*(this.state==1?1.8:1);
		var speed=this.speed*(this.state==1?1.8:1);

		this.rotation=(this.rotation+360)%360;
		this.rotationD=(this.rotationD+360)%360;

		var deltaR=0;
		var dr=this.rotationD-this.rotation;

		if (Math.abs(dr)<=speedR || Math.abs(dr)>=360-speedR){
			this.rotation=this.rotationD;
			deltaR=dr;
		}else{
			
			if (0<dr && dr<180){
				deltaR=speedR;
			}else if( 180<=dr && dr<360){
				deltaR=-speedR;
			}else if ( -180<dr && dr<0 ){
				deltaR=-speedR;
			}else if( -360<dr && dr<=-180){
				deltaR=speedR;
			}
			this.rotation+=deltaR;
		}

		var rad=this.rotationD*DH.CONST.DEG_TO_RAD;
		var speedX=speed*Math.cos(rad);
		var speedY=speed*Math.sin(rad);

		var changed=false;
		if (speedX ||speedY) {
			changed=true;
			this.lastX=this.x;
			this.lastY=this.y;
			this.x+=speedX;
			this.y+=speedY;

			if (this.x<-2){
				this.x=this.map.width-2;
				speedX=this.x-this.lastX;
			}else if (this.x>this.map.width+2){
				this.x=2;
				speedX=this.x-this.lastX;
			}
			if (this.y<-2){
				this.y=this.map.height-2;
				speedY=this.y-this.lastY;
			}else if (this.y>this.map.height+2){
				this.y=2;
				speedY=this.y-this.lastY;
			}

			this.view.move(speedX,speedY);
			GameUtil.translatePoly(this.bodyBox,speedX,speedY);
			GameUtil.translatePoly(this.weaponBox,speedX,speedY);
		}

		if (deltaR){
			changed=true;
			this.view.rotate(deltaR);		
			GameUtil.rotatePoly(this.bodyBox,deltaR,this.x,this.y);
			GameUtil.rotatePoly(this.weaponBox,deltaR,this.x,this.y);

		}

		if (changed){
			this.updateAABB();	
		}
		

	},

	getAABB : function(){
		return this.AABB;
	},

	inAABB : function(x,y){
		// var x=sprite.x , y=sprite.y;
		var aabb=this.AABB;
		return x>aabb[0] && y>aabb[1] && x<aabb[2] && y<aabb[3] ;
	},

	updateAABB : function(){

		var poly=this.view.poly;
		var minX=Math.min( poly[0][0],poly[1][0],poly[2][0]);
		var maxX=Math.max( poly[0][0],poly[1][0],poly[2][0]);

		var minY=Math.min( poly[0][1],poly[1][1],poly[2][1]);
		var maxY=Math.max( poly[0][1],poly[1][1],poly[2][1]);

		var aabb=this.AABB;

		var ext=80;

		aabb[0]=minX-ext;
		aabb[1]=minY-ext;
		aabb[2]=maxX+ext;
		aabb[3]=maxY+ext;

		this.bodyLine[0]=this.bodyBox[1];
		this.bodyLine[1]=this.bodyBox[2];
			

	},

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


		drawPoly(context,this.bodyBox,-this.map.x,-this.map.y);
		context.strokeStyle="red";
		drawPoly(context,this.bodyLine,-this.map.x,-this.map.y);
		drawPoly(context,this.weaponBox,-this.map.x,-this.map.y);
		context.strokeStyle="black";

		var x=this.AABB[0]-this.map.x;
		var y=this.AABB[1]-this.map.y;
		var w=this.AABB[2]-this.AABB[0];
		var h=this.AABB[3]-this.AABB[1];
		context.strokeRect(x,y,w,h);

		// this.power
		context.fillStyle=this.state==1?"red":(this.power==100?"blue":"green");
		context.fillRect(500,50, this.power, 10);
	},

	renderWeapon : function(context){

		if (this.state==1){
			var ox=35, oy=30;
			context.translate( ox , oy );
			context.drawImage(this.img, this.imgWidth,0, this.weaponImgWidth , this.weaponImgHeight,
						0,0,this.weaponImgWidth , this.weaponImgHeight );
			context.translate( -ox , -oy );
		}

	}

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
			var ox=35, oy=30;
			context.translate( ox , oy );
			context.drawImage(this.img, this.imgWidth,0, this.weaponImgWidth , this.weaponImgHeight,
						0,0,this.weaponImgWidth , this.weaponImgHeight );
			context.translate( -ox , -oy );
		}

		context.drawImage(this.img, 0,0, this.imgWidth ,this.imgHeight,
						0,0,this.imgWidth ,this.imgHeight);
				

		context.restore();

	}

}

exports.Person=Person;
exports.PersonShare=PersonShare;



