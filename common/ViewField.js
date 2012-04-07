var ViewField=function(cfg){	

	for (var property in cfg ){
		this[property]=cfg[property];
	}

};


ViewField.prototype={

	constructor : ViewField ,

	person : null ,
	poly : null,

	init : function(){
		var cx=this.person.x;
		var cy=this.person.y;

		var length=250;
		var width=250;

		this.poly=[
			[cx,cy],
			[cx+length,cy-width/2],
			[cx+length,cy+width/2]
		]
	},

	move : function(x,y){
		var poly=this.poly;

		var len=poly.length;
		for(var i = 0; i < len; i++){
			var p=poly[i];
			p[0]=p[0]+x;
			p[1]=p[1]+y;
		}	
	},

	rotate : function(dr){
	
		var poly=this.poly;
		var cx=poly[0][0],
			cy=poly[0][1];
		DH.rotatePoly(poly,dr,cx,cy);

	}


}