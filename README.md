# Hades

Hades is a application that aim to facilitate the start of multiple game server using the same template configuration. It also allows you to access a fully fonctional terminal to control the running server.

## Installation

Clone the git repository, then copy the `config.default.js` to `config.js`, change it as you want then build the project for production or run the development servers.

The game configuration files syntax is explained in the wiki : https://github.com/AIR-EISTI/hades/wiki/Games-Configuration.

## Building for production

Run `ng build --prod` to build the project for production. The build artifacts will be stored in the `dist/` directory.  
Run `npm run start` to start Hades web server (if you want Hades to be able to change the user running a game, it should be running as root).  
Serve the static files using a web server like nginx and proxy requests to `/api` to hades.

## Development

### Running the development server

In separate terminal run
* `npm run start:dev:client`, this will start the development server for the front end, available by default at http://localhost:4200/
* `npm run start:dev:server`, starts the API server with auto reload when source files change, available by default at http://localhost:5050.

### Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

### Running unit tests (todo)

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

### Running end-to-end tests (todo)

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).
