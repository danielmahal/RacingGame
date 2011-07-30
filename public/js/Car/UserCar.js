var UserCar = (function() {
	function UserCar (scene, b2world, keyHandler, x, z) {
		UserCar.parent.constructor.call(this, scene, b2world, x, z);
		this.addKeyHandling(keyHandler);
	}
	
	Husky.extend(UserCar, Car);
	
	UserCar.prototype.addKeyHandling = function(keyHandler) {
		keyHandler.add(87, this, { keyhold: this.accelerate });
		keyHandler.add(83, this, { keyhold: this.braking });
		keyHandler.add(65, this, { keyhold: this.turnLeft });
		keyHandler.add(68, this, { keyhold: this.turnRight });
		keyHandler.add(32, this, { keyhold: this.boost });
	}
	
	UserCar.prototype.accelerate = function() {
		this.engineForce = this.attributes.engineForce;
	}
	
	UserCar.prototype.boost = function() {
		this.engineForce = this.attributes.engineForce * 3;
	}
	
	UserCar.prototype.braking = function() {
		this.engineForce = -this.attributes.brakeForce;
	}
	
	UserCar.prototype.turnLeft = function() {
		this.steerAngle -= .02;
		this.steerAngle = Math.min(Math.PI * 0.2, this.steerAngle);
	}
	
	UserCar.prototype.turnRight = function() {
		this.steerAngle += .02;
		this.steerAngle = Math.min(Math.PI * 0.2, this.steerAngle);
	}
	
	return UserCar;
})();