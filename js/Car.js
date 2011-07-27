var Car = (function() {
	
	var constants = {
		drag: 0.42,
		resistance: 12.8,
		engineForce: 1000
	}
	
	
	function Car(scene, keyHandler) {
		this.sizes = {
			carWidth: 30,
			carHeight: 50,
			carLength: 200,
			wheelRadius: 20,
			wheelDepth: 20
		}
		
		this.velocity = new THREE.Vector2(0, 0);
		this.mass = 2000;
		this.angle = Math.PI * .5;
		this.steerAngle = 0;
		
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
		
		this.parts.body.position.y = this.sizes.carHeight / 2 + this.sizes.wheelRadius * 0.5;
		
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
		keyHandler.add(87, this, { keydown: this.accelerate, keyup: this.deccelerate });
		keyHandler.add(83, this, { keydown: this.brake, keyup: this.stopBraking });
		keyHandler.add(65, this, { keyhold: this.turnLeft });
		keyHandler.add(68, this, { keyhold: this.turnRight });
	}
	
	Car.prototype.accelerate = function() {
		this.accelerating = true;
	}
	
	Car.prototype.deccelerate = function() {
		this.accelerating = false;
	}
	
	Car.prototype.brake = function() {}
	
	Car.prototype.stopBraking = function() {}
	
	Car.prototype.turnRight = function() {
		this.steerAngle -= .02;
		this.steerAngle = Math.min(Math.PI * 0.4, this.steerAngle);
	}
	
	Car.prototype.turnLeft = function() {
		this.steerAngle += .02;
		this.steerAngle = Math.min(Math.PI * 0.4, this.steerAngle);
	}
	
	Car.prototype.update = function() {
		var speed = Math.sqrt(this.velocity.length());
		var angleVector = new THREE.Vector2(Math.sin(this.angle), Math.cos(this.angle));
		
		var force = this.velocity.clone();
		
		// Resistance
		var perpForce = -angleVector.y * this.velocity.x + angleVector.x * this.velocity.y;
		var corneringForce = new THREE.Vector2(-angleVector.y * perpForce, angleVector.x * perpForce).multiplyScalar(this.mass * 0.1).negate();
		
		var drag = this.velocity.clone().multiplyScalar(-constants.drag * speed);
		var friction = this.velocity.clone().multiplyScalar(-constants.resistance);
		
		if(this.accelerating) {
			var traction = angleVector.clone().multiplyScalar(constants.engineForce);
			force.addSelf(traction);
		}
		
		force.addSelf(drag).addSelf(friction).addSelf(corneringForce);
		force.divideScalar(this.mass);
		
		this.velocity.addSelf(force);
		
		this.steerAngle += -this.steerAngle * .1;
		var turnRadius = this.sizes.carLength / Math.sin(this.steerAngle);
		
		this.angle += (this.velocity.lengthSq() / turnRadius) * 0.1;
		
		this.obj.position.x += this.velocity.x;
		this.obj.position.z += this.velocity.y;
		
		this.obj.rotation.y = this.angle;
		
		for(i in this.parts.wheels.front) {
			this.parts.wheels.front[i].rotation.y = this.steerAngle + (Math.PI * 1.5);
		}
	}
	
	return Car;
})();