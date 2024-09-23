module.exports = {
  // The port Hades API will listen on.
  hadesServerPort: 5050,
  // The host Hades API will listen on.
  // If Hades is not running behind a reverse proxy or if you want it accessible
  // directly change it to the remote ip of your server.
  hadesServerHost: '127.0.0.1',
  // The directory in which will be stored the game configuration files.
  // The directory should exist before the application starts.
  configDir: __dirname + '/server/configs'
}
