var socket = require('./socket.js');
var express = require('express');
var fs = require('fs');

var app = module.exports = express.createServer();

app.configure(function(){
	app.set('views', __dirname + '/views');
	app.set('view engine', 'ejs');
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(app.router);
	app.use(express.static(__dirname + '/public'));
	app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});



app.get('/', function(req, res){
	res.render('index', {
		layout: false
	});
});

app.get('/maps/:map/collision', function(req, res){
	var filepath = 'public/assets/geometry/maps/' + req.params.map + '/collision.geo';
	
	fs.readFile(filepath, 'utf-8', function(err, data) {
		if (err) throw err;
		
		var pointsPattern = /\n(-?\d+\.\d+)\s[^\s]+\s(-?\d+\.\d+)\s/g;
		var facesPattern = /\s3\s<\s(\d+)\s(\d+)\s(\d+)/g;

		var points = [];
		while(match = pointsPattern.exec(data)) {
			points.push({x: match[1], y: match[2]});
		}

		var polygons = [];
		while(match = facesPattern.exec(data)) {
			polygons.push([points[match[1]], points[match[2]], points[match[3]]]);
		}
		
		res.send(polygons);
	});
});



app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);

var socket = socket.start(app);