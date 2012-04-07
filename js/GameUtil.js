
var GameUtil ={

	translatePoly : function(poly,x,y){
		var len=poly.length;
		for(var i = 0; i < len; i++){
			poly[i][0]+=x;
			poly[i][1]+=y;
		}
		return poly;
	},

	rotatePoly : function(poly,deg,cx,cy){
		var rad=deg*DH.CONST.DEG_TO_RAD;
		var cos=Math.cos(rad), sin=Math.sin(rad);
		cx=cx||0;
		cy=cy||0;
		var len=poly.length;
		for(var i = 0; i < len; i++){
			var p=poly[i];
			var px=p[0]-cx, py=p[1]-cy;
			var x= px*cos- py*sin;
			var y= px*sin+ py*cos;
			p[0]=x+cx;
			p[1]=y+cy;
		}
		return poly;
	},


		collideAABB : function(sprites, gridCol, gridSize) {	
			
			var grid = {};
		    for( var s = 0; s < sprites.length; s++ ) {
				var spriteA = sprites[s];
				spriteA.personList=[];

				var bb=spriteA.getAABB();
				var	colMin = Math.floor( bb[0]/gridSize ) ,
					rowMin = Math.floor( bb[1]/gridSize ) ,
					colMax = Math.floor( bb[2]/gridSize ) ,
					rowMax = Math.floor( bb[3]/gridSize ) ;
				
				var checked = {};
				var startIdx=rowMin*gridCol+colMin;
				for( var row = rowMin; row <= rowMax; row++ ) {

					var idx=startIdx;
					for( var col = colMin; col <= colMax; col++ ) {
						var group=grid[idx];
						if( !group ) {
							grid[idx] = [spriteA];
						}else {
							for( var c = 0, len=group.length; c<len; c++ ) {
								var spriteB=group[c];
								if( !checked[spriteB.id] 
									&& spriteA.inAABB(spriteB.x,spriteB.y)  ) {
									spriteA.personList.push([
											spriteB.id,
											spriteB.x,
											spriteB.y,
											spriteB.rotation,
											spriteB.state
										]);
									checked[spriteB.id] = true;
								}
							}
							group.push(spriteA);
						}
						idx++;
					}
					startIdx+=gridCol;
				}
			}
		}
};

