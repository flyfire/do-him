
var Map=function(cfg){	

	for (var property in cfg ){
		this[property]=cfg[property];
	}

};


Map.prototype={

	constructor : Map ,

	x : 0,
	y : 0,

	img : null ,

	tileSize : 32 ,

	width : 2000,
	height : 2000,


	init : function(){
		this.viewWidth=this.game.width;
		this.viewHeight=this.game.height;

		this.tileCols=Math.ceil(this.viewWidth/this.tileSize)+2;
		this.tileRows=Math.ceil(this.viewHeight/this.tileSize)+2;
		this.player=this.game.currentStage.player;
	},

	update : function(deltaTime ){

		var x=this.player.x;
		var y=this.player.y;

		var left=x-this.x;
		var right=this.viewWidth-left;
		var top=y-this.y;
		var bottom=this.viewHeight-top;
		if ( right < 300){
			this.x=x-(this.viewWidth-300);
		}
		if ( left < 300){
			this.x=x-300;
		}
		if ( bottom < 200){
			this.y=y-(this.viewHeight-200);
		}
		if ( top < 200){
			this.y=y-200;
		}

		var maxX=this.width-this.viewWidth;
		var maxY=this.height-this.viewHeight;

		this.x=Math.max(0, Math.min(maxX, this.x));
		this.y=Math.max(0, Math.min(maxY, this.y));


	},
	render : function(context){
		var mapRows=this.tileRows;
		var mapCols=this.tileCols;
		var tileSize=this.tileSize;
		var offsetX=this.x%this.tileSize;
		var offsetY=this.y%this.tileSize;
		for (var r=0;r<mapRows;r++){
			for (var c=0;c<mapCols;c++){
				
				context.drawImage(this.img,0,0, tileSize,tileSize,
						c*tileSize-tileSize-offsetX,r*tileSize-tileSize-offsetY, 
						tileSize, tileSize);
			}	
		}
	}



}
