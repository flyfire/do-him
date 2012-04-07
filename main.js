
var WIDTH = 800,
    HEIGHT = 500;


;(function(scope,undefined){

var DH=scope.DH;

DH.CONST.DEG_TO_RAD=Math.PI/180;
DH.CONST.RAD_TO_DEG=180/Math.PI;
DH.CONST.DEG_90= 90*DH.CONST.DEG_TO_RAD;

DH.CONST.CMD={
	login : "in",
	leave : "l",
	info : "i",
	update : "u",
	err : "e"
};


var FPS=30;



var game=scope.game=new DH.Game({

	width : WIDTH ,
	
	height : HEIGHT ,
	
	FPS : FPS,

	shadowEnabled : true ,

	container : "Stage" ,
	
	resList : [
		{ id : "player" , url : "./res/person.png" },
		{ id : "tiles" , url : "./res/tiles.png" }
	],


	entityInfo : {},

	beforeLoad :function(){

	},
	
	onLoading : function(loadedCount,totalCount){

	},

	onLoad : function(){

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

	initWebSocket : function(){
		if (window["WebSocket"]) {

		    var host=this.host||document.location.hostname||"localhost";
		    
		    var port=this.port||88;

		    var conn = new WebSocket("ws://"+host+":"+ port +"/");

		    conn.onmessage = function(evt) {
		      console.log(evt.data);
		    };

		    conn.onclose = function() {
		      console.log("** you have been disconnected");
		    };

		    conn.onopen = function(){
		      console.log("** you have been connected");
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
		
		this.timeBar=$$('.time');
		this.curScoreBar=$$('.cur-score');
		this.hiScoreBar=$$('.hi-score');

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
		this.ws.send(infoStr);

	},

	getStageInstance : function(idx){
		return new DH.Stage({

			onInit : function(game){
	
				
			},

			// personList : [],
			// enemyCache : [],

			beforeRun : function(){
				this.game.stopgame=false;
				$css($$('.time'), 'display', 'block');
				$css($$('.cur-score'), 'display', 'block');
				$css($$('.hi-score'), 'display', 'block');

				this.personList=[];
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
					x : 100,
					y : 100,
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
			},


			update : function(deltaTime){
					
				this.player.update(deltaTime);
				this.map.update(deltaTime);
			},

			drawBG : function(context){

				// context.fillStyle="red";
				// context.fillRect(0,0,this.game.width,this.game.height);
				
				this.map.render( context );

				this.personList=[
					[12,"npc_1",300,300,90,true]
				];
				var share=this.personShare;
				for (var i=this.personList.length-1;i>=0;i--){
					var p=this.personList[i];

					share.id=p[0];
					share.name=p[1];
					share.x=p[2];
					share.y=p[3];
					share.rotation=p[4];
					share.state=p[5];

					

					share.render( context );

				}

			},

			render : function(deltaTime){
				
				var map=this.map;

				var context=this.game.context;
				
				context.clearRect(0,0,this.game.width,this.game.height);


				context.save();

				this.player.view.drawPath(context,this.map.x,this.map.y);

				// context.clip();
				
				this.drawBG(context);	

				context.stroke();			

				context.restore();

				this.player.render( context );
			},

			handleInput : function(deltaTime){

				this.player.walk=false;

				var rotation=null;

				var changed=false;

				if (joystick.moveDistance>=10){
					
					this.player.walk=true;

					rotation=joystick.rotation;

					changed=true;

				}else{

					var up=DH.KeyState[DH.Key.W]||DH.KeyState[DH.Key.UP];
					var down=DH.KeyState[DH.Key.S]||DH.KeyState[DH.Key.DOWN];
					var left=DH.KeyState[DH.Key.A]||DH.KeyState[DH.Key.LEFT];
					var right=DH.KeyState[DH.Key.D]||DH.KeyState[DH.Key.RIGHT];
					var rage=!!DH.KeyState[DH.Key.J];

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
						this.player.walk=true;

						dx=speedX;
						dy=speedY;

						var rad=Math.atan2(dy, dx);	
						rotation=rad*DH.CONST.RAD_TO_DEG;
						
						changed=true;
					}
					this.player.want2Rage=rage;

				}

				var infoStr="["+
						'"'+DH.CONST.CMD.info+'",'+
						 this.player.id +","+ 
						 rotation +","+ 
						 this.player.walk+","+ 
						 this.player.want2Rage 
						 +"]";
				this.game.sendPersonInfo( infoStr );

				if (this.player.want2Rage){
					this.player.rage();
					this.player.want2Rage=false;
				}
				if (changed){
					this.player.setRotation(rotation);
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
var stickX=60;
var stickY=HEIGHT-180;


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

