'use strict';

module.exports = function (server, mongoose, logger) {
	server.route({	
		method: 'GET',
		path: '/view',
		config: {
			handler : function(request, reply) {
			reply.file('./view/index.html');
			}
		}
	});

    server.route({
		method: 'GET',
		path: '/view/{static*}',
		config: {
			handler: {
				directory: {
					path: 'view',
					index: true
				}
			}
		}
	});
};