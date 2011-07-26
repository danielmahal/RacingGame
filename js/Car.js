var Car = (function() {
	
	var cDrag		= 1;
	var cRR			= 40;
	var engineForce = 1000;
	var brakeForce	= 100;
	
	function Car(scene, keyHandler) {
		this.setupObject();
		
		scene.addObject( this.obj );
		
		this.engineForce = 0;
		this.velocity = new THREE.Vector2(0, 0);
		this.mass = 2000;
		this.angle = Math.PI * .5;
		
		keyHandler.add(87, this, this.accelerate);	// Key: W
		keyHandler.add(65, this, this.turnLeft);	// Key: A
		keyHandler.add(83, this, this.brake);	// Key: S
		keyHandler.add(68, this, this.turnRight);	// Key: D
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
				this.parts.wheels[fb][lr].position.z = 30 * (lr == 'left' ? -1 : 1);
				this.parts.wheels[fb][lr].position.x = 30 * (fb == 'front' ? -1 : 1);
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
	
	Car.prototype.accelerate = function() {
		this.engineForce = 1000;
	}
	
	Car.prototype.brake = function() {
		this.braking = true;
	}
	
	Car.prototype.turnLeft = function() {
		this.angle -= .1;
	}
	
	Car.prototype.turnRight = function() {
		this.angle += .1;
	}
	
	Car.prototype.update = function() {
		speed = Math.sqrt(this.velocity.length());
		
		var angleVector = new THREE.Vector2(Math.sin(this.angle), Math.cos(this.angle));
		var traction	= angleVector.multiplyScalar(this.engineForce);
		
		// Resistance
		var drag = this.velocity.clone().multiplyScalar(-cDrag * speed);
		var friction = this.velocity.clone().multiplyScalar(-cRR);
		
		var force = this.velocity.clone().addSelf(traction).addSelf(drag).addSelf(friction);
		
		force.divideScalar(this.mass);
		
		this.velocity.addSelf(force);
		
		this.obj.position.x += this.velocity.x;
		this.obj.position.z += this.velocity.y;
		
		this.engineForce = 0;
		this.braking = false;
		
		this.obj.rotation.y = this.angle;
	}
	
	return Car;
})();