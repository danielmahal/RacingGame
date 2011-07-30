var UserCar = (function() {
	function UserCar (id, scene, b2world, keyHandler, socketHandler, x, z) {
		UserCar.parent.constructor.call(this, scene, b2world, x, z);
		
		this.id = id;
		
		this.socketHandler = socketHandler;
		this.keyHandler = keyHandler;
		
		this.addControls();
	}
	
	Husky.extend(UserCar, Car);
	
	UserCar.prototype.addControls = function() {
		this.keyHandler.add(87, this, {
			keydown: 	[ this.setAccelerate, true ],
			keyup: 		[ this.setAccelerate, false ]
		});
		
		this.keyHandler.add(83, this, {
			keydown: 	[ this.setBrake, true ],
			keyup: 		[ this.setBrake, false ]
		});
		
		this.keyHandler.add(65, this, {
			keydown: 	[ this.setTurn, 'left' ],
			keyup: 		[ this.setTurn, false ]
		});
		
		this.keyHandler.add(68, this, {
			keydown: 	[ this.setTurn, 'right' ],
			keyup: 		[ this.setTurn, false ]
		});
		
		this.keyHandler.add(32, this, {
			keydown: 	[ this.setHandbrake, true ],
			keyup: 		[ this.setHandbrake, false ]
		});
	}
	
	UserCar.prototype.update = function(time) {
		UserCar.parent.update.call(this);
		
		if(this.socketHandler.isConnected() && !(time % 10)) {
			this.socketHandler.emit('playerData', {
				id: this.id,
				angle: this.body.GetAngle(),
				position: this.body.GetPosition(),
				velocity: this.body.GetLinearVelocity(),
				angularVelocity: this.body.GetAngularVelocity()
			});
		}
	}
	
	return UserCar;
})();