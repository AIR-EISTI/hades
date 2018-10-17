const pty = require('node-pty')

const SocketService = require('./SocketService')

class Game {
  constructor (config, nickname, command, args) {
    console.log('New game starting: ', config.name)

    this.nickname = nickname
    this.name = config.name
    this.status = 'RUNNING'
    this.command = command
    this.args = args
    this.exitCode = null
    this.stdout = []

    this.proc = pty.spawn(command, args, {
      uid: config.uid,
      gid: config.gid,
      cwd: config.cwd
    })

    this.initEventGame()
  }

  initEventGame () {
    this.proc.on('exit', this.processOnClose.bind(this))
    this.proc.on('error', this.processOnError.bind(this))
    this.proc.on('data', this.processOnStdout.bind(this))
    SocketService.on('term-data', this.onTermData.bind(this))
  }

  onTermData (ws, msg) {
    this.pushStdin(msg)
  }

  processOnClose (code, signal) {
    this.exitCode = code
    this.status = this.exitCode === 0 ? 'CLOSED' : 'WARN'
    console.log('[' + this.proc.pid + '-' + this.name + '] Process endend with code '+ this.exitCode)
    //SocketService.emitServerList(this.getServersList())
    //SocketService.emitUpdateStatus(this.proc.pid, this)
    this.addLineToHist(this.exitCode === 0 ? 'INFO' : 'WARN', 'Process endend with code '+ this.exitCode)
  }

  processOnStdout (data) {
    //this.addLineToHist('STDOUT', data.toString())
    SocketService.broadcast('term-data', data.toString())
  }

  processOnError (err) {
    console.error('[' + this.proc.pid + '-' + this.name + '] [ERROR] ' + err)
    this.status = 'ERROR'
    //SocketService.emitServerList(this.getServersList())
    //SocketService.emitUpdateStatus(this.proc.pid, this)
    this.addLineToHist('ERROR', err.toString())
  }

  addLineToHist (type, data) {
    let typeMap = {
      'WARN' : 'W',
      'INFO' : 'I',
      'ERROR' : 'E',
      'STDOUT' : '>',
      'STDIN' : '<',
      'STDERR' : '!!'
    }
    let line = {type : typeMap[type], data}
    this.stdout.push(line)
    this.stdout = this.stdout.slice(-100)
    //SocketService.emitConsole(pid, line)
  }

  pushStdin (data) {
    this.proc.write(data)
    //this.addLineToHist('STDIN', data)
  }

  kill () {
    this.proc.kill('SIGTERM')
  }
}

module.exports = Game
