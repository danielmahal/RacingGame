var Car = (function() {
	
	function Car(scene, b2world, x, z) {
		this.sizes = {
			carWidth: 0.6,
			carHeight: 0.6,
			carLength: 1.4,
			wheelRadius: 0.3,
			wheelDepth: 0.4
		}
		
		this.attributes = {
			drag: 0.08 * 0.001,
			resistance: 12.8 * 0.001,
			engineForce: 0.6,
			brakeForce: .2,
			startSlip: 6,
			stopSlip: 2,
			slipMultiplier: 0.02
		};
		
		this.scene = scene;
		this.b2world = b2world;
		
		this.engineForce = 0;
		this.resistance = this.sideResistance = this.attributes.resistance;
		this.steerAngle = 0;
		this.slipping = false;
		this.handbrake = false;
		
		this.obj = this.setupObject();
		this.obj.position.x = x;
		this.obj.position.z = z;
		
		this.scene.addObject( this.obj );
		
		this.body = this.setupBody();
	}
	
	Car.prototype.setupBody = function(world) {
		var bodyDef = new b2BodyDef();
		bodyDef.type = b2Body.b2_dynamicBody;
		bodyDef.position.Set(this.obj.position.x, this.obj.position.y);
		var body = this.b2world.CreateBody(bodyDef);
		
		var fixtureDef = new b2FixtureDef();
		fixtureDef.shape = new b2PolygonShape.AsBox(this.sizes.carLength * .5, (this.sizes.carWidth + this.sizes.wheelDepth * 2) * .5);
		fixtureDef.friction = 0.1;
		fixtureDef.restitution = 0.3;
		fixtureDef.density = 100.0;
		body.CreateFixture(fixtureDef);
		
		body.SetAngularDamping(10);
		
		body.SetAngle(Math.PI * 0.5);
		
		return body;
	}
	
	Car.prototype.destroy = function() {
		this.scene.removeObject( this.obj );
		this.b2world.DestroyBody( this.body );
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
	
	
	Car.prototype.update = function() {
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
		
		this.obj.position.z = this.body.GetPosition().x;
		this.obj.position.x = this.body.GetPosition().y;
		
		this.obj.rotation.y = this.body.GetAngle();
 
		for(i in this.parts.wheels.front) {
			this.parts.wheels.front[i].rotation.y = -this.steerAngle * 5 + (Math.PI * 1.5);
		}
		
		this.engineForce = 0;
	}
	
	return Car;
})();