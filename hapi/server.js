'use strict'
const Hapi = require('hapi');
var Routes = require('./routes');
var Config = require('./config');

var server = new Hapi.Server();

server.connection({
		host: Config.server.host,
		port: Config.server.port
});
server.register(Config.plugins, (err) => {
	if(err) {
		throw err;
	}
	server.route(Routes.endpoints);
});

server.start((err) => {
	if(err) {
		throw err;
	}
	console.log('Server running at: ' + server.info.uri);
});

