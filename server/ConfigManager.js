'use strict'
const fs = require('fs')
const util = require('util')
const path = require('path')
const Ajv = require('ajv')

const SocketService = require('./SocketService')

const readdir = util.promisify(fs.readdir)
const readFile = util.promisify(fs.readFile)
const access = util.promisify(fs.access)

const config = require('../config')
const gameConfigSchema = require('./schemas/game.schema')

class ConfigManager {
  constructor () {
    this.configDir = config.configDir
    this.matchFileRegex = /\.json$/
    this.games = {}
    this.fileNames = {}
    this.ajv = new Ajv({ removeAdditional: true, allErrors: true, verbose: true })
    this.validateGameConfig = this.ajv.compile(gameConfigSchema)
  }

  readConfigDir () {
    readdir(this.configDir)
      .then((files) => {
        files
          .filter(file => this.matchFileRegex.test(file))
          .forEach(this.loadConfig.bind(this))
      })
      .catch((err) => {
        if (err.code === 'ENOENT') {
          this.createConfigDir()
        } else {
          console.error('Error reading game config directory\n', err)
        }
      })
  }

  startWatchDir () {
    fs.watch(this.configDir, this.configChanged.bind(this))
  }

  async loadConfig (configFileName) {
    try {
      let data = await readFile(path.join(this.configDir, configFileName))
      let config = JSON.parse(data)

      if (!this.validateGameConfig(config)) {
        throw this.ajv.errorsText(this.validateGameConfig.errors)
      }

      this.games[config.name] = config
      this.fileNames[configFileName] = config.name
      SocketService.emitGameLoaded(config)
      console.log(`Loaded game ${config.name}`)
    } catch (err) {
      console.warn(`Could not read config file ${configFileName}\n`, err)
    }
  }

  async configChanged (eventname, filename) {
    if (eventname === 'change') {
      return this.matchFileRegex.test(filename) && this.loadConfig(filename)
    }
    try {
      await access(path.join(this.configDir, filename))
    } catch (err) {
      let name = this.fileNames[filename]
      if (name) {
        delete this.games[name]
        console.log('Deleted config', name)
        SocketService.emitGameDeleted(name)
      }
    }
  }

  getConfig (gameName) {
    if (gameName in this.games)
      return this.games[gameName]
    return null
  }
}

module.exports = new ConfigManager()
