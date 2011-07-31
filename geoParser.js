var fs = require('fs');

exports.parse = function(path, callback) {
	fs.readFile(path, 'utf-8', function(err, data) {
		if (err) throw err;
		
		var verticesPattern = /\n(-?\d+\.\d+)\s([^\s]+)\s(-?\d+\.\d+)\s/g;
		var facesPattern = /\s3\s<\s(\d+)\s(\d+)\s(\d+)/g;
		
		var returnData = {
			vertices: [],
			faces: []
		}
		
		while(match = verticesPattern.exec(data)) {
			returnData.vertices.push([match[1], match[2], match[3]]);
		}

		while(match = facesPattern.exec(data)) {
			returnData.faces.push([match[1], match[2], match[3]]);
		}
		
		callback(returnData);
	});
}

exports.getModelScript = function(path, callback) {
	exports.parse(path, function(data) {
		var script = "var model = ";
			script+= JSON.stringify(data);
			script+= "; postMessage(model);";
			
		// var script = "var model = {\n";
		// 	script+= "'vertices': ["+ data.vertices.join(', ') +"],\n";
		// 	script+= "'faces': ["+ data.faces.join(', ') +"],\n";
		// 	script+= "'end': (new Date).getTime()\n"
		// 	script+= "}\n";
		// 	script+= "postMessage(model);";
		
		callback(script);
	});
}

/* Test */
exports.getModelScript('./public/assets/geometry/maps/track1/road.geo', function(model) {
	console.log(model);
});