var app = new RacingGame(document.getElementById('canvas'));

(function runLoop() {
	app.update();
	app.render();
	
	requestAnimFrame(runLoop);
})();