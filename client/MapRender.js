	
Map.prototype.img = null ;
Map.prototype.render = function(context){
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
	};