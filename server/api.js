const express = require('express')

const ConfigManager = require('./ConfigManager')
const GameManager = require('./GameManager')

const router = express.Router()

router.get('/games', (req, res) => {
  res.json(Object.values(ConfigManager.games))
})

router.get('/games/:game', (req, res) => {
  let gameName = req.params.game
  let gameConfig = ConfigManager.getConfig(gameName)
  if (gameConfig) {
    res.json(gameConfig)
  } else {
    res.sendStatus(404)
  }
})

router.delete('/servers/:pid',(req,res) => {
  let game = GameManager.gamesProcess[req.params.pid]
  if (!game) {
    res.sendStatus(404)
  }
  game.process.kill('SIGTERM')
  return res.sendStatus(202)
})

router.post('/servers', (req, res) => {
  let gameName = req.body.game
  let gameConfig = ConfigManager.getConfig(gameName)

  if (gameConfig === null) {
    return res.sendStatus(404)
  }

  let variables = {}
  for (let variable of gameConfig.vars) {
    variables[variable.name] = req.body.vars[variable.name] || variable.default
  }

  res.json(GameManager.startGame(req.body.nickname, gameConfig, variables))
})

router.get('/servers', (req, res) => {
  return res.json(GameManager.getServersList())
})

router.get('/servers/:pid', (req, res) => {
  let server = GameManager.gamesProcess[req.params.pid]

  if (!server) {
    return res.sendStatus(404)
  }

  let returnObject = {...server}
  delete returnObject['process']

  res.json(returnObject)
})

router.post('/servers/:pid/stdin', (req, res) => {
  let pid = Number(req.params.pid)

  if (!(pid in GameManager.gamesProcess)) {
    return res.sendStatus(404)
  }

  GameManager.pushStdin(req.params.pid, req.body.command+'\n')
  return res.sendStatus(202)
})


module.exports = router
