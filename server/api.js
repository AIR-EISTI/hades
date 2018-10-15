const express = require('express')

const ConfigManager = require('./ConfigManager')
const gameManager = require('./games')

const router = express.Router()

router.get('/games', function getGames (req, res){
  return Object.values(res.json(ConfigManager.games))
})

router.get('/games/:game', function getGame(req, res){
  let gameName = req.params.game;
  let gameConfig = ConfigManager.getConfig(gameName);
  if(gameConfig)
    res.json(gameConfig)
  else
    res.send(404);
});

router.delete('/servers/:pid',function killServer(req,res){
  let gamesObj = gameManager.getServers()
  let pid = req.params.pid
  if(pid in gamesObj) {
    gamesObj[pid].process.kill('SIGTERM')
    return res.sendStatus(200)
  }
  res.sendStatus(404)

})

router.post('/servers', function createServer(req, res){
  // TODO Do not work anymore
  /*let gameName = req.body.game || "";
  let variables = req.body.vars || {};
  let finalConfig = configManager.setVariables(gameName, variables);
  finalConfig.nickname = req.body.nickname;
  let returnValue = gameManager.startGame(finalConfig);

  res.json(returnValue);*/
  res.status(501)
  res.json({msg: 'Not implemented'})
})

router.get('/servers', function getServers(req, res){
  return res.json(gameManager.getServersList())
})

router.get('/servers/:pid', function getServer(req, res){
  let gamesObj = gameManager.getServers()
  let pid = req.params.pid
  if(!(pid in gamesObj))
    return res.sendStatus(404)
  let returnObject = {}
  for(prop in gamesObj[pid])
    returnObject[prop] = gamesObj[pid][prop]
  delete returnObject['process']

  res.json(returnObject);
})

router.post('/servers/:pid/stdin', function pushCommand(req, res){
  let resCode = gameManager.pushStdin(req.params.pid, req.body.command+'\n')
  if(resCode === 0){
    return res.sendStatus(200)
  }
  res.sendStatus(404)
})


module.exports = router
