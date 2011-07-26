var Camera = (function() {
	function Camera(fov, aspect, near, far, target) {
		Camera.parent.constructor.call(this, fov, aspect, near, far, target);
		
		this.position.y = 1000;
		this.position.z = 1000;
		this.target.position.y = 150;
	}
	
	Husky.extend(Camera, THREE.Camera);
	
	return Camera;
})();