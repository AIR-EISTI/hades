const express = require('express')
const bodyParser = require('body-parser')
const socketIo =require('socket.io')
const http = require('http')

const gameManager = require('./games')
const api = require('./api')
const IoServer = require('./socketServer')

const app = express()
const server = http.Server(app)
const io = socketIo(server)

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended : true}))
app.use('/api', api)

let socketServer = new IoServer(io)
gameManager.init(socketServer)

server.listen(5050)
