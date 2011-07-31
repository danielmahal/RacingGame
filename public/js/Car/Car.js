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
			stopSlip: 4,
			slipMultiplier: 0.02
		};
		
		this.scene = scene;
		this.b2world = b2world;
		
		this.engineForce = 0;
		this.resistance = this.sideResistance = this.attributes.resistance;
		this.steerAngle = 0;
		this.slipping = false;
		this.handbrake = false;
		this.velocityY = 0;
		this.onGround = false;
		
		this.bodyRestitution = 0.3;
		
		this.obj = this.setupObject();
		this.obj.position.x = x;
		this.obj.position.z = z;
		this.obj.position.y = 10;
		
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
		fixtureDef.restitution = this.bodyRestitution;
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
	
	
	
	Car.prototype.update = function() {
		this.obj.position.z = this.body.GetPosition().x;
		this.obj.position.x = this.body.GetPosition().y;
		
		
		var rayOffset = 10;
		var rayPos = this.obj.position.clone();
		var ray = new THREE.Ray( new THREE.Vector3(this.obj.position.x, this.obj.position.y + rayOffset, this.obj.position.z), new THREE.Vector3(0, -1, 0) );
		var cast = THREE.Collisions.rayCastNearest( ray );
		
		if( cast ) {
			var face = cast.mesh.geometry.faces[cast.faceIndex];
			var distance = cast.distance - rayOffset;
			
			this.velocityY -= 1 / this.body.GetMass();
			
			if(distance < -this.velocityY) {
				var velocity = this.body.GetLinearVelocity();
				
				var restitution = this.velocityY * this.bodyRestitution;
				this.velocityY = -distance + restitution;
			}
			
			this.obj.position.y += this.velocityY;
		}
		
		if(distance + this.velocityY > 0.4) {
			this.onGround = false;
		} else {
			this.onGround = true;
		}
		
		this.obj.rotation.y = this.body.GetAngle();

		for(i in this.parts.wheels.front) {
			this.parts.wheels.front[i].rotation.y = -this.steerAngle * 5 + (Math.PI * 1.5);
		}
	}
	
	return Car;
})();