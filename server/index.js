const express = require('express')
const bodyParser = require('body-parser')
const socketIo =require('socket.io')
const http = require('http')

const api = require('./api')
const GameManager = require('./GameManager')
const SocketService = require('./SocketService')

const app = express()
const server = http.Server(app)
const io = socketIo(server)

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended : true}))
app.use('/api', api)

SocketService.init(io)

server.listen(5050)
