const express = require('express');
const bodyParser = require('body-parser');
const socketIo =require('socket.io');
const http = require('http');

var app = express();
var server = http.Server(app);
var io = socketIo(server);

var configManager;
var gameManager;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : true}));

var api = express();

app.use('/api', api);

api.get('/games', function getGames (req, res){
  let configObj = configManager.getConfig();
  let games = []
  for(gameKey in configObj){
    games.push(configObj[gameKey])
  }
  return res.json(games);
});

api.get('/games/:game', function getGame(req, res){
  let gameName = req.params.game;
  let gamesConfig = configManager.getConfig();
  let gameConfig = gamesConfig[gameName] || null;
  if(gameConfig)
    res.json(gameConfig);
  else
    res.send(404);
});

api.delete('/servers/:pid',function killServer(req,res){
  let gamesObj = gameManager.getServers();
  let pid = req.params.pid;
  if(pid in gamesObj)
  {
    gamesObj[pid].process.kill('SIGTERM')
    console.log('toto');
    return res.sendStatus(200);
  }
  console.log('toto');
  res.sendStatus(404);

})

api.post('/servers', function createServer(req, res){
  let gameName = req.body.game || "";
  let variables = req.body.vars || {};
  let finalConfig = configManager.setVariables(gameName, variables);
  finalConfig.nickname = req.body.nickname;
  let returnValue = gameManager.startGame(finalConfig);

  res.json(returnValue);
});

api.get('/servers', function getServers(req, res){
  return res.json(gameManager.getServersList());
});

api.get('/servers/:pid', function getServer(req, res){
  let gamesObj = gameManager.getServers();
  let pid = req.params.pid;
  if(!(pid in gamesObj))
    return res.sendStatus(404);
  let returnObject = {};
  for(prop in gamesObj[pid])
    returnObject[prop] = gamesObj[pid][prop];
  delete returnObject['process'];

  res.json(returnObject);
});

api.post('/servers/:pid/stdin', function pushCommand(req, res){
  let resCode = gameManager.pushStdin(req.params.pid, req.body.command+'\n');
  if(resCode === 0){
    return res.sendStatus(200);
  }
  res.sendStatus(404);
})

server.listen(5050);

module.exports = {
  init : function (configM, gameM){
    configManager = configM;
    gameManager = gameM;
  },
  getIo : function(){
    return io;
  }
}
