var Scene = (function() {
	function Scene() {
		Scene.parent.constructor.call(this);
		
		this.fog = new THREE.FogExp2( 0xf1f9ff, 0.0002 );
		
		var light1 = new THREE.DirectionalLight( 0xffffff, 1.2, 10000, false );
		
		light1.position.z = 200;
		light1.position.x = 0;
		light1.position.y = 8000;
		
		this.addLight( light1 );
	}
	
	Husky.extend(Scene, THREE.Scene);
	
	return Scene;
})();