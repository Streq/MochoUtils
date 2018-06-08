"use strict";
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

	/**
	 * Loop class
	 * @constructor
	 * @param {function(function onload)} init - sets everything up,
	 *        it needs to call the onload function when it's done.
	 * @param {function(float dt)} update - updates according to dt.
	 * @param {function()} render - render callback.
	 * @param {int} FPS - frames per second, determines how many times
	 *        update and render will be called per second.
	 * @param {boolean} renderFPS - whether to render the darn fps or nah
	 */
	function Loop(init, update, render, FPS, renderFPS){
		this.setFPS(FPS || 60);
		this.init = init;
		this.update = update;
		this.render = render;
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