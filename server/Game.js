const pty = require('node-pty')

const SocketService = require('./SocketService')

class Game {
  constructor (config, nickname, command, args) {
    this.nickname = nickname
    this.name = config.name
    this.status = 'RUNNING'
    this.command = command
    this.args = args
    this.exitCode = null
    this.stdout = ''

    this.proc = pty.spawn(command, args, {
      uid: config.uid,
      gid: config.gid,
      cwd: config.cwd,
      cols: 150,
      rows: 30
    })
    SocketService.emitStatus(this.getRepr())
    this.initEventGame()
  }

  initEventGame () {
    this.proc.on('exit', this.processOnClose.bind(this))
    this.proc.on('error', this.processOnError.bind(this))
    this.proc.on('data', this.processOnData.bind(this))
    SocketService.on(`term-data@${this.proc.pid}`, this.onTermData.bind(this))
    SocketService.on(`enter-server@${this.proc.pid}`, this.onEnterServer.bind(this))
  }

  onTermData (ws, msg) {
    this.proc.write(msg)
  }

  onEnterServer (ws, msg) {
    ws.send(JSON.stringify({event: 'term-data', data: this.stdout}))
  }

  processOnClose (code, signal) {
    this.exitCode = code
    this.status = 'CLOSED'
    console.log('[' + this.proc.pid + '-' + this.name + '] Process endend with code '+ this.exitCode)
    SocketService.emitStatus(this.getRepr())
  }

  processOnData (data) {
    this.stdout += data
    SocketService.to(this.proc.pid, 'term-data', data.toString())
  }

  processOnError (err) {
    console.error('[' + this.proc.pid + '-' + this.name + '] [ERROR] ' + err)
    this.status = 'ERROR'
    //SocketService.emitUpdateStatus(this.proc.pid, this)
  }

  kill () {
    this.proc.kill('SIGTERM')
  }

  getRepr () {
    let returnObject = {...this, pid: this.proc.pid}
    delete returnObject['proc']
    delete returnObject['stdout']
    return returnObject
  }
}

module.exports = Game
