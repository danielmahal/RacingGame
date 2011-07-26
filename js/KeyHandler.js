var KeyHandler = (function() {
	function KeyHandler() {
		var keys = this.keys = [];
		
		document.addEventListener('keydown', function(e) { console.log(e.which) });
	}
	
	KeyHandler.prototype.add = function(key, scope, handlers) {
		for(var evt in handlers) {
			if(evt == 'keyhold') {
				var newKey = { scope: scope, handler: handlers[evt], down: false };
				
				this.add(key, newKey, {
					keydown: function() { this.down = true },
					keyup: function() { this.down = false }
				});
				
				this.keys.push(newKey);
			} else {
				this.addEventListener(key, scope, evt, handlers[evt]);
			}
		}
	}
	
	KeyHandler.prototype.addEventListener = function(key, scope, evt, handler) {
		document.addEventListener(evt, function(e) {
			if(e.which == key) {
				handler.call(scope);
			}
		});
	}
	
	KeyHandler.prototype.trigger = function() {
		for(var i in this.keys) {
			var key = this.keys[i];
			if(key.down == true) {
				key.handler.call(key.scope);
			}
		}
	}
	
	return KeyHandler;
})();