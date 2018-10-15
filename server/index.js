const gameManager = require('./games.js');
const webServer = require('./webServer.js');
const IoServer = require('./socketServer');

webServer.init(gameManager);
let socketServer = new IoServer(webServer.getIo());
gameManager.init(socketServer);
