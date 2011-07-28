var app = new RacingGame(document.getElementById('canvas'), document.getElementById('b2debug'));

(function runLoop() {
	app.update();
	app.render();
	
	requestAnimFrame(runLoop);
})();