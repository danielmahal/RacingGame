var SocketHandler = (function() {
	var socketHandler;
	
	function SocketHandler(url, model) {
		this.model = model;
		
		this.socket = io.connect(url);
		
		this.socket.on('connecting', function(message) { console.log('Connecting to ', url) });
		this.socket.on('connect_failed', function(message) { console.log('Connection failed') });
		this.socket.on('connect', function(message) { console.log('Connected to socket!') });
		this.socket.on('disconnect', function(message) { console.log('Disconnected from socket!') });
		this.socket.on('message', function(message) { console.log('Socket message:', message) });
	}
	
	SocketHandler.prototype.isConnected = function() {
		return this.socket.socket.connected;
	}
	
	SocketHandler.prototype.emit = function(event, data) {
		this.socket.emit(event, data);
	}
	
	SocketHandler.prototype.addHandler = function(event, scope, callback) {
		this.socket.on(event, function() {
			callback.apply(scope, arguments);
		})
	}
	
	return SocketHandler;
})();