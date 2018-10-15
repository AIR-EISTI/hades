'use strict'
const fs = require('fs')
const util = require('util')
const path = require('path')


const readdir = util.promisify(fs.readdir)
const readFile = util.promisify(fs.readFile)

class ConfigManager {
  constructor () {
    this.configDir =  __dirname + '/configs/'
    this.matchFileRegex = /\.json$/
    this.games = {}
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

  async loadConfig (configFileName) {
    try {
      let data = await readFile(path.join(this.configDir, configFileName))
      let config = JSON.parse(data)
      this.games[config.name] = config
      console.log(`Loading game ${config.name}`)
    } catch (err) {
      console.warn(`Could not read config file ${configFileName}\n`, err)
    }
  }

  getConfig (gameName) {
    if (gameName in this.games)
      return this.games[gameName]
    return null
  }
}

module.exports = new ConfigManager()
