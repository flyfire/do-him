


var GameCore=function(cfg){	

	for (var property in cfg ){
		this[property]=cfg[property];
	}

};


GameCore.prototype={

	constructor : GameCore ,

	personList : null,
	personMap : null ,
	personNameCache : null,

	map : null,
	game : null ,

	server : null ,
	init : function(game){
		this.personList=[];
		this.personMap={};
		this.personNameCache={};
		this.game=game;
	},

	addPerson : function(cfg){
		var person=new Person(cfg);
		this.personList.push(person);
		this.personMap[cfg.id]=person;
		this.personNameCache[cfg.name]=person;

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
			delete this.personMap[id];
			delete this.personNameCache[person.name];
		}
		return person;
	},

	checkName : function(name){
		var i=1;
		var oName=name;
		while( this.personNameCache[name] ){
			i++;
			name=oName+"_"+i;
		}
		return name;
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
			if (p.state==2){
				p.state=0;
				p.rotation=0;
				var pos=this.getRandomPos();
				p.x=pos[0];
				p.y=pos[1];
				p.power=100;
			}
		}
		this.checkAllPersonAABB();
		this.collideAllPerson();
		this.syncAllPerson();
	},

	collideAllPerson : function(){

		var sprites=this.personList;
	    for( var s = 0; s < sprites.length; s++ ) {
			var spriteA = sprites[s];
			var personList=spriteA.personList;

			for (var i=personList.length-1;i>=0;i--){
				var spriteB=personList[i];
				var rs=spriteA.collideOther(spriteB);
				personList[i]=[
						spriteB.id,
						spriteB.name,
						spriteB.x,
						spriteB.y,
						spriteB.rotation,
						spriteB.state
					];
			}
		}

	},


	syncAllPerson : function(deltaTime){
		for (var i=this.personList.length-1;i>=0;i--){
			var p=this.personList[i];
			
			if (this.server){
				var info=[
					DH.CONST.CMD.sync,
					p.id,
					p.name,
					p.x,
					p.y,
					p.rotation,
					p.state,
					p.power,
					p.doNum,
					p.beDidNum,
					p.personList
				];

				this.server.send(p.id , JSON.stringify(info) );
			}
		}
		
	},

	checkAllPersonAABB : function(){
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
								spriteA.personList.push(spriteB);

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
		return [
			DH.genRandom(5,this.map.width-5),
			DH.genRandom(5,this.map.height-5)
		]
	},




};


