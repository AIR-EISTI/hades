const gameManager = require('./games.js');
const configManager = require('./config.js');
const webServer = require('./webServer.js');
const IoServer = require('./socketServer');

webServer.init(configManager, gameManager);
let socketServer = new IoServer(webServer.getIo());
gameManager.init(socketServer);
