var app = new RacingGame(document.getElementById('canvas'), document.getElementById('b2debug'));

var stats = new Stats();

stats.domElement.style.position = 'absolute';
stats.domElement.style.left = '0px';
stats.domElement.style.top = '0px';

document.body.appendChild( stats.domElement );

(function runLoop() {
	app.update();
	app.render();
	
	stats.update();
	
	requestAnimFrame(runLoop);
})();