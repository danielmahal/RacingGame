var Car = (function() {
	
	function Car(scene, b2world) {
		this.sizes = {
			carWidth: 0.6,
			carHeight: 0.6,
			carLength: 1.4,
			wheelRadius: 0.3,
			wheelDepth: 0.4
		}
		
		this.attributes = {
			drag: 0.0012,
			resistance: 0.012,
			engineForce: 0.5,
			brakeForce: .2,
			startSlip: 3.9,
			stopSlip: 2.9,
			slipMultiplier: 0.1
		};
		
		this.engineForce = 0;
		this.currentResistance = this.attributes.resistance;
		this.steerAngle = 0;
		this.slipping = false;
		
		this.obj = this.setupObject();
		
		this.body = this.setupBody(b2world);
		
		scene.addObject( this.obj );
	}
	
	Car.prototype.setupBody = function(world) {
		var bodyDef = new b2BodyDef();
		bodyDef.type = b2Body.b2_dynamicBody;
		bodyDef.position.Set(this.obj.position.x, this.obj.position.y);
		var body = world.CreateBody(bodyDef);
		
		var fixtureDef = new b2FixtureDef();
		fixtureDef.shape = new b2PolygonShape.AsBox(this.sizes.carLength * .5, (this.sizes.carWidth + this.sizes.wheelDepth * 2) * .5);
		fixtureDef.friction = 0.1;
		fixtureDef.restitution = 0.3;
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
		drag.Multiply(-this.attributes.drag * speed);
		
		var friction = new b2Vec2(velocity.x, velocity.y);
		friction.Multiply(-this.currentResistance);
		
		if(!this.slipping) {
			if(Math.abs(perpForce) > this.attributes.startSlip) {
				this.currentResistance = this.attributes.resistance * this.attributes.slipMultiplier;
				this.slipping = true;
			}
		} else {
			if(Math.abs(perpForce) < this.attributes.stopSlip) {
				this.currentResistance = this.attributes.resistance;
				this.slipping = false;
			}
		}
		
		force.Add(corneringForce);
		force.Add(traction);
		force.Add(drag);
		force.Add(friction);
		
		this.steerAngle += -this.steerAngle * .25;
		var turnRadius = (this.sizes.carLength) / Math.sin(this.steerAngle);
		var angularForce = (Math.sqrt(velocity.Length()) / turnRadius) * 0.4;
		
		if(Math.abs(force.x) + Math.abs(force.y) > 0.1) {
			this.body.ApplyImpulse(force, this.body.GetPosition());
			this.body.SetAngle(this.body.GetAngle() - angularForce);
		}
		
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