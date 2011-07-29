// var SocketHandler = (function() {
// 	var that;
// 	
// 	function SocketHandler(model) {
// 		that = this;
// 		
// 		this.userId = null;
// 		this.model = model;
// 		
// 		this.hasConnection = false;
// 		
// 		this.socket = new io.Socket('shooter.nodester.com', {
// 			port: 80,
// 			transports: ['websocket']
// 		});
// 		
// 		this.socket.on('connect', this.connect);
// 		this.socket.on('disconnect', this.disconnect);
// 		this.socket.on('message', this.processMessage);
// 		
// 		this.socket.on('connecting', function(e) {
// 			console.log('connecting...', e);
// 		});
// 		
// 		this.socket.on('connect_failed', function(e) {
// 			console.log('connection failed', e);
// 		});
// 		
// 		this.socket.connect();
// 	}
// 	
// 	SocketHandler.prototype.welcomeHandler = function(data) {
// 		this.userId = data.id;
// 		this.send('update');
// 	}
// 	
// 	SocketHandler.prototype.updateHandler = function(data) {
// 		if(data.id == this.userId) {
// 			return;
// 		}
// 		
// 		if(!this.model.ships[data.id]) {
// 			this.model.ships[data.id] = new PlayerShip(this.model.scene);
// 		}
// 		
// 		var ship = this.model.ships[data.id];
// 		
// 		if(ship.obj != null) {
// 			ship.targetPosition = new THREE.Vector3(data.p.x, data.p.y, data.p.z);
// 			ship.targetRotation = new THREE.Vector3(data.r.x, data.r.y, data.r.z);
// 		}
// 	}
// 	
// 	SocketHandler.prototype.userDisconnectHandler = function(data) {
// 		var ship = this.model.ships[data.id];
// 		if(ship) {
// 			ship.destroy();
// 			delete this.model.ships[data.id];
// 		}
// 	}
// 	
// 	SocketHandler.prototype.connect = function() {
// 		console.log('Socket opened!');
// 		this.hasConnection = true;
// 	}
// 	
// 	SocketHandler.prototype.disconnect = function() {
// 		console.log('Socket closed!');
// 		this.hasConnection = false;
// 	}
// 	
// 	SocketHandler.prototype.send = function(type, data) {
// 		if(!data) {
// 			data = {};
// 		}
// 		data['type'] = type;
// 		this.socket.send(data);
// 	}
// 	
// 	SocketHandler.prototype.processMessage = function(data) {
// 		if(that[data.type + 'Handler']) {
// 			that[data.type + 'Handler'](data);
// 		}
// 	}
// 	
// 	return SocketHandler;
// })();