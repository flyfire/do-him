

ViewField.prototype.drawPath = function(context,ox,oy){

		var poly=this.poly;
		context.beginPath();

		context.moveTo( poly[0][0]-ox ,poly[0][1]-oy );
		context.lineTo( poly[1][0]-ox ,poly[1][1]-oy );
		context.lineTo( poly[2][0]-ox ,poly[2][1]-oy );
		context.lineTo( poly[0][0]-ox ,poly[0][1]-oy );

		context.closePath();	

	};