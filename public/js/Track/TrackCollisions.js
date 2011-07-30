var TrackCollisions = (function() {
	function TrackCollisions(world, data) {
		for(i in data) {
			this.createPolygon(world, data[i]);
		}
	}
	
	TrackCollisions.prototype.createPolygon = function(world, points) {
		var shape = new b2PolygonShape();
		
		var vertices = [];
		for(var i in points) {
			vertices.push(new b2Vec2(points[i].x - points[0].x, points[i].y - points[0].y));
		}
		
		shape.SetAsArray(vertices, vertices.length);
		
		var bodyDef = new b2BodyDef();
		bodyDef.position.Set(parseFloat(points[0].x) + 40, parseFloat(points[0].y));
		
		var body = world.CreateBody(bodyDef);
		body.CreateFixture2(shape);
		
		return body;
	}
	
	return TrackCollisions;
})();