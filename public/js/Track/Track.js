var Track = (function() {
	function Track(scene, world, loader, name) {
		var scope = this;
		var dirpath = '/maps/' + name + '/';
		
		this.scene = scene;
		
		microAjax(dirpath + 'collision', function(data) {
			new TrackCollisions(world, JSON.parse(data));
		});
		
		loader.load({
			model: dirpath + 'road',
			callback: function(geometry) {
				scope.createRoad(geometry);
			}
		});
	}
	
	Track.prototype.createRoad = function(geometry) {
		for(var i in geometry.vertices) {
			geometry.vertices[i].position.y = Math.sin(geometry.vertices[i].position.z * 0.05) * 15;
		}
		
		var material = new THREE.MeshPhongMaterial( { ambient: 0x333333, color: 0x000000, specular: 0x333333, wireframe: true }  );
		this.road = new THREE.Mesh(geometry, material);
		
		var meshCollider = THREE.CollisionUtils.MeshColliderWBox(this.road);
		THREE.Collisions.colliders.push(meshCollider);
		
		this.road.rotation.z = Math.PI;
		this.road.rotation.y = Math.PI * 0.5;
		
		this.road.position.x = 0;
		this.road.position.z = 40;
		
		this.scene.addObject(this.road);
	}
	
	Track.prototype.createObject = function() {
		
	}
	
	return Track;
})();