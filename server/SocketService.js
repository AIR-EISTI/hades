class SocketService {
  init (io) {
    this.io = io

    this.nspServers = this.io.of('/servers')

    this.nspServers.on('connection', (socket) => {
      let oldRoom = ''
      socket.on('change-room', (pid) => {
        if(oldRoom !== pid) {
          socket.leave(oldRoom)
          oldRoom = pid
        }
        socket.join(pid)
      })
    })
  }

  emitServerList (serversList) {
    this.nspServers.emit('list', serversList)
  }

  emitConsole (pid, msg) {
    this.nspServers.to(pid).emit('console', msg, pid)
  }

  emitUpdateStatus (pid, server) {
    let message = {
      status: server.status,
      exitCode: server.exitCode
    }
    this.nspServers.to(pid).emit('update-status', message)
  }
}

module.exports = new SocketService()
