var KeyHandler = (function() {
	function KeyHandler() {
		var that = this;
		this.keyListeners = {};
		
		document.addEventListener('keydown', function(e) {
			console.log('Pressed:', e.which);
			var key = e.which;
			if(that.keyListeners[key] != undefined) {
				that.keyListeners[key].keyDown = true;
			}
		});

		document.addEventListener('keyup', function(e) {
			var key = e.which;
			if(that.keyListeners[key] != undefined) {
				that.keyListeners[key].keyDown = false;
			}
		});
	}
	
	KeyHandler.prototype.forEachKey = function(key, fn) {
		if(this.keyListeners[key] != undefined) {
			for(i in this.keyListeners[key].handlers) {
				fn(this.keyListeners[key]['handlers'][i]);
			}
		}
	}
	
	KeyHandler.prototype.add = function(key, scope, callback) {
		if(this.keyListeners[key] == undefined) {
			this.keyListeners[key] = {
				keyDown: false,
				ready: true,
				handlers: []
			};
		}
		
		this.keyListeners[key].handlers.push({
			scope: scope,
			callback: callback
		});
	}
	
	KeyHandler.prototype.trigger = function() {
		for(i in this.keyListeners) {
			if(this.keyListeners[i].keyDown) {
				this.forEachKey(i, function(handler) {
					handler.callback.call(handler.scope);
				});
			}
		}
	}
	
	return KeyHandler;
})();