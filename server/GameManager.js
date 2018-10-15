const spawn = require('child_process').spawn
const fs = require('fs')
const pty = require('node-pty')

const SocketService = require('./SocketService')

class GameManager {
  constructor () {
    this.gamesProcess = {}
  }

  startGame (nickname, config, variables) {
    console.log('New game starting: ', config.name)

    let [command, args] = this.buildCommand(config, variables)

    let proc = pty.spawn(command, args, {
      uid: config.uid,
      gid: config.gid,
      cwd: config.cwd
    })

    this.gamesProcess[proc.pid] = {
      name: config.name,
      nickname,
      process: proc,
      status: 'RUNNING',
      command,
      args,
      exitCode: undefined,
      stdout: []
    }
    this.initEventGame(proc)
    SocketService.emitServerList(this.getServersList())
    return {pid: proc.pid, command: [command, ...args].join(' ')}
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

  initEventGame (game) {
    game.on('exit', this.processOnClose.bind(this, game))
    game.on('error', this.processOnError.bind(this, game))
    game.on('data', this.processOnStdout.bind(this, game))
  }

  processOnError (game, err) {
    console.error('[' + game.pid + '-' + this.gamesProcess[game.pid].name + '] [ERROR] ' + err)
    this.gamesProcess[game.pid].status = 'ERROR'
    SocketService.emitServerList(this.getServersList())
    SocketService.emitUpdateStatus(game.pid, this.gamesProcess[game.pid])
    this.addLineToHist(game.pid, 'ERROR', err.toString())
  }

  processOnClose (game, code, signal) {
    this.gamesProcess[game.pid].exitCode = (code || 0)
    this.gamesProcess[game.pid].status = this.gamesProcess[game.pid].exitCode === 0 ? 'CLOSED' : 'WARN'
    console.log('[' + game.pid + '-' + this.gamesProcess[game.pid].name + '] Process endend with code '+ this.gamesProcess[game.pid].exitCode)
    SocketService.emitServerList(this.getServersList())
    SocketService.emitUpdateStatus(game.pid, this.gamesProcess[game.pid])
    this.addLineToHist(game.pid, this.gamesProcess[game.pid].exitCode === 0 ? 'INFO' : 'WARN', 'Process endend with code '+ this.gamesProcess[game.pid].exitCode)
  }

  processOnStdout (game, data) {
    this.addLineToHist(game.pid, 'STDOUT', data.toString())
  }

  addLineToHist (pid, type, data) {
    let typeMap = {
      'WARN' : 'W',
      'INFO' : 'I',
      'ERROR' : 'E',
      'STDOUT' : '>',
      'STDIN' : '<',
      'STDERR' : '!!'
    }
    let line = {type : typeMap[type], data}
    this.gamesProcess[pid].stdout.push(line)
    this.gamesProcess[pid].stdout = this.gamesProcess[pid].stdout.slice(-100)
    SocketService.emitConsole(pid, line)
  }

  getServersList () {
    return Object.values(this.gamesProcess).map(proc => {
      return {pid: proc.process.pid, name: proc.nickname, status: proc.status}
    })
  }

  pushStdin (pid, data) {
    this.gamesProcess[pid].process.write(data)
    this.addLineToHist(pid, 'STDIN', data)
  }
}

module.exports = new GameManager()
