'use strict';

const AWS = require('aws-sdk');

const Config = require('../../config');

module.exports = function (server, mongoose, logger) {
	server.route({	
		method: 'POST',
		path: '/deleteFromS3',
		config: {
			handler : function(request, reply) {
				console.log(request.payload);
				var s3 = new AWS.S3();
				var s3_params = {
					Bucket: Config.get('/constants/BUCKET_NAME'),
					Delete: {
						Objects: [{
								Key: request.payload.fileId
							}
						]
					}
				};
				s3.deleteObjects(s3_params, function (err, data) {
					if (err) {
						reply(err);
					} else {
						reply(data);
					}
				});
			},
			tags: ['api'],
			plugins: {
				'hapi-swagger': {}
			}
		}
	});
};