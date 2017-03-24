const Boom = require('boom');
const http = require('http');
const querystring = require('querystring');

exports.getHome = {
	handler : function(request, reply) {
		reply.file('./view/index.html');
	}
};
exports.getStatic = {
	handler: {
		directory: {
			path: './view/',
			index: true
		}
	}
};

exports.login = {
	handler : function(request, reply) {
		var postData = querystring.stringify({
			'email' : request.payload['email'],
			'password' : request.payload['password']
		});

		var options = {
			method: 'POST',
			hostname: 'localhost',
			port: 8125,
			path: '/login',
			agent: false,
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
				'Content-Length': Buffer.byteLength(postData)
			}
		};
		var req = http.request(options, (res) => {
			console.log(`STATUS: ${res.statusCode}`);
			// console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
			res.setEncoding('utf8');
			res.on('data', (chunk) => {
				console.log(`BODY: ${chunk}`);
				});
			res.on('end', () => {
				console.log('No more data in response.');
				});
		});

		req.on('error', (e) => {
			  console.log(`problem with request: ${e.message}`);
		});

		// write data to request body
		req.write(postData);
		req.end();
		reply();
	}
};

exports.register = {
	handler : function(request, reply) {
		var userJSON = JSON.stringify({
			'firstName' : request.payload['firstName'],
			'lastName' : request.payload['lastName'],
			'email' : request.payload['email'],
			'role' : 'User',
			'password' : request.payload['password']
		});
		var postData = querystring.stringify({
			'user': userJSON,
			'registerType' : 'Register'
		});
		var options = {
			method: 'POST',
			hostname: 'localhost',
			port: 8125,
			path: '/register',
			agent: false,
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
				'Content-Length': Buffer.byteLength(postData)
			}
		};
		var req = http.request(options, (res) => {
			console.log(`STATUS: ${res.statusCode}`);
			// console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
			res.setEncoding('utf8');
			res.on('data', (chunk) => {
				console.log(`BODY: ${chunk}`);
				});
			res.on('end', () => {
				console.log('No more data in response.');
				});
		});

		req.on('error', (e) => {
			  console.log(`problem with request: ${e.message}`);
		});

		// write data to request body
		req.write(postData);
		req.end();
		reply('finished');
	}
};

exports.verifyEmail = {
	handler : function(request, reply){
		var options = {
			method: 'GET',
			hostname: 'localhost',
			port: 8125,
			// This redirects the server to appy using the /register/activate endpoint.
			path: '/register/activate?token=' + request.query["token"],
			agent: false,
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			}
		};
		var req = http.request(options, (res) => {
			console.log(`STATUS: ${res.statusCode}`);
			// console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
			res.setEncoding('utf8');
			res.on('data', (chunk) => {
				console.log(`BODY: ${chunk}`);
				});
			res.on('end', () => {
				console.log('No more data in response.');
				});
		});

		req.on('error', (e) => {
			  console.log(`problem with request: ${e.message}`);
		});

		// write data to request body
		req.end();
		reply('finished');
	}
};
