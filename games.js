const spawn = require('child_process').spawn;
const fs = require('fs');
const pty = require('pty.js')

var gamesProcess = {};
var socketServer = null;

function* uniqErrorGen(){
  let id = -1;
  while(true){
    yield id--;
  }
}
var uniqError = uniqErrorGen();

function startGame(config){
  console.log('New game starting : ', config.name);
  console.log(config);
  let [command, args] = buildCommand(config);
  let proc = pty.spawn(command, args, {
    uid: config.uid,
    gid: config.gid,
    cwd: config.cwd
  });
  proc.pid = proc.pid || uniqError.next().value;

  gamesProcess[proc.pid] = {
    name : config.name,
    nickname: config.nickname,
    process : proc,
    status : 'RUNNING',
    command : command,
    args : args,
    exitCode : undefined,
    stdout : []
  };
  initEventGame(proc);
  socketServer.emitServerList(getServersList());
  return [proc.pid, [command, ...args].join(' ')];
}

function buildCommand(config){
  let command = [];
  for (index in config.command){
    command.push(populateCommand(config, config.command[index]));
  }
  return [command[0], command.slice(1)];
}

function populateCommand(config, partialCommand){
  let varRegexp = /\$var_([a-z0-9_]+)/g;
  return partialCommand.replace(varRegexp, function(match,  variableName){
    if(!(variableName in config.vars)){
      console.warn('[', config.name, '] [WARNING] La variable', variableName, 'n\'existe pas.');
      return '';
    }
    return config.vars[variableName];
  });
}

function initEventGame(game, config){
  game.on('exit', processOnClose.bind(game));
  game.on('error', processOnError.bind(game));
  game.on('data', processOnStdout.bind(game));
}

function processOnError(err){
  console.error('[' + this.pid + '-' + gamesProcess[this.pid].name + '] [ERROR] ' + err);
  gamesProcess[this.pid].status = 'ERROR';
  socketServer.emitServerList(getServersList());
  socketServer.emitUpdateStatus(this.pid, gamesProcess[this.pid]);
  addLineToHist(this.pid, 'ERROR', err.toString());
}


function processOnClose(code, signal){
  gamesProcess[this.pid].exitCode = (code || 0);
  gamesProcess[this.pid].status = gamesProcess[this.pid].exitCode === 0 ? 'CLOSED' : 'WARN';
  console.log('[' + this.pid + '-' + gamesProcess[this.pid].name + '] Process endend with code '+ gamesProcess[this.pid].exitCode);
  socketServer.emitServerList(getServersList());
  socketServer.emitUpdateStatus(this.pid, gamesProcess[this.pid]);
  addLineToHist(this.pid, gamesProcess[this.pid].exitCode === 0 ? 'INFO' : 'WARN', 'Process endend with code '+ gamesProcess[this.pid].exitCode);
}

function processOnStdout(data){
  addLineToHist(this.pid, 'STDOUT', data.toString());
}

function addLineToHist(pid, type, data){
  let typeMap = {
    'WARN' : 'W',
    'INFO' : 'I',
    'ERROR' : 'E',
    'STDOUT' : '>',
    'STDIN' : '<',
    'STDERR' : '!!'
  };
  let line = {type : typeMap[type], data : data};
  gamesProcess[pid].stdout.push(line);
  gamesProcess[pid].stdout = gamesProcess[pid].stdout.slice(-100);
  socketServer.emitConsole(pid, line);
}

function getServersList(){
  let serversList = [];
  for(pid in gamesProcess){
    serversList.push({
      pid : pid,
      name: gamesProcess[pid].nickname,
      status : gamesProcess[pid].status
    });
  }
  return serversList;
}

function pushStdin(pid, data){
  if(!(pid in gamesProcess)){
    return -1;
  }
  gamesProcess[pid].process.write(data);
  addLineToHist(pid, 'STDIN', data);
  return 0;
}

module.exports = {
  startGame : startGame,
  getServersList: getServersList,
  getServers: function(){
    return gamesProcess;
  },
  init: function(socketS){
    socketServer = socketS;
  },
  pushStdin : pushStdin
}
