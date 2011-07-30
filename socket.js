var io = require('socket.io');


exports.start = function(app) {
	io = io.listen(app);
	
	var players = {};
	
	io.sockets.on('connection', function (socket) {
		for(i in players) {
			socket.emit('playerConnected', players[i]);
		}
		
		var player = {
			id: socket.id
		};
		
		players[socket.id] = player;
		
		socket.broadcast.emit('playerConnected', player);
		
		socket.on('playerData', function(data) {
			socket.broadcast.emit('playerData', data);
		});
		
		socket.on('ping', function() {
			socket.emit('ping');
		});
		
		socket.on('disconnect', function(data) {
			socket.broadcast.emit('playerDisconnected', player);
			delete players[socket.id];
		});
	});
	
	return io;
}