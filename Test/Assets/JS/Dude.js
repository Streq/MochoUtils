var EVENTS = {
	MOVE_LEFT : 0,
	MOVE_RIGHT : 1,
}

var INPUT = {
	UP : 0,
	DOWN : 1,
	LEFT : 2,
	RIGHT : 3
}

var Dude = (function(){
	var DIRECTION = {
		LEFT : -1,
		RIGHT : 1,
	}
	
	var ANIMATION = {
		IDLE : undefined,
		RUNNING : undefined,
	}
	
	var STATE = {
		IDLE : (function(){
			function m(instance){
				//instance.animation = ANIMATION.IDLE;
			}
			function handleInput(instance, input){
				switch(input){
					case INPUT.LEFT:
						instance.state = new STATE.RUNNING();
						instance.direction = DIRECTION.LEFT;
					break;
					case INPUT.RIGHT:
						instance.state = new STATE.RUNNING();
						instance.direction = DIRECTION.RIGHT;
					break;
				}
			}
			function update(instance, dt){}
			
			m.prototype.handleInput = handleInput;
			m.prototype.update = update;
			return m;
		})(),
		
		RUNNING : (function(){
			function m(){
				this.keepRunning = true;
			}
			function handleInput(instance, input){
				switch(input){
					case INPUT.LEFT:
						instance.direction = DIRECTION.LEFT;
						this.keepRunning = true;
					break;
					case INPUT.RIGHT:
						instance.direction = DIRECTION.RIGHT;
						this.keepRunning = true;
					break;
				}
			}
			function update(instance, dt){
				if(!this.keepRunning){
					instance.state = new STATE.IDLE();
				} else {
					instance.x += instance.speed * instance.direction * dt; 
					this.keepRunning = false;
				}
			}
			
			m.prototype.handleInput = handleInput;
			m.prototype.update = update;
			return m;
		})(),
	};
	
	
	function Dude(x,y){
		this.x = x;
		this.y = y;
		
		this.state = new STATE.IDLE(this);
		this.direction = DIRECTION.RIGHT;
	}
	Dude.prototype.update = function(dt){
		//this.animation.update(dt);
		this.state.update(this,dt);
	}
	Dude.prototype.handleInput = function (input){
		this.state.handleInput(this,input);
	};
	
	Dude.prototype.speed = 100/1000;
	Dude.prototype.jumpSpeed = 300/1000;
	Dude.prototype.fallSpeed = 200/1000;
	
	return Dude;
})();