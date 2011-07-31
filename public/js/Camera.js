var Camera = (function() {
	function Camera(fov, aspect, near, far, target) {
		this.camera = new THREE.Camera(fov, aspect, near, far, target);
		this.angle = 0;
	}
	
	Camera.prototype.setTarget = function(target) {
		this.target = target;
		this.camera.target = target.obj;
		this.update();
	}
	
	Camera.prototype.update = function() {
		if(this.target) {
			// this.camera.position.y = this.target.obj.position.y + 15;
			// this.camera.position.x = this.target.obj.position.x - 15;
			// this.camera.position.z = this.target.obj.position.z;
			
			this.angle += (this.target.body.GetAngle() - this.angle) * 0.03;
			this.camera.position.y = this.target.obj.position.y + 17;
			this.camera.position.x = this.target.obj.position.x - Math.sin(this.angle) * 25;
			this.camera.position.z = this.target.obj.position.z - Math.cos(this.angle) * 25;
		}
	}
	
	return Camera;
})();