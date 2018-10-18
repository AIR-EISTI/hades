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
  let game = GameManager.getServer(req.params.pid)

  if (!game) {
    res.sendStatus(404)
  }

  game.kill()
  return res.sendStatus(202)
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
  let result = GameManager.restartGame(req.params.pid)

  if (!result) {
    return res.sendStatus(404)
  }

  res.status(result.status).json(result)
})


module.exports = router
