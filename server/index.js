const express = require('express')
const bodyParser = require('body-parser')

const app = express()

const expressWs = require('express-ws')(app)

const ws = require('./ws')
const api = require('./api')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended : true}))

app.use('/api', api)
app.use('/ws', ws)

app.listen(5050)
