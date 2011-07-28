var Wall = (function() {
	function Wall(scene, world, x, z, width, height, length, rotation) {
		this.obj = this.setupObject(width, height, length);
		this.obj.position.x = x;
		this.obj.position.z = z;
		this.obj.position.y = height * 0.5;
		this.obj.rotation.y = rotation;
		
		this.body = this.setupBody(scene, world, width, length);
		
		console.log(this.obj);
		scene.addObject(this.obj);
	}
	
	Wall.prototype.setupBody = function(scene, world, width, length) {
		
		var shape = new b2PolygonShape();
		shape.SetAsBox(length * PX_TO_M * .5, width * PX_TO_M * .5);
		
		var bodyDef = new b2BodyDef();
		bodyDef.position.Set(this.obj.position.z * PX_TO_M, this.obj.position.x * PX_TO_M);
		
		var wall = world.CreateBody(bodyDef);
		wall.CreateFixture2(shape);
		
		wall.SetAngle(this.obj.rotation.y);
		
		return wall;
	}
	
	Wall.prototype.setupObject = function(width, height, length) {
		var material = new THREE.MeshPhongMaterial( { ambient: 0x333333, color: 0x000000, specular: 0x333333, wireframe: false }  );
		var geometry = new THREE.CubeGeometry(width, height, length, 1, 1, 1 );
		var obj = new THREE.Mesh(geometry, material);
		
		return obj;
	}
	
	return Wall;
})();