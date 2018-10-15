function IoServer(io){
  this.io = io;

  this.nspServers = this.io.of('/servers');

  this.nspServers.on('connection', function(socket){
    let oldRoom = '';
    socket.on('change-room', function(pid){
      if(oldRoom !== pid){
        socket.leave(oldRoom);
        oldRoom = pid;
      }
      socket.join(pid);
    });
  });
}

IoServer.prototype.emitServerList = function(serversList){
  this.nspServers.emit('list', serversList);
};

IoServer.prototype.emitConsole = function(pid, msg){
  this.nspServers.to(pid).emit('console', msg, pid);
}

IoServer.prototype.emitUpdateStatus = function(pid, server){
  let message = {
    status: server.status,
    exitCode: server.exitCode
  }
  this.nspServers.to(pid).emit('update-status', message);
  console.log('update', message);
}

module.exports = IoServer;
