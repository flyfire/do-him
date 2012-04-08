
var util = require("util"),
    ws = require("./ws/ws/server"),
    game = require("./game").game;
var DH = require("../common/Base");
var time = 0;

var server = ws.createServer({
  debug : !true
});

server.on('error', function (exc) {
    util.log("ignoring exception: " + exc);
});

server.on("connection", function(conn){
  util.log("Connection: "+conn.id+" ver:"+conn.version);

  server.send(conn.id, JSON.stringify([DH.CONST.CMD.login, conn.id]) );

  conn.on("message", function(message){
    try{
      var info = JSON.parse(message);
      if(info[0] == DH.CONST.CMD.update)
      {
          game.updatePersonMoveInfo(info);
      }else if(info[0] == DH.CONST.CMD.login)
      {
          info[1]=conn.id;
          game.addPerson(info);
      }
    }catch(e){
      util.log(message); 
    }

  });
});

server.on("close", function(conn){
    util.log("Disconnected: "+conn.id);
    game.removePerson(conn.id);
    server.broadcast(conn.id+" has disconnected.");
    
});

var _port=process.argv[2]||8008;
server.listen(_port);
util.log("Server Started. port : "+_port);
game.init(server);
game.start();
//game.shutdown();CONST.CMD
