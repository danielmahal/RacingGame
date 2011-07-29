var Camera = (function() {
	function Camera(fov, aspect, near, far, target) {
		this.camera = new THREE.Camera(fov, aspect, near, far, target);
	}
	
	Camera.prototype.setTarget = function(target) {
		this.target = target;
		this.camera.target = target;
		this.update();
	}
	
	Camera.prototype.update = function() {
		this.camera.position.y = this.target.position.y + 15;
		this.camera.position.x = this.target.position.x - 15;
		this.camera.position.z = this.target.position.z;
	}
	
	return Camera;
})();