var RacingGame = (function() {
	function RacingGame(container, b2debugCanvas) {
		var racingGame = this;
		this.model = {};
		
		this.shouldDebug = false;
		this.b2DebugDraw = this.setupDebugDraw(b2debugCanvas);
		
		this.model.b2World = new b2World(new b2Vec2(0, 0), true);
		this.model.b2World.SetWarmStarting(true);
		this.model.b2World.SetDebugDraw(this.b2DebugDraw);
		
		this.keyHandler = new KeyHandler();
		
		this.model.camera	= new Camera(50, window.innerWidth * .5 / window.innerHeight, 0.001, 1000);
		this.model.scene	= new Scene();
		this.model.renderer	= new Renderer(container, this.model.scene, this.model.camera.camera);
		
		this.model.cars = [];
		
		this.model.userCar = new UserCar(this.model.scene, this.model.b2World, this.keyHandler);
		this.model.cars.push(this.model.userCar);
		
		this.model.camera.setTarget(this.model.userCar.obj);
		
		this.socketHandler = new SocketHandler('http://84.215.130.126:3000/', this.model);
		
		this.track = new Track(this.model.scene, this.model.b2World, 'track1');
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
		
		for(i in this.model.cars) {
			this.model.cars[i].update();
		}
		
		this.model.camera.update();
		
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