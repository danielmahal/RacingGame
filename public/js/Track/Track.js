var Track = (function() {
	function Track(scene, world, name) {
		var dirpath = '/maps/' + name + '/';
		
		microAjax(dirpath + 'collision', function(data) {
			new TrackCollisions(world, JSON.parse(data));
		});
		
	}
	
	Track.prototype.createObject = function() {
		
	}
	
	return Track;
})();