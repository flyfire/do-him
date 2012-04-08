
var util = require("util"),
    ws = require("./ws/ws/server"),
    game = require("./game").game;
var DH = require("../common/Base");
var time = 0;
//创建WebSocket Server
var server = ws.createServer({
  debug : true
});

server.on('error', function (exc) {
    util.log("ignoring exception: " + exc);
});

//当有客户端接入时
server.on("connection", function(conn){
 // game.add_player(conn.id);
  util.log("Connection: "+conn.id+" ver:"+conn.version);

  server.broadcast(conn.id+" has connected.");
  server.send(conn.id, JSON.stringify([DH.CONST.CMD.login, conn.id]) );
  //当收到客户端发送的信息时
  conn.on("message", function(message){
   // var msg = {};
    //msg.text = message;
    //msg.rotation = 10;
    //game.receive_message(conn.id, msg);
    var info = JSON.parse(message);
    if(info[0] == DH.CONST.CMD.update)
    {
        game.updatePersonMoveInfo(info);
    }else if(info[0] == DH.CONST.CMD.login)
    {
        game.addPerson(info)
    }
    //向所有客户端发送信息.
    util.log(conn.id+" recive & send : "+message + "; time:" + game.time);
    //server.broadcast(message + "; time:" + game.time);
    //server.send(id, message);
  });
});

//当有客户端断开连接时
server.on("close", function(conn){
    util.log("Disconnected: "+conn.id);
    game.removePerson(conn.id);
    //向所有客户端发送信息.
    server.broadcast(conn.id+" has disconnected.");
    
});

//启动服务 监听8000端口
var _port=process.argv[2]||8000;
server.listen(_port);
util.log("Server Started. port : "+_port);
game.init(server);
game.start();
//game.shutdown();CONST.CMD
