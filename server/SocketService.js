const EventEmitter = require('events')


class SocketService extends EventEmitter {
  constructor () {
    super()
    this.serversToConn = {}
    this.connToServers = new Map()
    this.connections = new Set()
    this.on('enter-server', this.onEnterServer)
    this.on('leave-server', this.onLeaveServer)
    this.on('term-data', this.onTermData)
  }

  register (ws) {
    this.connections.add(ws)
    ws.on('message', (msg) => {
      try {
        let {event, data} = JSON.parse(msg)
        this.emit(event, ws, data)
      } catch (e) {}
    })
    ws.on('close', this.onLeaveServer.bind(this, ws))
    ws.on('close', this.onClose.bind(this, ws))
  }

  onEnterServer (ws, pid) {
    if (!(pid in this.serversToConn))
      this.serversToConn[pid] = new Set()
    if (this.connToServers.has(ws))
      this.emit('leave-serve')
    this.serversToConn[pid].add(ws)
    this.connToServers.set(ws, pid)
    this.emit(`enter-server@${pid}`, ws)
  }

  onLeaveServer (ws) {
    let pid = this.connToServers.get(ws)
    this.connToServers.delete(ws)
    if (!pid)
      return
    this.serversToConn[pid].delete(ws)
    if (!this.serversToConn[pid].size)
      delete this.serversToConn[pid]
  }

  onClose (ws) {
    this.connections.delete(ws)
  }

  onTermData (ws, msg) {
    let pid = this.connToServers.get(ws)
    if (pid) {
      this.emit(`term-data@${pid}`, ws, msg)
    }
  }

  emitTerminalData (pid, data) {
    this.to(pid, 'term-data', data)
  }

  emitStatus (pid, status) {
    this.broadcast('server-status', status)
  }

  to (pid, event, data) {
    let finalData = JSON.stringify({event, data})
    if (!this.serversToConn[pid])
      return
    for (let ws of this.serversToConn[pid]) {
      ws.send(finalData)
    }
  }

  broadcast (event, data) {
    let finalData = JSON.stringify({event, data})
    for (let ws of this.connections) {
      ws.send(finalData)
    }
  }
}

module.exports = new SocketService()
