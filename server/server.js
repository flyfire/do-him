
var util = require("util"),
    Server = require("./ws/Server"),
    game = require("./game").game;
var DH = require("../common/Base");
var time = 0;


var _port=process.argv[2]||8008;

var server = new Server({
  debug : !true,
  port : _port
});
server.start();
util.log("Server Started. port : "+server.port);


server.on('error', function (exc) {
    util.log("ignoring exception: " + exc);
});

server.on("connection", function(conn){
  util.log("Connection: "+conn.id+" ver:"+conn.version);

  var login=JSON.stringify([DH.CONST.CMD.login, conn.id]);

  server.send(conn.id, login );


  conn.on("message", function(message){
    var info;

    // try{
      info = JSON.parse(message);
    // }catch(e){
    //   var idx=message.lastIndexOf("[");
    //   var message2=message.substring(idx);
    //   try{
    //     info = JSON.parse(message2);
    //   }catch(e){
    //     util.log("message : "+message)
    //     return;
    //   }
    // }

      if(info[0] == DH.CONST.CMD.update)
      {
          game.updatePersonMoveInfo(info);
      }else if(info[0] == DH.CONST.CMD.login)
      {
          info[1]=conn.id;
          game.addPerson(info);
      }


  });

  conn.on("close", function(conn){
      util.log("Disconnected: "+conn.id);
      game.removePerson(conn.id);
      server.broadcast(conn.id+" has disconnected.");
  });

});



game.init(server);
game.start();
//game.shutdown();CONST.CMD
