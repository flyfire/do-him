var GameUtil ={

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

