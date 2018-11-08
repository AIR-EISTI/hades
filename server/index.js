const express = require('express')
const bodyParser = require('body-parser')
const Ajv = require('ajv')

const config = require('../config')

const app = express()

const expressWs = require('express-ws')(app)

const ws = require('./ws')
const api = require('./api')
const GameManager = require('./ConfigManager')

const hadesConfigSchema = require('./schemas/config.schema')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended : true}))

app.use('/api', api)
app.use('/ws', ws)

let ajv = new Ajv({ removeAdditional: true, allErrors: true, verbose: true })
let validateConfig = ajv.compile(hadesConfigSchema)

if (!validateConfig(config)) {
  console.error(`Invalid configuration file, ${ajv.errorsText(validateConfig.errors)}`)
  process.exit(-1)
}

GameManager.readConfigDir()
GameManager.startWatchDir()
app.listen(config.hadesServerPort, config.hadesServerHost)
