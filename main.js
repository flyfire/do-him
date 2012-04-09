
var WIDTH = WIDTH||800,
    HEIGHT = HEIGHT||500;


;(function(scope,undefined){

var DH=scope.DH;




var FPS=30;



var game=scope.game=new DH.Game({

	width : WIDTH ,
	
	height : HEIGHT ,
	
	FPS : FPS,

	shadowEnabled : true ,

	container : "Stage" ,
	
	resList : [
		{ id : "player" , url : "./res/person.png" },
		{ id : "flower" , url : "./res/flower.png" },
		{ id : "milk" , url : "./res/milk.png" },
		{ id : "tiles" , url : "./res/tiles.png" }
	],


	entityInfo : {},

	beforeLoad :function(){

	},
	
	onLoading : function(loadedCount,totalCount){

	},

	onLoad : function(){

		game.userName=game.inputName();

		this.initWebSocket();


		var autostart=true;

		if (autostart){
			this.start();
			return;
		}

		// new Dialog("Start",{
		// 	width : 400 ,
		// 	height : 400
		// });
	
	},

	ws : null,

	inputName : function(){
		var name=prompt("设置昵称(最多8字符,不设定直接点确定) : ");
		name=name||"Name";
		name=name.substring(0,8);
		return name;
	},
	initWebSocket : function(){
		if (window["WebSocket"]) {

		    var host=this.host||document.location.hostname||"localhost";
		    
		    var port=this.port||8008;

		    var conn = new WebSocket("ws://"+host+":"+ port +"/");

		    conn.onmessage = function(evt) {
		    	try{
			    	var info=JSON.parse(evt.data);
			    	var cmd=info[0];
			    	if (cmd==DH.CONST.CMD.login){
			    		game.currentStage.player.id=info[1];
			    		game.currentStage.player.serverReady=true;
			    		// console.log("info"+info)
			    	}else if(cmd==DH.CONST.CMD.sync){
			    		 // console.log(evt.data);
			    		game.currentStage.player.syncInfo(info);
			    	}
			    }catch(e){
			    	console.log(evt.data)
			    }
		     
		      // var data=JSON.parse(evt.data);
		    };

		    conn.onclose = function() {
		    	if (game && game.currentStage && game.currentStage.player){
		    		game.currentStage.player.name=null;
		    	}
		      console.log("** you have been disconnected");
		    };

		    conn.onopen = function(){
		     var name=game.userName;
		      conn.send( JSON.stringify([
		      		DH.CONST.CMD.login,
		      		0,
		      		name||"Name"

		      	] ) );
		    }
		     conn.onerror = function(){
		      console.log("** you have error");
		    }
		    this.ws=conn;
		    // conn.close();
		    // if(conn && conn.readyState == 1){
		    // 
		    // }
		}

	},
	onInit : function(){
		
		this.doNumBar=$$('.cur-score em');
		this.beDidNumBar=$$('.hi-score em');
		this.playerNumBar=$$(".player-num em");
		this.powerBar=$id("power-bar");

		this.context.fillStyle="#1155ff";
		this.context.font="20px arial";
		

		DH.initEvent();



	},

	handleInput : function(deltaTime){
		var pause=DH.KeyState[DH.Key.P];

		if (pause){
			this.keyDownTime=this.keyDownTime||0;

			if ( (this.timer.currentTime- this.keyDownTime) > 200){
				this.pausing=!this.pausing;
				
			}
			this.keyDownTime=this.timer.currentTime;
		}else{
			this.keyDownTime=0;
		}
		if (this.pausing){
			if (!this.stopgame){
				this.pausemenu=new Dialog('Pause', {
					width : 300,
					height : 'auto'
				});
			}
		}else{
			this.pausemenu=null;
		}
	},

	gameover : function(){	
		this.pausing=true;
		this.stopgame=true;
		new Dialog('GameOver', {
			width : 300,
			height : 'auto'
		});
	},

	sendPersonInfo : function(infoStr){
		if (this.ws && this.ws.readyState==1){

			this.ws.send(infoStr);
		}

	},

clear : function(){

	this.context.clearRect(0,0,this.width,this.height);


},

	getStageInstance : function(idx){
		return new DH.Stage({

			onInit : function(game){
	
				
			},

			beforeRun : function(){
				this.game.stopgame=false;
				$css($$('.player-num'), 'display', 'block');
				$css($$('.cur-score'), 'display', 'block');
				$css($$('.hi-score'), 'display', 'block');

				this.createEntity();
			},

			createEntity : function(){
				this.map=new Map({
					x : 0,
					y : 0,
					game : this.game ,
					img : this.game.getRes("tiles")
				});

				this.player=new Person({
					id : DH.ID_SEED,
					x : 0,
					y : 0,
					img : this.game.getRes("player")

				});
		

				this.map.player=this.player;
				this.map.init();

				this.player.map=this.map;
				this.player.init();

				this.personShare=new PersonShare({
					img : this.player.img,
					baseX : this.player.baseX,
					baseY : this.player.baseY,
					imgWidth : this.player.imgWidth ,
					imgHeight : this.player.imgHeight ,
					weaponImgWidth : this.player.weaponImgWidth ,
					weaponImgHeight : this.player.weaponImgHeight ,
					map : this.map 
				});	

				this.flowerImg=this.game.getRes("flower");
				this.milkImg=this.game.getRes("milk");
				this.itemList=[];

				this.flower=new Flower({
					x : this.game.width/2,
					y : this.game.height/2,
					img : this.flowerImg
				});
				this.flower.init();

				this.milk=new Milk({
					x : this.game.width/2,
					y : this.game.height/2,
					img : this.milkImg
				});
				this.milk.init();

				this.itemList.push(this.flower);
				this.itemList.push(this.milk);

			},


			update : function(deltaTime){
					
				this.player.update(deltaTime);
				this.map.update(deltaTime);

				if (this.player.doing){
					this.player.doing=false;
					this.milk.reset();
				}
				if (this.player.diding){
					this.player.doing=false;
					this.flower.reset();
				}
				for (var i=this.itemList.length-1;i>=0;i--){
					var f=this.itemList[i];
					f.update(deltaTime);
					// if (f.alpha==0){
					// 	f.img=null;
					// 	this.itemList.splice(i,1);
					// }
				}
				
			},

			drawBG : function(context){

				// context.fillStyle="red";
				// context.fillRect(0,0,this.game.width,this.game.height);
				
				this.map.render( context );

				this.player.renderWeapon(context);

				var share=this.personShare;

				// if (!window.taskAdded){
				// 	window.taskAdded=true;
				// 	this.game.timer.addTask(function(){
				// 			console.log(123)
				// 			window.taskAdded=false;
				// 		},1000)
				// }
				var Me=this;
				// this.game.timer.addTask(function(){
				// 		Me.showMilk=true;
				// 		},1000);
						
				for (var i=this.player.enemyList.length-1;i>=0;i--){
					var p=this.player.enemyList[i];
					if (p[5]==2){

					}else{
						share.id=p[0];
						share.name=p[1];
						share.x=p[2];
						share.y=p[3];
						share.rotation=p[4];
						share.state=p[5];						
					}				

					share.render( context );

				}


			},

			render : function(deltaTime){
				
				var map=this.map;

				var context=this.game.context;
				
				
				context.save();

				this.player.drawViewPath(context,this.map.x,this.map.y);

				context.clip();
				
				this.drawBG(context);	

				context.stroke();			

				context.restore();

				this.player.render( context );
				for (var i=this.itemList.length-1;i>=0;i--){
					var f=this.itemList[i];
					f.render(context,this.map.x,this.map.y);
				}



				this.game.doNumBar.innerHTML=this.player.doNum;
				this.game.beDidNumBar.innerHTML=this.player.beDidNum;
				this.game.playerNumBar.innerHTML=this.player.playerNum;

				var power=this.player.power;

				var color=this.player.state==1?"red":(power==100?"blue":"green");
				this.game.powerBar.style.backgroundColor=color;
				this.game.powerBar.style.height=power+"px";
			},

			handleInput : function(deltaTime){

				

				var rotationD=null;

				var changed=false;
				var walk=false;

				if (joystick.moveDistance>=10){
					
					walk=true;

					rotationD=joystick.rotation;

					changed=true;

				}else{

					var up=DH.KeyState[DH.Key.W]||DH.KeyState[DH.Key.UP];
					var down=DH.KeyState[DH.Key.S]||DH.KeyState[DH.Key.DOWN];
					var left=DH.KeyState[DH.Key.A]||DH.KeyState[DH.Key.LEFT];
					var right=DH.KeyState[DH.Key.D]||DH.KeyState[DH.Key.RIGHT];
					

					var speedY=0,speedX=0;
					if (up && !down){
						speedY=-1;
					}else if (down && !up){
						speedY=1;	
					}else{
						speedY=0;	
					}			

					if (left && !right){
						speedX=-1;
					}else if (right && !left){
						speedX=1;
					}else{
						speedX=0;	
					}

					if (speedX||speedY){
						walk=true;

						dx=speedX;
						dy=speedY;

						var rad=Math.atan2(dy, dx);	
						rotationD=rad*DH.CONST.RAD_TO_DEG;
						
						changed=true;
					}
					
				}

				if (!this.player.want2Rage ){
					var rage=!!DH.KeyState[DH.Key.J];
					this.player.want2Rage=rage;
				}

				this.player.walk=walk;
				if (changed){
					this.player.setRotationD(rotationD);
				}

				if (this.player.serverReady){
					var infoStr=[
							DH.CONST.CMD.update,
							this.player.id,
							rotationD,
							walk,
							this.player.want2Rage 
						];
					this.game.sendPersonInfo( JSON.stringify(infoStr) );
					this.player.want2Rage=false;
					return;
				}	

				
				if (this.player.want2Rage){
					this.player.rage();
					this.player.want2Rage=false;
				}
			



			}
		});
	}


});


function playGame(){
	//DH.$id("container").innerHTML="";	
	game.load();

	info=$id("info");
	initJoystick();

	initToucher();
};

DH.addEvent(window,"load" ,function(){

	playGame();
} );


})(this);


