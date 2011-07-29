(function() {
	var Husky = this.Husky = {};
	
	Husky.extend = function(child, parent) {
		var hasProp = Object.prototype.hasOwnProperty;

		for (var key in parent) {
			if (hasProp.call(parent, key)) {
				child[key] = parent[key];
			}
		}

		var boa = function() {
			this.constructor = child;
		};

		boa.prototype = parent.prototype;

		child.prototype = new boa();
		child.parent = parent.prototype;

		return child;
	};
})();