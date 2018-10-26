const os = require('os')
const pty = require('node-pty')
const pidusageTree = require('pidusage-tree')

const SocketService = require('./SocketService')

const NB_CPU = os.cpus().length
const TOT_MEM = os.totalmem()

class Game {
  constructor (config, nickname, command, args) {
    this.nickname = nickname
    this.name = config.name
    this.status = 'RUNNING'
    this.command = command
    this.args = args
    this.exitCode = null
    this.stdout = ''
    this.statsInterval = null
    this.totalMemory = TOT_MEM
    this.statsHist = []
    this.mapSizes = new Map()

    this.proc = pty.spawn(command, args, {
      uid: config.uid,
      gid: config.gid,
      cwd: config.cwd,
      cols: 150,
      rows: 30
    })
    SocketService.emitStatus(this.getRepr())
    this.initEventGame()
    this.initStats()
  }

  initEventGame () {
    this.proc.on('exit', this.processOnClose.bind(this))
    this.proc.on('error', this.processOnError.bind(this))
    this.proc.on('data', this.processOnData.bind(this))
    SocketService.on(`term-data@${this.proc.pid}`, this.onTermData.bind(this))
    SocketService.on(`enter-server@${this.proc.pid}`, this.onEnterServer.bind(this))
    SocketService.on(`term-resize@${this.proc.pid}`, this.onTermResize.bind(this))
    SocketService.on(`leave-server@${this.proc.pid}`, this.onLeaveServer.bind(this))
  }

  initStats () {
    this.statsInterval = setInterval(this.sendStats.bind(this), 5000)
  }

  async sendStats () {
    let stats = Object.values(await pidusageTree(this.proc.pid))
    let percentCpu = stats.map(s => s.cpu).reduce((a, b) => a + b, 0) / NB_CPU
    let procMem = stats.map(s => s.memory).reduce((a, b) => a + b, 0)
    let finalStats = {
      cpu: percentCpu,
      memory: procMem
    }
    this.statsHist.unshift(finalStats)
    this.statsHist.splice(61, 1)
    SocketService.emitGameStats(this.proc.pid, finalStats)
  }

  onTermData (ws, msg) {
    this.proc.write(msg)
  }

  onTermResize (ws, newSize) {
    this.mapSizes.set(ws, newSize)
    this.updateTermSize()
  }

  onEnterServer (ws, msg) {
    ws.send(JSON.stringify({event: 'term-data', data: this.stdout}))
  }

  onLeaveServer (ws) {
    this.mapSizes.delete(ws)
    this.updateTermSize()
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
    clearInterval(this.statsInterval)
    //SocketService.emitUpdateStatus(this.proc.pid, this)
  }

  updateTermSize() {
    let genSize = this.mapSizes.values()
    let min = genSize.next().value
    if (!min)
      return
    for (let {rows, cols} of genSize) {
      min.rows = Math.min(min.rows, rows)
      min.cols = Math.min(min.cols, cols)
    }
    this.proc.resize(min.cols, min.rows)
    SocketService.emitTermResize(this.proc.pid, min)
  }

  kill () {
    this.proc.kill('SIGTERM')
  }

  getRepr () {
    let returnObject = {...this, pid: this.proc.pid}
    delete returnObject['proc']
    delete returnObject['stdout']
    delete returnObject['statsInterval']
    delete returnObject['mapSizes']
    return returnObject
  }
}

module.exports = Game
