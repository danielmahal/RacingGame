var Car = (function() {
	
	var cDrag		= .1;
	var cRR			= 20;
	var engineForce = 1000;
	var brakeForce	= 1000;
	var steerForce	= 0.015;
	
	function Car(scene, keyHandler) {
		this.setupObject();
		this.addKeyHandling(keyHandler);
		
		scene.addObject( this.obj );
		
		this.velocity = new THREE.Vector2(0, 0);
		this.mass = 2000;
		this.angle = Math.PI * .5;
		this.steerAngle = 0;
	}
	
	Car.prototype.setupObject = function() {
		var material = new THREE.MeshPhongMaterial( { ambient: 0x333333, color: 0x000000, specular: 0x333333, wireframe: false }  );
		
		var geometries = {
			body: new THREE.CubeGeometry( 50, 30, 100, 1, 1, 1 ),
			wheel: new THREE.CylinderGeometry( 20, 20, 20, 15 )
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
		
		this.parts.body.position.y = 15;
		
		for(var fb in this.parts.wheels) {
			for(var lr in this.parts.wheels[fb]) {
				this.parts.wheels[fb][lr].rotation.y = Math.PI / 2;
				this.parts.wheels[fb][lr].position.x = 30 * (lr == 'left' ? -1 : 1);
				this.parts.wheels[fb][lr].position.z = 30 * (fb == 'back' ? -1 : 1);
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
	
	Car.prototype.brake = function() {
		this.braking = true;
	}
	
	Car.prototype.stopBraking = function() {
		this.braking = false;
	}
	
	Car.prototype.turnLeft = function() {
		this.steerAngle += ((Math.PI * .2) - this.steerAngle) * .05;
	}
	
	Car.prototype.turnRight = function() {
		this.steerAngle += ((-Math.PI * .2) - this.steerAngle) * .05;
	}
	
	Car.prototype.update = function() {
		var speed = Math.sqrt(this.velocity.length());
		var angleVector = new THREE.Vector2(Math.sin(this.angle), Math.cos(this.angle));
		
		var force = this.velocity.clone();
		
		// Resistance
		var perpForce = -angleVector.y * this.velocity.x + angleVector.x * this.velocity.y;
		var corneringForce = new THREE.Vector2(-angleVector.y * perpForce, angleVector.x * perpForce).multiplyScalar(100).negate();
		
		var drag = this.velocity.clone().multiplyScalar(-cDrag * speed);
		var friction = this.velocity.clone().multiplyScalar(-cRR);
		
		if(this.accelerating) {
			var traction = angleVector.clone().multiplyScalar(engineForce);
			force.addSelf(traction);
		}
		
		if(this.braking) {
			force.subSelf(angleVector.clone().multiplyScalar(brakeForce));
		}
		
		force.addSelf(drag).addSelf(friction).addSelf(corneringForce);
		force.divideScalar(this.mass);
		
		this.velocity.addSelf(force);
		
		// this.steerAngle += -this.steerAngle * .2;
		// this.angle += (this.steerAngle * speed * speed) * steerForce;
		
		this.obj.position.x += this.velocity.x;
		this.obj.position.z += this.velocity.y;
		
		this.obj.rotation.y = this.angle;
		
		for(i in this.parts.wheels.front) {
			this.parts.wheels.front[i].rotation.y = this.steerAngle + (Math.PI * 1.5);
		}
	}
	
	return Car;
})();