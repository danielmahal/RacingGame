var Car = (function() {
	
	var constants = {
		drag: 1.2,
		resistance: 15,
		engineForce: 1000,
		brakeForce: 500,
		startSlip: 9.5,
		stopSlip: 8,
		slipMultiplier: 0.2
	}
	
	
	function Car(scene, keyHandler) {
		this.sizes = {
			carWidth: 60,
			carHeight: 60,
			carLength: 140,
			wheelRadius: 30,
			wheelDepth: 40
		}
		
		// this.engineForce = 0;
		// this.velocity = new THREE.Vector2(0, 0);
		// this.mass = 1600;
		// this.angle = Math.PI * .5;
		// this.steerAngle = 0;
		// this.currentResistance = constants.resistance;
		// this.slipping = false;
		
		this.setupObject();
		this.addKeyHandling(keyHandler);
		
		scene.addObject( this.obj );
	}
	
	Car.prototype.setupObject = function() {
		var material = new THREE.MeshPhongMaterial( { ambient: 0x333333, color: 0x000000, specular: 0x333333, wireframe: false }  );
		
		var geometries = {
			body: new THREE.CubeGeometry( this.sizes.carWidth, this.sizes.carHeight - this.sizes.wheelRadius * 0.5, this.sizes.carLength - this.sizes.wheelRadius * 1.2, 1, 1, 1 ),
			wheel: new THREE.CylinderGeometry( 10, this.sizes.wheelRadius, this.sizes.wheelRadius, this.sizes.wheelDepth )
		}
		
		this.parts = {
			body: new THREE.Mesh( geometries.body, material ),
			wheels: {
				front: {
					left: new THREE.Mesh(geometries.wheel, material),
					right: new THREE.Mesh(geometries.wheel, material)
				},
				back: {
					left: new THREE.Mesh(geometries.wheel, material),
					right: new THREE.Mesh(geometries.wheel, material)
				}
			}
		}
		
		this.parts.body.position.y =  + this.sizes.carHeight / 2;
		
		for(var fb in this.parts.wheels) {
			for(var lr in this.parts.wheels[fb]) {
				this.parts.wheels[fb][lr].rotation.y = Math.PI / 2;
				this.parts.wheels[fb][lr].position.x = (this.sizes.wheelDepth * 0.5 + this.sizes.carWidth * 0.5) * (lr == 'left' ? -1 : 1);
				this.parts.wheels[fb][lr].position.z = (this.sizes.carLength * 0.5 - this.sizes.wheelRadius) * (fb == 'back' ? -1 : 1);
				this.parts.wheels[fb][lr].position.y = this.sizes.wheelRadius;
			}
		}
		
		this.obj = new THREE.Object3D();
		this.obj.addChild(this.parts.body);
		this.obj.addChild(this.parts.wheels.front.left);
		this.obj.addChild(this.parts.wheels.front.right);
		this.obj.addChild(this.parts.wheels.back.left);
		this.obj.addChild(this.parts.wheels.back.right);
		this.obj.position.y = 150;
	}
	
	Car.prototype.addKeyHandling = function(keyHandler) {
		keyHandler.add(87, this, { keyhold: this.accelerate });
		keyHandler.add(83, this, { keyhold: this.braking });
		keyHandler.add(65, this, { keyhold: this.turnLeft });
		keyHandler.add(68, this, { keyhold: this.turnRight });
		keyHandler.add(32, this, { keyhold: this.boost });
	}
	
	Car.prototype.accelerate = function() {
		this.engineForce = constants.engineForce;
	}
	
	Car.prototype.boost = function() {
		this.engineForce = constants.engineForce * 2;
		this.velocity.multiplyScalar(1.01)
	}
	
	Car.prototype.braking = function() {
		this.engineForce = -constants.brakeForce;
	}
	
	Car.prototype.turnRight = function() {
		this.steerAngle -= .02;
		this.steerAngle = Math.min(Math.PI * 0.2, this.steerAngle);
	}
	
	Car.prototype.turnLeft = function() {
		this.steerAngle += .02;
		this.steerAngle = Math.min(Math.PI * 0.2, this.steerAngle);
	}
	
	Car.prototype.update = function() {
		
	}
	
	return Car;
})();