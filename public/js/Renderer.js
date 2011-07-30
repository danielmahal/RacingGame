var Renderer = (function() {
	function Renderer(container, scene, camera) {
		this.scene = scene;
		this.camera = camera;
		
		this.renderer = new THREE.WebGLRenderer();
		this.renderer.setSize( window.innerWidth * .5, window.innerHeight );
		
		container.appendChild( this.renderer.domElement );
	}
	
	Renderer.prototype.render = function() {
		this.renderer.render(this.scene, this.camera);
	}
	
	return Renderer;
})();