const express = require('express')

const ConfigManager = require('./ConfigManager')
const GameManager = require('./GameManager')

const router = express.Router()

router.get('/games', (req, res) => {
  res.json(Object.values(ConfigManager.games))
})

router.get('/games/:game', (req, res) => {
  let gameConfig = ConfigManager.getConfig(req.params.game)

  if (gameConfig) {
    res.json(gameConfig)
  } else {
    res.sendStatus(404)
  }
})

router.delete('/servers/:pid', (req,res) => {
  let server = GameManager.getServer(req.params.pid)

  if (!server)
    return res.status(404).json({success: false, message: 'No server found with this pid'})

  if (server.exitCode === null)
    return res.status(409).json({success: false, message: 'Server is running'})

  GameManager.undefineGame(server)
  return res.sendStatus(201)
})

router.post('/servers', (req, res) => {
  let gameName = req.body.game
  let gameConfig = ConfigManager.getConfig(gameName)

  if (gameConfig === null) {
    return res.sendStatus(404)
  }

  let variables = GameManager.prepareVariables(gameConfig, req.body.vars)
  res.json(GameManager.startGame(req.body.nickname, gameConfig, variables))
})

router.get('/servers', (req, res) => {
  return res.json(GameManager.getServersList())
})

router.get('/servers/:pid', (req, res) => {
  let server = GameManager.getServer(req.params.pid)

  if (!server) {
    return res.sendStatus(404)
  }

  res.json(server.getRepr())
})

router.post('/servers/:pid/restart', (req, res) => {
  let server = GameManager.getServer(req.params.pid)

  if (!server)
    return res.status(404).json({success: false, message: 'No server found with this pid'})

  if (server.exitCode === null)
    return res.status(409).json({success: false, message: 'Server is running'})

  let config = ConfigManager.getConfig(server.name)

  if (!config)
    return res.status(410).json({success: false, message: 'Config could not be found'})

  let newPid = GameManager.restartGame(server, config)
  res.json({success: true, pid: newPid})
})

router.post('/servers/:pid/stop', (req, res) => {
  let server = GameManager.getServer(req.params.pid)

  if (!server)
    return res.status(404).json({success: false, message: 'No server found with this pid'})

  server.kill()
  return res.status(202).json({success: true})
})


module.exports = router
