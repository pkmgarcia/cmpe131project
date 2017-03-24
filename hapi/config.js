module.exports = {
	server: {
		//host: 'localhost',
		host: '0.0.0.0',
		port: 8000
	},
	plugins: [{
		register: require('inert')
	}]
}
