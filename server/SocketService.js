const EventEmitter = require('events')


class SocketService extends EventEmitter {
  constructor () {
    super()
    this.serversToConn = {}
    this.connToServers = new Map()
    this.connections = new Set()
    this.on('enter-server', this.onEnterServer)
    this.on('leave-server', this.onLeaveServer)
  }

  register (ws) {
    ws.on('message', (msg) => {
      try {
        let {event, data} = JSON.parse(msg)
        console.log(event, data)
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

  emitTerminalData (pid, data) {
    this.to(pid, 'term-data', data)
  }

  emitServerStatusChange (pid, status) {
    this.broadcast('server-status-change', status)
  }

  to (pid, event, data) {
    let finalData = JSON.parse({event, data})
    for (let ws of this.connToServers[pid]) {
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
