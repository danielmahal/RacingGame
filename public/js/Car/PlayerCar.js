var PlayerCar = (function() {
	function PlayerCar (id, scene, b2world, socketHandler, x, z) {
		PlayerCar.parent.constructor.call(this, scene, b2world, x, z);
		
		this.id = id;
		
		this.socketHandler = socketHandler;
		this.socketHandler.addHandler('playerData', this, this.processPlayerData);
	}
	
	Husky.extend(PlayerCar, Car);
	
	PlayerCar.prototype.processPlayerData = function(data) {
		if(this.id == data.id) {
			this.targetPosition = data.position;
			this.targetAngle = data.angle;
			
			this.body.SetLinearVelocity(new b2Vec2(data.linearVelocity.x, data.linearVelocity.z));
			this.body.SetAngularVelocity(data.angularVelocity);
			
			this.body.SetAwake(true);
		}
	}
	
	PlayerCar.prototype.update = function() {
		PlayerCar.parent.update.call(this);
		if(this.targetPosition) {
			var position = this.body.GetPosition();
			
			var x = position.x + (this.targetPosition.x - position.x) * 0.03;
			var z = position.y + (this.targetPosition.z - position.y) * 0.03;
			
			var y = this.obj.position.y + (this.targetPosition.y - this.obj.position.y) * 0.03;
			
			this.obj.position.y = y;
			this.body.SetPosition(new b2Vec2(x, z));
		}
		
		if(this.targetAngle) {
			var angle = this.body.GetAngle();
			this.body.SetAngle(angle + (this.targetAngle - angle) * 0.1);
		}
	}
	
	return PlayerCar;
})();