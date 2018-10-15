const express = require('express')
const bodyParser = require('body-parser')
const socketIo =require('socket.io')
const http = require('http')

const gameManager = require('./games')
const api = require('./api')
const SocketService = require('./SocketService')

const app = express()
const server = http.Server(app)
const io = socketIo(server)

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended : true}))
app.use('/api', api)

let socketService = new SocketService(io)
gameManager.init(socketService)

server.listen(5050)
