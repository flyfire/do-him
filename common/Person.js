
var util = util||require('util');
var DH = DH||require('./Base');

module.exports=Person;


function Person(cfg){	

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
	baseY : 45,
	walk : false ,

	bodyBox : null,
	AABB : null,

	// view : null ,

	state : 0 ,  // 0 : normal , 1 : raging , 2 : dead 
	want2Rage : false ,

	power : 100 ,
	powerSpeed : 0.4,

	doNum : 0,
	beDidNum : 0 ,

	init : function(){

		var length=250;
		var width=250;
		var minWidth=40;
		this.viewPoly=[
			[this.x,this.y-minWidth/2],
			[this.x+length,this.y-minWidth/2-width/2],
			[this.x+length,this.y+minWidth/2+width/2],
			[this.x,this.y+minWidth/2]
		]

		var x=this.x-18;
		var y=this.y-24;
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
		var w=48;
		var h=21;

		this.weaponBox=[
			[ x,y],
			[ x+w,y],
			[ x+w,y+h],
			[ x,y+h]
		];

		this.bodyLine=[];

		this.AABB=[];

		this.updateAABB();

	},

	setPos : function(){

	},
	setRotation : function(rotation){
		this.rotationD=rotation;

	},
	rage : function(){
		if (this.power==100 && this.state==0){
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
		}else if(this.state==0){
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

			DH.translatePoly(this.viewPoly,speedX,speedY);
			DH.translatePoly(this.bodyBox,speedX,speedY);
			DH.translatePoly(this.weaponBox,speedX,speedY);
		}

		if (deltaR){
			changed=true;
			DH.rotatePoly(this.viewPoly,deltaR,this.x,this.y);
			DH.rotatePoly(this.bodyBox,deltaR,this.x,this.y);
			DH.rotatePoly(this.weaponBox,deltaR,this.x,this.y);

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

	collideOther : function(sprite){

		if (this.state!=1 || sprite.state==2 ){
			return false;
		}

		var normal=DH.normalLine(this.bodyLine);
		var nx=normal[0],ny=normal[1],np=normal[2];

		var p1=sprite.bodyLine[0], p2=sprite.bodyLine[1];
		if (nx*p1[0]+ny*p1[1]-np >= 0 && nx*p2[0]+ny*p2[1]-np >=0){
			var rs= DH.checkPolyCollide(this.weaponBox ,sprite.bodyLine );
			if (rs){
				sprite.state=2;
				this.doNum++;
				sprite.beDidNum++;
			}
			return rs;
		}

		return false;
	},


	updateAABB : function(){

		var poly=this.viewPoly;

		var minX=Math.min( poly[0][0],poly[1][0],poly[2][0],poly[3][0]);
		var maxX=Math.max( poly[0][0],poly[1][0],poly[2][0],poly[3][0]);

		var minY=Math.min( poly[0][1],poly[1][1],poly[2][1],poly[3][1]);
		var maxY=Math.max( poly[0][1],poly[1][1],poly[2][1],poly[3][1]);

		var aabb=this.AABB;

		var ext=80;

		aabb[0]=minX-ext;
		aabb[1]=minY-ext;
		aabb[2]=maxX+ext;
		aabb[3]=maxY+ext;

		this.bodyLine[0]=this.bodyBox[1];
		this.bodyLine[1]=this.bodyBox[2];
			

	}

}



