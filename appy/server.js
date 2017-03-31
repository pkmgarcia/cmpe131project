'use strict';

const RestHapi = require('rest-hapi');
const Composer = require('./index');

Composer((err, server) => {

  if (err) {
    throw err;
  }
  
	// If the response is an error, redirect to the home page.
	server.ext('onPreResponse', function (request, reply) {
	    if (request.response.isBoom) {
	        return reply.redirect('/view');
	    }
	    return reply.continue();
	});

  server.start(() => {
    RestHapi.logUtil.logActionComplete(RestHapi.logger, "Server Initialized", server.info);
  });
});
