var util = require("util");
var Timer = require("../common/Timer");
var GameCore = require("../common/GameCore");
var DH = DH||require('../common/Base');



var timer = null;
var gameCore = new GameCore();
//var timer = require("");

var game = {};
game.server = null;


game.init = function(server)
{
    game.server = server;
	game._sleep = Math.floor(1000/DH.CONST.FPS);
    gameCore.init(game);
    
		
}
game.start = function()
{
    timer = (new Timer()).start();
    game.run();
}

game.updatePersonMoveInfo = function(message)
{
    gameCore.updatePersonMoveInfo(message);
}
game.addPerson = function(cfg)
{
    gameCore.addPerson(cfg);
}

game.removePerson = function(id)
{
    gameCore.removePerson(id);

}
game.callRun = function()
{
	game.run();
}
game.update = function(deltaTime)
{
   // util.log("game update: " + deltaTime);
    gameCore.updateAllPerson(deltaTime);
    
    
}
	
game.run = function()
{

    game.mainLoop=setTimeout( game.callRun, game._sleep );
    timer.tick();
    var deltaTime= timer.deltaTime;
    
  //  util.log("game update: " + timer + deltaTime);
    if( deltaTime>1 )
    {
        
        timer.runTasks();
        game.update(deltaTime);
    }
}



exports.game = game;