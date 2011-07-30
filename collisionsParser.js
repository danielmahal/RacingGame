var fs = require('fs');

exports.parse = function(path, callback) {
	fs.readFile(path, 'utf-8', function(err, data) {
		if (err) throw err;

		var pointsPattern = /\n(-?\d+\.\d+)\s[^\s]+\s(-?\d+\.\d+)\s/g;
		var facesPattern = /\s4\s<\s(\d+)\s(\d+)\s(\d+)\s(\d+)/g;

		var points = [];
		while(match = pointsPattern.exec(data)) {
			points.push({x: match[1], y: match[2]});
		}

		var polygons = [];
		while(match = facesPattern.exec(data)) {
			polygons.push([points[match[1]], points[match[2]], points[match[3]], points[match[4]]]);
		}
		
		callback(polygons);
	});
}
