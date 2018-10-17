const express = require('express')

const SocketService = require('./SocketService')

const router = express.Router()

router.ws('/', (ws, req) => {
  SocketService.register(ws)
})

module.exports = router
