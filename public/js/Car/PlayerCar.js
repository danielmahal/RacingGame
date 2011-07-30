var PlayerCar = (function() {
	function PlayerCar (id, scene, b2world, socketHandler, x, z) {
		PlayerCar.parent.constructor.call(this, scene, b2world, x, z);
		
		this.id = id;
		this.targetPosition = this.body.GetPosition();
		this.targetAngle = this.body.GetAngle();
		
		this.socketHandler = socketHandler;
		this.socketHandler.addHandler('playerData', this, this.processPlayerData);
	}
	
	Husky.extend(PlayerCar, Car);
	
	PlayerCar.prototype.processPlayerData = function(data) {
		if(this.id == data.id) {
			this.targetPosition = new b2Vec2(data.position.x, data.position.y);
			this.targetAngle = data.angle;
			
			var x = position.x + (this.targetPosition.x - position.x) * 0.07;
			var y = position.y + (this.targetPosition.y - position.y) * 0.07;
			
			this.body.SetLinearVelocity(new b2Vec2(data.velocity.x, data.velocity.y));
			this.body.SetAngularVelocity(data.angularVelocity);
		}
	}
	
	PlayerCar.prototype.update = function() {
		PlayerCar.parent.update.call(this);
		var position = this.body.GetPosition();
		var angle = this.body.GetAngle();
		
		var x = position.x + (this.targetPosition.x - position.x) * 0.07;
		var y = position.y + (this.targetPosition.y - position.y) * 0.07;
		
		this.body.SetPosition(new b2Vec2(x, y));
		this.body.SetAngle(angle + (this.targetAngle - angle) * 0.5);
	}
	
	return PlayerCar;
})();