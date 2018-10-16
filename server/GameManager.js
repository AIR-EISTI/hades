const spawn = require('child_process').spawn
const fs = require('fs')
const pty = require('node-pty')

const SocketService = require('./SocketService')
const Game = require('./Game')

class GameManager {
  constructor () {
    this.serversProcess = {}
  }

  startGame (nickname, config, variables) {
    console.log('New game starting: ', config.name)

    let [command, args] = this.buildCommand(config, variables)

    let game = new Game(config, nickname, command, args)
    this.serversProcess[game.proc.pid] = game
    return {pid: game.proc.pid, command: [command, ...args].join(' ')}
  }

  buildCommand (config, variables) {
    let command = config.command.map(this.populateCommand.bind(this, variables))
    return [command[0], command.slice(1)]
  }

  populateCommand (variables, partialCommand) {
    let varRegexp = /\$var_([a-z0-9_]+)/g
    return partialCommand.replace(varRegexp, (match,  variableName) => {
      if (!(variableName in variables)) {
        console.warn(`The variable ${variableName} doest not exist`)
        return ''
      }
      return variables[variableName]
    })
  }

  getServersList () {
    return Object.values(this.serversProcess).map(proc => {
      return {pid: proc.proc.pid, name: proc.nickname, status: proc.status}
    })
  }

  getServer (pid) {
    return this.serversProcess[pid] || null
  }

  prepareVariables (gameConfig, userVars) {
    let variables = {}
    for (let variable of gameConfig.vars) {
      variables[variable.name] = userVars[variable.name] || variable.default
    }
    return variables
  }

}

module.exports = new GameManager()
