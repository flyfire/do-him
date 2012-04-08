

;(function(scope,undefined){

	var DH=scope.DH=scope.DH||{};
	
	DH.CONST={};

DH.CONST.DEG_TO_RAD=Math.PI/180;
DH.CONST.RAD_TO_DEG=180/Math.PI;
DH.CONST.DEG_90= 90*DH.CONST.DEG_TO_RAD;

DH.CONST.CMD={
	login : "in",
	leave : "l",
	sync : "s",
	update : "u",
	err : "e"
};

DH.CONST.STATE={
	normal : 0,
	raging : 1,
	dead : 2
};

	DH._TODO_=function(){};
	
	DH.alias=function(name){
		scope[name]=scope.DH;
		scope.DH=_DH;
	};

	DH.merger=function(so, po,override) {
		if (arguments.length<2 || po === undefined ) {
			po = so;
			so = {};
		}
		for ( var key in po) {
			if ( !(key in so) || override!==false ) {
				so[key] = po[key];
			}
		}
		return so;
	};
		

	
	DH.merger(DH,{

		newClass : function(protoT,superClass){
			var pCon=protoT.constructor;
			var con=(pCon&&pCon!=Object.prototype.constructor)?pCon:function(cfg){
									DH.merger(this, cfg);
								};
			if (superClass){
				con=DH.inherit(con,superClass,protoT);
			}else{
				con.prototype=protoT;
				con.constructor=con;
			}
			return con;
		},
		
		inherit : function(subClass, superClass, prot ) {
			var tmpConstructor = function() {};
			subClass=subClass||function() {};
			prot=prot||{};
			if (superClass){
				tmpConstructor.prototype = superClass.prototype;
				subClass.$SuperClass = superClass.prototype;
			}
			subClass.prototype = new tmpConstructor();
			DH.merger(subClass.prototype , prot);
			subClass.prototype.constructor = subClass;
			return subClass;
		},	


		ID_SEED : 1 ,
		genId : function (p){
			return (p||"")+"_"+(DH.ID_SEED++);
		},

		delegate : function(fun, _this){
			return function(){
				return fun.apply(_this,arguments);
			};
		},

		noop : function (){},


		genRandom : function(lower, higher) {
			lower = (lower||lower===0)?lower : 0;
			higher = (higher||higher===0)?higher : 9999;
			return Math.floor( (higher - lower + 1) * Math.random() ) + lower;
		},

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

	normalLine : function(line) {
		var p1=line[0], p2=line[1];

		var nx = p2[1] - p1[1];
		var ny = p1[0] - p2[0];

		var np=nx*p1[0]+ny*p1[1];
		
		return [nx, ny , np ];
	},

checkPolyCollide : function (poly1, poly2 ) {
	var len1 = poly1.length,
		len2 = poly2.length;

	var p,q,v;

	var second=false;
	do{
		p=poly1[len1 - 1];
		var px = p[0];
		var py = p[1];
		for (var i = 0; i < len1; i++) {
			q=poly1[i];
			var qx = q[0];
			var qy = q[1];
			var nx = qy - py;
			var ny = px - qx;


			var NdotP = nx * px + ny * py;
			var allOutside = true;
			for (var j = 0; j < len2; j++) {
				v=poly2[j];
				var vx = v[0];
				var vy = v[1];
				var det = nx * vx + ny * vy - NdotP;
				if (det<0) {
					allOutside = false;
					break;
				}
			}

			if (allOutside){
				return false;
			}

			px = qx;
			py = qy;
		}
		if (len2<2){
			return true;
		}
		if (second){
			break;
		}
		second=true;

		len1=len1^len2;
		len2=len1^len2;
		len1=len1^len2;
		var _t=poly1;
		poly1=poly2;
		poly2=_t;
	}while(true);

	return true;
}

	});


	Date.now=Date.now||function(){ return new Date().getTime(); } ;
		
	Array.prototype.removeAt = function(idx) {
		return this.splice(idx, 1);
	};
	Array.prototype.removeItem = function(obj) {
		var idx = this.indexOf(obj);
		if (idx >= 0) {
			return this.removeAt(idx);
		}
		return false;
	};

	module.exports = DH;


})(this);


