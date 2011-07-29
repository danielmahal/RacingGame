var Wall = (function() {
	function Wall(scene, world, x, z, width, height, length, rotation) {
		this.obj = this.setupObject(width, height, length);
		this.obj.position.x = x;
		this.obj.position.z = z;
		this.obj.position.y = height * 0.5;
		this.obj.rotation.y = rotation;
		
		this.body = this.setupBody(scene, world, width, length);
		
		scene.addObject(this.obj);
	}
	
	Wall.prototype.setupBody = function(scene, world, width, length) {
		
		var shape = new b2PolygonShape();
		shape.SetAsBox(length * 0.5, width * 0.5);
		
		var bodyDef = new b2BodyDef();
		bodyDef.position.Set(this.obj.position.z, this.obj.position.x);
		
		var body = world.CreateBody(bodyDef);
		body.CreateFixture2(shape);
		
		body.SetAngle(this.obj.rotation.y);
		
		console.log(shape);
		
		return body;
	}
	
	Wall.prototype.setupObject = function(width, height, length) {
		var material = new THREE.MeshPhongMaterial( { ambient: 0x333333, color: 0x000000, specular: 0x333333, wireframe: false }  );
		var geometry = new THREE.CubeGeometry(width, height, length, 1, 1, 1 );
		var obj = new THREE.Mesh(geometry, material);
		
		return obj;
	}
	
	return Wall;
})();