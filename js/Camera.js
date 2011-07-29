var Camera = (function() {
	function Camera(fov, aspect, near, far, target) {
		Camera.parent.constructor.call(this, fov, aspect, near, far, target);
		
		this.position.y = 20;
		// this.position.x = -1000;
		this.position.x = -1;
	}
	
	Husky.extend(Camera, THREE.Camera);
	
	return Camera;
})();