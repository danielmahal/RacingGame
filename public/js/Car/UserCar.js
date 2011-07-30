var UserCar = (function() {
	function UserCar (scene, b2world, keyHandler, socketHandler, x, z) {
		UserCar.parent.constructor.call(this, scene, b2world, x, z);
		
		this.addKeyHandling(keyHandler);
		this.socketHandler = socketHandler;
	}
	
	Husky.extend(UserCar, Car);
	
	UserCar.prototype.addKeyHandling = function(keyHandler) {
		keyHandler.add(87, this, { keyhold: this.accelerate });
		keyHandler.add(83, this, { keyhold: this.braking });
		keyHandler.add(65, this, { keyhold: this.turnLeft });
		keyHandler.add(68, this, { keyhold: this.turnRight });
		keyHandler.add(32, this, { keydown: this.startHandbrake, keyup: this.stopHandbrake });
	}
	
	UserCar.prototype.accelerate = function() {
		this.engineForce = this.attributes.engineForce;
	}
	
	UserCar.prototype.startHandbrake = function() {
		this.handbrake = true;
	}
	
	UserCar.prototype.stopHandbrake = function() {
		this.handbrake = false;
	}
	
	UserCar.prototype.braking = function() {
		this.engineForce = -this.attributes.brakeForce;
	}
	
	UserCar.prototype.turnLeft = function() {
		this.steerAngle -= .006;
		this.steerAngle = Math.min(Math.PI * 0.15, this.steerAngle);
	}
	
	UserCar.prototype.turnRight = function() {
		this.steerAngle += .006;
		this.steerAngle = Math.min(Math.PI * 0.15, this.steerAngle);
	}
	
	UserCar.prototype.update = function() {
		UserCar.parent.update.call(this);
		
	}
	
	return UserCar;
})();