var stick1;
var info;

var soltRadius=60;
var stickRadius=40;
var stickX=70;
var stickY=HEIGHT-190;


function initJoystick(){



	var joystick=$$(".joystick");
	joystick.style.left=stickX+"px";
	joystick.style.top=stickY+"px";

	stick1=$id("stick1");

	var style=$id("slot1").style;
	var cfg={
		zIndex : 101,
		position : "absolute",
		left : 0+"px",
		top : 0+"px",
		width : soltRadius*2+"px",
		height : soltRadius*2+"px",
		borderRadius : soltRadius+"px"
	}
	for (var p in cfg){
		style[p]=cfg[p];
	}

	var style=stick1.style;
	var cfg={
		zIndex : 102,
		position : "absolute",
		left : soltRadius-stickRadius+"px",
		top : soltRadius-stickRadius+"px",
		width : stickRadius*2+"px",
		height : stickRadius*2+"px",
		borderRadius : stickRadius+"px"
	}
	for (var p in cfg){
		style[p]=cfg[p];
	}

	var stick2=$id("stick2");
	for (var p in cfg){
		stick2.style[p]=cfg[p];
	}
	stick2.style.left=(WIDTH-140)+"px";
	stick2.style.top=stickY+40+"px";

}

var button=new Toucher.Tap({
	isTrigger : function(touchWrapper,wrapperList,touchCoontroller){
		return touchWrapper.startTarget.id=="stick2";
	},
	onTap : function(touchWrappers,event,touchController){
		game.currentStage.player.want2Rage=true;
	}

});

var joystick=new Toucher.Joystick({

	maxRadius : soltRadius-10 ,

	isTrigger : function(touchWrapper,wrapperList,touchCoontroller){
		return touchWrapper.startTarget.id=="slot1"
				|| touchWrapper.startTarget.id=="stick1";
	},

	onMove : function(touchWrappers,event,touchController){
		var x=this.moveX.toFixed(2), 
			y=this.moveY.toFixed(2);
		var distance=this.moveDistance.toFixed(2),
			rotation=this.rotation.toFixed(2)

		setDomPos(stick1 , x , y);
		info.innerHTML=" ["+x+","+y+"],"+distance+","+rotation;
	},
	onEnd : function(touchWrappers,event,touchController){
		setDomPos(stick1 , 0 , 0);
		info.innerHTML=" ["+0+","+0+"]";
	}
});


var controller=new Toucher.Controller({
	beforeInit : function(){
		this.dom=document.body;
	},
	preventDefaultMove :true
});


function initToucher(){
	controller.init();
	controller.addListener(joystick);
	controller.addListener(button);
}

