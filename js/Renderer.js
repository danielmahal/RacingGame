var Renderer = (function() {
	function Renderer(container, scene, camera) {
		this.scene = scene;
		this.camera = camera;
		
		this.webGLRenderer = new THREE.WebGLRenderer();
		this.webGLRenderer.setSize( window.innerWidth * .5, window.innerHeight );
		
		container.appendChild( this.webGLRenderer.domElement );
	}
	
	Renderer.prototype.render = function() {
		this.webGLRenderer.render(this.scene, this.camera);
	}
	
	return Renderer;
})();