var RacingGame = (function() {
	function RacingGame(container, b2DebugCanvas) {
		var racingGame = this;
		this.model = {};
		
		this.debug = false;
		
		this.keyHandler = new KeyHandler();
		
		this.model.camera	= new Camera(50, window.innerWidth * .5 / window.innerHeight, 0.001, 1000);
		this.model.scene	= new Scene();
		this.model.renderer	= new Renderer(container, this.model.scene, this.model.camera.camera);
		
		this.b2DebugScale =10;
		this.b2DebugCanvas = b2DebugCanvas;
		this.b2DebugDraw = this.setupDebugDraw(this.b2DebugCanvas);
		this.setDebugMode(false);
		
		this.model.b2World = new b2World(new b2Vec2(0, 0), true);
		this.model.b2World.SetWarmStarting(true);
		this.model.b2World.SetDebugDraw(this.b2DebugDraw);
		
		this.model.cars = [];
		
		this.socketHandler = new SocketHandler('http://84.215.130.126:3000/', this.model);
		
		this.socketHandler.addHandler('connect', this, function() {
			this.model.userCar = new UserCar(this.model.scene, this.model.b2World, this.keyHandler, this.socketHandler, 100, 100);
			this.model.cars.push(this.model.userCar);
			this.model.camera.setTarget(this.model.userCar.obj);
			this.setDebugMode(true);
		});
		
		this.track = new Track(this.model.scene, this.model.b2World, 'track1');
	}
	
	RacingGame.prototype.setupDebugDraw = function(debugCanvas) {
		var game = this;
		document.addEventListener('click', function() {
			game.setDebugMode(game.debug ? false : true);
		});
		
		debugCanvas.width = window.innerWidth * .5;
		debugCanvas.height = window.innerHeight;
		
		this.b2DebugContext = debugCanvas.getContext('2d');
		
		var debugDraw = new b2DebugDraw();
		debugDraw.SetDrawScale(this.b2DebugScale);
		debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_centerOfMassBit);
		debugDraw.SetSprite(this.b2DebugContext);
		
		return debugDraw;
	}
	
	RacingGame.prototype.setDebugMode = function(value) {
		this.debug = value;
		this.b2DebugCanvas.style.display = value ? 'block' : 'none';
		
		var w = value ? window.innerWidth * 0.5 : window.innerWidth;
		var h = window.innerHeight;
		this.model.renderer.renderer.setSize(w, h);
		this.model.camera.camera.aspect = w / h;
		this.model.camera.camera.updateProjectionMatrix();
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
		
		if(this.debug) {
			this.b2DebugContext.clearRect(0, 0, this.b2DebugCanvas.width, this.b2DebugCanvas.height);
			this.b2DebugContext.save();
			var x = -this.model.userCar.obj.position.z * this.b2DebugScale + this.b2DebugCanvas.width * 0.5;
			var y = this.model.userCar.obj.position.x * this.b2DebugScale - this.b2DebugCanvas.height * 0.5;
			this.b2DebugContext.translate(x, y);
			this.model.b2World.DrawDebugData();
			this.b2DebugContext.restore();
		}
	}
	
	return RacingGame;
})();