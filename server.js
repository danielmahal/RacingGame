var express = require('express');
var fs = require('fs');

var socket = require('./socket.js');
var collisionsParser = require('./collisionsParser.js');

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
	var path = 'public/assets/geometry/maps/' + req.params.map + '/collision.geo';
	
	collisionsParser.parse(path, function(polygons) {
		res.send(polygons);
	});
});



app.listen(8362);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);

var socket = socket.start(app);