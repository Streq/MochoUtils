var Mocho = (function(mod){
	//Clock class
	function Clock(){
		this.lastReset = Date.now();
		this.restart = function(){
			var now = Date.now();
			var ret = now - this.lastReset;
			this.lastReset = now;
			return ret;
		};
	}

	//Loop class
	function Loop(initFunction, updateFunction, renderFunction, FPS, renderFPS){
		this.setFPS(FPS || 60);
		this.init = initFunction;
		this.update = updateFunction;
		this.render = renderFunction;
		this.renderFPS = renderFPS;
		this.timeFactor = 1;
		this.timeSinceLastUpdate = 0;
	}

	Loop.prototype.setFPS = function(x){
		this.frameTime = 1000/x;
		this.frameSecs = 1/x;
		this.fps = x;
	};
	Loop.prototype.run = function(){
		let onload = function(){			
			this.clock = new Clock();
			this.clock.restart();
			requestAnimationFrame(this.tick.bind(this));
		};
		this.init(onload.bind(this));
	}


	Loop.prototype.tick = function(){
		this.render(this.frameTime);
		
		var dt = this.clock.restart() * this.timeFactor;
		this.timeSinceLastUpdate += dt;
		
		while(this.timeSinceLastUpdate >= this.frameTime){
			this.timeSinceLastUpdate -= this.frameTime;
			this.update(this.frameTime);
		}
		
		requestAnimationFrame(this.tick.bind(this));
	};

	mod.Loop = Loop;
	mod.Clock = Clock;
	return mod;
})(Mocho||{});