const fs = require('fs');
const jsonfile = require('jsonfile');
const async = require('async');

const CONFIG_DIR = __dirname + '/configs/'

var config = {};
var eventSetFlag = false;

function createConfigDir (){
  fs.mkdir(CONFIG_DIR, (err) => {
    if(err)
      throw err;
    beginConfigDirWatch();
  });
}

function readConfigDir (err, files){
  if(err && err.code === 'ENOENT'){
    createConfigDir();
  }else if(err){
    throw err;
  }
  if(!eventSetFlag){
    beginConfigDirWatch();
  }
  loadConfigFiles(files);
}

function beginConfigDirWatch(){
  fs.watch(CONFIG_DIR, watchConfigDir);
  eventSetFlag = true;
}

function watchConfigDir(evt, filename){
  console.log('Detected change in configuration, reloading...');
  fs.readdir(CONFIG_DIR, readConfigDir);
}

function loadConfigFiles(files){
  async.map(files, loadConfig, function afterAllConfigsRead(err, results){
    for(gameConfig of results){
      updateSingleConfig(gameConfig);
    }
  })
}

// TODO : check de la syntax de la config : vérifier si tous champs sont présents.
function loadConfig(filename, callback){
  var isJsonFile = /\.json$/;
  if(!isJsonFile.test(filename))
    return;
  jsonfile.readFile(CONFIG_DIR + filename, function afterConfigRead(err, data){
    if(err && err.code !== 'ENOENT'){
      console.error('[ERROR] Erreur lors de la lecture du fichier de configuration', filename, err);
    }
    callback(null, { config : data || null, filename : filename } );
  });
}

function updateSingleConfig(data){
  if(data.config !== null)
    config[data.config.name] = data.config;
}

function setVariables(gameName, variables){
  if(!(gameName in config)){
    return null;
  }
  let gameConfig = config[gameName];
  let finalConfig = {
    name:gameName,
    vars:{},
    command : gameConfig.command,
    uid: gameConfig.uid,
    gid: gameConfig.gid,
    cwd: gameConfig.cwd
  };

  for(variable of gameConfig.vars){
    if(variable.name in variables){
      finalConfig.vars[variable.name] = variables[variable.name];
    }else{
      finalConfig.vars[variable.name] = variable.default;
    }
  }
  return finalConfig;
}
fs.readdir(CONFIG_DIR, readConfigDir);

module.exports = {
  getConfig : function(){
    return config;
  },
  setVariables : setVariables
}
