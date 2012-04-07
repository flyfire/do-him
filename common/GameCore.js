


var GameCore=function(cfg){	

	for (var property in cfg ){
		this[property]=cfg[property];
	}

};


GameCore.prototype={

	constructor : GameCore ,

	personList : null,
	personMap : null ,

	map : null,

	init : function(){
		this.personList=[];
		this.personMap={};
	},

	addPerson : function(cfg){
		var person=new Person(cfg);
		this.personList.push(person);
		this.personMap[cfg.id]=person;
	},
	removePerson : function(id){
		var person=this.personMap[id];
		if (person){
			for (var i=this.personList.length-1;i>=0;i--){
				var p=this.personList[i];
				if (p==person){
					this.personList.splice(i, 1);
					break;
				}
			}
			delete this.personMap[id]
		}
		return person;
	},

	setPersonMoveInfo : function(infoList){
		var id=infoList[0];
		var person=this.personMap[id];
		person.rotation=p[1];
		person.walk=p[2];
		var raging=p[3];
		if (raging==true && person.power==100 && person.state!=1){
			person.state=1;
		}
	},

	updateAllPerson : function(deltaTime){
		for (var i=this.personList.length-1;i>=0;i--){
			var p=this.personList[i];
			p.update(deltaTime);
		}
		this.checkAllPersonView();
		this.collideAllPerson();
	},
	collideAllPerson : function(){

	},

	syncAllPerson : function(deltaTime){
		for (var i=this.personList.length-1;i>=0;i--){
			var p=this.personList[i];
			
			// cmd , id, name, x,y,rotation, state, power,
			// 			 personList : id name x y rotation state 
		}
		
	},

	checkAllPersonView : function(){
		var gridSize=200;
		var gridCol=Math.ceil(this.map.width/gridSize);
		var sprites=this.personList;
		
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
	
	},


	extendMap : function(){

	},
	shrinkMap : function(){

	},

	getRandomPos : function(){

	},




};


