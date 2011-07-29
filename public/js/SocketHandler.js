var SocketHandler = (function() {
	var socketHandler;
	
	function SocketHandler(model) {
		socketHandler = this;
		
		this.userId = null;
		this.model = model;
		
		this.hasConnection = false;
		
		this.socket = io.connect('http://localhost');
		
		this.socket.on('connect', this.connect);
		this.socket.on('disconnect', this.disconnect);
		this.socket.on('message', this.processMessage);
		
		this.socket.on('connecting', function(e) {
			console.log('connecting...', e);
		});
		
		this.socket.on('connect_failed', function(e) {
			console.log('connection failed', e);
		});
	}
	
	SocketHandler.prototype.welcomeHandler = function(data) {
		this.userId = data.id;
		console.log('server welcomed me! I have an ID now: ', this.userId);
	}
	
	SocketHandler.prototype.connect = function() {
		console.log('Socket opened!');
		this.hasConnection = true;
	}
	
	SocketHandler.prototype.disconnect = function() {
		console.log('Socket closed!');
		this.hasConnection = false;
	}
	
	SocketHandler.prototype.send = function(type, data) {
		if(!data) { data = {} }
		data['type'] = type;
		this.socket.send(data);
	}
	
	SocketHandler.prototype.processMessage = function(data) {
		if(socketHandler[data.type + 'Handler']) {
			socketHandler[data.type + 'Handler'](data);
		}
	}
	
	return SocketHandler;
})();