
var RacingGame = (function() {
	function RacingGame(container) {
		this.model = {};
		
		var container = container;
		
		this.keyHandler = new KeyHandler();
		
		this.model.camera	= new Camera(50, window.innerWidth / window.innerHeight, 1, 3000);
		this.model.scene	= new Scene();
		this.model.renderer	= new Renderer(container, this.model.scene, this.model.camera);
		
		this.model.car = new Car(this.model.scene, this.keyHandler);
	}
	
	RacingGame.prototype.update = function() {
		this.keyHandler.trigger();
		this.model.car.update();
	}
	
	RacingGame.prototype.render = function() {
		this.model.renderer.render();
	}
	
	return RacingGame;
})();