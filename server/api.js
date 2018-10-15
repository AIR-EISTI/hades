const express = require('express')

const ConfigManager = require('./ConfigManager')
const GameManager = require('./GameManager')

const router = express.Router()

router.get('/games', function getGames (req, res){
  res.json(Object.values(ConfigManager.games))
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
  let gamesObj = GameManager.gamesProcess
  let pid = req.params.pid
  if(pid in gamesObj) {
    gamesObj[pid].process.kill('SIGTERM')
    return res.sendStatus(200)
  }
  res.sendStatus(404)

})

router.post('/servers', function createServer(req, res){
  let gameName = req.body.game
  let gameConfig = ConfigManager.getConfig(gameName)
  if (gameConfig === null) {
    return res.send(404)
  }

  let variables = {}
  for (let variable of gameConfig.vars) {
    variables[variable.name] = req.body.vars[variable.name] || variable.default
  }

  res.json(GameManager.startGame(req.body.nickname, gameConfig, variables))
})

router.get('/servers', function getServers(req, res){
  return res.json(GameManager.getServersList())
})

router.get('/servers/:pid', function getServer(req, res){
  let gamesObj = GameManager.gamesProcess
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
  let resCode = GameManager.pushStdin(req.params.pid, req.body.command+'\n')
  if(resCode === 0){
    return res.sendStatus(200)
  }
  res.sendStatus(404)
})


module.exports = router
