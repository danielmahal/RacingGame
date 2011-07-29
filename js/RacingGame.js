var RacingGame = (function() {
	function RacingGame(container, b2debugCanvas) {
		this.model = {};
		
		this.shouldDebug = false;
		this.b2DebugDraw = this.setupDebugDraw(b2debugCanvas);
		
		this.model.b2World = new b2World(new b2Vec2(0, 0), true);
		this.model.b2World.SetWarmStarting(true);
		this.model.b2World.SetDebugDraw(this.b2DebugDraw);
		
		this.keyHandler = new KeyHandler();
		
		this.model.camera	= new Camera(50, window.innerWidth * .5 / window.innerHeight, 0.001, 1000);
		this.model.scene	= new Scene();
		this.model.renderer	= new Renderer(container, this.model.scene, this.model.camera);
		
		this.model.car = new Car(this.model.scene, this.model.b2World, this.keyHandler);
		
		this.model.wall = new Wall(this.model.scene, this.model.b2World, 3, 3, 10, 1.2, 1, Math.random()*Math.PI);
	}
	
	RacingGame.prototype.setupDebugDraw = function(debugCanvas) {
		var game = this;
		debugCanvas.addEventListener('click', function() {
			game.shouldDebug = game.shouldDebug ? false : true;
		});
		
		debugCanvas.width = window.innerWidth * .5;
		debugCanvas.height = window.innerHeight;
		
		var b2debugContext = debugCanvas.getContext('2d');
		
		var debugDraw = new b2DebugDraw();
		debugDraw.SetDrawScale(20);
		debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_centerOfMassBit);
		debugDraw.SetSprite(b2debugContext);
		
		return debugDraw;
	}
	
	RacingGame.prototype.update = function() {
		this.keyHandler.trigger();
		this.model.car.update();
		
		this.model.b2World.Step(1 / 60, 1, 1);
	}
	
	RacingGame.prototype.render = function() {
		this.model.renderer.render();
		
		if(this.shouldDebug) {
			this.model.b2World.DrawDebugData();
		}
	}
	
	return RacingGame;
})();