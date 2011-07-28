var Car = (function() {
	
	var constants = {
		drag: 1.2 * 0.001,
		resistance: 12 * 0.001,
		engineForce: 4000 * 0.00015,
		brakeForce: 500 * 0.0001,
		startSlip: 4.2,
		stopSlip: 3,
		slipMultiplier: 0.15
	}
	
	function Car(scene, b2world, keyHandler) {
		this.sizes = {
			carWidth: 60,
			carHeight: 60,
			carLength: 140,
			wheelRadius: 30,
			wheelDepth: 40
		}
		
		this.engineForce = 0;
		this.currentResistance = constants.resistance;
		this.steerAngle = 0;
		this.slipping = false;
		
		this.obj = this.setupObject();
		this.addKeyHandling(keyHandler);
		
		this.body = this.setupBody(b2world);
		
		scene.addObject( this.obj );
	}
	
	Car.prototype.setupBody = function(world) {
		var bodyDef = new b2BodyDef();
		bodyDef.type = b2Body.b2_dynamicBody;
		bodyDef.position.Set(this.obj.position.x * PX_TO_M, this.obj.position.y * PX_TO_M);
		var body = world.CreateBody(bodyDef);
		
		var fixtureDef = new b2FixtureDef();
		fixtureDef.shape = new b2PolygonShape.AsBox(this.sizes.carLength * PX_TO_M * .5, (this.sizes.carWidth + this.sizes.wheelDepth * 2) * PX_TO_M * .5);
		fixtureDef.friction = 0.4;
		fixtureDef.restitution = 0;
		fixtureDef.density = 100.0;
		body.CreateFixture(fixtureDef);
		
		body.SetAngularDamping(2)
		
		return body;
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
		
		this.parts.body.position.y = this.sizes.carHeight / 2;
		
		for(var fb in this.parts.wheels) {
			for(var lr in this.parts.wheels[fb]) {
				this.parts.wheels[fb][lr].rotation.y = Math.PI / 2;
				this.parts.wheels[fb][lr].position.x = (this.sizes.wheelDepth * 0.5 + this.sizes.carWidth * 0.5) * (lr == 'left' ? -1 : 1);
				this.parts.wheels[fb][lr].position.z = (this.sizes.carLength * 0.5 - this.sizes.wheelRadius) * (fb == 'back' ? -1 : 1);
				this.parts.wheels[fb][lr].position.y = this.sizes.wheelRadius;
			}
		}
		
		var obj = new THREE.Object3D();
		obj.addChild(this.parts.body);
		obj.addChild(this.parts.wheels.front.left);
		obj.addChild(this.parts.wheels.front.right);
		obj.addChild(this.parts.wheels.back.left);
		obj.addChild(this.parts.wheels.back.right);
		
		return obj;
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
		this.engineForce = constants.engineForce * 3;
	}
	
	Car.prototype.braking = function() {
		this.engineForce = -constants.brakeForce;
	}
	
	Car.prototype.turnLeft = function() {
		this.steerAngle -= .02;
		this.steerAngle = Math.min(Math.PI * 0.2, this.steerAngle);
	}
	
	Car.prototype.turnRight = function() {
		this.steerAngle += .02;
		this.steerAngle = Math.min(Math.PI * 0.2, this.steerAngle);
	}
	
	Car.prototype.update = function() {
		var velocity = this.body.GetLinearVelocity();
		
		var speed = velocity.Length();
		var angleVector = new b2Vec2(Math.cos(this.body.GetAngle()), Math.sin(this.body.GetAngle()));
		
		var force = velocity;
		
		var perpForce = -angleVector.y * velocity.x + angleVector.x * velocity.y;
		var corneringForce = new b2Vec2(-angleVector.y * perpForce, angleVector.x * perpForce).GetNegative();
		corneringForce.Multiply(this.currentResistance * 20);
		
		var traction = new b2Vec2(angleVector.x, angleVector.y);
		traction.Multiply(this.engineForce);
		
		var drag = new b2Vec2(velocity.x, velocity.y);
		drag.Multiply(-constants.drag * speed);
		
		var friction = new b2Vec2(velocity.x, velocity.y);
		friction.Multiply(-this.currentResistance);
		
		if(!this.slipping) {
			if(Math.abs(perpForce) > constants.startSlip) {
				this.currentResistance = constants.resistance * constants.slipMultiplier;
				this.slipping = true;
			}
		} else {
			console.log('Slipping!')
			if(Math.abs(perpForce) < constants.stopSlip) {
				this.currentResistance = constants.resistance;
				this.slipping = false;
			}
		}
		
		force.Add(corneringForce);
		force.Add(traction);
		force.Add(drag);
		force.Add(friction);
		
		this.body.ApplyImpulse(force, this.body.GetPosition());
		
		this.steerAngle += -this.steerAngle * .25;
		var turnRadius = (this.sizes.carLength * PX_TO_M) / Math.sin(this.steerAngle);
		var angularForce = (Math.sqrt(velocity.Length()) / turnRadius) * 0.4;
		
		this.body.SetAngle(this.body.GetAngle() - angularForce);
		
		this.obj.position.z = this.body.GetPosition().x * M_TO_PX;
		this.obj.position.x = this.body.GetPosition().y * M_TO_PX;
		
		this.obj.rotation.y = this.body.GetAngle();
 
		for(i in this.parts.wheels.front) {
			this.parts.wheels.front[i].rotation.y = -this.steerAngle * 5 + (Math.PI * 1.5);
		}
		
		this.engineForce = 0;
	}
	
	return Car;
})();