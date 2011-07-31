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
	
	
	
	Car.prototype.setAccelerate = function(value) {
		this.accelerate = value;
	}
	
	Car.prototype.setHandbrake = function(value) {
		this.handbrake = value;
	}
	
	Car.prototype.setBrake = function(value) {
		this.brake = value;
	}
	
	Car.prototype.setTurn = function(value) {
		this.turn = value;
	}
	
	
	Car.prototype.applyForces = function() {
		var velocity = this.body.GetLinearVelocity();
		
		var speed = velocity.Length();
		var angleVector = new b2Vec2(Math.cos(this.body.GetAngle()), Math.sin(this.body.GetAngle()));
		
		var perpForce = -angleVector.y * velocity.x + angleVector.x * velocity.y;
		
		frictionForce = 0;
		if(this.handbrake) {
			this.engineForce = 0;
			var frictionForce = angleVector.y * velocity.x + angleVector.x * velocity.y;
		}
		
		if(!this.slipping) {
			if(Math.abs(perpForce) + Math.abs(frictionForce) > this.attributes.startSlip) {
				this.sideResistance = this.attributes.resistance * this.attributes.slipMultiplier;
				this.slipping = true;
			}
		} else {
			if(Math.abs(perpForce) + Math.abs(frictionForce) < this.attributes.stopSlip) {
				this.sideResistance = this.attributes.resistance;
				this.slipping = false;
			}
		}
		
		var traction = new b2Vec2(angleVector.x, angleVector.y);
		traction.Multiply(this.engineForce);
		
		var friction = new b2Vec2(velocity.x, velocity.y);
		friction.Multiply(-this.resistance);
		
		var drag = new b2Vec2(velocity.x, velocity.y);
		drag.Multiply(-this.attributes.drag * speed);
		
		var corneringForce = new b2Vec2(-angleVector.y * perpForce, angleVector.x * perpForce).GetNegative();
		corneringForce.Multiply(this.sideResistance * 20);
		
		var force = velocity;
		force.Add(traction);
		force.Add(friction);
		force.Add(drag);
		force.Add(corneringForce);
		
		
		var turnRadius = (this.sizes.carLength) / Math.sin(this.steerAngle);
		var angularForce = (Math.sqrt(velocity.Length()) / turnRadius) * 0.4;
		
		if(Math.abs(force.x) + Math.abs(force.y) > 0.1) {
			this.body.ApplyImpulse(force, this.body.GetPosition());
			this.body.SetAngle(this.body.GetAngle() - angularForce);
		}
	}
	
	UserCar.prototype.update = function(time) {
		UserCar.parent.update.call(this);
		
		if(this.accelerate) {
			this.engineForce = this.attributes.engineForce;
		}
		
		if(this.brake) {
			this.engineForce = -this.attributes.brakeForce;
		}
		
		if(this.turn == 'left') {
			this.steerAngle -= .006;
		}
		
		if(this.turn == 'right') {
			this.steerAngle += .006;
		}
		
		this.steerAngle = Math.min(Math.PI * 0.15, this.steerAngle);
		this.steerAngle += -this.steerAngle * .25;
		
		this.applyForces();
		
		this.engineForce = 0;
		
		if(this.socketHandler.isConnected() && !(time % 7)) {
			this.socketHandler.emit('playerData', {
				id: this.id,
				angle: this.body.GetAngle(),
				position: this.body.GetPosition(),
				linearVelocity: this.body.GetLinearVelocity(),
				angularVelocity: this.body.GetAngularVelocity()
			});
		}
	}
	
	return UserCar;
})();