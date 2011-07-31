var ModelLoader = (function() {
	function ModelLoader() {
		ModelLoader.parent.constructor.call(this);
	}
	
	Husky.extend(ModelLoader, THREE.JSONLoader);
	
	ModelLoader.prototype.createModel = function(json, callback, texture_path) {
		var scope = this;
		var geometry = new THREE.Geometry();
		var scale = ( json.scale !== undefined ) ? 1.0 / json.scale : 1.0;
		
		parseModel( scale );

		geometry.computeCentroids();
		geometry.computeFaceNormals();
		
		callback( geometry );
		
		function parseModel( scale ) {
			var vertices = json.vertices;
			
			var faces = json.faces;
			
			for(var i in vertices) {
				var vertex = new THREE.Vertex();

				vertex.position.x = vertices[i][0] * scale;
				vertex.position.y = vertices[i][1] * scale;
				vertex.position.z = vertices[i][2] * scale;

				geometry.vertices.push( vertex );
			}
			
			for(var i in faces) {
				var face = new THREE.Face3();

				face.a = faces[i][0];
				face.b = faces[i][1];
				face.c = faces[i][2];
				
				geometry.faces.push( face );
			}
		};
	}
	
	return ModelLoader;
})();