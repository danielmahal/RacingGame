var io = require('socket.io');

exports.start = function(app) {
	io = io.listen(app);
	
	io.sockets.on('connection', function (client) {
		client.send('Welcome to the server!');
	});
	
	return io;
}