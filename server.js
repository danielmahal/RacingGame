var io = require('socket.io');
var express = require('express');

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

app.listen(3000);

io = io.listen(app);

io.sockets.on('connection', function (client) {
	client.send('Welcome to the server!');
});

console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
