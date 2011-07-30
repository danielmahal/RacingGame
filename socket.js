var io = require('socket.io');

exports.start = function(app) {
	io = io.listen(app);
	
	io.sockets.on('connection', function (socket) {
		socket.send('Welcome to the server!');
		
		socket.on('playerUpdate', function(data) {
			socket.broadcast.emit('playerUpdate', data);
		});
	});
	
	return io;
}